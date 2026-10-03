<style>
  #settings-page .st-group-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    margin: 22px 2px 8px;
  }
  #settings-page .st-group-card {
    border-radius: 18px;
    overflow: hidden;
    background: linear-gradient(160deg, var(--color-card-solid) 0%, var(--color-bg-card) 100%);
    border: 1px solid rgba(var(--shadow-rgb), 0.06);
    box-shadow: 0 2px 4px rgba(var(--shadow-rgb), 0.03), 0 10px 24px rgba(var(--shadow-rgb), 0.05);
  }
  #settings-page .st-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    cursor: pointer;
  }
  #settings-page .st-row + .st-row {
    border-top: 1px solid rgba(var(--shadow-rgb), 0.05);
  }
  #settings-page .st-row-icon {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  #settings-page .st-row-label {
    flex: 1;
    min-width: 0;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--color-text-primary);
  }
  #settings-page .st-row-value {
    font-size: 12px;
    color: var(--color-text-secondary);
    flex-shrink: 0;
  }
  #settings-page .st-row-danger .st-row-label {
    color: var(--color-danger);
  }
  #settings-page .st-theme-option {
    flex: 1;
    padding: 14px 4px;
    border-radius: 14px;
    border: 1.5px solid var(--color-border);
    background: var(--color-card-solid);
    text-align: center;
  }
  #settings-page .st-theme-option.selected {
    border-color: var(--color-accent);
    background: rgba(255, 122, 26, 0.08);
  }
</style>

<div id="settings-page">

  <p style="font-size:19px;font-weight:800;color:var(--color-heading);margin-bottom:16px;">Settings</p>

  <div class="st-group-card" id="settings-profile-row" style="padding:14px 16px;display:flex;align-items:center;gap:14px;cursor:pointer;">
    <div class="avatar-circle" id="settings-avatar" style="width:52px;height:52px;font-size:18px;"></div>
    <div style="flex:1;min-width:0;">
      <p style="font-size:15px;font-weight:700;color:var(--color-heading);" id="settings-name"></p>
      <p style="font-size:12px;color:var(--color-text-secondary);margin-top:2px;" id="settings-phone"></p>
    </div>
    <span class="badge badge-premium" id="settings-plan-badge"></span>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);flex-shrink:0;"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </div>

  <p class="st-group-label">Vehicles &amp; Hardware</p>
  <div class="st-group-card">
    <div class="st-row" id="settings-my-vehicles-row">
      <div class="st-row-icon" style="background:rgba(255,122,26,0.1);color:var(--color-accent);">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13l1.5-5A2 2 0 016.4 6.5h11.2a2 2 0 011.9 1.5L21 13M5 13h14v5a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H8v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-5z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <span class="st-row-label">My Vehicles</span>
      <span class="st-row-value" id="settings-vehicle-count"></span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="st-row" id="settings-device-status-row">
      <div class="st-row-icon" style="background:rgba(34,165,89,0.1);color:var(--color-success);">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20v-4M6 20v-8M18 20v-12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </div>
      <span class="st-row-label">Device Status</span>
      <span class="st-row-value" id="settings-device-code"></span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
  </div>

  <p class="st-group-label">Account &amp; Security</p>
  <div class="st-group-card">
    <div class="st-row" id="settings-profile-details-row">
      <div class="st-row-icon" style="background:rgba(59,130,246,0.1);color:#3B82F6;">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="3.2" stroke="currentColor" stroke-width="1.6"/><path d="M5 19c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </div>
      <span class="st-row-label">Profile Details</span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="st-row" id="settings-vehicle-sharing-row">
      <div class="st-row-icon" style="background:rgba(184,134,11,0.1);color:var(--color-premium);">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="8" r="3" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="17" cy="8.5" r="2.3" stroke="currentColor" stroke-width="1.6"/><path d="M15.5 13.2c2.3.3 4 2 4 4.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </div>
      <span class="st-row-label">Vehicle Sharing</span>
      <span class="st-row-value" id="settings-shared-count"></span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="st-row" id="settings-security-row">
      <div class="st-row-icon" style="background:rgba(229,57,53,0.1);color:var(--color-danger);">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </div>
      <span class="st-row-label">App Lock</span>
      <span class="st-row-value" id="settings-lock-status"></span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
  </div>

  <p class="st-group-label">Billing &amp; Subscriptions</p>
  <div class="st-group-card">
    <div class="st-row" id="settings-subscription-row">
      <div class="st-row-icon" style="background:rgba(255,122,26,0.1);color:var(--color-accent);">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M3 10h18" stroke="currentColor" stroke-width="1.6"/></svg>
      </div>
      <span class="st-row-label">My Subscription</span>
      <span class="st-row-value" id="settings-plan-value"></span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
  </div>

  <p class="st-group-label">Preferences</p>
  <div class="st-group-card">
    <div class="st-row" id="settings-notif-prefs-row">
      <div class="st-row-icon" style="background:rgba(107,114,128,0.1);color:var(--color-text-secondary);">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.7 21a2 2 0 01-3.4 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </div>
      <span class="st-row-label">Notifications</span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="st-row" id="settings-theme-row">
      <div class="st-row-icon" style="background:rgba(59,130,246,0.1);color:#3B82F6;">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.4 5.4 0 01-7.54-7.54A9 9 0 0012 3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
      </div>
      <span class="st-row-label">Theme</span>
      <span class="st-row-value" id="settings-theme-value"></span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
  </div>

  <p class="st-group-label">Support, Trust &amp; Legal</p>
  <div class="st-group-card">
    <div class="st-row" id="settings-about-row">
      <div class="st-row-icon" style="background:rgba(107,114,128,0.1);color:var(--color-text-secondary);">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 11v5M12 8v.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </div>
      <span class="st-row-label">About Application</span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="st-row" id="settings-help-row">
      <div class="st-row-icon" style="background:rgba(34,165,89,0.1);color:var(--color-success);">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
      </div>
      <span class="st-row-label">Help / FAQ</span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="st-row st-row-danger" id="settings-deactivate-row">
      <div class="st-row-icon" style="background:rgba(229,57,53,0.1);color:var(--color-danger);">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v13a1 1 0 01-1 1H7a1 1 0 01-1-1V7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <span class="st-row-label">Deactivate My Account</span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-danger);"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
  </div>

