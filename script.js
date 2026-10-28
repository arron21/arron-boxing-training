document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // Interactive Calorie & Investment Calculator
  const sessionsInput = document.getElementById('sessionsPerWeek');
  const sessionsVal = document.getElementById('sessionsVal');
  const weeklyCalories = document.getElementById('weeklyCalories');
  const monthlyCalories = document.getElementById('monthlyCalories');
  const fatPounds = document.getElementById('fatPounds');
  const weeklyCost = document.getElementById('weeklyCost');

  const CALORIES_PER_HOUR = 800;
  const HOURLY_RATE = 50;

  function updateCalculator() {
    if (!sessionsInput) return;
    const sessions = parseInt(sessionsInput.value, 10) || 3;
    const weeklyCal = sessions * CALORIES_PER_HOUR;
    const monthlyCal = weeklyCal * 4;
    const estFatLbs = (monthlyCal / 3500).toFixed(1);
    const cost = sessions * HOURLY_RATE;

    sessionsVal.textContent = `${sessions} ${sessions === 1 ? 'Session' : 'Sessions'} / week`;
    weeklyCalories.textContent = `${weeklyCal.toLocaleString()}+`;
    monthlyCalories.textContent = `${monthlyCal.toLocaleString()}+`;
    fatPounds.textContent = `${estFatLbs}+ lbs`;
    weeklyCost.textContent = `$${cost}`;
  }

  if (sessionsInput) {
    sessionsInput.addEventListener('input', updateCalculator);
    updateCalculator();
  }

  // Netlify Analytics & Conversion Event Tracking
  // Netlify built-in Analytics tracks all server-side requests in your Netlify dashboard.
  // Sending lightweight background beacons for key conversion actions lets them show up
  // in your Netlify Analytics "Top pages / resources" report (e.g. /events/booking-submitted).
  function trackEvent(eventSlug, params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const path = `/events/${eventSlug}${query ? `?${query}` : ''}`;

      // Ping Netlify server logs so the event appears in Netlify Built-in Analytics
      fetch(path, { method: 'HEAD', keepalive: true }).catch(() => {});

      // Also forward to window.gtag / window.plausible if ever added via Netlify Snippet Injection
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventSlug.replace(/-/g, '_'), params);
      }
      if (typeof window.plausible === 'function') {
        window.plausible(eventSlug, { props: params });
      }
    } catch (_) {
      // Ignore tracking errors
    }
  }

  // Pre-fill Booking Form when clicking track or pricing buttons
  const sessionTypeSelect = document.getElementById('sessionType');
  const trainingGoalSelect = document.getElementById('trainingGoal');

  document.querySelectorAll('.select-goal-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const goal = btn.getAttribute('data-goal');
      if (goal && trainingGoalSelect) {
        trainingGoalSelect.value = goal;
      }
      trackEvent('select-track', { track: goal || 'unknown' });
    });
  });

  document.querySelectorAll('.select-plan-btn, [data-plan]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const plan = btn.getAttribute('data-plan');
      if (plan && sessionTypeSelect) {
        if (plan === 'intro') {
          sessionTypeSelect.value = 'Intro Session ($25)';
        } else {
          sessionTypeSelect.value = plan;
        }
      }
      trackEvent('select-plan', { plan: plan || 'intro' });
    });
  });

  // Track phone call and email link clicks
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('click-phone', { number: '9493066039' });
    });
  });

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('click-email', { email: 'arronmccrory@gmail.com' });
    });
  });

  // Booking Form Submission (with Netlify Forms AJAX support)
  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccess = document.getElementById('bookingSuccess');
  const successSummary = document.getElementById('successSummary');
  const resetFormBtn = document.getElementById('resetFormBtn');

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }

      const name = document.getElementById('clientName').value.trim();
      const sessionType = sessionTypeSelect ? sessionTypeSelect.value : 'Intro Session ($25)';
      const goal = trainingGoalSelect ? trainingGoalSelect.value : 'Fitness & Weight Loss';

      try {
        const formData = new FormData(bookingForm);
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString(),
        });
        trackEvent('booking-submitted', { session: sessionType, goal });
      } catch (err) {
        // Fallback gracefully if viewed locally or outside Netlify
        console.warn('Form submission notice:', err);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }

      if (successSummary) {
        successSummary.textContent = `Thanks, ${name}! Your request for the ${sessionType} focused on "${goal}" has been received. Get ready to burn 800+ calories an hour—I'll reach out shortly to confirm your time slot.`;
      }

      bookingForm.hidden = true;
      if (bookingSuccess) {
        bookingSuccess.hidden = false;
      }
    });
  }

  if (resetFormBtn && bookingForm && bookingSuccess) {
    resetFormBtn.addEventListener('click', () => {
      bookingForm.reset();
      bookingSuccess.hidden = true;
      bookingForm.hidden = false;
    });
  }
});
