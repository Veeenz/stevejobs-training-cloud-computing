// Script principale per l'applicazione Docker Workshop

document.addEventListener('DOMContentLoaded', function() {
    // Evidenzia la voce di menu attiva
    highlightActiveMenuItem();
    
    // Aggiunge animazioni alle card
    animateCards();
    
    // Inizializza tooltip di Bootstrap se esistono
    initializeTooltips();
    
    console.log('Docker Workshop - Applicazione inizializzata con successo');
});

// Funzione per evidenziare la voce di menu attiva
function highlightActiveMenuItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath === href || 
            (href !== '/' && currentPath.startsWith(href))) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

// Funzione per aggiungere animazioni alle card
function animateCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
        // Aggiunge un ritardo crescente all'animazione di ogni card
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Funzione per inizializzare i tooltip di Bootstrap
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    if (tooltipTriggerList.length > 0) {
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Aggiunge una funzione per controllare lo stato del server
function checkServerStatus() {
    fetch('/health-check')
        .then(response => {
            const statusBadge = document.getElementById('server-status');
            if (statusBadge) {
                if (response.ok) {
                    statusBadge.className = 'badge bg-success';
                    statusBadge.textContent = 'Online';
                } else {
                    statusBadge.className = 'badge bg-danger';
                    statusBadge.textContent = 'Offline';
                }
            }
        })
        .catch(() => {
            const statusBadge = document.getElementById('server-status');
            if (statusBadge) {
                statusBadge.className = 'badge bg-danger';
                statusBadge.textContent = 'Offline';
            }
        });
}

// Controlla lo stato del server ogni 30 secondi se l'elemento esiste
if (document.getElementById('server-status')) {
    checkServerStatus();
    setInterval(checkServerStatus, 30000);
} 