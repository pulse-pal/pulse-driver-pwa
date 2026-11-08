/* ==========================================================
   PULSEPAL DRIVER — APP.JS
   Startup, feature gate (canUse), live data simulation,
   service worker registration, the persistent floating
   Pulse AI assistant, and the notification bell dropdown
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker()
  applyStoredTheme()
  applyFeatureGating()

  // A fuel trip the driver started and never ended comes back here.
  restoreActiveTrip()

  // Right after the login screen recognises a number it saves the
  // account and reloads (so the right profile loads). If it asked to
  // pick up on a particular screen, go straight there: no splash.
  const resumePage = takeResumePage()
  if (resumePage) {
    navigateTo(resumePage)
  } else {
    loadPage('splash')

    setTimeout(() => {
      const isLoggedIn = localStorage.getItem('pulsepal_logged_in') === 'true'
      if (isLoggedIn) {
        navigateTo('home')
      } else if (isFleetDriver()) {
        // A fleet profile is already loaded (dev switch, or a fleet
        // number that started signing in): straight to Login.
        navigateTo('login')
      } else {
        // Everyone else starts at Welcome: Sign in (returning, or
        // added by a fleet manager) or Get Started (new, activates
        // a device). The login screen works out which kind of
        // account a phone number belongs to.
        navigateTo('welcome')
      }
    }, 2000)
  }

  startLiveDataSimulation()
  initPulseAiFab()
  initNotificationBell()
})

/* ----------------------------------------------------------
   ACCOUNT SWITCH + RESUME
   The account type and plan are applied when dummy-data.js loads,
   so signing in as a different kind of account means saving the
   number and reloading once. Only these screens may be resumed.
   ---------------------------------------------------------- */

const RESUME_KEY = 'pulsepal_resume'
const RESUMABLE_PAGES = ['onboarding-verify', 'onboarding-password', 'login']

// Reads and clears the resume note. One use only, so a later
// refresh starts normally.
function takeResumePage() {
  try {
    const raw = sessionStorage.getItem(RESUME_KEY)
    if (!raw) return null
    sessionStorage.removeItem(RESUME_KEY)
    const note = JSON.parse(raw)
    return note && RESUMABLE_PAGES.includes(note.page) ? note.page : null
  } catch (e) {
    return null
  }
}

// Saves the account and reloads so that account's profile loads.
// resumePage (optional) is the screen to open after the reload.
// Reloads to the bare path so a leftover ?mode= in the address bar
// can't override the account that just signed in.
window.switchAccountAndReload = function (rawPhone, resumePage) {
  saveSignedInAccount(rawPhone)
  if (resumePage && RESUMABLE_PAGES.includes(resumePage)) {
    try {
      sessionStorage.setItem(RESUME_KEY, JSON.stringify({ page: resumePage }))
    } catch (e) {}
  }
  window.location.href = window.location.pathname
}

/* ----------------------------------------------------------
   ACTIVE FUEL TRIP
   A fuel route the driver has started (Fuel Navigator -> Map ->
   Start) must outlive the screen it was started on and the app
   itself. The route lives in ACTIVE_FUEL_ROUTE (dummy-data.js);
   while its status is 'active' it is saved to this browser, so it
   comes back after leaving the Map or closing the app.

   status: 'preview' (route chosen, not started: never saved) or
           'active'  (started: saved, progress keeps moving).

   Progress (distanceTraveled, in km) lives here, not on the Map
   page, so the trip keeps moving while the driver is on another
   screen. In the prototype it is advanced by the simulated speed
   each tick. With real data the backend works it out from the
   car's live position on the route and sends the alerts.
   ---------------------------------------------------------- */

const ACTIVE_TRIP_KEY = 'pulsepal_active_trip'

// One saved trip per account.
function activeTripStorageKey() {
  return ACTIVE_TRIP_KEY + '_' + DRIVER.phone
}

function persistActiveTrip() {
  const route = ACTIVE_FUEL_ROUTE
  if (!route || route.status !== 'active' || route.arrived) return
  try {
    localStorage.setItem(activeTripStorageKey(), JSON.stringify({
      plate: ACTIVE_VEHICLE.plate,
      destinationName: route.destinationName,
      lat: route.lat,
      lng: route.lng,
      selectedRouteIndex: route.selectedRouteIndex || 0,
      distance_km: route.distance_km || 0,
      duration_min: route.duration_min || 0,
      total_km: route.total_km || 0,
      distanceTraveled: route.distanceTraveled || 0
    }))
  } catch (e) {}
}

