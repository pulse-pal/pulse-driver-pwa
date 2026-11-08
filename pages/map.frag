<style>
  /* The draggable info sheet slides down over the bottom nav when
     collapsed. Keep the nav above it on this page only. */
  #bottom-nav { z-index: 600 !important; }

  .map-camera-alert {
    background: linear-gradient(160deg, #FFF6EE 0%, var(--color-card-solid) 60%);
  }
  :root[data-theme="dark"] .map-camera-alert {
    background: linear-gradient(160deg, #2B2015 0%, var(--color-card-solid) 60%);
  }
</style>

<div class="map-container">
  <div id="leaflet-map"></div>

  <div class="map-floating-header" id="map-floating-header">Map</div>

  <div id="map-legend" style="position:absolute;left:12px;top:70px;z-index:400;background:var(--color-card-solid);border-radius:12px;padding:8px 12px;box-shadow:0 4px 14px rgba(var(--shadow-rgb),0.1);font-size:11px;display:flex;flex-direction:column;gap:4px;color:var(--color-text-primary);"></div>

  <div class="map-fab-stack">
    <button id="map-fuel-nav-fab" class="map-fab-primary" aria-label="Fuel Navigator">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 19V5M12 5L6 11M12 5L18 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="map-controls-group">
      <button id="map-center-btn" aria-label="Center on vehicle">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M12 2V5M12 19V22M22 12H19M5 12H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
      <button id="map-layers-btn" aria-label="Map layers">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </div>

  <div id="map-layers-panel" class="layers-panel hidden">
    <div class="layers-panel-header">
      <span>MAP LAYERS</span>
      <button id="map-layers-close-btn" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="layers-panel-body">
      <p class="layers-panel-title">Map Type</p>
      <div class="layers-type-row">
        <span class="layers-type-option active" id="layers-type-standard">Standard</span>
        <span class="layers-type-option" id="layers-type-satellite">Satellite</span>
      </div>
      <p class="layers-panel-title">Show on Map</p>
      <div class="layers-toggle-row">
        <span>Speed Cameras</span>
        <label class="toggle">
          <input type="checkbox" id="layers-toggle-cameras" checked>
          <span class="toggle-track"></span>
        </label>
      </div>
      <div class="layers-toggle-row">
        <span>Police Reports</span>
        <label class="toggle">
          <input type="checkbox" id="layers-toggle-reports" checked>
          <span class="toggle-track"></span>
        </label>
      </div>
      <div id="map-speed-alert-settings-row" style="border-top:1px solid var(--color-border);margin-top:12px;padding-top:12px;">
        <button id="map-speed-alert-settings-link" style="display:flex;align-items:center;justify-content:space-between;width:100%;font-size:12.5px;font-weight:600;">
          <span>Speed Alert Settings</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
  </div>
</div>

<div class="drag-sheet-outer">
  <div class="drag-sheet" id="map-info-sheet">
    <div class="drag-handle" id="map-info-handle"></div>
    <div class="drag-sheet-content" id="map-sheet-content"></div>
  </div>
</div>

<script>
(function () {
  const v = ACTIVE_VEHICLE
  const RATE_BASE = 9.04
  const BASE_SPEED = 83
  const SENSITIVITY = 0.05
  const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving'
  const ROUTE_LABELS = ['Fastest', 'Route 2', 'Route 3', 'Route 4']

  // What this account can use on the map. Decided by the shared gate,
  // not the plan name. Fleet drivers whose plan lacks a feature don't
  // see a button for it; individual drivers keep their existing
  // upgrade prompts.
  const speedAlertsAllowed = canUse('speed_alerts')
  const fuelNavAllowed = canUse('fuel_navigator')

  function currentConsumptionRate() {
    return Math.max(RATE_BASE + (v.speed - BASE_SPEED) * SENSITIVITY, 6)
  }

  function lerp(a, b, t) { return a + (b - a) * t }

  function haversineKm(a, b) {
    const R = 6371
    const dLat = (b[0] - a[0]) * Math.PI / 180
    const dLng = (b[1] - a[1]) * Math.PI / 180
    const lat1 = a[0] * Math.PI / 180, lat2 = b[0] * Math.PI / 180
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
    return 2 * R * Math.asin(Math.sqrt(h))
  }

  function buildCumulative(coords) {
    const cum = [0]
    for (let i = 1; i < coords.length; i++) {
      cum.push(cum[i - 1] + haversineKm(coords[i - 1], coords[i]))
    }
    return cum
  }

  function pointAtDistance(coords, cum, km) {
    const total = cum[cum.length - 1]
    const target = Math.max(0, Math.min(km, total))
    for (let i = 1; i < cum.length; i++) {
      if (cum[i] >= target) {
        const segFrac = (target - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1)
        return [lerp(coords[i - 1][0], coords[i][0], segFrac), lerp(coords[i - 1][1], coords[i][1], segFrac)]
      }
    }
    return coords[coords.length - 1]
  }

  function sliceCoords(coords, cum, fromKm, toKm) {
    const total = cum[cum.length - 1]
    const from = Math.max(0, Math.min(fromKm, total))
    const to = Math.max(0, Math.min(toKm, total))
    if (to <= from) return []
    const result = [pointAtDistance(coords, cum, from)]
    for (let i = 0; i < coords.length; i++) {
      if (cum[i] > from && cum[i] < to) result.push(coords[i])
    }
    result.push(pointAtDistance(coords, cum, to))
    return result
  }

  async function fetchRoadRoute(origin, dest) {
    const url = `${OSRM_BASE}/${origin.lng},${origin.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Routing request failed')
    const data = await res.json()
    if (!data.routes || !data.routes[0]) throw new Error('No route found')
    const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]])
    const totalKm = data.routes[0].distance / 1000
    const totalDurationMin = data.routes[0].duration / 60
    return { coords, cum: buildCumulative(coords), totalKm, totalDurationMin }
  }

  // Like fetchRoadRoute but asks OSRM for alternative roads too.
  // The public server doesn't always have any to offer — result
  // may come back with just one option, and that's expected.
  async function fetchRoadRouteOptions(origin, dest) {
    const url = `${OSRM_BASE}/${origin.lng},${origin.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson&alternatives=true`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Routing request failed')
    const data = await res.json()
    if (!data.routes || !data.routes.length) throw new Error('No route found')
    const options = data.routes.map(r => {
      const coords = r.geometry.coordinates.map(c => [c[1], c[0]])
      return {
        coords,
        cum: buildCumulative(coords),
        totalKm: r.distance / 1000,
        totalDurationMin: r.duration / 60
      }
    })
    options.sort((a, b) => a.totalDurationMin - b.totalDurationMin)
    return options
  }

  /* ==========================================================
     NORMAL MODE
     ========================================================== */
  function renderNormalMode() {
    document.getElementById('map-floating-header').textContent = 'Map'
    document.getElementById('map-legend').innerHTML = `
      <div style="display:flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:#00C853;"></span> My vehicle</div>
      <div style="display:flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:3px;background:#FF6B00;"></span> Speed camera</div>
      <div style="display:flex;align-items:center;gap:6px;"><span style="width:8px;height:8px;border-radius:50%;background:#E53935;"></span> Police check</div>
    `

    const speedLimit = 80
    const withinLimit = v.speed <= speedLimit
    let cameraAlertHtml = ''
    if (speedAlertsAllowed) {
      const cam = SPEED_CAMERAS[0]
      cameraAlertHtml = `
        <div class="map-camera-alert" style="border-radius:14px;padding:14px;">
          <p style="font-weight:700;font-size:13.5px;color:var(--color-warning);">Speed Camera Ahead</p>
          <p style="font-size:13px;margin-top:4px;color:var(--color-text-primary);">${cam.road} — ${cam.distance}</p>
          <p style="font-size:12px;color:var(--color-text-secondary);margin-top:2px;">Limit: ${cam.speed_limit} km/h</p>
        </div>
      `
    } else if (isFleetDriver()) {
      // Fleet driver without speed alerts: no price, no upgrade.
      cameraAlertHtml = `
        <div style="text-align:center;padding:18px 12px;background:var(--color-bg-card);border-radius:14px;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin:0 auto;color:var(--color-text-secondary);"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          <p style="font-weight:700;font-size:13px;margin-top:8px;color:var(--color-text-primary);">Speed camera alerts</p>
          <p id="map-fleet-lock-text" style="font-size:12px;color:var(--color-text-secondary);margin-top:4px;line-height:1.5;"></p>
          <button class="btn btn-primary btn-sm" id="map-fleet-call-btn" style="margin-top:10px;width:auto;border-radius:999px;">CALL FLEET MANAGER</button>
        </div>
      `
    } else {
      cameraAlertHtml = `
        <div style="text-align:center;padding:18px 12px;background:var(--color-bg-card);border-radius:14px;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin:0 auto;color:var(--color-text-secondary);"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          <p style="font-weight:700;font-size:13px;margin-top:8px;color:var(--color-text-primary);">Speed camera alerts require Premium</p>
          <button class="btn btn-primary btn-sm" id="map-upgrade-btn" style="margin-top:10px;width:auto;border-radius:999px;">UPGRADE</button>
        </div>
      `
    }

    document.getElementById('map-sheet-content').innerHTML = `
      <p class="sheet-title" id="map-address-line">📍 ${v.location}</p>
      <p class="sheet-subline">${v.lat.toFixed(4)}, ${v.lng.toFixed(4)} · Updated ${v.last_updated}</p>
      <div class="fault-info-row" style="margin-top:16px;"><span>Current road</span><span style="font-weight:700;">${v.current_road || '—'}</span></div>
      <div class="fault-info-row"><span>Speed limit</span><span style="font-weight:700;">${speedLimit} km/h</span></div>
      <div class="fault-info-row"><span>Your speed</span><span style="font-weight:700;color:${withinLimit ? 'var(--color-success)' : 'var(--color-danger)'};">${Math.round(v.speed)} km/h</span></div>
      <div style="margin-top:16px;">${cameraAlertHtml}</div>
    `

    const upgradeBtn = document.getElementById('map-upgrade-btn')
    if (upgradeBtn) upgradeBtn.addEventListener('click', () => checkPremium('speed_camera_alerts'))

    const fleetCallBtn = document.getElementById('map-fleet-call-btn')
    if (fleetCallBtn) {
      document.getElementById('map-fleet-lock-text').textContent =
        `Not available on your fleet's plan. Ask ${DRIVER.manager_name || 'your fleet manager'} to enable it.`
      fleetCallBtn.addEventListener('click', callFleetManager)
    }

    driverMapInstance = L.map('leaflet-map', { zoomControl: false, attributionControl: false }).setView([v.lat, v.lng], 15)
    driverMapTileStandard = L.tileLayer(OSM_URL, { subdomains: 'abc', maxZoom: 19 }).addTo(driverMapInstance)
    driverMapTileSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 })

    const vehicleIcon = L.divIcon({ className: '', html: `<div style="width:18px;height:18px;border-radius:50%;background:#00C853;border:3px solid #FFFFFF;box-shadow:0 0 0 2px #00C853,0 2px 8px rgba(0,0,0,.25);"></div>`, iconSize: [18, 18], iconAnchor: [9, 9] })
    L.marker([v.lat, v.lng], { icon: vehicleIcon }).addTo(driverMapInstance).bindPopup(`<b>${v.plate}</b><br>${v.location}`)

    const cameraIcon = L.divIcon({ className: '', html: `<div style="width:14px;height:14px;border-radius:4px;background:#FF6B00;border:2px solid #FFFFFF;box-shadow:0 2px 6px rgba(0,0,0,.2);"></div>`, iconSize: [14, 14], iconAnchor: [7, 7] })
    driverMapCameraLayer = L.layerGroup(SPEED_CAMERAS.map(cam => L.marker([cam.lat, cam.lng], { icon: cameraIcon }).bindPopup(`<b>${cam.type}</b><br>${cam.road}<br>Limit: ${cam.speed_limit} km/h`))).addTo(driverMapInstance)

    const reportIcon = L.divIcon({ className: '', html: `<div style="width:14px;height:14px;border-radius:50%;background:#E53935;border:2px solid #FFFFFF;box-shadow:0 2px 6px rgba(0,0,0,.2);"></div>`, iconSize: [14, 14], iconAnchor: [7, 7] })
    driverMapReportLayer = L.layerGroup(COMMUNITY_REPORTS.map(r => L.marker([r.lat, r.lng], { icon: reportIcon }).bindPopup(`<b>${r.type.replace('_', ' ')}</b><br>${r.road}<br>Reported ${r.reported}`))).addTo(driverMapInstance)

    setTimeout(() => driverMapInstance.invalidateSize(), 200)
    initDraggableSheet('map-info-sheet', 'map-info-handle', 68)
  }

  /* ==========================================================
     FUEL ROUTE MODE

     ACTIVE_FUEL_ROUTE.status:
       'preview'  route chosen, not started. Nothing is saved.
       'active'   started. Saved by app.js, which also advances
                  distanceTraveled while the driver is on any screen.
     The Map only draws the route; it does not own the progress.
     ========================================================== */
  let routeLayers = []
  let vehicleMarker = null
  let roadCoords = null
  let roadCum = null
  let sheetInitialized = false
  // What the sheet was last built for. Same key = only update the
  // numbers (so buttons aren't rebuilt under the driver's finger).
  let renderedSheetKey = null

  function isMapMounted() {
    return !!document.getElementById('map-sheet-content')
  }

  // Km driven along the route. Zero until the trip is started.
  function traveledKm(route) {
    return route.status === 'active' ? (route.distanceTraveled || 0) : 0
  }

  function stationIcon() {
    return L.divIcon({
      className: '',
      html: `<div style="width:26px;height:26px;border-radius:50%;background:#FFFFFF;border:2px solid #FF7A1A;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.2);">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4H14L18 8V20H6V4Z" stroke="#FF7A1A" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 4V8H18" stroke="#FF7A1A" stroke-width="1.8" stroke-linejoin="round"/></svg>
      </div>`,
      iconSize: [26, 26], iconAnchor: [13, 13]
    })
  }

  // A small confirm dialog. It lives on <body>, outside the page, so
  // it is removed BEFORE running the action (otherwise it would stay
  // on top of whatever screen comes next).
  function confirmDialog(opts) {
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    overlay.innerHTML = `
      <div class="modal-card">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:6px;" data-role="title"></h3>
        <p style="font-size:13px;color:var(--color-text-secondary);" data-role="text"></p>
        <button class="btn ${opts.danger ? 'btn-danger' : 'btn-primary'}" data-role="ok" style="margin:18px 0 10px;"></button>
        <button class="btn btn-ghost" data-role="cancel"></button>
      </div>
    `
    document.body.appendChild(overlay)
    overlay.querySelector('[data-role="title"]').textContent = opts.title
    overlay.querySelector('[data-role="text"]').textContent = opts.text
    overlay.querySelector('[data-role="ok"]').textContent = opts.confirmLabel
    overlay.querySelector('[data-role="cancel"]').textContent = opts.cancelLabel

    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove() })
    overlay.querySelector('[data-role="cancel"]').addEventListener('click', () => overlay.remove())
    overlay.querySelector('[data-role="ok"]').addEventListener('click', () => {
      overlay.remove()
      opts.onConfirm()
    })
  }

  function renderRouteHeader() {
    const route = ACTIVE_FUEL_ROUTE
    const header = document.getElementById('map-floating-header')
    if (!route || !header) return

    header.innerHTML = `<span id="map-route-title"></span> <button id="map-exit-route-btn" aria-label="Close route" style="float:right;background:none;border:none;color:var(--color-text-secondary);display:flex;align-items:center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>`
    document.getElementById('map-route-title').textContent =
      (route.status === 'active' ? 'Drive to ' : 'Route to ') + route.destinationName
    document.getElementById('map-exit-route-btn').addEventListener('click', closeRoute)
  }

  // Leaves the route view and the trip with it.
  function exitRoute() {
    clearActiveTrip()
    navigateTo('map')
  }

  // X in the header and END TRIP: a running trip asks first.
  function closeRoute() {
    const route = ACTIVE_FUEL_ROUTE
    if (route && route.status === 'active' && !route.arrived) {
      confirmDialog({
        title: 'End trip?',
        text: `Stop your trip to ${route.destinationName}? You can plan a new one any time.`,
        confirmLabel: 'END TRIP',
        cancelLabel: 'KEEP GOING',
        danger: true,
        onConfirm: exitRoute
      })
      return
    }
    exitRoute()
  }

  // Turn-by-turn is left to Google Maps. No origin is sent, so Google
  // uses the phone's own location.
  function openInGoogleMaps(route) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${route.lat},${route.lng}&travelmode=driving`
    window.open(url, '_blank', 'noopener')
  }

  function startTrip(alsoOpenGoogleMaps) {
    const route = ACTIVE_FUEL_ROUTE
    if (!route) return
    route.status = 'active'
    route.distanceTraveled = 0
    route.arrived = false
    persistActiveTrip()

    // Open Google Maps inside this tap, so the browser allows it.
    if (alsoOpenGoogleMaps) openInGoogleMaps(route)

    showToast(`Trip to ${route.destinationName} started`, 'success')
    renderRouteHeader()
    renderedSheetKey = null
    drawRoute(true)
  }

  async function renderFuelRoute() {
    const route = ACTIVE_FUEL_ROUTE
    if (!route) return

    if (!route.status) route.status = 'preview'
    roadCoords = null
    roadCum = null
    sheetInitialized = false
    renderedSheetKey = null

    renderRouteHeader()

    document.getElementById('map-legend').innerHTML = `
      <div style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:4px;background:#22A559;"></span> Comfortable</div>
      <div style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:4px;background:#FF6B00;"></span> Plan to refuel</div>
      <div style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:4px;background:#E53935;"></span> Critical</div>
      <div style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:4px;background:#9CA3AF;"></span> Unreachable</div>
      <div style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:2px;background:#B0B4BB;"></span> Other route</div>
    `
    document.getElementById('map-sheet-content').innerHTML = `<p class="sheet-title">Calculating route...</p>`

    driverMapInstance = L.map('leaflet-map', { zoomControl: false, attributionControl: false }).setView([v.lat, v.lng], 7)
    driverMapTileStandard = L.tileLayer(OSM_URL, { subdomains: 'abc', maxZoom: 19 }).addTo(driverMapInstance)

    try {
      const options = await fetchRoadRouteOptions({ lat: v.lat, lng: v.lng }, { lat: route.lat, lng: route.lng })
      route.routeOptions = options
      // Keep the route the driver chose earlier (clamped in case fewer
      // options come back this time).
      const idx = Math.min(route.selectedRouteIndex || 0, options.length - 1)
      route.selectedRouteIndex = idx
      const sel = options[idx]
      roadCoords = sel.coords
      roadCum = sel.cum
      route.distance_km = Math.round(sel.totalKm)
      route.duration_min = Math.round(sel.totalDurationMin)
      route.total_km = sel.totalKm
    } catch (err) {
      console.error(err)
      showToast('Could not load road route — check connection', 'danger')
      route.routeOptions = null
      roadCoords = [[v.lat, v.lng], [route.lat, route.lng]]
      roadCum = buildCumulative(roadCoords)
      route.total_km = roadCum[roadCum.length - 1]
    }
    persistActiveTrip()

    setTimeout(() => {
      driverMapInstance.invalidateSize()
      drawRoute(true)
      // Only measure the collapse height AFTER real content (not the
      // "Calculating..." placeholder) has been rendered into the sheet
      initDraggableSheet('map-info-sheet', 'map-info-handle', 60)
      sheetInitialized = true
    }, 100)
  }

  // Switches which route is active. Progress along the road doesn't
  // carry over since the two roads diverge, so a running trip restarts
  // its count from the car's position.
  function selectRouteOption(idx) {
    const route = ACTIVE_FUEL_ROUTE
    if (!route || !route.routeOptions || !route.routeOptions[idx]) return
    route.selectedRouteIndex = idx
    const sel = route.routeOptions[idx]
    roadCoords = sel.coords
    roadCum = sel.cum
    route.distance_km = Math.round(sel.totalKm)
    route.duration_min = Math.round(sel.totalDurationMin)
    route.total_km = sel.totalKm
    if (route.status === 'active') {
      route.distanceTraveled = 0
      route.arrived = false
      persistActiveTrip()
    }
    renderedSheetKey = null
    drawRoute(true)
  }

  function routeCardsHtml(route, rate) {
    if (!route.routeOptions || route.routeOptions.length < 2) return ''
    return `
      <div style="display:flex;gap:8px;overflow-x:auto;margin-top:16px;padding-bottom:2px;">
        ${route.routeOptions.map((opt, idx) => {
          const selected = idx === route.selectedRouteIndex
          const fuel = (opt.totalKm * rate / 100).toFixed(1)
          const hrs = Math.floor(opt.totalDurationMin / 60)
          const mins = Math.round(opt.totalDurationMin % 60)
          const durText = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`
          return `
            <button class="fn-route-card" data-idx="${idx}" style="flex-shrink:0;text-align:left;min-width:118px;padding:10px 12px;border-radius:14px;border:1.5px solid ${selected ? 'var(--color-accent)' : 'var(--color-border)'};background:${selected ? 'rgba(255,122,26,0.08)' : 'var(--color-card-solid)'};">
              <p style="font-size:11px;font-weight:700;color:${selected ? 'var(--color-accent)' : 'var(--color-text-secondary)'};">${ROUTE_LABELS[idx] || 'Route ' + (idx + 1)}</p>
              <p style="font-size:13px;font-weight:700;color:var(--color-heading);margin-top:3px;">${Math.round(opt.totalKm)}km · ${durText}</p>
              <p style="font-size:11px;color:var(--color-text-secondary);margin-top:2px;">${fuel}L fuel</p>
            </button>
          `
        }).join('')}
      </div>
    `
  }

  function remeasureSheet() {
    const sheet = document.getElementById('map-info-sheet')
    if (sheetInitialized && sheet && sheet._sheetRemeasure) {
      sheet._sheetRemeasure()
    }
  }

  function drawRoute(isInitial) {
    const route = ACTIVE_FUEL_ROUTE
    if (!route || !driverMapInstance || !roadCoords || !isMapMounted()) return

    routeLayers.forEach(l => driverMapInstance.removeLayer(l))
    routeLayers = []

    const destKm = roadCum[roadCum.length - 1]
    const basisKm = Math.min(traveledKm(route), destKm)
    const remainingKm = destKm - basisKm

    if (route.arrived || remainingKm <= 0.1) {
      const endIcon = L.divIcon({ className: '', html: `<div style="width:18px;height:18px;border-radius:50%;background:#00C853;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.25);"></div>`, iconSize: [18, 18], iconAnchor: [9, 9] })
      const endPoint = pointAtDistance(roadCoords, roadCum, destKm)
      const m = L.marker(endPoint, { icon: endIcon }).addTo(driverMapInstance).bindPopup(`Arrived at ${route.destinationName}`).openPopup()
      routeLayers.push(m)
      if (isInitial) driverMapInstance.setView(endPoint, 12)

      if (renderedSheetKey !== 'arrived') {
        renderedSheetKey = 'arrived'
        document.getElementById('map-sheet-content').innerHTML = `
          <p class="sheet-title" id="map-fr-arrived-title"></p>
          <button class="btn btn-primary" id="map-fr-done-btn" style="margin-top:16px;border-radius:999px;">DONE</button>
        `
        document.getElementById('map-fr-arrived-title').textContent = `Arrived at ${route.destinationName}`
        document.getElementById('map-fr-done-btn').addEventListener('click', exitRoute)
        remeasureSheet()
      }
      return
    }

    // Other route options, drawn flat and faded. Tapping one switches to it.
    if (route.routeOptions && route.routeOptions.length > 1) {
      route.routeOptions.forEach((opt, idx) => {
        if (idx === route.selectedRouteIndex) return
        const altLine = L.polyline(opt.coords, { color: '#9CA3AF', weight: 4, opacity: 0.55 }).addTo(driverMapInstance)
        altLine.on('click', () => selectRouteOption(idx))
        routeLayers.push(altLine)
      })
    }

    const rate = currentConsumptionRate()
    const rangeKm = v.fuel_litres / (rate / 100)
    const greenEnd = basisKm + Math.min(rangeKm * 0.6, remainingKm)
    const orangeEnd = basisKm + Math.min(rangeKm * 0.85, remainingKm)
    const redEnd = basisKm + Math.min(rangeKm, remainingKm)
    const hasGray = remainingKm > rangeKm

    const segments = [
      { from: basisKm, to: greenEnd, color: '#22A559' },
      { from: greenEnd, to: orangeEnd, color: '#FF6B00' },
      { from: orangeEnd, to: redEnd, color: '#E53935' }
    ]
    if (hasGray) segments.push({ from: redEnd, to: destKm, color: '#9CA3AF', dash: '2,10' })

    segments.forEach(seg => {
      if (seg.to <= seg.from) return
      const coords = sliceCoords(roadCoords, roadCum, seg.from, seg.to)
      if (coords.length < 2) return
      const line = L.polyline(coords, { color: seg.color, weight: 5, lineCap: 'round', dashArray: seg.dash || null }).addTo(driverMapInstance)
      routeLayers.push(line)
    })

    const vIcon = L.divIcon({ className: '', html: `<div style="width:16px;height:16px;border-radius:50%;background:#00C853;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.25);"></div>`, iconSize: [16, 16], iconAnchor: [8, 8] })
    vehicleMarker = L.marker(pointAtDistance(roadCoords, roadCum, basisKm), { icon: vIcon }).addTo(driverMapInstance)
    routeLayers.push(vehicleMarker)

    const endIcon = L.divIcon({ className: '', html: `<div style="width:16px;height:16px;border-radius:4px;background:#E53935;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.25);"></div>`, iconSize: [16, 16], iconAnchor: [8, 8] })
    const endMarker = L.marker(pointAtDistance(roadCoords, roadCum, destKm), { icon: endIcon }).addTo(driverMapInstance).bindPopup(route.destinationName)
    routeLayers.push(endMarker)

    ;[0.25, 0.55, 0.85].forEach((frac, i) => {
      const km = destKm * frac
      if (km <= basisKm) return
      const pos = pointAtDistance(roadCoords, roadCum, km)
      const marker = L.marker(pos, { icon: stationIcon() }).addTo(driverMapInstance)
      routeLayers.push(marker)
      marker.bindPopup(`
        <div style="text-align:center;">
          <b>Fuel Stop ${i + 1}</b><br>${Math.round(km - basisKm)}km ahead<br>
          <button onclick="window.__pulsepalNavigateToStation(${pos[0]}, ${pos[1]}, '${Math.round(km - basisKm)}km ahead')" style="margin-top:6px;background:#FF7A1A;color:#fff;border:none;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:600;">Navigate to this station</button>
        </div>
      `)
    })

    if (isInitial) {
      let bounds
      if (route.routeOptions && route.routeOptions.length > 1) {
        bounds = L.latLngBounds(route.routeOptions[0].coords)
        route.routeOptions.forEach(opt => bounds.extend(opt.coords))
      } else {
        bounds = L.latLngBounds(pointAtDistance(roadCoords, roadCum, basisKm), pointAtDistance(roadCoords, roadCum, destKm))
      }
      driverMapInstance.fitBounds(bounds, { padding: [50, 50] })
    }

    updateFuelRouteSheet(remainingKm, rate)
  }

  // Builds the sheet once per state (preview / active / chosen route);
  // after that only the numbers are refreshed.
  function renderSheet(route, rate) {
    const active = route.status === 'active'
    document.getElementById('map-sheet-content').innerHTML = `
      <p class="sheet-title" id="map-fr-km"></p>
      <div class="fault-info-row" style="margin-top:14px;"><span>Duration</span><span style="font-weight:700;" id="map-fr-duration"></span></div>
      <div class="fault-info-row"><span>Fuel needed</span><span style="font-weight:700;" id="map-fr-fuel"></span></div>
      ${routeCardsHtml(route, rate)}
      <div style="margin-top:16px;display:flex;flex-direction:column;gap:10px;">
        ${active ? `
          <button class="btn btn-outline" id="map-fr-gmaps-btn" style="border-radius:999px;">OPEN IN GOOGLE MAPS</button>
          <button class="btn btn-ghost" id="map-fr-end-btn" style="color:var(--color-danger);">END TRIP</button>
        ` : `
          <button class="btn btn-primary" id="map-fr-start-btn" style="border-radius:999px;">START TRIP</button>
          <button class="btn btn-outline" id="map-fr-start-gmaps-btn" style="border-radius:999px;">START AND OPEN GOOGLE MAPS</button>
        `}
      </div>
    `

    document.querySelectorAll('.fn-route-card').forEach(btn => {
      btn.addEventListener('click', () => selectRouteOption(Number(btn.dataset.idx)))
    })

    const startBtn = document.getElementById('map-fr-start-btn')
    if (startBtn) startBtn.addEventListener('click', () => startTrip(false))
    const startGmapsBtn = document.getElementById('map-fr-start-gmaps-btn')
    if (startGmapsBtn) startGmapsBtn.addEventListener('click', () => startTrip(true))
    const gmapsBtn = document.getElementById('map-fr-gmaps-btn')
    if (gmapsBtn) gmapsBtn.addEventListener('click', () => openInGoogleMaps(route))
    const endBtn = document.getElementById('map-fr-end-btn')
    if (endBtn) endBtn.addEventListener('click', closeRoute)
  }

  function updateFuelRouteSheet(remainingKm, rate) {
    const route = ACTIVE_FUEL_ROUTE
    const key = `${route.status}|${route.selectedRouteIndex || 0}`

    if (key !== renderedSheetKey) {
      renderedSheetKey = key
      renderSheet(route, rate)
      remeasureSheet()
    }

    const fuelNeeded = remainingKm * rate / 100
    const mins = route.duration_min
      ? Math.round(route.duration_min * (remainingKm / roadCum[roadCum.length - 1]))
      : Math.round((remainingKm / 75) * 60)
    const hrs = Math.floor(mins / 60)
    const remMins = mins % 60
    const durationText = hrs > 0 ? `${hrs}h ${remMins}m` : `${remMins}m`

    const kmEl = document.getElementById('map-fr-km')
    const durEl = document.getElementById('map-fr-duration')
    const fuelEl = document.getElementById('map-fr-fuel')
    if (kmEl) kmEl.textContent = `${Math.round(remainingKm)}km`
    if (durEl) durEl.textContent = durationText
    if (fuelEl) fuelEl.textContent = `${fuelNeeded.toFixed(1)}L`
  }

  async function goToStation(lat, lng, label) {
    // Heading to a fuel stop replaces any trip that was running.
    removeStoredTrip()
    document.getElementById('map-sheet-content').innerHTML = `<p class="sheet-title">Calculating route...</p>`
    ACTIVE_FUEL_ROUTE = {
      destinationName: `Fuel Stop (${label})`,
      lat,
      lng,
      distance_km: 0,
      status: 'preview',
      selectedRouteIndex: 0
    }
    renderedSheetKey = null
    renderRouteHeader()
    try {
      const result = await fetchRoadRoute({ lat: v.lat, lng: v.lng }, { lat, lng })
      roadCoords = result.coords
      roadCum = result.cum
      ACTIVE_FUEL_ROUTE.distance_km = Math.round(result.totalKm)
      ACTIVE_FUEL_ROUTE.duration_min = Math.round(result.totalDurationMin)
      ACTIVE_FUEL_ROUTE.total_km = result.totalKm
      drawRoute(true)
    } catch (err) {
      showToast('Could not load road route', 'danger')
    }
  }

  window.__pulsepalNavigateToStation = function (lat, lng, label) {
    const current = ACTIVE_FUEL_ROUTE
    if (current && current.status === 'active' && !current.arrived) {
      confirmDialog({
        title: 'Change your trip?',
        text: `Going to this fuel stop ends your trip to ${current.destinationName}.`,
        confirmLabel: 'GO TO FUEL STOP',
        cancelLabel: 'KEEP CURRENT TRIP',
        danger: false,
        onConfirm: () => goToStation(lat, lng, label)
      })
      return
    }
    goToStation(lat, lng, label)
  }

  // Called by app.js every tick. app.js has already moved the trip
  // forward; this only redraws it. Does nothing in preview, or if the
  // Map is not the screen currently showing.
  window.updateFuelRoute = function () {
    const route = ACTIVE_FUEL_ROUTE
    if (!route || route.status !== 'active') return
    if (!driverMapInstance || !roadCoords || !isMapMounted()) return
    drawRoute(false)
  }

  const layersBtn = document.getElementById('map-layers-btn')
  const layersPanel = document.getElementById('map-layers-panel')
  document.getElementById('map-layers-close-btn').addEventListener('click', () => layersPanel.classList.add('hidden'))
  layersBtn.addEventListener('click', (e) => { e.stopPropagation(); layersPanel.classList.toggle('hidden') })
  document.addEventListener('click', (e) => {
    if (!layersPanel.classList.contains('hidden') && !layersPanel.contains(e.target) && e.target !== layersBtn) {
      layersPanel.classList.add('hidden')
    }
  })
  document.getElementById('layers-type-standard').addEventListener('click', function () {
    this.classList.add('active'); document.getElementById('layers-type-satellite').classList.remove('active')
    if (typeof setDriverMapType === 'function') setDriverMapType('standard')
  })
  document.getElementById('layers-type-satellite').addEventListener('click', function () {
    this.classList.add('active'); document.getElementById('layers-type-standard').classList.remove('active')
    if (typeof setDriverMapType === 'function') setDriverMapType('satellite')
  })
  document.getElementById('layers-toggle-cameras').addEventListener('change', (e) => { if (typeof toggleDriverMapLayer === 'function') toggleDriverMapLayer('cameras', e.target.checked) })
  document.getElementById('layers-toggle-reports').addEventListener('change', (e) => { if (typeof toggleDriverMapLayer === 'function') toggleDriverMapLayer('reports', e.target.checked) })

  // Speed Alert Settings: orange when the account can use speed alerts,
  // grey when not. Hidden for fleet drivers whose plan lacks them.
  const speedAlertLink = document.getElementById('map-speed-alert-settings-link')
  speedAlertLink.style.color = speedAlertsAllowed ? 'var(--color-accent)' : 'var(--color-text-secondary)'
  if (isFleetDriver() && !speedAlertsAllowed) {
    document.getElementById('map-speed-alert-settings-row').classList.add('hidden')
  }
  speedAlertLink.addEventListener('click', () => {
    layersPanel.classList.add('hidden')
    if (checkPremium('speed_camera_alerts')) navigateTo('speed-alerts')
  })

  document.getElementById('map-center-btn').addEventListener('click', () => {
    layersPanel.classList.add('hidden')
    if (driverMapInstance) {
      const center = ACTIVE_FUEL_ROUTE && vehicleMarker ? vehicleMarker.getLatLng() : [v.lat, v.lng]
      driverMapInstance.setView(center, 15)
    }
  })

  // Fuel Navigator button: hidden for fleet drivers whose plan lacks
  // it; individual drivers keep it (Starter gets the upgrade prompt).
  const fuelNavFab = document.getElementById('map-fuel-nav-fab')
  if (isFleetDriver() && !fuelNavAllowed) {
    fuelNavFab.classList.add('hidden')
  } else {
    fuelNavFab.addEventListener('click', () => {
      if (checkPremium('fuel_navigator')) navigateTo('fuel-navigator')
    })
  }

  if (ACTIVE_FUEL_ROUTE) {
    renderFuelRoute()
  } else {
    renderNormalMode()
  }
})()
</script>