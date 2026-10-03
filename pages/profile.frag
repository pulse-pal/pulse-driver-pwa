<style>
  #profile-page .pf-group-card {
    border-radius: 18px;
    overflow: hidden;
    background: linear-gradient(160deg, var(--color-card-solid) 0%, var(--color-bg-card) 100%);
    border: 1px solid rgba(var(--shadow-rgb), 0.06);
    box-shadow: 0 2px 4px rgba(var(--shadow-rgb), 0.03), 0 10px 24px rgba(var(--shadow-rgb), 0.05);
  }
  #profile-page .pf-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    cursor: pointer;
  }
  #profile-page .pf-row + .pf-row {
    border-top: 1px solid rgba(var(--shadow-rgb), 0.05);
  }
  #profile-page .pf-row-icon {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  #profile-page .pf-row-label {
    flex: 1;
    min-width: 0;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--color-text-primary);
  }
  #profile-page .pf-row-value {
    font-size: 12px;
    color: var(--color-text-secondary);
    flex-shrink: 0;
  }
  #profile-page .pf-row-danger .pf-row-label {
    color: var(--color-danger);
  }
</style>

<div id="profile-page">

  <button id="profile-back-btn" aria-label="Back" style="display:flex;align-items:center;gap:4px;margin:0 0 8px -6px;padding:8px 12px 8px 6px;border-radius:999px;font-size:13px;font-weight:600;color:var(--color-text-secondary);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Settings
  </button>

  <div class="profile-header" style="padding-bottom:14px;">
    <div class="avatar-circle" id="profile-avatar"></div>
    <p class="profile-name" id="profile-name-display"></p>
    <p class="profile-phone" id="profile-phone-display"></p>
    <button class="btn btn-primary btn-sm" id="profile-edit-btn" style="width:auto;border-radius:999px;padding:0 20px;margin-top:12px;">EDIT PROFILE</button>
  </div>

  <p class="settings-group-label" style="margin-top:8px;">Account</p>
  <div class="pf-group-card">
    <div class="pf-row" id="profile-edit-name-row">
      <div class="pf-row-icon" style="background:rgba(59,130,246,0.1);color:#3B82F6;">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="3.2" stroke="currentColor" stroke-width="1.6"/><path d="M5 19c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </div>
      <span class="pf-row-label">Full name</span>
      <span class="pf-row-value" id="profile-name-value"></span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="pf-row" id="profile-edit-phone-row">
      <div class="pf-row-icon" style="background:rgba(34,165,89,0.1);color:var(--color-success);">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <span class="pf-row-label">Phone number</span>
      <span class="pf-row-value" id="profile-phone-value"></span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="pf-row pf-row-danger" id="profile-logout-row">
      <div class="pf-row-icon" style="background:rgba(229,57,53,0.1);color:var(--color-danger);">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <span class="pf-row-label">Logout</span>
    </div>
  </div>

</div>

<script>
(function () {
  document.getElementById('profile-back-btn').addEventListener('click', () => navigateTo('settings'))

  function initials(name) {
    return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
  }

  function render() {
    document.getElementById('profile-avatar').textContent = initials(DRIVER.name)
    document.getElementById('profile-name-display').textContent = DRIVER.name
    document.getElementById('profile-phone-display').textContent = DRIVER.phone

    document.getElementById('profile-name-value').textContent = DRIVER.name
    document.getElementById('profile-phone-value').textContent = DRIVER.phone
  }

  function openEditModal(field, label, currentValue) {
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    overlay.innerHTML = `
      <div class="modal-card" style="text-align:left;">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:14px;text-align:center;">Edit ${label}</h3>
        <div class="field">
          <input type="text" class="input" id="profile-edit-input" value="${currentValue}">
        </div>
        <button class="btn btn-primary" id="profile-edit-save" style="margin-bottom:10px;">SAVE</button>
        <button class="btn btn-ghost" id="profile-edit-cancel">CANCEL</button>
      </div>
    `
    document.body.appendChild(overlay)
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove() })
    document.getElementById('profile-edit-cancel').addEventListener('click', () => overlay.remove())
    document.getElementById('profile-edit-save').addEventListener('click', () => {
      const newValue = document.getElementById('profile-edit-input').value.trim()
      if (!newValue) {
        showToast(`${label} cannot be empty`, 'warning')
        return
      }
      DRIVER[field] = newValue
      overlay.remove()
      render()
      showToast(`${label} updated`, 'success')
    })
  }

  document.getElementById('profile-edit-name-row').addEventListener('click', () => {
    openEditModal('name', 'Full Name', DRIVER.name)
  })
  document.getElementById('profile-edit-phone-row').addEventListener('click', () => {
    openEditModal('phone', 'Phone Number', DRIVER.phone)
  })

  // "Edit Profile" button opens the name field first — the most
  // common thing someone wants to change — matching the reference's
  // single "Edit profile" entry point rather than a separate flow.
  document.getElementById('profile-edit-btn').addEventListener('click', () => {
    openEditModal('name', 'Full Name', DRIVER.name)
  })

  document.getElementById('profile-logout-row').addEventListener('click', () => {
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    overlay.innerHTML = `
      <div class="modal-card">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:6px;">Log out?</h3>
        <p style="font-size:13px;color:var(--color-text-secondary);">You'll need your phone number and password to log back in.</p>
        <button class="btn btn-danger" id="profile-confirm-logout" style="margin:18px 0 10px;">LOG OUT</button>
        <button class="btn btn-ghost" id="profile-cancel-logout">CANCEL</button>
      </div>
    `
    document.body.appendChild(overlay)
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove() })
    document.getElementById('profile-cancel-logout').addEventListener('click', () => overlay.remove())
    document.getElementById('profile-confirm-logout').addEventListener('click', () => {
      localStorage.removeItem('pulsepal_logged_in')
      navigateTo('login')
    })
  })

  render()
})()
</script>