function removeStoredTrip() {
  try { localStorage.removeItem(activeTripStorageKey()) } catch (e) {}
}

// Ends the trip: forgets it in memory and in the browser.
function clearActiveTrip() {
  ACTIVE_FUEL_ROUTE = null
  removeStoredTrip()
}

// Puts a saved trip back into ACTIVE_FUEL_ROUTE at startup. Ignored
// if it belongs to another vehicle, or the account can't use Fuel
// Navigator (e.g. a fleet plan without it).
function restoreActiveTrip() {
  if (!canUse('fuel_navigator')) return
  try {
    const raw = localStorage.getItem(activeTripStorageKey())
    if (!raw) return
    const saved = JSON.parse(raw)
    if (!saved || saved.plate !== ACTIVE_VEHICLE.plate) return
    if (!saved.destinationName || typeof saved.lat !== 'number' || typeof saved.lng !== 'number') return

    ACTIVE_FUEL_ROUTE = {
      destinationName: saved.destinationName,
      lat: saved.lat,
      lng: saved.lng,
      selectedRouteIndex: saved.selectedRouteIndex || 0,
      distance_km: saved.distance_km || 0,
      duration_min: saved.duration_min || 0,
      total_km: saved.total_km || 0,
      distanceTraveled: saved.distanceTraveled || 0,
      status: 'active'
    }
  } catch (e) {}
}

// Moves an active trip forward by the distance driven this tick and
// ends it when the car gets there.
function advanceActiveTrip(kmThisTick) {
  const route = ACTIVE_FUEL_ROUTE
  if (!route || route.status !== 'active' || route.arrived) return

  route.distanceTraveled = (route.distanceTraveled || 0) + kmThisTick

  const total = route.total_km || route.distance_km || 0
  if (total > 0 && route.distanceTraveled >= total) {
    route.arrived = true
    removeStoredTrip()

    NOTIFICATIONS.unshift({
      type: 'trip',
      title: 'You have arrived',
      message: `Arrived at ${route.destinationName}`,
      time: 'Just now',
      read: false
    })
    if (typeof window.refreshNotificationBell === 'function') {
      window.refreshNotificationBell()
    }
    showToast(`Arrived at ${route.destinationName}`, 'success')
    return
  }

  persistActiveTrip()
}

/* ----------------------------------------------------------
   FEATURE GATE
   canUse(featureKey) is the ONE place that decides whether the
   current account can use a feature. Screens, nav items and quick
   actions call it; nothing else in the app should read
   DRIVER.plan or DRIVER.fleet_plan to make an access decision.

   Four account states (columns, in this order):
     0  individual driver, Starter
     1  individual driver, Premium
     2  fleet driver, Fleet Starter
     3  fleet driver, Fleet Premium

   This is a UI gate only. Real enforcement has to happen on the
   backend, where the plan lives in the database.
   ---------------------------------------------------------- */

const FEATURE_ACCESS = {
  //                          Ind.Starter  Ind.Premium  Fleet.Starter  Fleet.Premium

  // Everyone
  dashboard:                 [true,        true,        true,          true],
  faults:                    [true,        true,        true,          true],
  map:                       [true,        true,        true,          true],
  trips:                     [true,        true,        true,          true],
  device_status:             [true,        true,        true,          true],

  // Premium: individual Premium and Fleet Premium
  trip_coaching:             [false,       true,        false,         true],
  driving_score:             [false,       true,        false,         true],
  fuel_navigator:            [false,       true,        false,         true],
  speed_alerts:              [false,       true,        false,         true],
  pulse_ai:                  [false,       true,        false,         true],

  // Individual drivers only (never fleet drivers)
  mechanic_booking:          [true,        true,        false,         false],
  service_reminders:         [true,        true,        false,         false],
  vehicle_sharing:           [true,        true,        false,         false],
  vehicle_sharing_advanced:  [false,       true,        false,         false],
  my_vehicles:               [true,        true,        false,         false],
  add_vehicle:               [true,        true,        false,         false],
  subscription:              [true,        true,        false,         false],
  billing:                   [true,        true,        false,         false],
  payment_reminders:         [true,        true,        false,         false],
  deactivate_account:        [true,        true,        false,         false],

  // Fleet drivers only: call / notify the fleet manager, "My Fleet" card
  fleet_contact:             [false,       false,       true,          true]
}

