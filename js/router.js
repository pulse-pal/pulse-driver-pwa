/* ==========================================================
   PULSEPAL DRIVER — ROUTER.JS
   Loads page fragments into #content, manages layout state
   ========================================================== */

const ONBOARDING_PAGES = [
  'splash',
  'onboarding-device',
  'onboarding-verify',
  'onboarding-password',
  'subscribe',
  'login'
]

const TRANSPARENT_TOPBAR_PAGES = ['map', 'fuel-navigator']

const PAGE_TITLES = {
  home: '',
  faults: 'Vehicle Health',
  'fault-detail': 'Fault Detail',
  map: '',
  trips: 'Trip History',
  'trip-detail': 'Trip Detail',
  'service-reminders': 'Service Reminders',
  mechanics: 'Mechanics',
  'mechanic-detail': 'Mechanic',
  'fuel-navigator': '',
  'pulse-ai': 'Pulse AI',
  'speed-alerts': 'Speed Alerts',
  'trip-coaching': 'Trip Coaching',
  'vehicle-sharing': 'Vehicle Sharing',
  'my-vehicles': 'My Vehicles',
  'add-vehicle': 'Add Vehicle',
  profile: 'My Profile',
  subscription: 'My Subscription',
  settings: 'Settings',
  'device-status': 'Device Status',
  security: 'App Lock',
  'notification-preferences': 'Notifications',
  about: 'About',
  'help-faq': 'Help / FAQ',
  'deactivate-account': 'Deactivate Account'
}

const NAV_TAB_FOR_PAGE = {
  home: 'home',
  faults: 'faults',
  'fault-detail': 'faults',
  map: 'map',
  trips: 'trips',
  'trip-detail': 'trips',
  'service-reminders': 'faults',
  mechanics: 'faults',
  'mechanic-detail': 'faults',
  'fuel-navigator': 'map',
  'pulse-ai': 'settings',
  'speed-alerts': 'map',
  'trip-coaching': 'trips',
  'vehicle-sharing': 'settings',
  'my-vehicles': 'settings',
  'add-vehicle': 'settings',
  profile: 'settings',
  subscription: 'settings',
  settings: 'settings',
  'device-status': 'settings',
  security: 'settings',
  'notification-preferences': 'settings',
  about: 'settings',
  'help-faq': 'settings',
  'deactivate-account': 'settings'
}

let currentPage = null

async function loadPage(page) {
  const content = document.getElementById('content')
  const topBar = document.getElementById('top-bar')
  const bottomNav = document.getElementById('bottom-nav')
  const topBarTitle = document.getElementById('top-bar-title')
  const aiFab = document.getElementById('pulse-ai-fab')
  const aiPanel = document.getElementById('pulse-ai-panel')

  try {
    const res = await fetch(`pages/${page}.frag`)
    if (!res.ok) throw new Error(`Page not found: ${page}`)
    const html = await res.text()
    content.innerHTML = html
  } catch (err) {
    content.innerHTML = `<div class="empty-state"><p>Couldn't load this page.</p></div>`
    console.error(err)
  }

  currentPage = page

  const isOnboarding = ONBOARDING_PAGES.includes(page)

  if (isOnboarding) {
    topBar.classList.add('hidden')
    bottomNav.classList.add('hidden')
    aiFab.classList.add('hidden')
    aiPanel.classList.add('hidden')
  } else {
    bottomNav.classList.remove('hidden')
    aiFab.classList.remove('hidden')
    setActiveNavTab(NAV_TAB_FOR_PAGE[page] || null)

    if (TRANSPARENT_TOPBAR_PAGES.includes(page)) {
      topBar.classList.add('hidden')
    } else {
      topBar.classList.remove('hidden')
      topBarTitle.textContent = PAGE_TITLES[page] || ''
    }
  }

  updateFaultBadge()
  executePageScripts(content)

  if (typeof window.initPage === 'function') {
    window.initPage(page)
  }

  window.scrollTo(0, 0)
}

function executePageScripts(container) {
  const scripts = container.querySelectorAll('script')
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script')
    Array.from(oldScript.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value)
    })
    newScript.textContent = oldScript.textContent
    oldScript.parentNode.replaceChild(newScript, oldScript)
  })
}

function setActiveNavTab(tab) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === tab)
  })
}

function updateFaultBadge() {
  const badge = document.getElementById('nav-fault-badge')
  if (!badge) return
  const count = ACTIVE_VEHICLE.fault_codes.length
  if (count > 0) {
    badge.textContent = count
    badge.classList.remove('hidden')
  } else {
    badge.classList.add('hidden')
  }
}

function navigateTo(page) {
  const content = document.getElementById('content')
  content.style.opacity = '0'
  setTimeout(() => {
    loadPage(page)
    content.style.opacity = '1'
  }, 150)
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      navigateTo(item.dataset.page)
    })
  })

  document.getElementById('top-bar-bell').addEventListener('click', () => {
    showToast('No new notifications', 'success')
  })
})