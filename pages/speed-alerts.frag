<div id="speed-alerts-page">

  <button id="sa-back-btn" aria-label="Back" style="display:flex;align-items:center;gap:4px;margin:0 0 14px -6px;padding:8px 12px 8px 6px;border-radius:999px;font-size:13px;font-weight:600;color:var(--color-text-secondary);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Back
  </button>

  <div id="sa-body"></div>

</div>

<script>
(function () {
  const page = document.getElementById('speed-alerts-page')

  document.getElementById('sa-back-btn').addEventListener('click', () => navigateTo('map'))

  if (DRIVER.plan !== 'premium') {
    document.getElementById('sa-body').innerHTML = `
      <div class="card" style="text-align:center;padding:32px 20px;">
        <div class="upgrade-lock-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </div>
        <p style="font-size:16px;font-weight:700;color:var(--color-heading);">Speed Alerts</p>
        <p style="font-size:12.5px;color:var(--color-text-secondary);margin:6px 0 20px;line-height:1.5;">Camera and police check alerts are part of Premium.</p>
        <button class="btn btn-primary" id="sa-upgrade-btn" style="border-radius:999px;">UPGRADE TO PREMIUM</button>
      </div>
    `
    document.getElementById('sa-upgrade-btn').addEventListener('click', () => checkPremium('speed_camera_alerts'))
    return
  }

  const s = SPEED_ALERT_SETTINGS

  function toggleRow(label, description, key) {
    return `
      <div class="toggle-row" style="align-items:flex-start;padding:14px 0;">
        <div style="flex:1;padding-right:12px;">
          <p style="font-size:13.5px;font-weight:600;color:var(--color-heading);">${label}</p>
          <p style="font-size:11.5px;color:var(--color-text-secondary);margin-top:2px;">${description}</p>
        </div>
        <label class="toggle" style="margin-top:2px;">
          <input type="checkbox" class="sa-toggle" data-key="${key}" ${s[key] ? 'checked' : ''}>
          <span class="toggle-track"></span>
        </label>
      </div>
    `
  }

  function pickerRow(options, selectedKey, groupName) {
    return `
      <div style="display:flex;gap:8px;">
        ${options.map(opt => `
          <button class="sa-picker-option" data-group="${groupName}" data-value="${opt.value}"
            style="flex:1;padding:10px 4px;border-radius:12px;border:1.5px solid ${opt.value === selectedKey ? 'var(--color-accent)' : 'var(--color-border)'};background:${opt.value === selectedKey ? 'rgba(255,122,26,0.08)' : 'var(--color-card-solid)'};color:${opt.value === selectedKey ? 'var(--color-accent)' : 'var(--color-text-secondary)'};font-size:12.5px;font-weight:600;text-align:center;">
            ${opt.label}
          </button>
        `).join('')}
      </div>
    `
  }

  function render() {
    document.getElementById('sa-body').innerHTML = `
      <p style="font-size:19px;font-weight:800;color:var(--color-heading);margin-bottom:4px;">Speed Alerts</p>
      <p style="font-size:12.5px;color:var(--color-text-secondary);margin-bottom:22px;">Choose what warns you while driving.</p>

      <p class="settings-group-label" style="margin:0 0 4px;">Alert Types</p>
      <div class="card" style="padding:0 16px;">
        ${toggleRow('Fixed speed cameras', 'Known permanent camera locations', 'fixed_cameras')}
        <div style="height:1px;background:var(--color-border);"></div>
        ${toggleRow('Mobile speed cameras', 'Community-reported mobile units', 'mobile_cameras')}
        <div style="height:1px;background:var(--color-border);"></div>
        ${toggleRow('Police checks', 'Community-reported police stops', 'police_checks')}
      </div>

      <p class="settings-group-label" style="margin-top:24px;margin-bottom:8px;">Alert Style</p>
      <div id="sa-style-picker">
        ${pickerRow([
          { value: 'sound', label: 'Sound' },
          { value: 'vibration', label: 'Vibration' },
          { value: 'both', label: 'Both' }
        ], s.alert_style, 'alert_style')}
      </div>

      <p class="settings-group-label" style="margin-top:24px;margin-bottom:8px;">Alert Distance</p>
      <p style="font-size:11.5px;color:var(--color-text-secondary);margin-bottom:10px;margin-top:-4px;">How far ahead you're warned</p>
      <div id="sa-distance-picker">
        ${pickerRow([
          { value: '500m', label: '500m' },
          { value: '1km', label: '1km' },
          { value: '2km', label: '2km' }
        ], s.alert_distance, 'alert_distance')}
      </div>
    `

    bindEvents()
  }

  function bindEvents() {
    document.querySelectorAll('.sa-toggle').forEach(input => {
      input.addEventListener('change', (e) => {
        s[e.target.dataset.key] = e.target.checked
        showToast(e.target.checked ? 'Alert enabled' : 'Alert disabled', 'success')
      })
    })

    document.querySelectorAll('.sa-picker-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.dataset.group
        s[group] = btn.dataset.value
        render()
      })
    })
  }

  render()
})()
</script>