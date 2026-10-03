<style>
  #trip-detail-page #trip-map-holder {
    height: 230px;
    position: relative;
  }
  #trip-detail-page #trip-map-wrap {
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;
    background: var(--color-bg-card);
    border-radius: var(--radius-md);
    overflow: hidden;
  }
  #trip-detail-page #trip-map-wrap.expanded {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: var(--content-max-width);
    top: var(--top-bar-height);
    bottom: var(--bottom-nav-height);
    height: auto;
    border-radius: 0;
    z-index: 900;
    overscroll-behavior: contain;
  }
  #trip-detail-page #trip-map-toggle {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1200;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-card-solid);
    color: var(--color-text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba(var(--shadow-rgb), 0.14);
  }
  #trip-detail-page #trip-map-label {
    display: none;
    position: absolute;
    top: 10px;
    left: 10px;
    right: 62px;
    z-index: 1200;
    background: var(--color-card-solid);
    border-radius: 999px;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 700;
    color: var(--color-text-primary);
    box-shadow: 0 4px 14px rgba(var(--shadow-rgb), 0.1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #trip-detail-page #trip-map-wrap.expanded #trip-map-label {
    display: block;
  }
</style>

<div id="trip-detail-page">

  <button id="trip-detail-back" aria-label="Back to trips" style="display:flex;align-items:center;gap:4px;margin:0 0 14px -6px;padding:8px 12px 8px 6px;border-radius:999px;font-size:13px;font-weight:600;color:var(--color-text-secondary);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Trips
  </button>

  <div id="trip-detail-body"></div>

</div>

