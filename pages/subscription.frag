<div id="subscription-page">

  <button id="sub2-back-btn" aria-label="Back" style="display:flex;align-items:center;gap:4px;margin:0 0 14px -6px;padding:8px 12px 8px 6px;border-radius:999px;font-size:13px;font-weight:600;color:var(--color-text-secondary);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Profile
  </button>

  <div id="sub2-summary-section">
    <p style="font-size:19px;font-weight:800;color:var(--color-heading);margin-bottom:16px;">My Subscription</p>

    <div class="card plan-progress-card" id="sub2-current-card"></div>

    <div class="card" style="margin-top:16px;padding:0 18px;">
      <div class="toggle-row">
        <div>
          <p style="font-size:13.5px;font-weight:600;color:var(--color-heading);">Auto-renew</p>
          <p style="font-size:11.5px;color:var(--color-text-secondary);margin-top:2px;">Automatically renew at expiry</p>
        </div>
        <label class="toggle">
          <input type="checkbox" id="sub2-autorenew-toggle">
          <span class="toggle-track"></span>
        </label>
      </div>
    </div>

    <button class="btn btn-outline" id="sub2-change-plan-btn" style="border-radius:999px;margin-top:18px;">CHANGE PLAN</button>

    <p class="settings-group-label">Payment History</p>
    <div class="card" id="sub2-history-list" style="padding:0 18px;"></div>
  </div>

  <div id="sub2-change-section" class="hidden">

    <div class="card-stack" style="margin-bottom:20px;">

      <div class="plan-card" id="sub2-plan-card-starter">
        <p class="plan-price">KES 1,500<span> / month</span></p>
        <p class="plan-tagline">Basic monitoring</p>
        <ul class="plan-feature-list">
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Live dashboard (speed, RPM, temp, fuel)</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Fault code detection in plain English</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Service reminders</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>SMS alerts for faults</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Trip history (last 10 trips)</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Vehicle location on map</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Mechanic finder and booking</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Towing detection alerts</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Unplug detection alerts</li>
        </ul>
        <button class="btn btn-outline" data-plan="starter" data-price="1500">CHOOSE STARTER</button>
      </div>

      <div class="plan-card plan-recommended" id="sub2-plan-card-premium">
        <span class="plan-badge-recommended">⭐ RECOMMENDED</span>
        <p class="plan-price">KES 2,500<span> / month</span></p>
        <p class="plan-tagline">Full vehicle intelligence</p>
        <ul class="plan-feature-list">
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Everything in Starter, plus:</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Fuel Range Navigator</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Pulse AI Chatbot</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Trip Coaching after every trip</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Speed limit alerts per road</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Speed camera alerts</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Safety zone and radar alerts</li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Advanced vehicle sharing</li>
        </ul>
        <button class="btn btn-primary" data-plan="premium" data-price="2500">CHOOSE PREMIUM</button>
      </div>

    </div>

    <div id="sub2-duration-section" class="hidden" style="margin-bottom:20px;">
      <p class="settings-group-label" style="margin-top:0;">How long?</p>
      <div class="duration-options">
        <button class="duration-option" data-months="1" data-discount="0">
          <span>1 month</span><span></span>
        </button>
        <button class="duration-option" data-months="3" data-discount="0.05">
          <span>3 months</span><span class="duration-save">Save 5%</span>
        </button>
        <button class="duration-option" data-months="6" data-discount="0.10">
          <span>6 months</span><span class="duration-save">Save 10%</span>
        </button>
        <button class="duration-option" data-months="12" data-discount="0.15">
          <span>12 months</span><span class="duration-save">Save 15%</span>
        </button>
      </div>
      <div class="card" id="sub2-total-card" style="margin-top:12px;display:none;">
        <div class="fault-info-row"><span>Total</span><span id="sub2-total-amount" style="font-weight:700;"></span></div>
        <div class="fault-info-row" id="sub2-savings-row"><span>You save</span><span id="sub2-savings-amount" style="color:var(--color-accent);font-weight:700;"></span></div>
      </div>
    </div>

    <div id="sub2-payment-section" class="hidden" style="margin-bottom:20px;">
      <p class="settings-group-label" style="margin-top:0;">Pay with M-Pesa</p>
      <div class="field">
        <label class="field-label">M-Pesa Phone Number</label>
        <input type="tel" class="input" id="sub2-mpesa-phone">
      </div>
      <p style="font-size:12px;color:var(--color-text-secondary);text-align:center;">You'll receive a confirmation SMS</p>
    </div>

    <div id="sub2-success-section" class="hidden">
      <div class="card" style="text-align:center;padding:28px 22px;">
        <div class="result-icon-success" style="margin:0 auto 16px;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h2 style="font-size:17px;font-weight:800;letter-spacing:0.5px;color:var(--color-heading);">PAYMENT RECEIVED</h2>
        <p style="font-size:12.5px;color:var(--color-text-secondary);margin-top:8px;line-height:1.5;">
          Your <span id="sub2-success-plan" style="font-weight:600;color:var(--color-text-primary);"></span> plan is now active. You'll get a confirmation SMS shortly.
        </p>
        <div style="border-top:1.5px dashed var(--color-border);margin:20px 0;"></div>
        <div style="text-align:left;display:flex;flex-direction:column;gap:0;">
          <div class="fault-info-row"><span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Plan</span><span id="sub2-receipt-plan" style="font-weight:600;"></span></div>
          <div class="fault-info-row"><span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Duration</span><span id="sub2-receipt-duration" style="font-weight:600;"></span></div>
          <div class="fault-info-row"><span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Amount Paid</span><span id="sub2-receipt-amount" style="font-weight:600;"></span></div>
          <div class="fault-info-row"><span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">M-Pesa Ref</span><span id="sub2-receipt-ref" style="font-weight:600;"></span></div>
          <div class="fault-info-row"><span style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Valid Until</span><span id="sub2-receipt-date" style="font-weight:600;"></span></div>
        </div>
      </div>
    </div>

    <button class="btn btn-ghost" id="sub2-cancel-change-btn" style="margin-top:4px;">CANCEL</button>
  </div>

  <div style="margin-top:16px;">
    <button class="btn btn-primary hidden" id="sub2-pay-btn">
      <span class="btn-spinner"></span>
      <span id="sub2-pay-btn-text">PAY</span>
    </button>
    <button class="btn btn-primary hidden" id="sub2-done-btn">DONE</button>
  </div>

