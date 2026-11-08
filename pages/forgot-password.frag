<div class="auth-page">

  <div class="auth-header">
    <div class="auth-topbar">
      <button class="auth-back" id="forgot-back-btn" aria-label="Back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <h1 class="auth-title">Forgot Password</h1>
    <p class="auth-subtitle">Enter your registered phone number and we'll send you a code.</p>
  </div>

  <div class="auth-card">

    <div class="auth-field">
      <div class="auth-input-wrap">
        <span class="auth-input-prefix">+254</span>
        <input type="tel" class="auth-input has-prefix" id="forgot-phone-input" placeholder="Phone number" autocomplete="tel">
      </div>
      <p class="auth-error" id="forgot-error"></p>
    </div>

    <button class="auth-btn" id="forgot-submit-btn">
      <span class="auth-btn-spinner"></span>
      <span id="forgot-submit-btn-text">SEND CODE</span>
    </button>

  </div>

</div>

<script>
(function () {
  const phoneInput = document.getElementById('forgot-phone-input')
  const errorText = document.getElementById('forgot-error')
  const submitBtn = document.getElementById('forgot-submit-btn')
  const submitBtnText = document.getElementById('forgot-submit-btn-text')

  // Any earlier reset attempt is over once this screen opens.
  window.pulsepalAuthFlow = null

  document.getElementById('forgot-back-btn').addEventListener('click', () => navigateTo('login'))

  phoneInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitBtn.click() })

  submitBtn.addEventListener('click', () => {
    errorText.textContent = ''

    const raw = phoneInput.value.trim()
    if (!raw) {
      errorText.textContent = 'Enter your phone number'
      return
    }

    // Kenyan mobile numbers: 07XXXXXXXX or 01XXXXXXXX.
    const phone = normalizePhone(raw)
    if (!/^0[17]\d{8}$/.test(phone)) {
      errorText.textContent = 'Enter a valid phone number'
      return
    }

    // Prototype only: a real backend answers the same way whether or
    // not the number is registered ("if it is, a code was sent"), so
    // strangers can't test which numbers have accounts.
    if (!findAccountByPhone(phone)) {
      errorText.textContent = 'No account found with that phone number'
      return
    }

    submitBtn.classList.add('is-loading')
    submitBtn.disabled = true
    submitBtnText.textContent = 'Sending code...'

    setTimeout(() => {
      // Tells the OTP and password screens they are part of a reset,
      // not an onboarding. Lives in memory only, so a page refresh
      // clears it.
      window.pulsepalAuthFlow = 'reset'
      navigateTo('onboarding-verify')
    }, 900)
  })
})()
</script>