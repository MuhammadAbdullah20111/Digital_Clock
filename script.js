function updateClock() {
    const now = new Date();
    
    // Get time components
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    // Get date components
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    
    // Update DOM
    document.querySelector('.hours').textContent = hours;
    document.querySelector('.minutes').textContent = minutes;
    document.querySelector('.seconds').textContent = seconds;
    document.getElementById('date').textContent = dateString;
}

// Update immediately and then every second
updateClock();
setInterval(updateClock, 1000);

// Responsive interaction handler
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

    const xAxis = (window.innerWidth / 2 - clientX) / 30;
    const yAxis = (window.innerHeight / 2 - clientY) / 30;
    
    clock.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
}

// Add event listeners for both mouse and touch
document.addEventListener('mousemove', handleInteraction);
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleInteraction(e);
}, { passive: false });

// Window resize handler
function handleResize() {
    const clock = document.querySelector('.clock');
    clock.style.transform = 'rotateY(0deg) rotateX(0deg)';
}

window.addEventListener('resize', handleResize);