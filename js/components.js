/* ==========================================================
   PULSEPAL DRIVER — COMPONENTS.JS
   Reusable UI helpers used across pages
   ========================================================== */

/* ----------------------------------------------------------
   TOASTS
   ---------------------------------------------------------- */

function showToast(message, type = 'success') {
  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`

  const iconSvg = type === 'success'
    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    : `<span style="font-weight:800;font-size:13px;line-height:1;">!</span>`

  toast.innerHTML = `<span class="toast-icon">${iconSvg}</span><span>${message}</span>`
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 4000)
}

/* ----------------------------------------------------------
   PREMIUM FEATURE GATE
   ---------------------------------------------------------- */

const PREMIUM_FEATURES = {
  fuel_navigator: {
    name: 'Fuel Range Navigator',
    pitch: 'See exactly how far you can go on remaining fuel and find the cheapest stations nearby.'
  },
  pulse_ai_chatbot: {
    name: 'Pulse AI Assistant',
    pitch: 'Chat with an AI that understands your vehicle\'s faults and answers questions in plain language.'
  },
  trip_coaching: {
    name: 'Trip Coaching',
    pitch: 'Get personalized tips after every trip to drive safer and save fuel.'
  },
  speed_camera_alerts: {
    name: 'Speed Camera Alerts',
    pitch: 'Get warned before fixed speed cameras and community-reported police checks.'
  },
  vehicle_sharing_advanced: {
    name: 'Advanced Vehicle Sharing',
    pitch: 'Share with timed access windows and see driving behavior reports for shared drivers.'
  }
}

function checkPremium(featureKey) {
  if (DRIVER.plan === 'premium') return true
  showUpgradePrompt(featureKey)
  return false
}

function showUpgradePrompt(featureKey) {
  const feature = PREMIUM_FEATURES[featureKey] || {
    name: 'This feature',
    pitch: 'Unlock more with Premium.'
  }

  const existing = document.getElementById('upgrade-modal')
  if (existing) existing.remove()

  const overlay = document.createElement('div')
  overlay.id = 'upgrade-modal'
  overlay.className = 'modal-overlay'
  overlay.innerHTML = `
    <div class="modal-card">
      <div class="upgrade-lock-icon">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/>
          <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </div>
      <h3 style="font-size:17px;font-weight:700;margin-bottom:4px;">${feature.name}</h3>
      <p style="font-size:13px;color:var(--color-text-secondary);">This feature requires Premium plan</p>

      <div class="upgrade-price-compare">
        <span>Current: Starter — KES 1,500/mo</span>
        <span style="color:var(--color-premium);font-weight:700;">Premium — KES 2,500/mo</span>
      </div>

      <p style="font-size:12.5px;color:var(--color-text-secondary);margin-top:10px;">Upgrading unlocks:</p>
      <ul class="upgrade-feature-list">
        <li>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          ${feature.pitch}
        </li>
        <li>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Fuel Range Navigator, Pulse AI, Trip Coaching, Speed Camera Alerts
        </li>
        <li>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Advanced vehicle sharing with behavior reports
        </li>
      </ul>

      <button class="btn btn-primary" id="upgrade-modal-cta" style="margin-bottom:10px;">
        UPGRADE TO PREMIUM
      </button>
      <button class="btn btn-ghost" id="upgrade-modal-later">MAYBE LATER</button>
    </div>
  `

  document.body.appendChild(overlay)

  document.getElementById('upgrade-modal-later').addEventListener('click', closeUpgradePrompt)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeUpgradePrompt()
  })
  document.getElementById('upgrade-modal-cta').addEventListener('click', () => {
    closeUpgradePrompt()
    navigateTo('subscription')
  })
}

function closeUpgradePrompt() {
  const modal = document.getElementById('upgrade-modal')
  if (modal) modal.remove()
}

/* ----------------------------------------------------------
   FORMATTING HELPERS
   ---------------------------------------------------------- */

function formatKES(amount) {
  return 'KES ' + Number(amount).toLocaleString('en-KE')
}

function formatKESRange(min, max) {
  return `${formatKES(min)} - ${formatKES(max)}`
}

/* ----------------------------------------------------------
   STAR RATING
   ---------------------------------------------------------- */

function renderStars(rating) {
  return `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.9 6.6 7.1.7-5.4 4.7 1.6 7-6.2-3.7L5.8 21l1.6-7L2 9.3l7.1-.7L12 2z"/>
    </svg>
    <span>${rating.toFixed(1)}</span>
  `
}

/* ----------------------------------------------------------
   STATUS / SEVERITY HELPERS
   ---------------------------------------------------------- */

function severityDotClass(severity) {
  if (severity === 'critical' || severity === 'high') return 'status-dot-danger'
  if (severity === 'medium') return 'status-dot-warning'
  return 'status-dot-offline'
}

function severityIconClass(severity) {
  return severity
}

/* ----------------------------------------------------------
   DRAGGABLE BOTTOM SHEET
   ---------------------------------------------------------- */

function initDraggableSheet(sheetId, handleId, peekHeight) {
  const sheet = document.getElementById(sheetId)
  const handle = document.getElementById(handleId)
  if (!sheet || !handle) return

  let collapsedOffset = 0
  let currentOffset = 0
  let startY = 0
  let startOffset = 0
  let dragging = false
  // Tracks whether the user has left the sheet pulled open or
  // collapsed. A remeasure (triggered when content changes shape,
  // e.g. new route data) restores this same state instead of
  // always snapping back to collapsed.
  let isOpen = false

  function measure() {
    const sheetHeight = sheet.offsetHeight
    collapsedOffset = Math.max(sheetHeight - peekHeight, 0)
    setOffset(isOpen ? 0 : collapsedOffset, false)
  }

  function setOffset(offset, animate) {
    currentOffset = Math.min(Math.max(offset, 0), collapsedOffset)
    sheet.style.transition = animate ? 'transform 220ms ease' : 'none'
    sheet.style.transform = `translateY(${currentOffset}px)`
  }

  handle.addEventListener('pointerdown', (e) => {
    dragging = true
    startY = e.clientY
    startOffset = currentOffset
    handle.setPointerCapture(e.pointerId)
    sheet.style.transition = 'none'
  })

  handle.addEventListener('pointermove', (e) => {
    if (!dragging) return
    setOffset(startOffset + (e.clientY - startY), false)
  })

  function endDrag() {
    if (!dragging) return
    dragging = false
    const totalMoved = Math.abs(currentOffset - startOffset)
    let snapTo
    if (totalMoved < 5) {
      snapTo = startOffset > collapsedOffset / 2 ? 0 : collapsedOffset
    } else {
      snapTo = currentOffset > collapsedOffset / 2 ? collapsedOffset : 0
    }
    isOpen = snapTo === 0
    setOffset(snapTo, true)
  }

  handle.addEventListener('pointerup', endDrag)
  handle.addEventListener('pointercancel', endDrag)

  setTimeout(measure, 50)
  window.addEventListener('resize', measure)

  sheet._sheetExpand = () => { isOpen = true; setOffset(0, true) }
  sheet._sheetCollapse = () => { isOpen = false; setOffset(collapsedOffset, true) }
  // Callers use this after content changes shape (new route loaded,
  // station switched) so the collapse height reflects the real,
  // final content instead of a stale earlier measurement. Preserves
  // whatever open/collapsed state the user left it in.
  sheet._sheetRemeasure = measure
}