// Older keys used by existing checkPremium(...) calls, mapped to
// the feature names above so those call sites keep working.
const FEATURE_ALIASES = {
  pulse_ai_chatbot: 'pulse_ai',
  vehicle_sharing_basic: 'vehicle_sharing'
}

const _warnedFeatureKeys = new Set()

function isFleetDriver() {
  return DRIVER.account_type === 'fleet_driver'
}

function getAccessColumn() {
  if (isFleetDriver()) {
    return DRIVER.fleet_plan === 'fleet_premium' ? 3 : 2
  }
  return DRIVER.plan === 'premium' ? 1 : 0
}

function canUse(featureKey) {
  const key = FEATURE_ALIASES[featureKey] || featureKey
  const row = FEATURE_ACCESS[key]
  const col = getAccessColumn()

  if (row) return row[col] === true

  // Unknown key: behave like the old checkPremium did (an unlisted key
  // meant "Premium feature") for individuals, and stay locked for fleet
  // drivers so nothing leaks. The warning lists keys to add above.
  if (!_warnedFeatureKeys.has(featureKey)) {
    _warnedFeatureKeys.add(featureKey)
    console.warn('[canUse] unknown feature key:', featureKey)
  }
  return col === 1
}

// Hides any element marked data-requires="feature_key" when the
// current account can't use that feature. Used for static markup
// such as bottom-nav items. Safe to call repeatedly: it only undoes
// hiding that it did itself.
function applyFeatureGating(root) {
  const scope = root || document
  scope.querySelectorAll('[data-requires]').forEach(el => {
    const allowed = canUse(el.dataset.requires)
    if (!allowed) {
      el.classList.add('hidden')
      el.dataset.gateHidden = '1'
    } else if (el.dataset.gateHidden === '1') {
      el.classList.remove('hidden')
      delete el.dataset.gateHidden
    }
  })
}
window.applyFeatureGating = applyFeatureGating

// Opens the phone dialler to the fleet manager. Used by Home, fault
// detail, Profile and the locked-feature prompt.
function callFleetManager() {
  if (!DRIVER.manager_phone) {
    showToast('No manager number on file', 'warning')
    return
  }
  window.location.href = 'tel:' + DRIVER.manager_phone
}

/* ----------------------------------------------------------
   THEME
   index.html already applies data-theme="dark" before first
   paint (to avoid a flash) if localStorage has it saved. This
   syncs APP_THEME (the in-memory value settings.frag reads) to
   match whatever index.html already applied, and provides the
   function that actually changes the theme when picked.
   ---------------------------------------------------------- */

function applyStoredTheme() {
  const saved = localStorage.getItem('pulsepal_theme')
  if (saved === 'dark') {
    APP_THEME = 'dark'
  }
}

window.setAppTheme = function (theme) {
  APP_THEME = theme
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
  try {
    localStorage.setItem('pulsepal_theme', theme)
  } catch (e) {}
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return

  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      // A worker may already be sitting "waiting" from a previous
      // visit (e.g. the tab was open when the update installed).
      if (registration.waiting) {
        showUpdateBanner(registration.waiting)
      }

      // Watch for a NEW worker starting to install during this visit.
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          // "installed" + an existing controller means this is an
          // UPDATE (not the very first install) — safe to prompt.
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateBanner(newWorker)
          }
        })
      })
    })
    .catch(err => console.warn('Service worker registration failed:', err))

  // Once the new worker takes control, the cached files have
  // changed under us — reload so the page matches what's cached.
  let hasReloaded = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hasReloaded) return
    hasReloaded = true
    window.location.reload()
  })
}

function showUpdateBanner(waitingWorker) {
  if (document.getElementById('sw-update-banner')) return

  const banner = document.createElement('div')
  banner.id = 'sw-update-banner'
  banner.style.cssText = `
    position: fixed;
    left: 50%;
    bottom: calc(var(--bottom-nav-height) + 14px);
    transform: translateX(-50%);
    width: calc(100% - 32px);
    max-width: calc(var(--content-max-width) - 32px);
    background: #2D3748;
    color: #FFFFFF;
    border-radius: 16px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.24);
    z-index: 1200;
  `
  banner.innerHTML = `
    <span style="flex:1;font-size:13px;font-weight:600;">A new version of PulsePal is ready</span>
    <button id="sw-update-btn" style="background:var(--color-accent);color:#fff;border:none;border-radius:999px;padding:8px 16px;font-size:12.5px;font-weight:700;flex-shrink:0;">UPDATE</button>
  `
  document.body.appendChild(banner)

  document.getElementById('sw-update-btn').addEventListener('click', () => {
    waitingWorker.postMessage('SKIP_WAITING')
    banner.remove()
  })
}

