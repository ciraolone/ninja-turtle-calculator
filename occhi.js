document.addEventListener('DOMContentLoaded', () => {
    function muoviPupille(event) {
        const occhi = document.querySelectorAll('.occhio');
        occhi.forEach(occhio => {
            const pupilla = occhio.querySelector('.pupilla');
            const rect = occhio.getBoundingClientRect();
            const pupillaRect = pupilla.getBoundingClientRect();

            const occhioCenter = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
            
            // Calcola la distanza massima che la pupilla può muoversi
            const maxDistanceX = (rect.width - pupillaRect.width) / 2;
            const maxDistanceY = (rect.height - pupillaRect.height) / 2;
            
            // Calcola la posizione relativa del mouse rispetto al centro dell'occhio
            let moveX = (event.clientX - occhioCenter.x) / (rect.width / 4);
            let moveY = (event.clientY - occhioCenter.y) / (rect.height / 4);
            
            // Limita il movimento della pupilla
            moveX = Math.max(-1, Math.min(1, moveX));
            moveY = Math.max(-1, Math.min(1, moveY));
            
            // Applica una funzione di smorzamento per rendere il movimento più fluido
            moveX = Math.sign(moveX) * Math.pow(Math.abs(moveX), 0.5);
            moveY = Math.sign(moveY) * Math.pow(Math.abs(moveY), 0.5);
            
            // Applica il movimento
            pupilla.style.transform = `translate(-50%, -50%) translate(${moveX * maxDistanceX}px, ${moveY * maxDistanceY}px)`;
        });
    }

    document.addEventListener('mousemove', muoviPupille);
});
