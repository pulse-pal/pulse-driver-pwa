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

  /* Avatar with camera badge */
  #profile-page .pf-avatar-wrap {
    display: flex;
    justify-content: center;
    padding-top: 4px;
  }
  #profile-page .pf-avatar-btn {
    position: relative;
    width: 120px;
    height: 120px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  #profile-page .pf-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    font-weight: 800;
    color: var(--color-accent);
    background-color: var(--color-bg-card);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    border: 1px solid var(--color-border);
    box-shadow: 0 8px 24px rgba(var(--shadow-rgb), 0.08);
  }
  #profile-page .pf-avatar-badge {
    position: absolute;
    right: 2px;
    bottom: 2px;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--color-accent);
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid var(--color-card-solid);
    box-shadow: 0 4px 10px rgba(255, 122, 26, 0.35);
  }

  /* Name / phone rows: icon, small label, bold value */
  #profile-page .pf-info-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 16px;
    cursor: pointer;
  }
  #profile-page .pf-info-row + .pf-info-row {
    border-top: 1px solid rgba(var(--shadow-rgb), 0.05);
  }
  #profile-page .pf-info-icon,
  #profile-page .pf-info-end {
    display: flex;
    flex-shrink: 0;
    color: var(--color-text-secondary);
  }
  #profile-page .pf-info-text {
    flex: 1;
    min-width: 0;
  }
  #profile-page .pf-info-label {
    font-size: 12px;
    color: var(--color-text-secondary);
  }
  #profile-page .pf-info-value {
    font-size: 15px;
    font-weight: 600;
    color: var(--color-heading);
    margin-top: 2px;
    word-break: break-word;
  }
  #profile-page .pf-info-hint {
    font-size: 11.5px;
    line-height: 1.4;
    color: var(--color-text-secondary);
    margin-top: 4px;
  }

  /* Bottom sheet (appended to <body>, so these are not scoped) */
  .pf-sheet-overlay {
    position: fixed;
    inset: 0;
    z-index: 1300;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: pf-fade 0.18s ease-out;
  }
  .pf-sheet {
    width: 100%;
    max-width: 480px;
    background: var(--color-card-solid);
    border-radius: 22px 22px 0 0;
    padding: 10px 20px calc(20px + env(safe-area-inset-bottom, 0px));
    animation: pf-slide 0.22s ease-out;
  }
  .pf-sheet-grab {
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: rgba(var(--shadow-rgb), 0.18);
    margin: 0 auto 14px;
  }
  .pf-sheet-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--color-heading);
    margin-bottom: 14px;
  }
  .pf-sheet-option {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    padding: 14px 4px;
    background: none;
    border: none;
    text-align: left;
    font-size: 15px;
    font-weight: 600;
    color: var(--color-heading);
    cursor: pointer;
  }
  .pf-sheet-option + .pf-sheet-option {
    border-top: 1px solid rgba(var(--shadow-rgb), 0.06);
  }
  .pf-sheet-option.danger {
    color: var(--color-danger);
  }
  .pf-sheet-option svg {
    flex-shrink: 0;
  }
  .pf-sheet-field {
    position: relative;
    margin-bottom: 20px;
  }
  .pf-sheet-input {
    width: 100%;
    padding: 8px 44px 8px 0;
    border: none;
    border-bottom: 2px solid var(--color-accent);
    background: transparent;
    color: var(--color-heading);
    font-size: 16px;
    outline: none;
  }
  .pf-sheet-count {
    position: absolute;
    right: 0;
    bottom: 10px;
    font-size: 12px;
    color: var(--color-text-secondary);
  }
  .pf-sheet-actions {
    display: flex;
    gap: 10px;
  }
  @keyframes pf-slide {
    from { transform: translateY(100%); }
    to { transform: none; }
  }
  @keyframes pf-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>

