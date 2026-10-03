<style>
  #vs-page .vs-user-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid var(--color-border);
  }
  #vs-page .vs-user-row:last-child {
    border-bottom: none;
  }
  #vs-page .vs-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--color-bg-card);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 13px;
    color: var(--color-accent);
    flex-shrink: 0;
  }
  #vs-page .vs-remove-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
    flex-shrink: 0;
  }
</style>

<div id="vs-page">

  <button id="vs-back-btn" aria-label="Back" style="display:flex;align-items:center;gap:4px;margin:0 0 14px -6px;padding:8px 12px 8px 6px;border-radius:999px;font-size:13px;font-weight:600;color:var(--color-text-secondary);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Settings
  </button>

  <p style="font-size:19px;font-weight:800;color:var(--color-heading);margin-bottom:4px;">Vehicle Sharing</p>
  <p id="vs-subtitle" style="font-size:12.5px;color:var(--color-text-secondary);margin-bottom:20px;"></p>

  <div id="vs-list" class="card" style="padding:0 18px;margin-bottom:18px;"></div>

  <button class="btn btn-primary" id="vs-add-btn" style="border-radius:999px;">+ ADD PERSON</button>

</div>

<script>
(function () {
  document.getElementById('vs-back-btn').addEventListener('click', () => navigateTo('settings'))
  document.getElementById('vs-subtitle').textContent = `People with access to ${ACTIVE_VEHICLE.plate}`

  const isPremium = DRIVER.plan === 'premium'

  function initials(name) {
    return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
  }

  function scoreColor(score) {
    if (score >= 80) return 'var(--color-success)'
    if (score >= 65) return 'var(--color-warning)'
    return 'var(--color-danger)'
  }

  function userRow(u) {
    const accessLabel = u.access_type === 'timed'
      ? `Until ${u.expires_at}`
      : 'Full access'

    return `
      <div class="vs-user-row">
        <div class="vs-avatar">${initials(u.name)}</div>
        <div style="flex:1;min-width:0;">
          <p style="font-size:13.5px;font-weight:700;color:var(--color-heading);">${u.name}</p>
          <p style="font-size:11.5px;color:var(--color-text-secondary);margin-top:1px;">${u.role} · ${u.phone}</p>
          <div style="display:flex;align-items:center;gap:8px;margin-top:5px;flex-wrap:wrap;">
            <span class="badge ${u.access_type === 'timed' ? 'badge-warning' : 'badge-accent'}" style="font-size:10.5px;">${accessLabel}</span>
            ${isPremium ? `<span style="font-size:11px;font-weight:700;color:${scoreColor(u.driving_score)};">Score: ${u.driving_score}/100</span>` : ''}
          </div>
        </div>
        <button class="vs-remove-btn" data-id="${u.id}" aria-label="Remove ${u.name}">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
      </div>
    `
  }

  function renderList() {
    const list = document.getElementById('vs-list')

    if (SHARED_USERS.length === 0) {
      list.innerHTML = `
        <div style="text-align:center;padding:28px 12px;">
          <p style="font-size:13px;color:var(--color-text-secondary);">Not shared with anyone yet</p>
        </div>
      `
      return
    }

    list.innerHTML = SHARED_USERS.map(userRow).join('')

    list.querySelectorAll('.vs-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const user = SHARED_USERS.find(u => u.id === Number(btn.dataset.id))
        removePerson(user)
      })
    })
  }

  function removePerson(user) {
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    overlay.innerHTML = `
      <div class="modal-card">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:6px;">Remove ${user.name}?</h3>
        <p style="font-size:13px;color:var(--color-text-secondary);">They will lose access to ${ACTIVE_VEHICLE.plate} immediately.</p>
        <button class="btn btn-danger" id="vs-confirm-remove" style="margin:18px 0 10px;">REMOVE</button>
        <button class="btn btn-ghost" id="vs-cancel-remove">CANCEL</button>
      </div>
    `
    document.body.appendChild(overlay)
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove() })
    document.getElementById('vs-cancel-remove').addEventListener('click', () => overlay.remove())
    document.getElementById('vs-confirm-remove').addEventListener('click', () => {
      const idx = SHARED_USERS.findIndex(u => u.id === user.id)
      if (idx > -1) SHARED_USERS.splice(idx, 1)
      overlay.remove()
      renderList()
      showToast(`${user.name} removed`, 'success')
    })
  }

  function openAddModal() {
    let accessType = 'full'

    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    overlay.innerHTML = `
      <div class="modal-card" style="text-align:left;">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:14px;text-align:center;">Add Person</h3>

        <div class="field">
          <label class="field-label">Full name</label>
          <input type="text" class="input" id="vs-new-name" placeholder="e.g. Mary Wanjiku">
        </div>
        <div class="field">
          <label class="field-label">Phone number</label>
          <input type="text" class="input" id="vs-new-phone" placeholder="07XX XXX XXX">
        </div>
        <div class="field">
          <label class="field-label">Relationship</label>
          <input type="text" class="input" id="vs-new-role" placeholder="e.g. Spouse, Employee, Friend">
        </div>

        <div class="field">
          <label class="field-label">Access</label>
          <div style="display:flex;gap:8px;">
            <button class="vs-access-option selected" data-value="full" style="flex:1;padding:10px 4px;border-radius:12px;border:1.5px solid var(--color-accent);background:rgba(255,122,26,0.08);color:var(--color-accent);font-size:12.5px;font-weight:600;">Full access</button>
            <button class="vs-access-option" data-value="timed" style="flex:1;padding:10px 4px;border-radius:12px;border:1.5px solid var(--color-border);background:var(--color-card-solid);color:var(--color-text-secondary);font-size:12.5px;font-weight:600;">Timed ${isPremium ? '' : '🔒'}</button>
          </div>
        </div>

        <button class="btn btn-primary" id="vs-save-btn" style="margin-top:8px;margin-bottom:10px;">ADD PERSON</button>
        <button class="btn btn-ghost" id="vs-cancel-add">CANCEL</button>
      </div>
    `
    document.body.appendChild(overlay)
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove() })
    document.getElementById('vs-cancel-add').addEventListener('click', () => overlay.remove())

    overlay.querySelectorAll('.vs-access-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.value === 'timed' && !isPremium) {
          overlay.remove()
          checkPremium('vehicle_sharing_advanced')
          return
        }
        accessType = btn.dataset.value
        overlay.querySelectorAll('.vs-access-option').forEach(b => {
          const sel = b === btn
          b.style.borderColor = sel ? 'var(--color-accent)' : 'var(--color-border)'
          b.style.background = sel ? 'rgba(255,122,26,0.08)' : 'var(--color-card-solid)'
          b.style.color = sel ? 'var(--color-accent)' : 'var(--color-text-secondary)'
        })
      })
    })

    document.getElementById('vs-save-btn').addEventListener('click', () => {
      const name = document.getElementById('vs-new-name').value.trim()
      const phone = document.getElementById('vs-new-phone').value.trim()
      const role = document.getElementById('vs-new-role').value.trim()

      if (!name || !phone) {
        showToast('Name and phone are required', 'warning')
        return
      }

      SHARED_USERS.push({
        id: Date.now(),
        name: name,
        phone: phone,
        role: role || 'Shared user',
        access_type: accessType,
        expires_at: accessType === 'timed' ? 'Today, 11:59 PM' : null,
        driving_score: 0,
        added_at: 'Just now'
      })

      overlay.remove()
      renderList()
      showToast(`${name} added`, 'success')
    })
  }

  document.getElementById('vs-add-btn').addEventListener('click', openAddModal)

  renderList()
})()
</script>