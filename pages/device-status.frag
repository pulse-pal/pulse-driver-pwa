<div id="device-status-page">

  <button id="ds-back-btn" aria-label="Back" style="display:flex;align-items:center;gap:4px;margin:0 0 14px -6px;padding:8px 12px 8px 6px;border-radius:999px;font-size:13px;font-weight:600;color:var(--color-text-secondary);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Settings
  </button>

  <div id="ds-body"></div>

</div>

<script>
(function () {
  const v = ACTIVE_VEHICLE

  document.getElementById('ds-back-btn').addEventListener('click', () => navigateTo('settings'))

  function signalMeta(strength) {
    if (strength === 'strong') return { label: 'Strong', color: 'var(--color-success)', bars: 3 }
    if (strength === 'medium') return { label: 'Medium', color: 'var(--color-warning)', bars: 2 }
    return { label: 'Weak', color: 'var(--color-danger)', bars: 1 }
  }

  function signalBars(active, color) {
    let html = '<div style="display:flex;align-items:flex-end;gap:2px;height:16px;">'
    for (let i = 1; i <= 3; i++) {
      const h = 5 + i * 4
      html += `<span style="width:4px;height:${h}px;border-radius:2px;background:${i <= active ? color : 'var(--color-border)'};"></span>`
    }
    html += '</div>'
    return html
  }

  function render() {
    const sig = signalMeta(v.signal_strength)
    const online = v.status === 'active'

    document.getElementById('ds-body').innerHTML = `
      <div class="card" style="text-align:center;padding:26px 20px;margin-bottom:18px;">
        <div style="width:64px;height:64px;border-radius:18px;background:var(--color-bg-card);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;color:${online ? 'var(--color-success)' : 'var(--color-text-secondary)'};">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20v-4M6 20v-8M18 20v-12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </div>
        <p style="font-size:17px;font-weight:800;color:var(--color-heading);">${v.device_code}</p>
        <p style="font-size:12.5px;color:var(--color-text-secondary);margin-top:2px;">${v.make} ${v.model} · ${v.plate}</p>
        <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:10px;">
          <span class="status-dot ${online ? 'status-dot-online' : 'status-dot-offline'}"></span>
          <span style="font-size:12.5px;font-weight:600;color:${online ? 'var(--color-success)' : 'var(--color-text-secondary)'};">${online ? 'Connected' : 'Offline'}</span>
        </div>
      </div>

      <div class="card" style="padding:0 18px;">
        <div class="fault-info-row" style="align-items:center;">
          <span>Signal strength</span>
          <span style="display:flex;align-items:center;gap:8px;font-weight:700;color:${sig.color};">${sig.label} ${signalBars(sig.bars, sig.color)}</span>
        </div>
        <div class="fault-info-row"><span>Last sync</span><span style="font-weight:700;" id="ds-last-sync">${v.last_sync}</span></div>
        <div class="fault-info-row"><span>Firmware version</span><span style="font-weight:700;">${v.firmware_version}</span></div>
        <div class="fault-info-row"><span>Hardware</span><span style="font-weight:700;">Teltonika FMB125</span></div>
      </div>

      <p style="font-size:12px;color:var(--color-text-secondary);margin:16px 4px 18px;line-height:1.5;">
        If your data looks delayed, make sure the device is plugged into the OBD port and the ignition is on. Re-pairing refreshes the connection without losing any history.
      </p>

      <button class="btn btn-outline" id="ds-repair-btn" style="border-radius:999px;">
        <span class="btn-spinner"></span>
        <span id="ds-repair-btn-text">RE-PAIR DEVICE</span>
      </button>
    `

    document.getElementById('ds-repair-btn').addEventListener('click', repairDevice)
  }

  function repairDevice() {
    const btn = document.getElementById('ds-repair-btn')
    const btnText = document.getElementById('ds-repair-btn-text')

    btn.classList.add('btn-loading')
    btn.disabled = true
    btnText.textContent = 'Re-pairing...'

    setTimeout(() => {
      btn.classList.remove('btn-loading')
      btn.disabled = false
      btnText.textContent = 'RE-PAIR DEVICE'

      v.last_sync = 'Just now'
      v.last_updated = 'Just now'
      v.signal_strength = 'strong'
      v.status = 'active'

      render()
      showToast('Device re-paired successfully', 'success')
    }, 1600)
  }

  render()
})()
</script>