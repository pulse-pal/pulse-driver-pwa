<!-- ENTRY VIEW: orange banner + white card (enter code / not found) -->
<div class="auth-page" id="device-auth-view">

  <div class="auth-header">
    <div class="auth-topbar">
      <button class="auth-back" id="device-back-btn" aria-label="Back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <h1 class="auth-title">Activate Your Device</h1>
  </div>

  <div class="auth-card">

    <div id="device-step-default">
      <p class="auth-lead">Enter the code printed on your PulsePal device label</p>
      <div class="auth-field">
        <input type="text" id="device-code-input" class="auth-input auth-input-code" placeholder="e.g. PULSE-0001" maxlength="20" autocomplete="off">
      </div>
    </div>

    <div id="device-step-notfound" class="hidden">
      <div class="result-state">
        <div class="result-icon-error">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
          </svg>
        </div>
        <h2 style="font-size:19px;font-weight:700;">Device not found</h2>
        <p style="font-size:13px;color:var(--color-text-secondary);">Check the code and try again</p>
        <p style="font-size:12.5px;color:var(--color-text-secondary);margin-top:6px;">Make sure device is plugged into your car's OBD port and ignition is on</p>
      </div>
    </div>

    <button class="auth-btn" id="device-action-btn">
      <span class="auth-btn-spinner"></span>
      <span id="device-action-btn-text">FIND MY DEVICE</span>
    </button>

  </div>

</div>

<!-- DEVICE FOUND VIEW: the original layout, no banner, no dots -->
<div class="onboarding-page hidden" id="device-found-view">
  <button class="onboarding-back" id="device-found-back-btn" aria-label="Back">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>

  <div class="onboarding-body" style="margin-top:16px;">
    <div class="result-state">
      <div class="result-icon-success">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 style="font-size:19px;font-weight:700;">Device Found!</h2>
    </div>
    <div class="card">
      <div class="fault-info-row"><span>Device</span><span id="found-device-code" style="font-weight:700;color:var(--color-text-primary);"></span></div>
      <div class="fault-info-row"><span>Status</span><span><span class="status-dot status-dot-online" style="display:inline-block;margin-right:5px;"></span>Online</span></div>
    </div>
    <p class="settings-group-label">Vehicle Auto-Detected</p>
    <div class="card">
      <p id="found-vehicle-name" style="font-weight:700;font-size:15px;"></p>
      <p id="found-vehicle-plate" style="font-size:13px;color:var(--color-text-secondary);margin-top:2px;"></p>
    </div>
  </div>

  <div class="onboarding-footer">
    <button class="btn btn-primary" id="device-continue-btn">
      <span id="device-continue-btn-text">CONTINUE →</span>
    </button>
  </div>
</div>

<script>
(function () {
  let step = 'default'

  const authView = document.getElementById('device-auth-view')
  const foundView = document.getElementById('device-found-view')
  const actionBtn = document.getElementById('device-action-btn')
  const actionBtnText = document.getElementById('device-action-btn-text')

  document.getElementById('device-back-btn').addEventListener('click', () => navigateTo('welcome'))

  // From the Device Found view, back returns to the code field.
  document.getElementById('device-found-back-btn').addEventListener('click', () => {
    foundView.classList.add('hidden')
    authView.classList.remove('hidden')
    resetForm()
  })

  document.getElementById('device-continue-btn').addEventListener('click', () => navigateTo('onboarding-verify'))

  actionBtn.addEventListener('click', () => {
    if (step === 'default') {
      searchDevice()
    } else if (step === 'notfound') {
      resetForm()
    }
  })

  function searchDevice() {
    const input = document.getElementById('device-code-input')
    const code = input.value.trim().toUpperCase()

    actionBtn.classList.add('is-loading')
    actionBtn.disabled = true
    actionBtnText.textContent = 'Searching...'

    setTimeout(() => {
      const vehicle = VEHICLES.find(v => v.device_code === code)

      actionBtn.classList.remove('is-loading')
      actionBtn.disabled = false

      if (vehicle) {
        document.getElementById('found-device-code').textContent = vehicle.device_code
        document.getElementById('found-vehicle-name').textContent = `${vehicle.make} ${vehicle.model} ${vehicle.year}`
        document.getElementById('found-vehicle-plate').textContent = `Plate: ${vehicle.plate}`
        authView.classList.add('hidden')
        foundView.classList.remove('hidden')
        actionBtnText.textContent = 'FIND MY DEVICE'
        step = 'found'
      } else {
        document.getElementById('device-step-default').classList.add('hidden')
        document.getElementById('device-step-notfound').classList.remove('hidden')
        actionBtnText.textContent = 'Try Again'
        step = 'notfound'
      }
    }, 1200)
  }

  function resetForm() {
    document.getElementById('device-step-notfound').classList.add('hidden')
    document.getElementById('device-step-default').classList.remove('hidden')
    actionBtnText.textContent = 'FIND MY DEVICE'
    document.getElementById('device-code-input').value = ''
    step = 'default'
  }
})()
</script>