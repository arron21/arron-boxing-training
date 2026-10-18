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

  // Pre-fill Booking Form when clicking track or pricing buttons
  const sessionTypeSelect = document.getElementById('sessionType');
  const trainingGoalSelect = document.getElementById('trainingGoal');

  document.querySelectorAll('.select-goal-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const goal = btn.getAttribute('data-goal');
      if (goal && trainingGoalSelect) {
        trainingGoalSelect.value = goal;
      }
    });
  });

  document.querySelectorAll('.select-plan-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const plan = btn.getAttribute('data-plan');
      if (plan && sessionTypeSelect) {
        sessionTypeSelect.value = plan;
      }
    });
  });

  // Booking Form Submission
  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccess = document.getElementById('bookingSuccess');
  const successSummary = document.getElementById('successSummary');
  const resetFormBtn = document.getElementById('resetFormBtn');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const sessionType = sessionTypeSelect ? sessionTypeSelect.value : 'Intro Session ($25)';
      const goal = trainingGoalSelect ? trainingGoalSelect.value : 'Fitness & Weight Loss';

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