</div>

<script>
(function () {
  function initials(name) {
    return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
  }

  function renderThemeValue() {
    document.getElementById('settings-theme-value').textContent = APP_THEME === 'dark' ? 'Dark' : 'Light'
  }

  document.getElementById('settings-avatar').textContent = initials(DRIVER.name)
  document.getElementById('settings-name').textContent = DRIVER.name
  document.getElementById('settings-phone').textContent = DRIVER.phone
  document.getElementById('settings-plan-badge').textContent = DRIVER.plan === 'premium' ? 'PREMIUM' : 'STARTER'

  document.getElementById('settings-vehicle-count').textContent = `${VEHICLES.length} vehicle${VEHICLES.length === 1 ? '' : 's'}`
  document.getElementById('settings-device-code').textContent = ACTIVE_VEHICLE.device_code
  document.getElementById('settings-shared-count').textContent = `${SHARED_USERS.length} ${SHARED_USERS.length === 1 ? 'person' : 'people'}`
  document.getElementById('settings-lock-status').textContent = SECURITY_SETTINGS.app_lock_enabled ? 'On' : 'Off'
  document.getElementById('settings-plan-value').textContent = DRIVER.plan === 'premium' ? 'Premium' : 'Starter'
  renderThemeValue()

  document.getElementById('settings-profile-row').addEventListener('click', () => navigateTo('profile'))
  document.getElementById('settings-my-vehicles-row').addEventListener('click', () => navigateTo('my-vehicles'))
  document.getElementById('settings-device-status-row').addEventListener('click', () => navigateTo('device-status'))
  document.getElementById('settings-profile-details-row').addEventListener('click', () => navigateTo('profile'))
  document.getElementById('settings-vehicle-sharing-row').addEventListener('click', () => navigateTo('vehicle-sharing'))
  document.getElementById('settings-security-row').addEventListener('click', () => navigateTo('security'))
  document.getElementById('settings-subscription-row').addEventListener('click', () => navigateTo('subscription'))
  document.getElementById('settings-notif-prefs-row').addEventListener('click', () => navigateTo('notification-preferences'))
  document.getElementById('settings-about-row').addEventListener('click', () => navigateTo('about'))
  document.getElementById('settings-help-row').addEventListener('click', () => navigateTo('help-faq'))
  document.getElementById('settings-deactivate-row').addEventListener('click', () => navigateTo('deactivate-account'))

  document.getElementById('settings-theme-row').addEventListener('click', () => {
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    overlay.innerHTML = `
      <div class="modal-card" style="text-align:left;">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:14px;text-align:center;">Choose Theme</h3>
        <div style="display:flex;gap:10px;">
          <button class="st-theme-option ${APP_THEME === 'light' ? 'selected' : ''}" data-theme="light">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin:0 auto 6px;color:#FF7A1A;"><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            <p style="font-size:12.5px;font-weight:600;">Light</p>
          </button>
          <button class="st-theme-option ${APP_THEME === 'dark' ? 'selected' : ''}" data-theme="dark">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin:0 auto 6px;color:#3B82F6;"><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
            <p style="font-size:12.5px;font-weight:600;">Dark</p>
          </button>
        </div>
        <button class="btn btn-ghost" id="st-theme-close" style="margin-top:16px;">CLOSE</button>
      </div>
    `
    document.body.appendChild(overlay)
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove() })
    document.getElementById('st-theme-close').addEventListener('click', () => overlay.remove())

    overlay.querySelectorAll('.st-theme-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.dataset.theme
        if (typeof window.setAppTheme === 'function') {
          window.setAppTheme(choice)
        } else {
          APP_THEME = choice
        }
        renderThemeValue()
        overlay.remove()
        showToast(`Theme set to ${choice === 'dark' ? 'Dark' : 'Light'}`, 'success')
      })
    })
  })
})()
</script>