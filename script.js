/* =========================================
   3D Digital Clock — Script
   ========================================= */

// --- Particle System ---
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() > 0.5 ? 187 : 261; // cyan or purple
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulse += this.pulseSpeed;
            this.currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.pulse));

            if (this.x < -10 || this.x > canvas.width + 10 ||
                this.y < -10 || this.y > canvas.height + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.currentOpacity})`;
            ctx.fill();

            // Glow effect
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.currentOpacity * 0.15})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const lineOpacity = (1 - dist / 120) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 229, 255, ${lineOpacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }
    animate();
}

// --- Greeting Based on Time of Day ---
function getGreeting(hour) {
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
}

// --- Seconds Progress Ring ---
function updateProgressRing(seconds) {
    const ring = document.getElementById('seconds-ring');
    if (!ring) return;
    const circumference = 2 * Math.PI * 54; // r=54
    const offset = circumference - (seconds / 60) * circumference;
    ring.style.strokeDashoffset = offset;
}

// --- Clock Update ---
function updateClock() {
    const now = new Date();

    // Get time components (12-hour)
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds();

    // Get date components
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);

    // Update DOM
    document.getElementById('hours-display').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes-display').textContent = minutes;
    document.getElementById('seconds-display').textContent = seconds.toString().padStart(2, '0');
    document.getElementById('ampm').textContent = ampm;
    document.getElementById('date').textContent = dateString;
    document.getElementById('greeting').textContent = getGreeting(now.getHours());

    // Update progress ring
    updateProgressRing(seconds);
}

// --- 3D Tilt Effect ---
function handleInteraction(e) {
    const clock = document.querySelector('.clock');
    let clientX, clientY;

    if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const rect = clock.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const xAxis = ((centerX - clientX) / rect.width) * 12;
    const yAxis = ((centerY - clientY) / rect.height) * 12;

    clock.style.transform = `rotateY(${xAxis}deg) rotateX(${-yAxis}deg)`;
}

function resetTilt() {
    const clock = document.querySelector('.clock');
    clock.style.transform = 'rotateY(0deg) rotateX(0deg)';
}

// --- Event Listeners ---
document.addEventListener('mousemove', handleInteraction);
document.addEventListener('mouseleave', resetTilt);
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleInteraction(e);
}, { passive: false });

window.addEventListener('resize', resetTilt);

// --- Initialize ---
initParticles();
updateClock();
setInterval(updateClock, 1000);