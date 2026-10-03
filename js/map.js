/* ==========================================================
   PULSEPAL DRIVER — MAP.JS
   Leaflet map setup — kept for reference/reuse. map.frag
   currently sets up its own map inline (dual-mode support),
   but assigns to these same global variable names, so
   setDriverMapType/toggleDriverMapLayer still work against
   whatever map.frag created.
   ========================================================== */

let driverMapInstance = null
let driverMapTileStandard = null
let driverMapTileSatellite = null
let driverMapCameraLayer = null
let driverMapReportLayer = null

function initDriverMap() {
  const mapEl = document.getElementById('leaflet-map')
  if (!mapEl) return

  if (driverMapInstance) {
    driverMapInstance.remove()
    driverMapInstance = null
  }

  const vehicle = ACTIVE_VEHICLE

  driverMapInstance = L.map('leaflet-map', {
    zoomControl: false,
    attributionControl: false
  }).setView([vehicle.lat, vehicle.lng], 15)

  // Plain OpenStreetMap tiles — no account/API key required,
  // unlike Carto's basemaps which now require one
  driverMapTileStandard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    subdomains: 'abc',
    maxZoom: 19
  }).addTo(driverMapInstance)

  driverMapTileSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19
  })

  const vehicleIcon = L.divIcon({
    className: 'vehicle-marker',
    html: `<div style="
      width: 18px; height: 18px; border-radius: 50%;
      background: #00C853; border: 3px solid #FFFFFF;
      box-shadow: 0 0 0 2px #00C853, 0 2px 8px rgba(0,0,0,0.25);
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  })

  L.marker([vehicle.lat, vehicle.lng], { icon: vehicleIcon })
    .addTo(driverMapInstance)
    .bindPopup(`<b>${vehicle.plate}</b><br>${vehicle.location}`)

  const cameraIcon = L.divIcon({
    className: 'camera-marker',
    html: `<div style="
      width: 14px; height: 14px; border-radius: 4px;
      background: #FF6B00; border: 2px solid #FFFFFF;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  })

  driverMapCameraLayer = L.layerGroup(
    SPEED_CAMERAS.map(cam =>
      L.marker([cam.lat, cam.lng], { icon: cameraIcon })
        .bindPopup(`<b>${cam.type}</b><br>${cam.road}<br>Limit: ${cam.speed_limit} km/h`)
    )
  ).addTo(driverMapInstance)

  const reportIcon = L.divIcon({
    className: 'report-marker',
    html: `<div style="
      width: 14px; height: 14px; border-radius: 50%;
      background: #E53935; border: 2px solid #FFFFFF;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  })

  driverMapReportLayer = L.layerGroup(
    COMMUNITY_REPORTS.map(report =>
      L.marker([report.lat, report.lng], { icon: reportIcon })
        .bindPopup(`<b>${report.type.replace('_', ' ')}</b><br>${report.road}<br>Reported ${report.reported}`)
    )
  ).addTo(driverMapInstance)

  setTimeout(() => driverMapInstance.invalidateSize(), 200)
}

function setDriverMapType(type) {
  if (!driverMapInstance) return
  if (type === 'satellite') {
    driverMapInstance.removeLayer(driverMapTileStandard)
    driverMapTileSatellite.addTo(driverMapInstance)
  } else {
    driverMapInstance.removeLayer(driverMapTileSatellite)
    driverMapTileStandard.addTo(driverMapInstance)
  }
}

function toggleDriverMapLayer(name, visible) {
  if (!driverMapInstance) return
  const layer = name === 'cameras' ? driverMapCameraLayer : driverMapReportLayer
  if (!layer) return
  if (visible) {
    driverMapInstance.addLayer(layer)
  } else {
    driverMapInstance.removeLayer(layer)
  }
}

window.initDriverMap = initDriverMap
window.setDriverMapType = setDriverMapType
window.toggleDriverMapLayer = toggleDriverMapLayer