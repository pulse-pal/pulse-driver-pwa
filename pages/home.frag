<div id="home-page">

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

  <div class="card" style="margin-bottom:8px;">
    <p class="settings-group-label" style="margin-top:0;">Today</p>
    <div class="stat-grid" id="home-today-grid"></div>
  </div>

</div>

<script>
(function () {
  const titleEl = document.getElementById('top-bar-title')
  if (titleEl) titleEl.textContent = `${ACTIVE_VEHICLE.make} ${ACTIVE_VEHICLE.model} ${ACTIVE_VEHICLE.year}`

  function renderGaugeTicks() {
    const container = document.getElementById('home-gauge-ticks')
    if (!container) return

    const topSpeed = ACTIVE_VEHICLE.top_speed || 180
    const values = Array.from({ length: 7 }, (_, i) => Math.round((topSpeed / 6) * i / 10) * 10)

    const cx = 125, cy = 125
    const rDot = 100, rLabel = 118

    let html = ''
    values.forEach(v => {
      const angleDeg = (210 + (v / topSpeed) * 300) % 360
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
    if (DRIVER.plan === 'premium' && avgScore !== null) {
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

    const maxSpeed = v.top_speed || 180
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
  }

  renderGaugeTicks()
  renderFaultBanner()
  renderTodaySummary()
  window.updateDashboard()
})()
</script>