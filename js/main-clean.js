document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');

    // Countdown Timer logic
    // Countdown Timer Logic
    const initCountdown = (elementId, idSuffix = '') => {
        const countdownElement = document.getElementById(elementId);
        if (!countdownElement) return;

        let duration = 7200; // 2 hours in seconds

        // Unique storage key for each timer to avoid conflicts? 
        // Or sync them? Let's sync them for consistency.
        const savedTime = localStorage.getItem('offerCountdown');
        const savedTimestamp = localStorage.getItem('offerTimestamp');

        if (savedTime && savedTimestamp) {
            const elapsed = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000);
            duration = parseInt(savedTime) - elapsed;
        } else {
            localStorage.setItem('offerTimestamp', Date.now());
            localStorage.setItem('offerCountdown', duration);
        }

        if (duration < 0) duration = 7200;

        const updateTimer = () => {
            // Re-calculate based on current time to avoid drift if multiple timers run
            // OR just decrement shared state? 
            // Simplest: just decrement specific runner or re-read localstorage.
            // Better: Independent decrement visual, sync on load.
            // Simple decrement:
            if (duration <= 0) {
                duration = 7200; // Reset loop
                localStorage.setItem('offerTimestamp', Date.now());
            }
            duration--;

            // Sync back to storage occasionally or rely on timestamp?
            // Let's just calculate from timestamp usually, but here we decrement.

            const hours = Math.floor(duration / 3600);
            const minutes = Math.floor((duration % 3600) / 60);
            const seconds = duration % 60;

            const daysEl = document.getElementById('days' + idSuffix);
            const hoursEl = document.getElementById('hours' + idSuffix);
            const minutesEl = document.getElementById('minutes' + idSuffix);
            const secondsEl = document.getElementById('seconds' + idSuffix);

            if (daysEl) daysEl.innerText = '00';
            if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
            if (minutesEl) minutesEl.innerText = minutes.toString().padStart(2, '0');
            if (secondsEl) secondsEl.innerText = seconds.toString().padStart(2, '0');
        };

        setInterval(updateTimer, 1000);
        updateTimer();
    };

    // Initialize timers
    initCountdown('countdown-timer', ''); // Original if exists
    initCountdown('countdown-cta', '-1'); // New CTA section

    // Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/\./g, ''); // Remove existing dots

                // Lower inc to slow and higher to fast
                const inc = target / speed;

                if (count < target) {
                    // Start formatting with dots
                    counter.innerText = Math.ceil(count + inc).toLocaleString('de-DE');
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target.toLocaleString('de-DE');
                }
            };
            updateCount();
        });
    };

    // Trigger animation when section is in view
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target); // Run only once
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }
    // Dynamic Date for Top Bar (France Time Zone)
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const franceDate = new Date().toLocaleDateString('fr-FR', {
            timeZone: 'Europe/Paris',
            day: '2-digit',
            month: '2-digit'
        });
        dateElement.innerText = franceDate; // Formats as DD/MM automatically
    }
});
