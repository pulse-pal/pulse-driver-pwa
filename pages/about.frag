<div id="about-page">

  <button id="about-back-btn" aria-label="Back" style="display:flex;align-items:center;gap:4px;margin:0 0 14px -6px;padding:8px 12px 8px 6px;border-radius:999px;font-size:13px;font-weight:600;color:var(--color-text-secondary);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Settings
  </button>

  <div style="text-align:center;padding:12px 0 24px;">
    <img src="assets/images/logo.png" alt="PulsePal" style="width:56px;height:56px;margin:0 auto 10px;">
    <p style="font-size:16px;font-weight:800;color:var(--color-heading);">PulsePal</p>
    <p style="font-size:12px;color:var(--color-text-secondary);margin-top:2px;" id="about-version-line"></p>
  </div>

  <div class="card" style="padding:0 18px;">
    <div class="fault-info-row"><span>App version</span><span style="font-weight:700;" id="about-app-version"></span></div>
    <div class="fault-info-row"><span>Build</span><span style="font-weight:700;" id="about-build"></span></div>
    <div class="fault-info-row"><span>Device firmware</span><span style="font-weight:700;" id="about-firmware"></span></div>
    <div class="fault-info-row"><span>Connected device</span><span style="font-weight:700;" id="about-device-code"></span></div>
  </div>

  <p class="settings-group-label">Legal</p>
  <div class="card" style="padding:0 18px;">
    <a id="about-terms-link" target="_blank" rel="noopener" class="settings-row" style="text-decoration:none;color:inherit;cursor:pointer;">
      <span>Terms of Service</span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);"><path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
    <div style="height:1px;background:var(--color-border);"></div>
    <a id="about-privacy-link" target="_blank" rel="noopener" class="settings-row" style="text-decoration:none;color:inherit;cursor:pointer;">
      <span>Data &amp; Privacy Policy</span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);"><path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
  </div>

  <p style="text-align:center;font-size:11px;color:var(--color-text-secondary);margin-top:24px;">
    Made in Nairobi, Kenya 🇰🇪
  </p>

</div>

<script>
(function () {
  document.getElementById('about-back-btn').addEventListener('click', () => navigateTo('settings'))

  document.getElementById('about-version-line').textContent = `Version ${APP_INFO.app_version}`
  document.getElementById('about-app-version').textContent = APP_INFO.app_version
  document.getElementById('about-build').textContent = APP_INFO.build
  document.getElementById('about-firmware').textContent = ACTIVE_VEHICLE.firmware_version
  document.getElementById('about-device-code').textContent = ACTIVE_VEHICLE.device_code

  document.getElementById('about-terms-link').href = APP_INFO.terms_url
  document.getElementById('about-privacy-link').href = APP_INFO.privacy_url
})()
</script>