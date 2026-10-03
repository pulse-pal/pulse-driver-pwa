<style>
  #help-faq-page .hf-whatsapp-card {
    background: linear-gradient(160deg, #E9FBEF 0%, var(--color-card-solid) 60%);
  }
  :root[data-theme="dark"] #help-faq-page .hf-whatsapp-card {
    background: linear-gradient(160deg, #122B1A 0%, var(--color-card-solid) 60%);
  }
</style>

<div id="help-faq-page">

  <button id="hf-back-btn" aria-label="Back" style="display:flex;align-items:center;gap:4px;margin:0 0 14px -6px;padding:8px 12px 8px 6px;border-radius:999px;font-size:13px;font-weight:600;color:var(--color-text-secondary);">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Settings
  </button>

  <p style="font-size:19px;font-weight:800;color:var(--color-heading);margin-bottom:16px;">Help &amp; FAQ</p>

  <a id="hf-whatsapp-link" target="_blank" rel="noopener" class="card hf-whatsapp-card" style="display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit;margin-bottom:20px;">
    <div style="width:44px;height:44px;border-radius:12px;background:#25D366;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 14.4c-.3-.15-1.7-.85-2-.95-.27-.1-.46-.15-.66.15-.2.3-.76.94-.93 1.14-.17.2-.34.22-.63.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.58-.9-2.17-.24-.57-.48-.5-.66-.5-.17-.01-.37-.01-.56-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.19 5.06 4.47.71.3 1.26.49 1.69.62.71.23 1.35.2 1.86.12.57-.08 1.7-.7 1.94-1.37.24-.68.24-1.26.17-1.38-.08-.13-.27-.2-.57-.35z" fill="#FFFFFF"/><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.35 5.06L2 22l5.06-1.32A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" stroke="#25D366" stroke-width="1.4"/></svg>
    </div>
    <div style="flex:1;">
      <p style="font-size:14px;font-weight:700;color:var(--color-heading);">Chat with Support</p>
      <p style="font-size:11.5px;color:var(--color-text-secondary);margin-top:1px;">On WhatsApp · usually replies fast</p>
    </div>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--color-text-secondary);flex-shrink:0;"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </a>

  <p class="settings-group-label" style="margin-top:0;">Frequently Asked Questions</p>
  <div id="hf-faq-list" style="display:flex;flex-direction:column;gap:10px;"></div>

</div>

<script>
(function () {
  document.getElementById('hf-back-btn').addEventListener('click', () => navigateTo('settings'))
  document.getElementById('hf-whatsapp-link').href = `https://wa.me/${APP_INFO.whatsapp_number}`

  const FAQS = [
    {
      q: 'Why isn\u2019t my vehicle data updating?',
      a: 'Check that your PulsePal device is plugged into the OBD port and the ignition is on. You can also try "Re-pair Device" under Settings \u2192 Device Status to refresh the connection.'
    },
    {
      q: 'How do I change my subscription plan?',
      a: 'Go to Settings \u2192 My Subscription \u2192 Change Plan. You can switch between Starter and Premium, and pay by M-Pesa for 1, 3, 6 or 12 months, with a discount on longer durations.'
    },
    {
      q: 'Can I share my vehicle with a family member or driver?',
      a: 'Yes. Go to Settings \u2192 Vehicle Sharing to add someone by name and phone number. Starter gives them full access; Premium adds timed access windows and driving behavior reports.'
    },
    {
      q: 'What happens if I miss a payment?',
      a: 'You get a 7-day grace period after your plan expires before the account is suspended. You\u2019ll get an SMS reminder before that happens.'
    },
    {
      q: 'Is my location and driving data private?',
      a: 'Your GPS and driving data is only visible to you and anyone you explicitly grant access to under Vehicle Sharing. See our Data & Privacy Policy under Settings \u2192 About Application for full details.'
    }
  ]

  function renderFaqs() {
    document.getElementById('hf-faq-list').innerHTML = FAQS.map((f, i) => `
      <div class="card" style="padding:0;overflow:hidden;">
        <button class="hf-question-btn" data-index="${i}" style="width:100%;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:16px 18px;text-align:left;">
          <span style="font-size:13.5px;font-weight:600;color:var(--color-heading);">${f.q}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="hf-chevron" data-index="${i}" style="color:var(--color-text-secondary);flex-shrink:0;transition:transform 200ms;"><path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="hf-answer" data-index="${i}" style="display:none;padding:0 18px 16px;">
          <p style="font-size:12.5px;color:var(--color-text-secondary);line-height:1.55;">${f.a}</p>
        </div>
      </div>
    `).join('')

    document.querySelectorAll('.hf-question-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = btn.dataset.index
        const answer = document.querySelector(`.hf-answer[data-index="${i}"]`)
        const chevron = document.querySelector(`.hf-chevron[data-index="${i}"]`)
        const isOpen = answer.style.display === 'block'
        answer.style.display = isOpen ? 'none' : 'block'
        chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)'
      })
    })
  }

  renderFaqs()
})()
</script>