<div id="profile-page">

  <button id="profile-back-btn" aria-label="Back" style="display:flex;align-items:center;gap:4px;margin:0 0 8px -6px;padding:8px 12px 8px 6px;border-radius:999px;font-size:13px;font-weight:600;color:var(--color-text-secondary);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Settings
  </button>

  <div class="pf-avatar-wrap">
    <button type="button" class="pf-avatar-btn" id="profile-avatar-btn" aria-label="Change profile photo">
      <span class="pf-avatar" id="profile-avatar"></span>
      <span class="pf-avatar-badge">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.4" stroke="currentColor" stroke-width="1.7"/></svg>
      </span>
    </button>
  </div>

  <input type="file" accept="image/*" id="profile-file-gallery" hidden>
  <input type="file" accept="image/*" capture="user" id="profile-file-camera" hidden>

  <div class="pf-group-card" style="margin-top:24px;">
    <div class="pf-info-row" id="profile-name-row">
      <span class="pf-info-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="3.4" stroke="currentColor" stroke-width="1.7"/><path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
      </span>
      <div class="pf-info-text">
        <p class="pf-info-label">Name</p>
        <p class="pf-info-value" id="profile-name-value"></p>
      </div>
      <span class="pf-info-end">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 20h4L19 9a2.1 2.1 0 00-3-3L5 17v3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14.5 7.5l2 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </span>
    </div>
    <div class="pf-info-row" id="profile-phone-row">
      <span class="pf-info-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
      <div class="pf-info-text">
        <p class="pf-info-label">Phone</p>
        <p class="pf-info-value" id="profile-phone-value"></p>
        <p class="pf-info-hint">Your number is your login. To change it, contact support.</p>
      </div>
      <span class="pf-info-end">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 10.5V8a4 4 0 018 0v2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </span>
    </div>
  </div>

  <div id="profile-fleet-section" class="hidden">
    <p class="settings-group-label" style="margin-top:20px;">My Fleet</p>
    <div class="pf-group-card">
      <div class="pf-row" style="cursor:default;">
        <div class="pf-row-icon" style="background:rgba(255,122,26,0.1);color:var(--color-accent);">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6H14V16H2V6Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 10H18L21 13V16H14V10Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="7" cy="17.5" r="1.8" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="17.5" r="1.8" stroke="currentColor" stroke-width="1.6"/></svg>
        </div>
        <span class="pf-row-label">Fleet</span>
        <span class="pf-row-value" id="profile-fleet-name"></span>
      </div>
      <div class="pf-row" style="cursor:default;">
        <div class="pf-row-icon" style="background:rgba(59,130,246,0.1);color:#3B82F6;">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="3.2" stroke="currentColor" stroke-width="1.6"/><path d="M5 19c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </div>
        <span class="pf-row-label">Fleet manager</span>
        <span class="pf-row-value" id="profile-fleet-manager"></span>
      </div>
      <div class="pf-row" id="profile-fleet-call-row">
        <div class="pf-row-icon" style="background:rgba(34,165,89,0.1);color:var(--color-success);">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <span class="pf-row-label">Call fleet manager</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
    </div>
  </div>

  <div class="pf-group-card" style="margin-top:20px;">
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

  const NAME_MAX = 40
  const AVATAR_SIZE = 256
  // The photo is kept in this browser only for the prototype; the
  // backend stores the real upload later. One photo per phone number,
  // so each demo account keeps its own.
  const AVATAR_KEY = 'pulsepal_avatar_' + DRIVER.phone

  const avatarEl = document.getElementById('profile-avatar')
  const galleryInput = document.getElementById('profile-file-gallery')
  const cameraInput = document.getElementById('profile-file-camera')

  function initials(name) {
    return name.split(' ').filter(Boolean).map(p => p[0]).join('').slice(0, 2).toUpperCase()
  }

  // 0712345678 -> +254 712 345678
  function formatPhone(phone) {
    const d = String(phone || '').replace(/\D/g, '')
    if (d.length === 10 && d.startsWith('0')) return `+254 ${d.slice(1, 4)} ${d.slice(4)}`
    return phone || ''
  }

  function getSavedPhoto() {
    try { return localStorage.getItem(AVATAR_KEY) } catch (e) { return null }
  }

  function renderAvatar() {
    const photo = getSavedPhoto()
    if (photo) {
      avatarEl.style.backgroundImage = `url("${photo}")`
      avatarEl.textContent = ''
    } else {
      avatarEl.style.backgroundImage = ''
      avatarEl.textContent = initials(DRIVER.name)
    }
  }

  function render() {
    renderAvatar()
    document.getElementById('profile-name-value').textContent = DRIVER.name
    document.getElementById('profile-phone-value').textContent = formatPhone(DRIVER.phone)
  }

  // Fleet drivers only: who their fleet and manager are, with a one-tap call.
  function renderFleetSection() {
    if (!canUse('fleet_contact')) return

    document.getElementById('profile-fleet-name').textContent = DRIVER.fleet_name || ''
    document.getElementById('profile-fleet-manager').textContent = DRIVER.manager_name || ''
    document.getElementById('profile-fleet-call-row').addEventListener('click', callFleetManager)
    document.getElementById('profile-fleet-section').classList.remove('hidden')
  }

  /* ---------- bottom sheet ---------- */

  function openSheet(innerHtml) {
    const overlay = document.createElement('div')
    overlay.className = 'pf-sheet-overlay'
    overlay.innerHTML = `<div class="pf-sheet" role="dialog" aria-modal="true"><div class="pf-sheet-grab"></div>${innerHtml}</div>`
    document.body.appendChild(overlay)
    const close = () => overlay.remove()
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close() })
    return { overlay, close }
  }

  /* ---------- profile photo ---------- */

  function processPhoto(file) {
    if (!file) return
    if (!file.type || !file.type.startsWith('image/')) {
      showToast('Please choose an image', 'warning')
      return
    }

    const reader = new FileReader()
    reader.onerror = () => showToast('Could not read that photo', 'warning')
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => showToast('Could not open that photo', 'warning')
      img.onload = () => {
        // Square crop from the centre, resized so it stays small.
        const side = Math.min(img.width, img.height)
        const sx = (img.width - side) / 2
        const sy = (img.height - side) / 2
        const canvas = document.createElement('canvas')
        canvas.width = AVATAR_SIZE
        canvas.height = AVATAR_SIZE
        canvas.getContext('2d').drawImage(img, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85)

        try {
          localStorage.setItem(AVATAR_KEY, dataUrl)
        } catch (e) {
          showToast('Could not save the photo', 'warning')
          return
        }
        renderAvatar()
        showToast('Profile photo updated', 'success')
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }

  function onFilePicked(input) {
    const file = input.files && input.files[0]
    input.value = ''   // lets the same photo be picked again
    processPhoto(file)
  }
  galleryInput.addEventListener('change', () => onFilePicked(galleryInput))
  cameraInput.addEventListener('change', () => onFilePicked(cameraInput))

  function openPhotoSheet() {
    const hasPhoto = !!getSavedPhoto()
    const { overlay, close } = openSheet(`
      <h3 class="pf-sheet-title">Profile photo</h3>
      <button class="pf-sheet-option" id="pf-opt-camera">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.4" stroke="currentColor" stroke-width="1.7"/></svg>
        Take photo
      </button>
      <button class="pf-sheet-option" id="pf-opt-gallery">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" stroke-width="1.7"/><circle cx="9" cy="10" r="1.8" stroke="currentColor" stroke-width="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Choose from gallery
      </button>
      ${hasPhoto ? `
      <button class="pf-sheet-option danger" id="pf-opt-remove">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Remove photo
      </button>` : ''}
    `)

    overlay.querySelector('#pf-opt-camera').addEventListener('click', () => {
      close()
      cameraInput.click()
    })
    overlay.querySelector('#pf-opt-gallery').addEventListener('click', () => {
      close()
      galleryInput.click()
    })
    const removeBtn = overlay.querySelector('#pf-opt-remove')
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        close()
        try { localStorage.removeItem(AVATAR_KEY) } catch (e) {}
        renderAvatar()
        showToast('Profile photo removed', 'success')
      })
    }
  }

  document.getElementById('profile-avatar-btn').addEventListener('click', openPhotoSheet)

  /* ---------- name ---------- */

  function openNameSheet() {
    const { overlay, close } = openSheet(`
      <h3 class="pf-sheet-title">Enter your name</h3>
      <div class="pf-sheet-field">
        <input type="text" class="pf-sheet-input" id="pf-name-input" maxlength="${NAME_MAX}" autocomplete="name">
        <span class="pf-sheet-count" id="pf-name-count"></span>
      </div>
      <div class="pf-sheet-actions">
        <button class="btn btn-ghost" id="pf-name-cancel" style="flex:1;margin:0;">CANCEL</button>
        <button class="btn btn-primary" id="pf-name-save" style="flex:1;margin:0;">SAVE</button>
      </div>
    `)

    const input = overlay.querySelector('#pf-name-input')
    const count = overlay.querySelector('#pf-name-count')
    const saveBtn = overlay.querySelector('#pf-name-save')

    input.value = DRIVER.name

    function refresh() {
      count.textContent = `${input.value.length}/${NAME_MAX}`
      const value = input.value.trim()
      const canSave = value.length > 0 && value !== DRIVER.name
      saveBtn.disabled = !canSave
      saveBtn.style.opacity = canSave ? '' : '0.5'
    }

    function save() {
      const value = input.value.trim()
      if (!value || value === DRIVER.name) return
      DRIVER.name = value
      close()
      render()
      showToast('Name updated', 'success')
    }

    input.addEventListener('input', refresh)
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') save() })
    overlay.querySelector('#pf-name-cancel').addEventListener('click', close)
    saveBtn.addEventListener('click', save)

    refresh()
    input.focus()
    input.select()
  }

  document.getElementById('profile-name-row').addEventListener('click', openNameSheet)

  // The number is the login, so it can't be edited here. A real
  // change goes through a verification code (built later).
  document.getElementById('profile-phone-row').addEventListener('click', () => {
    showToast('To change your number, contact support', 'success')
  })

  /* ---------- logout ---------- */

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
      // The dialog lives on <body>, outside the page, so it has to be
      // removed here or it stays on top of the Login screen.
      overlay.remove()
      localStorage.removeItem('pulsepal_logged_in')
      navigateTo('login')
    })
  })

  render()
  renderFleetSection()
})()
</script>