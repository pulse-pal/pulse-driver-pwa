<div id="home-page">

  <div id="home-fleet-chip-row" class="hidden" style="margin-bottom:12px;">
    <span style="display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border-radius:999px;background:var(--color-card-solid);border:1px solid var(--color-border);font-size:12.5px;font-weight:600;color:var(--color-heading);">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-accent);flex-shrink:0;">
        <path d="M2 6H14V16H2V6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M14 10H18L21 13V16H14V10Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <circle cx="7" cy="17.5" r="1.8" fill="var(--color-card-solid)" stroke="currentColor" stroke-width="1.8"/>
        <circle cx="17" cy="17.5" r="1.8" fill="var(--color-card-solid)" stroke="currentColor" stroke-width="1.8"/>
      </svg>
      <span id="home-fleet-chip-text"></span>
    </span>
  </div>

  <div id="home-trip-card" class="card hidden" style="margin-bottom:14px;border:1.5px solid var(--color-accent);">
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="width:38px;height:38px;border-radius:50%;background:rgba(255,122,26,0.12);color:var(--color-accent);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 19V5M12 5L6 11M12 5L18 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div style="min-width:0;flex:1;">
        <p id="home-trip-title" style="font-weight:700;font-size:14px;color:var(--color-heading);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></p>
        <p id="home-trip-sub" style="font-size:12.5px;color:var(--color-text-secondary);margin-top:2px;"></p>
      </div>
    </div>
    <div style="display:flex;gap:10px;margin-top:12px;">
      <button class="btn btn-primary btn-sm" id="home-trip-continue-btn" style="flex:1;border-radius:999px;">CONTINUE</button>
      <button class="btn btn-outline btn-sm" id="home-trip-end-btn" style="flex:1;border-radius:999px;color:var(--color-danger);">END</button>
    </div>
  </div>

  <div class="gradient-stat-row">
    <div class="gradient-chip gradient-chip-fuel">
      <p class="gradient-chip-label">FUEL</p>
      <p class="gradient-chip-value" id="home-fuel-value">--%</p>
    </div>
    <div class="gradient-chip gradient-chip-temp">
      <p class="gradient-chip-label">ENGINE TEMP</p>
      <p class="gradient-chip-value" id="home-temp-value">--°C</p>
    </div>
    <div class="gradient-chip gradient-chip-battery">
      <p class="gradient-chip-label">BATTERY</p>
      <p class="gradient-chip-value" id="home-battery-value">--V</p>
    </div>
  </div>

  <div class="speed-gauge-container">
    <div class="speed-gauge-ring" id="home-gauge-ring">
      <div class="speed-gauge-inner">
        <p class="value" id="home-speed-value">--</p>
        <p class="unit">km/h</p>
      </div>
    </div>
    <div class="speed-gauge-ticks" id="home-gauge-ticks"></div>
  </div>

  <div class="icon-stat-row">
    <div class="icon-stat-pill">
      <div class="icon-stat-circle">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2V6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4.9 4.9L7.8 7.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M2 12H6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M12 12L16 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>
      </div>
      <div class="icon-stat-text">
        <span class="icon-stat-value" id="home-rpm-value">--</span>
        <span class="icon-stat-label">RPM</span>
      </div>
    </div>
    <div class="icon-stat-pill">
      <div class="icon-stat-circle">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4H14L18 8V20H6V4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 4V8H18" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
      </div>
      <div class="icon-stat-text">
        <span class="icon-stat-value" id="home-load-value">--</span>
        <span class="icon-stat-label">Engine Load</span>
      </div>
    </div>
  </div>

  <div id="home-fault-banner" class="card fault-banner-glow" style="margin-bottom:16px;"></div>

  <div id="home-fleet-actions" class="hidden" style="margin-bottom:16px;">
    <p class="settings-group-label" style="margin-top:0;">Quick actions</p>
    <div id="home-fleet-tiles" style="display:grid;gap:10px;"></div>
    <button class="btn btn-outline" id="home-fleet-call-btn" style="margin-top:10px;border-radius:999px;">CALL FLEET MANAGER</button>
  </div>

  <div class="card" style="margin-bottom:8px;">
    <p class="settings-group-label" style="margin-top:0;">Today</p>
    <div class="stat-grid" id="home-today-grid"></div>
  </div>

