/* ==========================================================
   PULSEPAL DRIVER — APP.JS
   Startup, live data simulation, service worker registration,
   the persistent floating Pulse AI assistant, and the
   notification bell dropdown
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker()
  applyStoredTheme()
  loadPage('splash')

  setTimeout(() => {
    const isLoggedIn = localStorage.getItem('pulsepal_logged_in') === 'true'
    if (isLoggedIn) {
      navigateTo('home')
    } else {
      navigateTo('onboarding-device')
    }
  }, 2000)

  startLiveDataSimulation()
  initPulseAiFab()
  initNotificationBell()
})

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