// Thresholds (km remaining) that trigger a one-time notification,
// checked high-to-low so a big single tick can't skip past one.
const SERVICE_REMINDER_THRESHOLDS = [500, 100, 0]

function trackServiceReminders(kmThisTick) {
  // Service reminders aren't part of a fleet driver's plan: no
  // countdown, no notifications.
  if (!canUse('service_reminders')) return

  SERVICE_REMINDERS.forEach(reminder => {
    if (reminder.due_in_km <= 0) return

    reminder.due_in_km = Math.max(0, reminder.due_in_km - kmThisTick)
    reminder.due_in = reminder.due_in_km <= 0
      ? 'Due now'
      : Math.round(reminder.due_in_km).toLocaleString('en-KE') + 'km'

    SERVICE_REMINDER_THRESHOLDS.forEach(threshold => {
      if (reminder.due_in_km <= threshold && !reminder.notified_thresholds.includes(threshold)) {
        reminder.notified_thresholds.push(threshold)
        fireServiceNotification(reminder, threshold)
      }
    })
  })

  if (typeof window.updateFaultBadgeExtras === 'function') {
    window.updateFaultBadgeExtras()
  }
}

function fireServiceNotification(reminder, threshold) {
  const message = threshold === 0
    ? `${reminder.title} is due now`
    : `${reminder.title} in ${threshold}km`

  NOTIFICATIONS.unshift({
    type: 'service',
    title: reminder.title,
    message: message,
    time: 'Just now',
    read: false
  })

  if (typeof window.refreshNotificationBell === 'function') {
    window.refreshNotificationBell()
  }

  showToast(message, threshold === 0 ? 'warning' : 'success')
}

function startLiveDataSimulation() {
  setInterval(() => {
    const maxSpeed = getSpeedoMax(ACTIVE_VEHICLE)

    ACTIVE_VEHICLE.speed += (Math.random() - 0.5) * 4
    ACTIVE_VEHICLE.speed = Math.max(0, Math.min(maxSpeed, ACTIVE_VEHICLE.speed))
    ACTIVE_VEHICLE.rpm = 800 + (ACTIVE_VEHICLE.speed * 18)
    ACTIVE_VEHICLE.fuel_level = Math.max(0, ACTIVE_VEHICLE.fuel_level - 0.001)
    ACTIVE_VEHICLE.fuel_litres = (ACTIVE_VEHICLE.fuel_level / 100) * ACTIVE_VEHICLE.tank_size

    const kmThisTick = ACTIVE_VEHICLE.speed * (3 / 3600)
    trackServiceReminders(kmThisTick)
    advanceActiveTrip(kmThisTick)

    if (typeof window.updateDashboard === 'function') {
      window.updateDashboard()
    }
    if (typeof window.updateFuelRoute === 'function') {
      window.updateFuelRoute()
    }
  }, 3000)
}

let faultToastShown = false

window.initPage = function (page) {
  // Pages are injected after startup, so re-apply data-requires to
  // whatever the new fragment contains.
  applyFeatureGating()

  if (page === 'home' && !faultToastShown && ACTIVE_VEHICLE.fault_codes.length > 0) {
    showToast(`Fault detected on ${ACTIVE_VEHICLE.plate}`, 'warning')
    faultToastShown = true
  }
}

/* ----------------------------------------------------------
   PULSE AI FLOATING ASSISTANT
   ---------------------------------------------------------- */

