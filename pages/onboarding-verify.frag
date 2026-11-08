<div class="auth-page">

  <div class="auth-header">
    <div class="auth-topbar">
      <button class="auth-back" id="verify-back-btn" aria-label="Back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <h1 class="auth-title">Verify Your Phone</h1>
  </div>

  <div class="auth-card">

    <div id="verify-step-default">
      <p class="auth-lead" id="verify-subtext">We sent a 4-digit code to<br><strong id="verify-phone-number"></strong></p>

      <div class="otp-row">
        <input type="tel" inputmode="numeric" maxlength="1" class="otp-box" id="otp-1">
        <input type="tel" inputmode="numeric" maxlength="1" class="otp-box" id="otp-2">
        <input type="tel" inputmode="numeric" maxlength="1" class="otp-box" id="otp-3">
        <input type="tel" inputmode="numeric" maxlength="1" class="otp-box" id="otp-4">
      </div>

      <div class="resend-row" id="verify-resend-row">
        Didn't receive code? Resend in <span id="verify-countdown">45</span> seconds
      </div>
    </div>

    <div id="verify-step-success" class="hidden">
      <div class="result-state">
        <div class="result-icon-success">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 style="font-size:19px;font-weight:700;">Phone Verified!</h2>
      </div>
    </div>

    <div id="verify-footer">
      <button class="auth-btn" id="verify-action-btn">
        <span class="auth-btn-spinner"></span>
        <span id="verify-action-btn-text">VERIFY</span>
      </button>
    </div>

  </div>

</div>

<script>
(function () {
  let countdownSeconds = 45
  let countdownTimer = null

  const backBtn = document.getElementById('verify-back-btn')
  const actionBtn = document.getElementById('verify-action-btn')
  const actionBtnText = document.getElementById('verify-action-btn-text')
  const resendRow = document.getElementById('verify-resend-row')
  const countdownSpan = document.getElementById('verify-countdown')
  const otpInputs = [1, 2, 3, 4].map(n => document.getElementById(`otp-${n}`))

  // A fleet driver reached this screen from the login screen, never
  // from the device-code screen, so back returns to login.
  backBtn.addEventListener('click', () => navigateTo(isFleetDriver() ? 'login' : 'onboarding-device'))

  // Show driver's phone as +254 format
  const rawPhone = DRIVER.phone.replace(/^0/, '254')
  document.getElementById('verify-phone-number').textContent = `+${rawPhone}`

  // OTP box behavior: auto-focus next, auto-submit on 4th digit
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^0-9]/g, '')
      if (input.value && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus()
      }
      if (otpInputs.every(box => box.value.length === 1)) {
        verifyCode()
      }
    })

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        otpInputs[index - 1].focus()
      }
    })
  })

  otpInputs[0].focus()

  actionBtn.addEventListener('click', verifyCode)

  function verifyCode() {
    actionBtn.classList.add('is-loading')
    actionBtn.disabled = true
    actionBtnText.textContent = 'Verifying...'

    setTimeout(() => {
      document.getElementById('verify-step-default').classList.add('hidden')
      document.getElementById('verify-step-success').classList.remove('hidden')
      document.getElementById('verify-footer').classList.add('hidden')
      clearInterval(countdownTimer)

      setTimeout(() => {
        navigateTo('onboarding-password')
      }, 1200)
    }, 900)
  }

  function startCountdown() {
    countdownSeconds = 45
    countdownSpan.textContent = countdownSeconds
    resendRow.innerHTML = `Didn't receive code? Resend in <span id="verify-countdown">${countdownSeconds}</span> seconds`

    countdownTimer = setInterval(() => {
      countdownSeconds -= 1
      const span = document.getElementById('verify-countdown')
      if (span) span.textContent = countdownSeconds

      if (countdownSeconds <= 0) {
        clearInterval(countdownTimer)
        resendRow.innerHTML = `<a href="#" id="verify-resend-link">Resend Code</a>`
        document.getElementById('verify-resend-link').addEventListener('click', (e) => {
          e.preventDefault()
          showToast('New code sent', 'success')
          startCountdown()
        })
      }
    }, 1000)
  }

  startCountdown()
})()
</script><div class="auth-page">

  <div class="auth-header">
    <div class="auth-topbar">
      <button class="auth-back" id="verify-back-btn" aria-label="Back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <h1 class="auth-title">Verify Your Phone</h1>
  </div>

  <div class="auth-card">

    <div id="verify-step-default">
      <p class="auth-lead" id="verify-subtext">We sent a 4-digit code to<br><strong id="verify-phone-number"></strong></p>

      <div class="otp-row">
        <input type="tel" inputmode="numeric" maxlength="1" class="otp-box" id="otp-1">
        <input type="tel" inputmode="numeric" maxlength="1" class="otp-box" id="otp-2">
        <input type="tel" inputmode="numeric" maxlength="1" class="otp-box" id="otp-3">
        <input type="tel" inputmode="numeric" maxlength="1" class="otp-box" id="otp-4">
      </div>

      <div class="resend-row" id="verify-resend-row">
        Didn't receive code? Resend in <span id="verify-countdown">45</span> seconds
      </div>
    </div>

    <div id="verify-step-success" class="hidden">
      <div class="result-state">
        <div class="result-icon-success">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 style="font-size:19px;font-weight:700;">Phone Verified!</h2>
      </div>
    </div>

    <div id="verify-footer">
      <button class="auth-btn" id="verify-action-btn">
        <span class="auth-btn-spinner"></span>
        <span id="verify-action-btn-text">VERIFY</span>
      </button>
    </div>

  </div>

