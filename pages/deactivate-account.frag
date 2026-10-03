<div id="deactivate-page">

  <button id="da-back-btn" aria-label="Back" style="display:flex;align-items:center;gap:4px;margin:0 0 14px -6px;padding:8px 12px 8px 6px;border-radius:999px;font-size:13px;font-weight:600;color:var(--color-text-secondary);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Settings
  </button>

  <div style="text-align:center;padding:16px 0 8px;">
    <div style="width:56px;height:56px;border-radius:50%;background:rgba(229,57,53,0.1);color:var(--color-danger);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v13a1 1 0 01-1 1H7a1 1 0 01-1-1V7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <p style="font-size:18px;font-weight:800;color:var(--color-heading);">Deactivate My Account</p>
  </div>

  <div class="card" style="margin-top:18px;">
    <p style="font-size:13px;font-weight:700;color:var(--color-heading);margin-bottom:10px;">Before you go, this will:</p>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div style="display:flex;gap:10px;align-items:flex-start;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-danger);flex-shrink:0;margin-top:2px;"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <p style="font-size:12.5px;color:var(--color-text-secondary);line-height:1.5;">Stop all monitoring on <b id="da-vehicle-list" style="color:var(--color-heading);"></b></p>
      </div>
      <div style="display:flex;gap:10px;align-items:flex-start;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-danger);flex-shrink:0;margin-top:2px;"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <p style="font-size:12.5px;color:var(--color-text-secondary);line-height:1.5;">Remove access for anyone you've shared a vehicle with</p>
      </div>
      <div style="display:flex;gap:10px;align-items:flex-start;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-danger);flex-shrink:0;margin-top:2px;"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <p style="font-size:12.5px;color:var(--color-text-secondary);line-height:1.5;">Cancel your subscription — no further M-Pesa charges</p>
      </div>
      <div style="display:flex;gap:10px;align-items:flex-start;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-danger);flex-shrink:0;margin-top:2px;"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <p style="font-size:12.5px;color:var(--color-text-secondary);line-height:1.5;">Permanently delete your trip history, faults and profile data</p>
      </div>
    </div>
  </div>

  <p style="font-size:12px;color:var(--color-text-secondary);margin:16px 4px 6px;">
    If you've sold this vehicle, consider <a id="da-remove-vehicle-link" style="color:var(--color-accent);font-weight:600;">removing just that vehicle</a> instead of deactivating your whole account.
  </p>

  <div class="field" style="margin-top:22px;">
    <label class="field-label">Type <b>DEACTIVATE</b> to confirm</label>
    <input type="text" class="input" id="da-confirm-input" placeholder="DEACTIVATE" autocomplete="off">
  </div>

  <button class="btn btn-danger" id="da-confirm-btn" style="margin-top:8px;" disabled>DEACTIVATE MY ACCOUNT</button>

</div>

<script>
(function () {
  document.getElementById('da-back-btn').addEventListener('click', () => navigateTo('settings'))

  document.getElementById('da-vehicle-list').textContent = VEHICLES.map(v => v.plate).join(', ')

  document.getElementById('da-remove-vehicle-link').addEventListener('click', () => navigateTo('my-vehicles'))

  const input = document.getElementById('da-confirm-input')
  const confirmBtn = document.getElementById('da-confirm-btn')

  input.addEventListener('input', () => {
    confirmBtn.disabled = input.value.trim().toUpperCase() !== 'DEACTIVATE'
  })

  confirmBtn.addEventListener('click', () => {
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    overlay.innerHTML = `
      <div class="modal-card">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:6px;">Are you absolutely sure?</h3>
        <p style="font-size:13px;color:var(--color-text-secondary);">This cannot be undone. Your account and all vehicle data will be permanently deleted.</p>
        <button class="btn btn-danger" id="da-final-confirm" style="margin:18px 0 10px;">YES, DEACTIVATE</button>
        <button class="btn btn-ghost" id="da-final-cancel">GO BACK</button>
      </div>
    `
    document.body.appendChild(overlay)
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove() })
    document.getElementById('da-final-cancel').addEventListener('click', () => overlay.remove())
    document.getElementById('da-final-confirm').addEventListener('click', () => {
      localStorage.removeItem('pulsepal_logged_in')
      navigateTo('login')
      showToast('Your account has been deactivated', 'success')
    })
  })
})()
</script>