function initPulseAiFab() {
  const fab = document.getElementById('pulse-ai-fab')
  const panel = document.getElementById('pulse-ai-panel')
  const closeBtn = document.getElementById('pulse-ai-close-btn')
  const expandBtn = document.getElementById('pulse-ai-expand-btn')
  const sendBtn = document.getElementById('pulse-ai-panel-send')
  const input = document.getElementById('pulse-ai-panel-input')
  const messages = document.getElementById('pulse-ai-panel-messages')

  let greeted = false

  fab.addEventListener('click', () => {
    if (!checkPremium('pulse_ai_chatbot')) return

    const notifPanel = document.getElementById('notification-panel')
    if (notifPanel) notifPanel.classList.add('hidden')

    panel.classList.toggle('hidden')

    if (!panel.classList.contains('hidden') && !greeted) {
      addAiMessage(`Hi ${DRIVER.name.split(' ')[0]}! Ask me anything about your ${ACTIVE_VEHICLE.make} ${ACTIVE_VEHICLE.model}.`)
      greeted = true
    }
  })

  closeBtn.addEventListener('click', () => panel.classList.add('hidden'))

  expandBtn.addEventListener('click', () => {
    panel.classList.add('hidden')
    navigateTo('pulse-ai')
  })

  function addUserMessage(text) {
    const bubble = document.createElement('div')
    bubble.className = 'chat-bubble chat-bubble-user'
    bubble.style.alignSelf = 'flex-end'
    bubble.textContent = text
    messages.appendChild(bubble)
    messages.scrollTop = messages.scrollHeight
  }

  function addAiMessage(text) {
    const bubble = document.createElement('div')
    bubble.className = 'chat-bubble chat-bubble-ai'
    bubble.style.alignSelf = 'flex-start'
    bubble.textContent = text
    messages.appendChild(bubble)
    messages.scrollTop = messages.scrollHeight
  }

  function handleSend() {
    const text = input.value.trim()
    if (!text) return
    addUserMessage(text)
    input.value = ''

    setTimeout(() => {
      if (ACTIVE_VEHICLE.fault_codes.length > 0 && /fault|wrong|problem|check engine/i.test(text)) {
        const fault = FAULT_CODES.find(f => f.code === ACTIVE_VEHICLE.fault_codes[0])
        addAiMessage(fault ? fault.description_simple : "I couldn't find details on that fault.")
      } else {
        addAiMessage("I'm still learning — try asking about a fault code, or open the full chat for more.")
      }
    }, 700)
  }

  sendBtn.addEventListener('click', handleSend)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend()
  })
}

/* ----------------------------------------------------------
   NOTIFICATION BELL DROPDOWN
   ---------------------------------------------------------- */

function initNotificationBell() {
  const bellBtn = document.getElementById('top-bar-bell')
  const bellDot = document.getElementById('top-bar-bell-dot')
  const panel = document.getElementById('notification-panel')
  const closeBtn = document.getElementById('notification-panel-close')
  const list = document.getElementById('notification-panel-list')

  function notifIconColor(type) {
    if (type === 'fault') return 'var(--color-danger)'
    if (type === 'payment') return 'var(--color-accent)'
    if (type === 'service') return 'var(--color-warning)'
    return 'var(--color-text-secondary)'
  }

  function renderList() {
    if (NOTIFICATIONS.length === 0) {
      list.innerHTML = `<div style="padding:24px 16px;text-align:center;color:var(--color-text-secondary);font-size:13px;">No notifications yet</div>`
      return
    }
    list.innerHTML = NOTIFICATIONS.map((n, i) => `
      <div class="notif-item" data-index="${i}" style="${n.type === 'service' ? 'cursor:pointer;' : ''}">
        <span class="notif-item-dot" style="background:${notifIconColor(n.type)};"></span>
        <div class="notif-item-text">
          <p class="notif-item-title">${n.title}</p>
          <p class="notif-item-message">${n.message}</p>
          <p class="notif-item-time">${n.time}</p>
        </div>
      </div>
    `).join('')

    list.querySelectorAll('.notif-item').forEach(el => {
      const n = NOTIFICATIONS[Number(el.dataset.index)]
      if (n.type !== 'service') return
      el.addEventListener('click', () => {
        panel.classList.add('hidden')
        navigateTo('faults')
      })
    })
  }

  function updateBellDot() {
    const hasUnread = NOTIFICATIONS.some(n => !n.read) || ACTIVE_VEHICLE.fault_codes.length > 0
    bellDot.classList.toggle('hidden', !hasUnread)
  }

  bellBtn.addEventListener('click', () => {
    const aiPanel = document.getElementById('pulse-ai-panel')
    if (aiPanel) aiPanel.classList.add('hidden')

    panel.classList.toggle('hidden')

    if (!panel.classList.contains('hidden')) {
      renderList()
      NOTIFICATIONS.forEach(n => { n.read = true })
      updateBellDot()
    }
  })

  closeBtn.addEventListener('click', () => panel.classList.add('hidden'))

  // Called from the simulation loop when a new service notification
  // fires, so the bell dot lights up even if the panel is closed.
  window.refreshNotificationBell = function () {
    updateBellDot()
    if (!panel.classList.contains('hidden')) renderList()
  }

  renderList()
  updateBellDot()
}