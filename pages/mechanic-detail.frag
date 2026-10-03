<style>
  #mech-detail-page .md-date-chip {
    flex-shrink: 0;
    text-align: center;
    min-width: 58px;
    padding: 10px 6px;
    border-radius: 14px;
    border: 1.5px solid var(--color-border);
    background: var(--color-card-solid);
  }
  #mech-detail-page .md-date-chip.selected {
    border-color: var(--color-accent);
    background: rgba(255, 122, 26, 0.08);
  }
  #mech-detail-page .md-date-chip .dow {
    font-size: 10px;
    font-weight: 700;
    color: var(--color-text-secondary);
    text-transform: uppercase;
  }
  #mech-detail-page .md-date-chip.selected .dow {
    color: var(--color-accent);
  }
  #mech-detail-page .md-date-chip .num {
    font-size: 16px;
    font-weight: 800;
    color: var(--color-heading);
    margin-top: 2px;
  }
  #mech-detail-page .md-time-chip {
    padding: 10px 4px;
    border-radius: 12px;
    border: 1.5px solid var(--color-border);
    background: var(--color-card-solid);
    font-size: 12.5px;
    font-weight: 600;
    text-align: center;
    color: var(--color-text-primary);
  }
  #mech-detail-page .md-time-chip.selected {
    border-color: var(--color-accent);
    background: rgba(255, 122, 26, 0.08);
    color: var(--color-accent);
  }
</style>

<div id="mech-detail-page">

  <button id="md-back-btn" aria-label="Back to mechanics" style="display:flex;align-items:center;gap:4px;margin:0 0 14px -6px;padding:8px 12px 8px 6px;border-radius:999px;font-size:13px;font-weight:600;color:var(--color-text-secondary);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Mechanics
  </button>

  <div id="md-body"></div>

</div>