<script>
(function () {
  // Approximate coordinates for the dummy trip place names.
  // Replaced by real start/end coordinates from the backend later.
  const PLACES = {
    'Westlands':        { lat: -1.2670, lng: 36.8110 },
    'CBD Nairobi':      { lat: -1.2864, lng: 36.8172 },
    'Thika Road KM 23': { lat: -1.1850, lng: 36.9150 },
    'Nakuru':           { lat: -0.3031, lng: 36.0800 },
    'JKIA Airport':     { lat: -1.3192, lng: 36.9278 }
  }

  const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving'

  const ICON_EXPAND = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  const ICON_CLOSE = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`

  const body = document.getElementById('trip-detail-body')
  const trip = TRIPS.find(t => t.id === ACTIVE_TRIP_ID)

  let map = null
  let routeBounds = null
  let expanded = false

  document.getElementById('trip-detail-back').addEventListener('click', () => navigateTo('trips'))

  function scoreStyle(score) {
    if (score >= 80) return { bg: 'rgba(34,165,89,0.12)', color: 'var(--color-success)', label: 'Smooth driving' }
    if (score >= 65) return { bg: 'rgba(255,107,0,0.12)', color: 'var(--color-warning)', label: 'Room to improve' }
    return { bg: 'rgba(229,57,53,0.12)', color: 'var(--color-danger)', label: 'Needs attention' }
  }

  function renderEmpty() {
    body.innerHTML = `
      <div class="empty-state">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/></svg>
        <p style="font-weight:700;font-size:15px;color:var(--color-heading);">Trip not found</p>
        <p style="font-size:12.5px;margin-top:4px;">Pick a trip from your history.</p>
      </div>
    `
  }

  function renderLocked() {
    body.innerHTML = `
      <div class="card" style="text-align:center;padding:32px 20px;">
        <div class="upgrade-lock-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </div>
        <p style="font-size:16px;font-weight:700;color:var(--color-heading);">${trip.start} to ${trip.end}</p>
        <p style="font-size:12.5px;color:var(--color-text-secondary);margin:6px 0 20px;line-height:1.5;">Trip maps, driving scores and behaviour breakdowns are part of Premium.</p>
        <button class="btn btn-primary" id="trip-upgrade-btn" style="border-radius:999px;">UPGRADE TO PREMIUM</button>
      </div>
    `
    document.getElementById('trip-upgrade-btn').addEventListener('click', () => checkPremium('trip_coaching'))
  }

  function behaviourRow(label, count, unit) {
    const clean = count === 0
    return `
      <div style="display:flex;justify-content:space-between;align-items:baseline;padding:11px 0;">
        <span style="font-size:13px;color:var(--color-text-secondary);">${label}</span>
        <span style="font-size:13.5px;font-weight:700;color:${clean ? 'var(--color-success)' : 'var(--color-danger)'};">${clean ? 'None' : count + ' ' + unit + (count === 1 ? '' : 's')}</span>
      </div>
    `
  }

  function renderTrip() {
    const s = scoreStyle(trip.score)

    body.innerHTML = `
      <div id="trip-map-holder">
        <div id="trip-map-wrap">
          <div id="trip-map" style="width:100%;height:100%;"></div>
          <div id="trip-map-label">${trip.start} to ${trip.end}</div>
          <button id="trip-map-toggle" aria-label="Expand map">${ICON_EXPAND}</button>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;margin:20px 2px 18px;">
        <div style="min-width:0;">
          <p style="font-size:11px;font-weight:600;color:var(--color-text-secondary);letter-spacing:0.3px;">${trip.date}</p>
          <p style="font-size:19px;font-weight:800;color:var(--color-heading);margin-top:5px;line-height:1.25;">${trip.start}</p>
          <p style="font-size:13px;font-weight:600;color:var(--color-accent);margin-top:2px;">to ${trip.end}</p>
        </div>
        <div style="text-align:center;padding:8px 14px;border-radius:16px;background:${s.bg};color:${s.color};flex-shrink:0;">
          <p style="font-size:24px;font-weight:800;line-height:1;">${trip.score}</p>
          <p style="font-size:9px;font-weight:700;letter-spacing:0.5px;margin-top:3px;opacity:0.8;">SCORE</p>
        </div>
      </div>

      <div class="card" style="padding:20px;">
        <div style="display:flex;align-items:baseline;gap:6px;">
          <span style="font-size:32px;font-weight:800;color:var(--color-heading);line-height:1;">${trip.distance}</span>
          <span style="font-size:13px;font-weight:600;color:var(--color-text-secondary);">km in ${trip.duration}</span>
        </div>
        <div style="display:flex;gap:26px;margin-top:18px;">
          <div>
            <p style="font-size:10.5px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.4px;">Avg speed</p>
            <p style="font-size:14px;font-weight:700;color:var(--color-heading);margin-top:3px;">${trip.avg_speed} km/h</p>
          </div>
          <div>
            <p style="font-size:10.5px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.4px;">Max speed</p>
            <p style="font-size:14px;font-weight:700;color:var(--color-heading);margin-top:3px;">${trip.max_speed} km/h</p>
          </div>
          <div>
            <p style="font-size:10.5px;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.4px;">Fuel</p>
            <p style="font-size:14px;font-weight:700;color:var(--color-heading);margin-top:3px;">${trip.fuel_used} L</p>
          </div>
        </div>
      </div>

      <div style="margin:24px 2px 6px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <p style="font-size:13px;font-weight:700;color:var(--color-heading);">Driving behaviour</p>
          <p style="font-size:11.5px;font-weight:600;color:${s.color};">${s.label}</p>
        </div>
        <div style="margin-top:4px;">
          ${behaviourRow('Harsh braking', trip.harsh_braking, 'event')}
          <div style="height:1px;background:var(--color-border);"></div>
          ${behaviourRow('Harsh acceleration', trip.harsh_accel, 'event')}
          <div style="height:1px;background:var(--color-border);"></div>
          ${behaviourRow('Speeding', trip.speeding, 'incident')}
        </div>
      </div>

      <button class="btn btn-primary" id="trip-coaching-btn" style="border-radius:999px;margin-top:22px;">GET TRIP COACHING</button>
    `

    document.getElementById('trip-coaching-btn').addEventListener('click', () => {
      if (checkPremium('trip_coaching')) navigateTo('trip-coaching')
    })

    drawMap()
  }

  function startIcon() {
    return L.divIcon({
      className: '',
      html: `<div style="width:16px;height:16px;border-radius:50%;background:#00C853;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.25);"></div>`,
      iconSize: [16, 16], iconAnchor: [8, 8]
    })
  }

  function endIcon() {
    return L.divIcon({
      className: '',
      html: `<div style="width:16px;height:16px;border-radius:4px;background:#E53935;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.25);"></div>`,
      iconSize: [16, 16], iconAnchor: [8, 8]
    })
  }

  // The public OSRM server is shared and sometimes times out or
  // rate-limits, so try a few times before giving up.
  async function fetchRoute(url, attempts) {
    for (let i = 0; i < attempts; i++) {
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error('HTTP ' + res.status)
        const data = await res.json()
        if (!data.routes || !data.routes[0]) throw new Error('No route found')
        return data.routes[0]
      } catch (err) {
        console.error(`OSRM attempt ${i + 1} of ${attempts} failed:`, err)
        if (i < attempts - 1) await new Promise(r => setTimeout(r, 1200))
      }
    }
    return null
  }

  // Collapsed = preview only (no drag/zoom) so the page scrolls
  // normally over it. Expanded = drag + pinch zoom.
  function setInteractive(on) {
    if (!map) return
    const method = on ? 'enable' : 'disable'
    map.dragging[method]()
    map.touchZoom[method]()
    map.doubleClickZoom[method]()
    map.scrollWheelZoom[method]()
  }

  function setExpanded(on) {
    const wrap = document.getElementById('trip-map-wrap')
    const toggle = document.getElementById('trip-map-toggle')
    if (!wrap || !toggle || !map) return

    expanded = on
    wrap.classList.toggle('expanded', on)
    toggle.innerHTML = on ? ICON_CLOSE : ICON_EXPAND
    toggle.setAttribute('aria-label', on ? 'Close expanded map' : 'Expand map')
    setInteractive(on)

    setTimeout(() => {
      if (!map) return
      map.invalidateSize()
      if (routeBounds) map.fitBounds(routeBounds, { padding: [36, 36] })
    }, 60)
  }

  function drawMap() {
    const mapEl = document.getElementById('trip-map')
    const a = PLACES[trip.start]
    const b = PLACES[trip.end]
    if (!mapEl || !a || !b) return

    map = L.map(mapEl, { zoomControl: false, attributionControl: true })
    L.tileLayer(OSM_URL, { subdomains: 'abc', maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map)

    L.marker([a.lat, a.lng], { icon: startIcon() }).addTo(map).bindPopup(trip.start)
    L.marker([b.lat, b.lng], { icon: endIcon() }).addTo(map).bindPopup(trip.end)

    const straight = [[a.lat, a.lng], [b.lat, b.lng]]
    routeBounds = L.latLngBounds(straight)
    map.fitBounds(routeBounds, { padding: [36, 36] })
    setTimeout(() => map.invalidateSize(), 200)

    setInteractive(false)

    document.getElementById('trip-map-toggle').addEventListener('click', (e) => {
      e.stopPropagation()
      setExpanded(!expanded)
    })
    map.on('click', () => { if (!expanded) setExpanded(true) })

    const url = `${OSRM_BASE}/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`

    fetchRoute(url, 3).then(route => {
      if (!document.getElementById('trip-map')) return

      if (!route) {
        // Fallback: dashed straight line if OSRM stays unreachable
        L.polyline(straight, { color: '#FF7A1A', weight: 4, opacity: 0.8, dashArray: '6 8' }).addTo(map)
        return
      }

      const line = L.geoJSON(route.geometry, {
        style: { color: '#FF7A1A', weight: 5, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }
      }).addTo(map)
      routeBounds = line.getBounds()
      map.fitBounds(routeBounds, { padding: [36, 36] })
    })
  }

  if (!trip) {
    renderEmpty()
  } else if (DRIVER.plan !== 'premium') {
    renderLocked()
  } else {
    renderTrip()
  }
})()
</script>