<div class="auth-page">

  <div class="auth-header">
    <div class="auth-topbar">
      <button class="auth-back" id="login-back-btn" aria-label="Back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <a href="#" class="auth-header-link" id="login-getstarted-link">Get Started</a>
    </div>
    <h1 class="auth-title" id="login-heading">Sign in</h1>
    <p class="auth-subtitle" id="login-subtitle">Enter your phone number to continue.</p>
  </div>

  <div class="auth-card">

    <div class="auth-field">
      <div class="auth-input-wrap">
        <span class="auth-input-prefix">+254</span>
        <input type="tel" class="auth-input has-prefix" id="login-phone-input" placeholder="Phone number" autocomplete="tel">
      </div>
    </div>

    <div class="auth-field hidden" id="login-password-field">
      <div class="auth-input-wrap">
        <input type="password" class="auth-input has-eye" id="login-password-input" placeholder="Password" autocomplete="current-password">
        <button class="auth-eye" id="login-password-toggle" type="button" aria-label="Show password">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12C2 12 5.5 5.5 12 5.5C18.5 5.5 22 12 22 12C22 12 18.5 18.5 12 18.5C5.5 18.5 2 12 2 12Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/>
          </svg>
        </button>
      </div>
    </div>

    <p class="auth-error" id="login-error"></p>

    <a href="#" class="auth-forgot hidden" id="login-forgot-link">Forgot password?</a>

    <button class="auth-btn" id="login-submit-btn">
      <span class="auth-btn-spinner"></span>
      <span id="login-submit-btn-text">Continue</span>
    </button>

    <button class="auth-social" id="login-google-btn" type="button">
      <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" fill="#34A853"/>
        <path d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" fill="#EA4335"/>
      </svg>
      Continue with Google
    </button>

    <p class="auth-legal">
      By logging in, you agree to the<br>
      <a href="#" id="login-privacy-link" target="_blank" rel="noopener">Privacy policy</a> &amp; <a href="#" id="login-terms-link" target="_blank" rel="noopener">Terms of Service</a>
    </p>

  </div>

</div>