<script>
(function () {
  const body = document.getElementById('md-body')
  const mech = MECHANICS.find(m => m.id === ACTIVE_MECHANIC_ID)

  document.getElementById('md-back-btn').addEventListener('click', () => navigateTo('mechanics'))

  function initials(name) {
    return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
  }

  const AVATAR_COLORS = ['#FF7A1A', '#22A559', '#3B82F6', '#B8860B', '#E5533C']
  function avatarColor(id) {
    return AVATAR_COLORS[id % AVATAR_COLORS.length]
  }

  function renderEmpty() {
    body.innerHTML = `
      <div class="empty-state">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M21 21L16.5 16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <p style="font-weight:700;font-size:15px;color:var(--color-heading);">Mechanic not found</p>
        <p style="font-size:12.5px;margin-top:4px;">Pick a mechanic from the list.</p>
      </div>
    `
  }

  // Next 7 days as selectable chips
  function buildDateOptions() {
    const days = []
    const dow = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      days.push({
        key: d.toISOString().slice(0, 10),
        dow: i === 0 ? 'TODAY' : dow[d.getDay()],
        num: d.getDate(),
        display: i === 0
          ? `Today, ${d.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}`
          : d.toLocaleDateString('en-KE', { weekday: 'long', month: 'short', day: 'numeric' })
      })
    }
    return days
  }

  const TIME_SLOTS = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM']

  let selectedDate = null
  let selectedTime = null

  function renderProfile() {
    body.innerHTML = `
      <div style="display:flex;gap:14px;align-items:center;margin-bottom:20px;">
        <div style="width:64px;height:64px;border-radius:18px;background:linear-gradient(145deg, ${avatarColor(mech.id)}, ${avatarColor(mech.id)}CC);display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:800;color:#fff;box-shadow:0 4px 14px rgba(0,0,0,0.16);flex-shrink:0;">${initials(mech.name)}</div>
        <div style="min-width:0;">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <p style="font-size:17px;font-weight:800;color:var(--color-heading);">${mech.garage}</p>
            ${mech.priority ? '<span class="badge badge-premium">PRIORITY</span>' : ''}
          </div>
          <p style="font-size:12.5px;color:var(--color-text-secondary);margin-top:2px;">${mech.name} · ${mech.location}</p>
          <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
            ${renderStars(mech.rating)} <span style="font-size:12px;color:var(--color-text-secondary);">(${mech.reviews} reviews)</span>
          </div>
        </div>
      </div>

      <div class="card" style="padding:16px;margin-bottom:18px;">
        <div class="fault-info-row"><span>Status</span><span style="font-weight:700;color:${mech.open ? 'var(--color-success)' : 'var(--color-text-secondary)'};">${mech.open ? 'Open now' : 'Closed'}</span></div>
        <div class="fault-info-row"><span>Distance</span><span style="font-weight:700;">${mech.distance}</span></div>
        <div class="fault-info-row"><span>Verified</span><span style="font-weight:700;color:${mech.verified ? 'var(--color-success)' : 'var(--color-text-secondary)'};">${mech.verified ? 'Yes' : 'Not yet'}</span></div>
        <div class="mechanic-specialties" style="margin-top:12px;">
          ${mech.specializations.map(s => `<span class="spec-chip-v2" style="font-size:10.5px;font-weight:600;padding:4px 10px;border-radius:999px;background:rgba(255,122,26,0.07);border:1px solid rgba(255,122,26,0.18);color:var(--color-accent);">${s}</span>`).join('')}
        </div>
      </div>

      <a href="tel:${mech.phone}" class="btn btn-outline" style="border-radius:999px;margin-bottom:22px;display:flex;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        CALL ${mech.name.split(' ')[0].toUpperCase()}
      </a>

      <p style="font-size:13px;font-weight:700;color:var(--color-heading);margin-bottom:10px;">Book Appointment</p>

      <div id="md-date-row" style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;"></div>
      <p id="md-selected-date-label" style="font-size:12px;color:var(--color-text-secondary);margin-top:10px;"></p>

      <div id="md-time-grid" style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;margin-top:14px;"></div>

      <div class="field" style="margin-top:16px;">
        <label class="field-label">Notes for the mechanic (optional)</label>
        <textarea class="input" id="md-notes" rows="3" style="min-height:70px;padding-top:10px;resize:none;" placeholder="e.g. cylinder 1 misfire, rough idle"></textarea>
      </div>

      <button class="btn btn-primary" id="md-confirm-btn" style="border-radius:999px;margin-top:8px;" disabled>PICK A DATE AND TIME</button>
    `

    renderDateRow()
    renderTimeGrid()

    document.getElementById('md-confirm-btn').addEventListener('click', confirmBooking)
  }

  function renderDateRow() {
    const row = document.getElementById('md-date-row')
    const options = buildDateOptions()
    row.innerHTML = options.map(d => `
      <button class="md-date-chip ${selectedDate === d.key ? 'selected' : ''}" data-key="${d.key}" data-display="${d.display}">
        <p class="dow">${d.dow}</p>
        <p class="num">${d.num}</p>
      </button>
    `).join('')

    row.querySelectorAll('.md-date-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        selectedDate = chip.dataset.key
        document.getElementById('md-selected-date-label').textContent = chip.dataset.display
        renderDateRow()
        updateConfirmState()
      })
    })
  }

  function renderTimeGrid() {
    const grid = document.getElementById('md-time-grid')
    grid.innerHTML = TIME_SLOTS.map(t => `
      <button class="md-time-chip ${selectedTime === t ? 'selected' : ''}" data-time="${t}">${t}</button>
    `).join('')

    grid.querySelectorAll('.md-time-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        selectedTime = chip.dataset.time
        renderTimeGrid()
        updateConfirmState()
      })
    })
  }

  function updateConfirmState() {
    const btn = document.getElementById('md-confirm-btn')
    if (selectedDate && selectedTime) {
      btn.disabled = false
      btn.textContent = 'CONFIRM APPOINTMENT'
    } else {
      btn.disabled = true
      btn.textContent = 'PICK A DATE AND TIME'
    }
  }

  function confirmBooking() {
    const dateLabel = document.getElementById('md-selected-date-label').textContent
    const notes = document.getElementById('md-notes').value.trim()

    BOOKINGS.push({
      mechanic_id: mech.id,
      date: dateLabel,
      time: selectedTime,
      notes: notes,
      status: 'pending'
    })

    renderConfirmation(dateLabel)
  }

  function renderConfirmation(dateLabel) {
    body.innerHTML = `
      <div class="card" style="text-align:center;padding:32px 20px;">
        <div class="result-icon-success" style="margin:0 auto 16px;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <p style="font-size:17px;font-weight:800;color:var(--color-heading);">Appointment Requested</p>
        <p style="font-size:13px;color:var(--color-text-secondary);margin-top:6px;line-height:1.5;">${mech.garage} will confirm your slot on <b>${dateLabel}</b> at <b>${selectedTime}</b>.</p>
        <button class="btn btn-primary" id="md-done-btn" style="border-radius:999px;margin-top:22px;">BACK TO VEHICLE HEALTH</button>
      </div>
    `
    document.getElementById('md-done-btn').addEventListener('click', () => navigateTo('faults'))
  }

  if (!mech) {
    renderEmpty()
  } else {
    renderProfile()
  }
})()
</script>