</div>

<script>
(function () {
  let countdownSeconds = 45
  let countdownTimer = null

  const backBtn = document.getElementById('verify-back-btn')
  const actionBtn = document.getElementById('verify-action-btn')
  const actionBtnText = document.getElementById('verify-action-btn-text')
  const resendRow = document.getElementById('verify-resend-row')
  const countdownSpan = document.getElementById('verify-countdown')
  const otpInputs = [1, 2, 3, 4].map(n => document.getElementById(`otp-${n}`))

  // This screen is shared by three paths:
  //   password reset  -> back goes to Forgot Password
  //   fleet driver    -> reached from Login, so back returns to Login
  //   new individual  -> reached from the device screen
  const resetFlow = window.pulsepalAuthFlow === 'reset'

  backBtn.addEventListener('click', () => {
    if (resetFlow) {
      navigateTo('forgot-password')
    } else if (isFleetDriver()) {
      navigateTo('login')
    } else {
      navigateTo('onboarding-device')
    }
  })

  // Show driver's phone as +254 format
  const rawPhone = DRIVER.phone.replace(/^0/, '254')
  document.getElementById('verify-phone-number').textContent = `+${rawPhone}`

  // OTP box behavior: auto-focus next, auto-submit on 4th digit
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^0-9]/g, '')
      if (input.value && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus()
      }
      if (otpInputs.every(box => box.value.length === 1)) {
        verifyCode()
      }
    })

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        otpInputs[index - 1].focus()
      }
    })
  })

  otpInputs[0].focus()

  actionBtn.addEventListener('click', verifyCode)

  function verifyCode() {
    actionBtn.classList.add('is-loading')
    actionBtn.disabled = true
    actionBtnText.textContent = 'Verifying...'

    setTimeout(() => {
      document.getElementById('verify-step-default').classList.add('hidden')
      document.getElementById('verify-step-success').classList.remove('hidden')
      document.getElementById('verify-footer').classList.add('hidden')
      clearInterval(countdownTimer)

      setTimeout(() => {
        navigateTo('onboarding-password')
      }, 1200)
    }, 900)
  }

  function startCountdown() {
    countdownSeconds = 45
    countdownSpan.textContent = countdownSeconds
    resendRow.innerHTML = `Didn't receive code? Resend in <span id="verify-countdown">${countdownSeconds}</span> seconds`

    countdownTimer = setInterval(() => {
      countdownSeconds -= 1
      const span = document.getElementById('verify-countdown')
      if (span) span.textContent = countdownSeconds

      if (countdownSeconds <= 0) {
        clearInterval(countdownTimer)
        resendRow.innerHTML = `<a href="#" id="verify-resend-link">Resend Code</a>`
        document.getElementById('verify-resend-link').addEventListener('click', (e) => {
          e.preventDefault()
          showToast('New code sent', 'success')
          startCountdown()
        })
      }
    }, 1000)
  }

  startCountdown()
})()
</script>