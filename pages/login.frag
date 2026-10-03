<div class="onboarding-page" style="padding-top:40px;">

  <div style="text-align:center;margin-bottom:32px;">
    <img src="assets/images/logo.png" alt="PulsePal" style="width:64px;height:64px;margin:0 auto 16px;">
    <h1 class="onboarding-heading">Welcome Back</h1>
  </div>

  <div class="onboarding-body">

    <div class="field">
      <label class="field-label">Phone Number</label>
      <div class="input-wrap">
        <input type="tel" class="input" id="login-phone-input" placeholder="0712345678" style="padding-left:52px;">
        <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:15px;color:var(--color-text-secondary);font-weight:600;">+254</span>
      </div>
    </div>

    <div class="field">
      <label class="field-label">Password</label>
      <div class="input-wrap">
        <input type="password" class="input" id="login-password-input" placeholder="Enter your password">
        <button class="input-icon-btn" id="login-password-toggle" type="button" aria-label="Show password">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12C2 12 5.5 5.5 12 5.5C18.5 5.5 22 12 22 12C22 12 18.5 18.5 12 18.5C5.5 18.5 2 12 2 12Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/>
          </svg>
        </button>
      </div>
      <p id="login-error" style="font-size:12px;color:var(--color-danger);margin-top:6px;min-height:16px;"></p>
    </div>

  </div>

  <div class="onboarding-footer">
    <button class="btn btn-primary" id="login-submit-btn">
      <span class="btn-spinner"></span>
      <span id="login-submit-btn-text">LOGIN</span>
    </button>
    <div style="text-align:center;margin-top:16px;">
      <a href="#" id="login-forgot-link" style="font-size:13px;color:var(--color-text-secondary);">Forgot password?</a>
    </div>
    <div style="text-align:center;margin-top:10px;">
      <a href="#" id="login-signup-link" style="font-size:13px;color:var(--color-accent);font-weight:600;">New user? Activate device</a>
    </div>
  </div>

</div>

<script>
(function () {
  const phoneInput = document.getElementById('login-phone-input')
  const passwordInput = document.getElementById('login-password-input')
  const toggleBtn = document.getElementById('login-password-toggle')
  const submitBtn = document.getElementById('login-submit-btn')
  const submitBtnText = document.getElementById('login-submit-btn-text')
  const errorText = document.getElementById('login-error')

  toggleBtn.addEventListener('click', () => {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password'
  })

  document.getElementById('login-forgot-link').addEventListener('click', (e) => {
    e.preventDefault()
    showToast('Password reset link sent via SMS', 'success')
  })

  document.getElementById('login-signup-link').addEventListener('click', (e) => {
    e.preventDefault()
    navigateTo('onboarding-device')
  })

  submitBtn.addEventListener('click', () => {
    errorText.textContent = ''
    const enteredPhone = phoneInput.value.trim().replace(/^0/, '')
    const knownPhone = DRIVER.phone.replace(/^0/, '')

    if (!enteredPhone || !passwordInput.value) {
      errorText.textContent = 'Enter your phone number and password'
      return
    }

    if (enteredPhone !== knownPhone) {
      errorText.textContent = 'No account found with that phone number'
      return
    }

    submitBtn.classList.add('btn-loading')
    submitBtn.disabled = true
    submitBtnText.textContent = 'Logging in...'

    setTimeout(() => {
      localStorage.setItem('pulsepal_logged_in', 'true')
      navigateTo('home')
    }, 900)
  })
})()
</script>