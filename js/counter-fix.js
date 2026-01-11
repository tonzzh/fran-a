
document.addEventListener("DOMContentLoaded", function () {
    // --- Logic 1: Number Counter (Restored) ---
    // Handles the animation of numbers (e.g., "7,000,000+") using data attributes.
    const counters = document.querySelectorAll('.elementor-counter-number');

    if (counters.length) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const duration = parseInt(counter.getAttribute('data-duration') || 2000);
                    const startValue = parseFloat(counter.getAttribute('data-from-value') || 0);
                    const endValue = parseFloat(counter.getAttribute('data-to-value') || 0);
                    const delimiter = counter.getAttribute('data-delimiter') || '.';

                    let startTime = null;

                    function step(timestamp) {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min((timestamp - startTime) / duration, 1);
                        const currentValue = Math.floor(progress * (endValue - startValue) + startValue);

                        counter.innerText = currentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);

                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            counter.innerText = endValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
                        }
                    }

                    window.requestAnimationFrame(step);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    // --- Logic 2: Evergreen Countdown Timer (New) ---
    // Handles the countdown timer for offers, resetting every X seconds (Evergreen).
    const countdownWrappers = document.querySelectorAll('.elementor-countdown-wrapper');

    if (countdownWrappers.length) {
        countdownWrappers.forEach(wrapper => {
            const interval = parseInt(wrapper.getAttribute('data-evergreen-interval')) || 7200; // Default 2 hours
            const localStorageKey = 'elementor_evergreen_timer_' + interval;

            // Find child elements
            const daysEl = wrapper.querySelector('.elementor-countdown-days');
            const hoursEl = wrapper.querySelector('.elementor-countdown-hours');
            const minutesEl = wrapper.querySelector('.elementor-countdown-minutes');
            const secondsEl = wrapper.querySelector('.elementor-countdown-seconds');

            function getTargetTime() {
                let targetTime = localStorage.getItem(localStorageKey);

                // If no time stored or time passed, set new time
                if (!targetTime || new Date(targetTime).getTime() <= Date.now()) {
                    const now = new Date();
                    // Add interval in seconds
                    targetTime = new Date(now.getTime() + interval * 1000);
                    localStorage.setItem(localStorageKey, targetTime);
                } else {
                    targetTime = new Date(targetTime);
                }

                return targetTime;
            }

            let targetTime = getTargetTime();

            function updateTimer() {
                const now = Date.now();
                let distance = targetTime.getTime() - now;

                // If timer finished, reset it (Evergreen behavior)
                if (distance < 0) {
                    targetTime = getTargetTime();
                    distance = targetTime.getTime() - now;
                    // Double check to prevent negative flash if logic is tight
                    if (distance < 0) {
                        // Force a reset if it's still negative (shouldn't happen with getTargetTime logic but safe fallback)
                        const nowFresh = new Date();
                        targetTime = new Date(nowFresh.getTime() + interval * 1000);
                        localStorage.setItem(localStorageKey, targetTime);
                        distance = targetTime.getTime() - nowFresh.getTime();
                    }
                }

                // Calculations
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Update DOM
                if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
                if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
                if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
                if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
            }

            // Initial call
            updateTimer();
            // Update every second
            setInterval(updateTimer, 1000);
        });
    }
});