<script>
(function () {
  // PLACEHOLDERS: replace with your real Privacy policy and Terms URLs
  // before release. They open in a new tab.
  const LEGAL_URLS = {
    privacy: 'https://pulsepal.example/privacy',
    terms: 'https://pulsepal.example/terms'
  }
  document.getElementById('login-privacy-link').href = LEGAL_URLS.privacy
  document.getElementById('login-terms-link').href = LEGAL_URLS.terms

  // A password reset that was left half-finished must never carry
  // over into a normal login.
  window.pulsepalAuthFlow = null

  const ACTIVATED_KEY = 'pulsepal_fleet_activated'

  const backBtn = document.getElementById('login-back-btn')
  const getStartedLink = document.getElementById('login-getstarted-link')
  const heading = document.getElementById('login-heading')
  const subtitle = document.getElementById('login-subtitle')
  const phoneInput = document.getElementById('login-phone-input')
  const passwordField = document.getElementById('login-password-field')
  const passwordInput = document.getElementById('login-password-input')
  const toggleBtn = document.getElementById('login-password-toggle')
  const forgotLink = document.getElementById('login-forgot-link')
  const googleBtn = document.getElementById('login-google-btn')
  const submitBtn = document.getElementById('login-submit-btn')
  const submitBtnText = document.getElementById('login-submit-btn-text')
  const errorText = document.getElementById('login-error')

  // Phone-first sign in, in two steps on this one screen:
  //   'phone'    -> the number decides what kind of account it is
  //   'password' -> existing accounts only
  // A fleet driver's first sign in skips the password step: phone ->
  // OTP -> set password -> Fleet Welcome (their manager added them,
  // so they have no password yet).
  let step = 'phone'
  let account = null

  // True when a fleet profile is already loaded (a fleet number
  // started signing in, or the dev switch is on).
  const fleetLoaded = isFleetDriver()

  function setLoading(on, text) {
    submitBtn.classList.toggle('is-loading', on)
    submitBtn.disabled = on
    if (text) submitBtnText.textContent = text
  }

  function showPhoneStep() {
    step = 'phone'
    account = null
    heading.textContent = 'Sign in'
    subtitle.textContent = 'Enter your phone number to continue.'
    phoneInput.readOnly = false
    phoneInput.style.opacity = ''
    passwordInput.value = ''
    passwordField.classList.add('hidden')
    forgotLink.classList.add('hidden')
    googleBtn.classList.remove('hidden')
    getStartedLink.classList.remove('hidden')
    errorText.textContent = ''
    setLoading(false, 'Continue')
  }

  function showPasswordStep(found) {
    step = 'password'
    account = found
    heading.textContent = 'Welcome back'
    subtitle.textContent = 'Enter your password to sign in.'
    phoneInput.readOnly = true
    phoneInput.style.opacity = '0.7'
    passwordField.classList.remove('hidden')
    forgotLink.classList.remove('hidden')
    googleBtn.classList.add('hidden')
    getStartedLink.classList.add('hidden')
    errorText.textContent = ''
    setLoading(false, 'Sign in')
    passwordInput.focus()
  }

  // Drops a loaded fleet profile and goes back to the normal start
  // (splash, then Welcome). Fleet drivers can't open the device
  // screen, so this is how someone on a fleet profile gets out.
  function resetToDefaultProfile() {
    clearSignedInAccount()
    try { sessionStorage.removeItem('pulsepal_dev_mode') } catch (e) {}
    window.location.href = window.location.pathname
  }

  backBtn.addEventListener('click', () => {
    if (step === 'password') {
      showPhoneStep()
      phoneInput.focus()
      return
    }
    if (fleetLoaded) {
      resetToDefaultProfile()
      return
    }
    navigateTo('welcome')
  })

  getStartedLink.addEventListener('click', (e) => {
    e.preventDefault()
    if (fleetLoaded) {
      resetToDefaultProfile()
      return
    }
    navigateTo('onboarding-device')
  })

  toggleBtn.addEventListener('click', () => {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password'
  })

  forgotLink.addEventListener('click', (e) => {
    e.preventDefault()
    navigateTo('forgot-password')
  })

  googleBtn.addEventListener('click', () => {
    showToast('Google sign-in coming soon', 'success')
  })

  phoneInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitBtn.click() })
  passwordInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitBtn.click() })

  function submitPhone() {
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

    const found = findAccountByPhone(phone)
    if (!found) {
      errorText.textContent = "No account found for that number. New to PulsePal? Tap Get Started. Added by a fleet? Ask your manager to check the number."
      return
    }

    // Fleet driver signing in for the first time: send the code,
    // then OTP -> set password -> Fleet Welcome.
    if (found.account_type === 'fleet_driver' && localStorage.getItem(ACTIVATED_KEY) !== 'true') {
      setLoading(true, 'Sending code...')
      setTimeout(() => {
        if (accountMatchesLoadedProfile(found)) {
          navigateTo('onboarding-verify')
        } else {
          // Loads the fleet profile (one reload), then opens the OTP screen.
          switchAccountAndReload(found.phone, 'onboarding-verify')
        }
      }, 900)
      return
    }

    showPasswordStep(found)
  }

  function submitPassword() {
    if (!passwordInput.value) {
      errorText.textContent = 'Enter your password'
      return
    }

    // Prototype only: any password is accepted. The backend checks
    // the real one.
    setLoading(true, 'Signing in...')
    setTimeout(() => {
      localStorage.setItem('pulsepal_logged_in', 'true')
      if (accountMatchesLoadedProfile(account)) {
        navigateTo('home')
      } else {
        // Loads this account's profile (one reload); startup then
        // sees the logged-in flag and opens Home.
        switchAccountAndReload(account.phone)
      }
    }, 900)
  }

  submitBtn.addEventListener('click', () => {
    errorText.textContent = ''
    if (step === 'phone') submitPhone()
    else submitPassword()
  })

  showPhoneStep()
})()
</script>