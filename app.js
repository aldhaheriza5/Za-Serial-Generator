// ANTIGRAVITY COMMAND CENTER (GEN 2) - INTERACTIVE LAYER

document.addEventListener('DOMContentLoaded', () => {
    console.log("Antigravity Command Center Init...");

    // 1. REAL-TIME CLOCK
    const clockElement = document.getElementById('realtime-clock');
    
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    setInterval(updateClock, 1000);
    updateClock();

    // 2. CARD INTERACTION HOOKS (Optional enhancement)
    const cards = document.querySelectorAll('.bento-card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.card-title').textContent;
            console.log(`Navigating to: ${title}`);
            // Logic for navigation is partly handled by inline HTML onclick, 
            // but we can add global tracking or effects here.
        });
    });

    // 3. FADE-IN ANIMATION FOR GRID
    const bentoContainer = document.querySelector('.bento-container');
    bentoContainer.style.opacity = '0';
    bentoContainer.style.transform = 'translateY(20px)';
    bentoContainer.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

    setTimeout(() => {
        bentoContainer.style.opacity = '1';
        bentoContainer.style.transform = 'translateY(0)';
    }, 100);
});
