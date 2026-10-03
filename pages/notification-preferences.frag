<div id="notif-prefs-page">

  <button id="np-back-btn" aria-label="Back" style="display:flex;align-items:center;gap:4px;margin:0 0 14px -6px;padding:8px 12px 8px 6px;border-radius:999px;font-size:13px;font-weight:600;color:var(--color-text-secondary);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Settings
  </button>

  <p style="font-size:19px;font-weight:800;color:var(--color-heading);margin-bottom:4px;">Notifications</p>
  <p style="font-size:12.5px;color:var(--color-text-secondary);margin-bottom:20px;">Choose how each alert reaches you</p>

  <div id="np-list"></div>

</div>

<script>
(function () {
  document.getElementById('np-back-btn').addEventListener('click', () => navigateTo('settings'))

  const ALERT_TYPES = [
    { key: 'fault_alerts', label: 'Fault Alerts', description: 'Engine and diagnostic fault codes' },
    { key: 'speed_camera_alerts', label: 'Speed Camera Alerts', description: 'Fixed and mobile camera warnings' },
    { key: 'police_checks', label: 'Police Checks', description: 'Community-reported police stops' },
    { key: 'curfew_geofence', label: 'Curfew / Geofence Alerts', description: 'If the car leaves a permitted zone or time window' }
  ]

  function toggleCell(alertKey, channel, checked) {
    return `
      <label style="display:flex;flex-direction:column;align-items:center;gap:4px;">
        <input type="checkbox" class="np-toggle" data-alert="${alertKey}" data-channel="${channel}" ${checked ? 'checked' : ''} style="width:0;height:0;opacity:0;position:absolute;">
        <span class="np-toggle-visual" data-alert="${alertKey}" data-channel="${channel}" style="width:40px;height:24px;border-radius:999px;background:${checked ? 'var(--color-accent)' : 'var(--color-border)'};position:relative;cursor:pointer;transition:background 150ms;">
          <span style="position:absolute;top:2px;left:${checked ? '18px' : '2px'};width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.15);transition:left 150ms;"></span>
        </span>
        <span style="font-size:10px;color:var(--color-text-secondary);">${channel === 'sms' ? 'SMS' : 'Push'}</span>
      </label>
    `
  }

  function alertRow(alert) {
    const prefs = NOTIFICATION_PREFERENCES[alert.key]
    return `
      <div class="card" style="padding:16px 18px;margin-bottom:12px;">
        <p style="font-size:13.5px;font-weight:700;color:var(--color-heading);">${alert.label}</p>
        <p style="font-size:11.5px;color:var(--color-text-secondary);margin-top:2px;margin-bottom:14px;">${alert.description}</p>
        <div style="display:flex;gap:28px;justify-content:center;">
          ${toggleCell(alert.key, 'sms', prefs.sms)}
          ${toggleCell(alert.key, 'push', prefs.push)}
        </div>
      </div>
    `
  }

  function render() {
    document.getElementById('np-list').innerHTML = ALERT_TYPES.map(alertRow).join('')

    document.querySelectorAll('.np-toggle-visual').forEach(visual => {
      visual.addEventListener('click', () => {
        const alertKey = visual.dataset.alert
        const channel = visual.dataset.channel
        const newValue = !NOTIFICATION_PREFERENCES[alertKey][channel]
        NOTIFICATION_PREFERENCES[alertKey][channel] = newValue

        visual.style.background = newValue ? 'var(--color-accent)' : 'var(--color-border)'
        visual.querySelector('span').style.left = newValue ? '18px' : '2px'

        const checkbox = document.querySelector(`.np-toggle[data-alert="${alertKey}"][data-channel="${channel}"]`)
        if (checkbox) checkbox.checked = newValue
      })
    })
  }

  render()
})()
</script>