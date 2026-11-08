<div class="auth-page">

  <div class="auth-header">
    <div class="auth-topbar"></div>
    <h1 class="auth-title" id="fw-heading"></h1>
    <p class="auth-subtitle">You're all set. Here's what has been assigned to you.</p>
  </div>

  <div class="auth-card">

    <p style="font-size:12px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:var(--color-text-secondary);">Your vehicle</p>
    <div style="display:flex;align-items:center;gap:14px;margin-top:8px;padding:14px;border-radius:14px;background:var(--color-bg-card);">
      <div style="width:44px;height:44px;border-radius:50%;background:rgba(255,122,26,0.12);color:var(--color-accent);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 6H14V16H2V6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M14 10H18L21 13V16H14V10Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <circle cx="7" cy="17.5" r="1.8" fill="var(--color-bg-card)" stroke="currentColor" stroke-width="1.8"/>
          <circle cx="17" cy="17.5" r="1.8" fill="var(--color-bg-card)" stroke="currentColor" stroke-width="1.8"/>
        </svg>
      </div>
      <div style="min-width:0;">
        <p id="fw-vehicle-name" style="font-weight:700;font-size:15px;color:var(--color-heading);"></p>
        <p id="fw-vehicle-plate" style="font-size:13px;color:var(--color-text-secondary);margin-top:2px;"></p>
      </div>
    </div>

    <p style="font-size:12px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:var(--color-text-secondary);margin-top:20px;">Your fleet manager</p>
    <div style="margin-top:8px;padding:14px;border-radius:14px;background:var(--color-bg-card);">
      <p id="fw-manager-name" style="font-weight:700;font-size:15px;color:var(--color-heading);"></p>
      <p id="fw-manager-phone" style="font-size:13px;color:var(--color-text-secondary);margin-top:2px;"></p>
      <button class="btn btn-outline btn-sm" id="fw-call-btn" style="margin-top:12px;width:auto;border-radius:999px;">CALL FLEET MANAGER</button>
    </div>

    <button class="auth-btn" id="fw-start-btn" style="margin-top:24px;">
      <span id="fw-start-btn-text">Get Started</span>
    </button>

  </div>

</div>

<script>
(function () {
  // This screen is only part of the fleet driver onboarding path.
  if (!isFleetDriver()) {
    navigateTo('home')
    return
  }

  const v = ACTIVE_VEHICLE

  document.getElementById('fw-heading').textContent = `Welcome to ${DRIVER.fleet_name}`
  document.getElementById('fw-vehicle-name').textContent = `${v.make} ${v.model} ${v.year}`
  document.getElementById('fw-vehicle-plate').textContent = `Plate: ${v.plate}`
  document.getElementById('fw-manager-name').textContent = DRIVER.manager_name || 'Fleet manager'
  document.getElementById('fw-manager-phone').textContent = DRIVER.manager_phone
    ? `+254${DRIVER.manager_phone.replace(/^0/, '')}`
    : ''

  document.getElementById('fw-call-btn').addEventListener('click', callFleetManager)

  document.getElementById('fw-start-btn').addEventListener('click', () => {
    localStorage.setItem('pulsepal_logged_in', 'true')
    navigateTo('home')
  })
})()
</script>