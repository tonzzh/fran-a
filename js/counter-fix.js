document.addEventListener("DOMContentLoaded", function () {
    const counters = document.querySelectorAll('.elementor-counter-number');

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
});