</div>

<script>
(function () {
  // Owners see the vehicle name (they can have several vehicles).
  // A fleet driver has one assigned vehicle, so the title is the
  // fleet name instead and the plate sits in the chip below.
  const titleEl = document.getElementById('top-bar-title')
  if (titleEl) {
    titleEl.textContent = canUse('fleet_contact')
      ? (DRIVER.fleet_name || 'Home')
      : `${ACTIVE_VEHICLE.make} ${ACTIVE_VEHICLE.model} ${ACTIVE_VEHICLE.year}`
  }

  // The scale the tick labels were last drawn for. updateDashboard
  // compares this with getSpeedoMax() every tick and redraws the
  // ticks if they differ, so the labels and the fill can never
  // disagree.
  let renderedSpeedoMax = null

  function renderGaugeTicks() {
    const container = document.getElementById('home-gauge-ticks')
    if (!container) return

    const speedoMax = getSpeedoMax(ACTIVE_VEHICLE)
    renderedSpeedoMax = speedoMax
    const values = Array.from({ length: 7 }, (_, i) => Math.round((speedoMax / 6) * i / 10) * 10)

    const cx = 125, cy = 125
    const rDot = 100, rLabel = 118

    let html = ''
    values.forEach(v => {
      const angleDeg = (210 + (v / speedoMax) * 300) % 360
      const rad = angleDeg * Math.PI / 180
      const dotX = cx + rDot * Math.sin(rad)
      const dotY = cy - rDot * Math.cos(rad)
      const labelX = cx + rLabel * Math.sin(rad)
      const labelY = cy - rLabel * Math.cos(rad)
      html += `<span class="gauge-tick-dot" style="left:${dotX}px;top:${dotY}px;"></span>`
      html += `<span class="gauge-tick-label" style="left:${labelX}px;top:${labelY}px;">${v}</span>`
    })
    container.innerHTML = html
  }

  function renderFaultBanner() {
    const banner = document.getElementById('home-fault-banner')
    if (!banner) return

    if (ACTIVE_VEHICLE.fault_codes.length > 0) {
      const fault = FAULT_CODES.find(f => f.code === ACTIVE_VEHICLE.fault_codes[0])
      banner.classList.add('danger')
      banner.classList.remove('ok')
      banner.innerHTML = `
        <p style="font-weight:700;font-size:14px;color:var(--color-danger);">🔴 ${ACTIVE_VEHICLE.fault_codes.length} Active Fault Detected</p>
        <p style="font-size:13px;margin-top:4px;">${fault ? fault.title : ''} — ${fault ? fault.code : ''}</p>
        <p style="font-size:12px;color:var(--color-text-secondary);margin-top:2px;">${fault ? fault.action : ''}</p>
        <button class="btn btn-outline btn-sm" id="home-view-fault-btn" style="margin-top:10px;width:auto;border-radius:999px;">VIEW DETAILS →</button>
      `
      const btn = document.getElementById('home-view-fault-btn')
      if (btn) btn.addEventListener('click', () => navigateTo('fault-detail'))
    } else {
      banner.classList.add('ok')
      banner.classList.remove('danger')
      banner.innerHTML = `
        <p style="font-weight:700;font-size:14px;color:var(--color-accent);">✅ All systems normal</p>
        <p style="font-size:12.5px;color:var(--color-text-secondary);margin-top:2px;">No active fault codes</p>
      `
    }
  }

  // Fleet drivers only: a chip with the assigned vehicle's plate and
  // a row of quick actions. Individual drivers never see either.
  // Every tile is filtered through canUse(), so a fleet plan decides
  // what appears.
  function renderFleetHome() {
    if (!canUse('fleet_contact')) return

    document.getElementById('home-fleet-chip-text').textContent = ACTIVE_VEHICLE.plate
    document.getElementById('home-fleet-chip-row').classList.remove('hidden')

    const icons = {
      faults: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L22 20H2L12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10V14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>`,
      trips: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19V13C4 9.13401 7.13401 6 11 6H12C15.866 6 19 9.13401 19 13V19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M2 19H22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="8" cy="19" r="1.4" fill="currentColor"/><circle cx="16" cy="19" r="1.4" fill="currentColor"/><path d="M11.5 3V6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
      map: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 20L3 18V5L9 7M9 20L15 18M9 20V7M15 18L21 20V7L15 5M15 18V5M9 7L15 5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
      fuel: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 20V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M4 20h11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7.5 8h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M14 9h2.5a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 0 3 0V9l-2.5-2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    }

    const tiles = [
      { feature: 'faults', page: 'faults', label: 'Faults', icon: icons.faults },
      { feature: 'trips', page: 'trips', label: 'Trips', icon: icons.trips },
      { feature: 'map', page: 'map', label: 'Map', icon: icons.map },
      { feature: 'fuel_navigator', page: 'fuel-navigator', label: 'Fuel Nav', icon: icons.fuel }
    ].filter(t => canUse(t.feature))

    const grid = document.getElementById('home-fleet-tiles')
    grid.style.gridTemplateColumns = `repeat(${tiles.length}, 1fr)`
    grid.innerHTML = tiles.map(t => `
      <button class="home-fleet-tile" data-page="${t.page}" style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 6px;background:var(--color-card-solid);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-heading);font-size:12.5px;font-weight:600;">
        <span style="color:var(--color-accent);">${t.icon}</span>
        ${t.label}
      </button>
    `).join('')

    grid.querySelectorAll('.home-fleet-tile').forEach(btn => {
      btn.addEventListener('click', () => navigateTo(btn.dataset.page))
    })

    document.getElementById('home-fleet-call-btn').addEventListener('click', callFleetManager)
    document.getElementById('home-fleet-actions').classList.remove('hidden')
  }

  /* ----------------------------------------------------------
     Resume trip card. Visible only while a trip is started and
     not yet arrived, for accounts that can use Fuel Navigator.
     app.js moves the trip forward; this only shows it.
     ---------------------------------------------------------- */
  function tripIsRunning() {
    const t = ACTIVE_FUEL_ROUTE
    return !!(t && t.status === 'active' && !t.arrived && canUse('fuel_navigator'))
  }

  // Small confirm dialog. It lives on <body>, so it is removed BEFORE
  // the action runs (otherwise it would stay over the next screen).
  function confirmEndTrip(destinationName, onConfirm) {
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    overlay.innerHTML = `
      <div class="modal-card">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:6px;">End trip?</h3>
        <p style="font-size:13px;color:var(--color-text-secondary);" data-role="text"></p>
        <button class="btn btn-danger" data-role="ok" style="margin:18px 0 10px;">END TRIP</button>
        <button class="btn btn-ghost" data-role="cancel">KEEP GOING</button>
      </div>
    `
    document.body.appendChild(overlay)
    overlay.querySelector('[data-role="text"]').textContent =
      `Stop your trip to ${destinationName}? You can plan a new one any time.`
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove() })
    overlay.querySelector('[data-role="cancel"]').addEventListener('click', () => overlay.remove())
    overlay.querySelector('[data-role="ok"]').addEventListener('click', () => {
      overlay.remove()
      onConfirm()
    })
  }

  let tripCardWired = false

  function renderTripCard() {
    const card = document.getElementById('home-trip-card')
    if (!card) return

    if (!tripIsRunning()) {
      card.classList.add('hidden')
      return
    }

    const t = ACTIVE_FUEL_ROUTE
    const totalKm = t.total_km || t.distance_km || 0
    const leftKm = Math.max(0, totalKm - (t.distanceTraveled || 0))

    document.getElementById('home-trip-title').textContent = `Heading to ${t.destinationName}`
    document.getElementById('home-trip-sub').textContent = `${Math.round(leftKm)} km left`
    card.classList.remove('hidden')

    // Buttons are wired once; later ticks only change the text.
    if (tripCardWired) return
    tripCardWired = true

    document.getElementById('home-trip-continue-btn').addEventListener('click', () => navigateTo('map'))
    document.getElementById('home-trip-end-btn').addEventListener('click', () => {
      const trip = ACTIVE_FUEL_ROUTE
      if (!trip) return
      confirmEndTrip(trip.destinationName, () => {
        clearActiveTrip()
        renderTripCard()
      })
    })
  }

  function renderTodaySummary() {
    const grid = document.getElementById('home-today-grid')
    if (!grid) return
    const todayTrips = TRIPS.filter(t => t.date === 'Today')
    const avgScore = todayTrips.length
      ? Math.round(todayTrips.reduce((sum, t) => sum + t.score, 0) / todayTrips.length)
      : null

    let html = `
      <div class="stat-tile">
        <p class="stat-tile-label">Distance Today</p>
        <p class="stat-tile-value">${ACTIVE_VEHICLE.distance_today}km</p>
      </div>
      <div class="stat-tile">
        <p class="stat-tile-label">Trips Today</p>
        <p class="stat-tile-value">${todayTrips.length}</p>
      </div>
    `
    if (canUse('driving_score') && avgScore !== null) {
      html += `
        <div class="stat-tile" style="grid-column: span 2;">
          <p class="stat-tile-label">Driving Score Today</p>
          <p class="stat-tile-value">${avgScore}/100</p>
        </div>
      `
    }
    grid.innerHTML = html
  }

  const GAUGE_SWEEP_DEG = 300

  window.updateDashboard = function () {
    const v = ACTIVE_VEHICLE
    const speedEl = document.getElementById('home-speed-value')
    if (!speedEl) return

    const maxSpeed = getSpeedoMax(v)
    if (maxSpeed !== renderedSpeedoMax) renderGaugeTicks()

    const speed = Math.max(0, Math.min(v.speed, maxSpeed))
    const pct = speed / maxSpeed

    speedEl.textContent = Math.round(speed)

    const fillDeg = pct * GAUGE_SWEEP_DEG
    const midDeg = fillDeg * 0.55
    const gradient = `conic-gradient(from 210deg, #FFD166 0deg, #FF7A1A ${midDeg}deg, #E53935 ${fillDeg}deg, rgba(var(--shadow-rgb), 0.08) ${fillDeg}deg 300deg, transparent 300deg 360deg)`

    const ring = document.getElementById('home-gauge-ring')
    ring.style.background = gradient
    ring.style.boxShadow = '0 10px 32px rgba(255, 122, 26, 0.14)'

    document.getElementById('home-fuel-value').textContent = `${Math.round(v.fuel_level)}%`
    document.getElementById('home-battery-value').textContent = `${v.battery}V`

    const tempEl = document.getElementById('home-temp-value')
    tempEl.textContent = `${v.engine_temp}°C`
    tempEl.style.color = v.engine_temp > 105 ? 'var(--color-danger)' : v.engine_temp >= 95 ? 'var(--color-warning)' : 'var(--color-heading)'

    document.getElementById('home-rpm-value').textContent = Math.round(v.rpm).toLocaleString()
    document.getElementById('home-load-value').textContent = `${Math.round(v.engine_load)}%`

    // Keeps the trip card's km-left in step with the simulation, and
    // hides it the moment the trip ends or the car arrives.
    renderTripCard()
  }

  renderGaugeTicks()
  renderFaultBanner()
  renderFleetHome()
  renderTodaySummary()
  renderTripCard()
  window.updateDashboard()
})()
</script>