</div>

<script>
(function () {
  document.getElementById('sub2-back-btn').addEventListener('click', () => navigateTo('profile'))

  const summarySection = document.getElementById('sub2-summary-section')
  const changeSection = document.getElementById('sub2-change-section')
  const durationSection = document.getElementById('sub2-duration-section')
  const paymentSection = document.getElementById('sub2-payment-section')
  const successSection = document.getElementById('sub2-success-section')
  const totalCard = document.getElementById('sub2-total-card')
  const payBtn = document.getElementById('sub2-pay-btn')
  const payBtnText = document.getElementById('sub2-pay-btn-text')
  const doneBtn = document.getElementById('sub2-done-btn')

  let selectedPlan = null
  let selectedPrice = 0
  let selectedMonths = null
  let selectedDiscount = 0

  function planLabel(code) {
    return code === 'premium' ? 'Premium' : 'Starter'
  }

  function renderSummary() {
    const price = DRIVER.plan === 'premium' ? 2500 : 1500
    document.getElementById('sub2-current-card').innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <span class="badge ${DRIVER.plan === 'premium' ? 'badge-premium' : 'badge-accent'}">${planLabel(DRIVER.plan).toUpperCase()}</span>
          <p style="font-size:20px;font-weight:800;color:var(--color-heading);margin-top:8px;">${formatKES(price)}<span style="font-size:12px;font-weight:500;color:var(--color-text-secondary);"> / month</span></p>
        </div>
      </div>
      <div class="plan-progress-row">
        <span>Current period</span>
        <span>Renews ${DRIVER.plan_expires}</span>
      </div>
    `
    document.getElementById('sub2-autorenew-toggle').checked = DRIVER.auto_renew

    document.getElementById('sub2-history-list').innerHTML = PAYMENT_HISTORY.map((p, i) => `
      <div class="payment-history-row" style="${i === 0 ? '' : ''}">
        <span>${p.plan_name} · ${p.paid_at}</span>
        <span style="font-weight:700;">${formatKES(p.amount_kes)}</span>
      </div>
    `).join('')
  }

  document.getElementById('sub2-autorenew-toggle').addEventListener('change', (e) => {
    DRIVER.auto_renew = e.target.checked
    showToast(e.target.checked ? 'Auto-renew enabled' : 'Auto-renew disabled', 'success')
  })

  function resetChangeFlow() {
    document.getElementById('sub2-plan-card-starter').classList.remove('card-active')
    document.getElementById('sub2-plan-card-premium').classList.remove('card-active')
    durationSection.classList.add('hidden')
    paymentSection.classList.add('hidden')
    successSection.classList.add('hidden')
    totalCard.style.display = 'none'
    payBtn.classList.add('hidden')
    doneBtn.classList.add('hidden')
    document.querySelectorAll('#sub2-change-section .duration-option').forEach(o => o.classList.remove('selected'))
    document.getElementById('sub2-mpesa-phone').value = DRIVER.phone
    selectedPlan = null
    selectedMonths = null
    changeSection.querySelector('.card-stack').classList.remove('hidden')
  }

  document.getElementById('sub2-change-plan-btn').addEventListener('click', () => {
    summarySection.classList.add('hidden')
    changeSection.classList.remove('hidden')
    resetChangeFlow()
  })

  document.getElementById('sub2-cancel-change-btn').addEventListener('click', () => {
    changeSection.classList.add('hidden')
    summarySection.classList.remove('hidden')
    payBtn.classList.add('hidden')
    doneBtn.classList.add('hidden')
  })

  changeSection.querySelectorAll('[data-plan]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedPlan = btn.dataset.plan
      selectedPrice = parseInt(btn.dataset.price)

      document.getElementById('sub2-plan-card-starter').classList.toggle('card-active', selectedPlan === 'starter')
      document.getElementById('sub2-plan-card-premium').classList.toggle('card-active', selectedPlan === 'premium')

      durationSection.classList.remove('hidden')
      paymentSection.classList.add('hidden')
      totalCard.style.display = 'none'
      payBtn.classList.add('hidden')
      document.querySelectorAll('#sub2-change-section .duration-option').forEach(o => o.classList.remove('selected'))
      selectedMonths = null

      durationSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  })

  changeSection.querySelectorAll('.duration-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#sub2-change-section .duration-option').forEach(o => o.classList.remove('selected'))
      btn.classList.add('selected')

      selectedMonths = parseInt(btn.dataset.months)
      selectedDiscount = parseFloat(btn.dataset.discount)

      const subtotal = selectedPrice * selectedMonths
      const savings = Math.round(subtotal * selectedDiscount)
      const total = subtotal - savings

      totalCard.style.display = 'block'
      document.getElementById('sub2-total-amount').textContent = formatKES(total)
      document.getElementById('sub2-savings-row').style.display = savings > 0 ? 'flex' : 'none'
      document.getElementById('sub2-savings-amount').textContent = formatKES(savings)

      paymentSection.classList.remove('hidden')
      payBtn.classList.remove('hidden')
      payBtnText.textContent = `PAY ${formatKES(total)}`

      paymentSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  })

  function generateMpesaRef() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let ref = ''
    for (let i = 0; i < 10; i++) ref += chars[Math.floor(Math.random() * chars.length)]
    return ref
  }

  function formatFutureDate(months) {
    const d = new Date()
    d.setMonth(d.getMonth() + months)
    return d.toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  payBtn.addEventListener('click', () => {
    payBtn.classList.add('btn-loading')
    payBtn.disabled = true
    payBtnText.textContent = 'Sending M-Pesa prompt...'

    setTimeout(() => {
      const subtotal = selectedPrice * selectedMonths
      const savings = Math.round(subtotal * selectedDiscount)
      const total = subtotal - savings
      const newExpiry = formatFutureDate(selectedMonths)
      const ref = generateMpesaRef()

      changeSection.querySelector('.card-stack').classList.add('hidden')
      durationSection.classList.add('hidden')
      paymentSection.classList.add('hidden')
      payBtn.classList.add('hidden')
      payBtn.classList.remove('btn-loading')
      payBtn.disabled = false
      payBtnText.textContent = 'PAY'

      document.getElementById('sub2-success-plan').textContent = planLabel(selectedPlan)
      document.getElementById('sub2-receipt-plan').textContent = planLabel(selectedPlan)
      document.getElementById('sub2-receipt-duration').textContent = `${selectedMonths} month${selectedMonths > 1 ? 's' : ''}`
      document.getElementById('sub2-receipt-amount').textContent = formatKES(total)
      document.getElementById('sub2-receipt-ref').textContent = ref
      document.getElementById('sub2-receipt-date').textContent = newExpiry

      successSection.classList.remove('hidden')
      doneBtn.classList.remove('hidden')

      // Commit the change now — the receipt is shown, so this counts
      // as a confirmed payment, matching subscribe.frag's pattern.
      DRIVER.plan = selectedPlan
      DRIVER.plan_expires = newExpiry
      PAYMENT_HISTORY.unshift({
        plan_code: selectedPlan,
        plan_name: planLabel(selectedPlan),
        amount_kes: total,
        duration_months: selectedMonths,
        method: 'M-Pesa',
        mpesa_ref: ref,
        paid_at: new Date().toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' })
      })
    }, 1800)
  })

  doneBtn.addEventListener('click', () => {
    changeSection.classList.add('hidden')
    summarySection.classList.remove('hidden')
    doneBtn.classList.add('hidden')
    renderSummary()
  })

  renderSummary()
})()
</script>