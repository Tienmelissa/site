// ===================================
// VARIABLES GLOBALES
// ===================================
let currentImageIndex = 0;
let galleryImages = [];
let lastScrollY = 0;
let ticking = false;

// ===================================
// INITIALISATION
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    // Initialiser le formulaire de réservation après le chargement du DOM
    handleReservationForm();
});

function initializeApp() {
    // Écran de chargement
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);

    // Initialisation des fonctionnalités
    initNavigation();
    initScrollEffects();
    initGallery();
    initAnimations();
    initParticles();
    initBackToTop();
    initSmoothScroll();
    
    // Mise à jour de la barre de progression au scroll
    updateScrollProgress();
}

// ===================================
// RETOUR EN HAUT
// ===================================
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: var(--white);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
    `;

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Ajouter le bouton à la page
    document.body.appendChild(backToTopBtn);

    // Gérer l'apparition/disparition du bouton
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        backToTopBtn.style.opacity = scrollPosition > 300 ? '1' : '0';
        backToTopBtn.style.transform = scrollPosition > 300 ? 'translateY(0)' : 'translateY(20px)';
    });
}

// ===================================
// SCROLL FLUIDE
// ===================================
function initSmoothScroll() {
    // Sélectionner tous les liens de navigation
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Trouver la section cible
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Fermer le menu mobile si nécessaire
                const navMenu = document.getElementById('navMenu');
                const navToggle = document.getElementById('navToggle');
                if (navMenu && navToggle) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
                
                // Scroller vers la section cible
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Ajouter un écouteur d'événement pour le scroll
    window.addEventListener('scroll', () => {
        // Ajouter la classe 'active' aux liens de navigation en fonction de la section visible
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===================================
// ÉCRAN DE CHARGEMENT
// ===================================
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ===================================
// NAVIGATION
// ===================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu mobile
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Fermer le menu au clic sur un lien (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Navbar au scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleNavbarScroll(navbar, lastScrollTop);
                lastScrollTop = window.pageYOffset;
                ticking = false;
            });
            ticking = true;
        }
    });
}

function handleNavbarScroll(navbar, lastScrollTop) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Ajouter classe scrolled
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Masquer/afficher la navbar
    if (scrollTop > lastScrollTop && scrollTop > 200) {
        navbar.classList.add('hidden');
    } else {
        navbar.classList.remove('hidden');
    }
}

// ===================================
// EFFETS DE SCROLL
// ===================================
function initScrollEffects() {
    // Observer pour les animations au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animation spéciale pour la timeline
                if (entry.target.classList.contains('timeline-item')) {
                    animateTimelineItem(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observer tous les éléments avec fade-in
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Observer les éléments de timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // Barre de progression du scroll
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollProgress);
            ticking = true;
        }
    });
}

function updateScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }
    ticking = false;
}

function animateTimelineItem(item) {
    const dot = item.querySelector('.timeline-dot');
    const content = item.querySelector('.timeline-content');
    
    if (dot) {
        setTimeout(() => {
            dot.classList.add('active');
        }, 200);
    }
    
    if (content) {
        setTimeout(() => {
            content.style.transform = 'translateY(0)';
            content.style.opacity = '1';
        }, 400);
    }
}

// ===================================
// GALERIE ET LIGHTBOX
// ===================================
function initGallery() {
    // Vérifier si la galerie existe
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    // Vérifier si le lightbox existe
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) {
        console.error('Le lightbox est manquant dans le DOM');
        return;
    }

    // Vérifier et récupérer les éléments du lightbox
    const elements = {
        image: lightbox.querySelector('.lightbox-image'),
        close: lightbox.querySelector('.lightbox-close'),
        prev: lightbox.querySelector('.lightbox-prev'),
        next: lightbox.querySelector('.lightbox-next')
    };

    // Vérifier que tous les éléments sont présents
    if (!elements.image || !elements.close || !elements.prev || !elements.next) {
        console.error('Éléments du lightbox manquants');
        return;
    }

    // Initialiser la galerie d'images
    const galleryItems = document.querySelectorAll('.hotel-card img');
    if (galleryItems.length === 0) {
        console.error('Aucune image trouvée dans la galerie');
        return;
    }

    // Créer un tableau des images
    const galleryImages = Array.from(galleryItems).map(img => ({
        src: img.src,
        alt: img.alt
    }));

    let currentImageIndex = 0;

    // Ajouter les écouteurs d'événements
    elements.close.addEventListener('click', closeLightbox);
    elements.prev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage(elements.image);
    });
    elements.next.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage(elements.image);
    });

    // Navigation clavier
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    elements.prev.click();
                    break;
                case 'ArrowRight':
                    elements.next.click();
                    break;
            }
        }
    });

    // Ajouter les écouteurs de clic sur les images
    galleryItems.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox(lightbox, elements.image);
        });
    });
}

function openLightbox(lightbox, image) {
    updateLightboxImage(image);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxImage(image) {
    if (galleryImages[currentImageIndex]) {
        image.src = galleryImages[currentImageIndex].src;
        image.alt = galleryImages[currentImageIndex].alt;
    }
}

// ===================================
// ANIMATIONS SPÉCIALES
// ===================================
function initAnimations() {
    // Animation du compteur dans les stats
    animateCounters();
    
    // Animation des éléments au hover
    initHoverEffects();
    
    // Animation de typing pour le titre (optionnel)
    initTypingAnimation();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        counter.textContent = Math.floor(current);
                    }, 20);
                    observer.unobserve(counter);
                }
            });
        });
        
        observer.observe(counter);
    });
}

function initHoverEffects() {
    // Effet parallax sur l'image hero
    const heroImage = document.getElementById('heroImage');
    if (heroImage) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const deltaX = (clientX - centerX) / centerX;
            const deltaY = (clientY - centerY) / centerY;
            
            heroImage.style.transform = `translate(${deltaX * 10}px, ${deltaY * 10}px) scale(1.05)`;
        });
    }

    // Effet de tilt sur les cartes
    const cards = document.querySelectorAll('.floating-card, .timeline-content');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.style.transition = 'transform 0.1s ease';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.5s ease';
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

function initTypingAnimation() {
    const titleElement = document.querySelector('.hero-title .title-line.highlight');
    if (titleElement) {
        const text = titleElement.textContent;
        titleElement.textContent = '';
        titleElement.style.borderRight = '2px solid var(--primary-light)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                titleElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    titleElement.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        setTimeout(typeWriter, 1500);
    }
}

// ===================================
// PARTICULES ANIMÉES
// ===================================
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 50;
    const particles = [];

    // Créer les particules
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(212, 175, 55, 0.3);
            border-radius: 50%;
            pointer-events: none;
        `;
        
        particlesContainer.appendChild(particle);
        
        particles.push({
            element: particle,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: Math.random() * 100
        });
    }

    // Animer les particules
    function animateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life += 0.5;

            // Rebond sur les bords
            if (particle.x <= 0 || particle.x >= window.innerWidth) {
                particle.vx *= -1;
            }
            if (particle.y <= 0 || particle.y >= window.innerHeight) {
                particle.vy *= -1;
            }

            // Réinitialiser si hors limites
            if (particle.x < 0) particle.x = 0;
            if (particle.x > window.innerWidth) particle.x = window.innerWidth;
            if (particle.y < 0) particle.y = 0;
            if (particle.y > window.innerHeight) particle.y = window.innerHeight;

            // Effet de pulsation
            const scale = 0.5 + Math.sin(particle.life * 0.1) * 0.5;
            const opacity = 0.3 + Math.sin(particle.life * 0.1) * 0.2;
            
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px) scale(${scale})`;
            particle.element.style.opacity = opacity;
        });

        requestAnimationFrame(animateParticles);
    }

    // Initialiser les particules
    animateParticles();
}

// ===================================
// FORMULAIRE DE RÉSERVATION
// ===================================
// ===============================
// MODAL DE CONFIRMATION STYLÉE
// ===============================

// Création du modal de confirmation
function createReservationModal() {
    // Vérifier si le modal existe déjà
    if (document.getElementById('reservationModal')) {
        return;
    }

    const modalHTML = `
        <div id="reservationModal" class="reservation-modal">
            <div class="modal-overlay"></div>
            <div class="modal-container">
                <div class="modal-content">
                    <div class="success-animation">
                        <div class="checkmark-circle">
                            <div class="checkmark"></div>
                        </div>
                    </div>
                    <h2 class="modal-title">Réservation Confirmée !</h2>
                    <p class="modal-message">
                        Votre demande de réservation a été envoyée avec succès. 
                        Vous recevrez une confirmation par téléphone dans les plus brefs délais.
                    </p>
                    <div class="modal-details" id="modalDetails">
                        <!-- Les détails seront insérés ici -->
                    </div>
                    <div class="modal-actions">
                        <button class="modal-btn primary" onclick="closeReservationModal()">
                            <i class="fas fa-check"></i>
                            Parfait !
                        </button>
                        <button class="modal-btn secondary" onclick="makeNewReservation()">
                            <i class="fas fa-plus"></i>
                            Nouvelle réservation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Ajouter le HTML au body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Ajouter les styles CSS
    addModalStyles();
}

// Ajouter les styles CSS pour le modal
function addModalStyles() {
    // Vérifier si les styles existent déjà
    if (document.getElementById('modalStyles')) {
        return;
    }

    const styles = `
        <style id="modalStyles">
            .reservation-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .reservation-modal.show {
                opacity: 1;
                visibility: visible;
            }

            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }

            .modal-container {
                position: relative;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.7) translateY(50px);
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .reservation-modal.show .modal-container {
                transform: scale(1) translateY(0);
            }

            .modal-content {
                background: linear-gradient(145deg, #ffffff, #f8f9fa);
                border-radius: 25px;
                padding: 40px 30px;
                text-align: center;
                box-shadow: 
                    0 25px 80px rgba(0, 0, 0, 0.15),
                    0 0 0 1px rgba(212, 175, 55, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.6);
                position: relative;
                overflow: hidden;
            }

            .modal-content::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #d4af37, #f4e4a6, #d4af37);
                background-size: 200% 100%;
                animation: shimmer 2s ease-in-out infinite;
            }

            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }

            .success-animation {
                margin-bottom: 25px;
            }

            .checkmark-circle {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: linear-gradient(135deg, #28a745, #20c997);
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                box-shadow: 
                    0 10px 30px rgba(40, 167, 69, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }

            .checkmark-circle::after {
                content: '';
                position: absolute;
                width: 120px;
                height: 120px;
                border: 3px solid rgba(40, 167, 69, 0.2);
                border-radius: 50%;
                animation: pulse 2s ease-in-out infinite;
            }

            @keyframes bounceIn {
                0% {
                    transform: scale(0);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.1);
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                    opacity: 0.5;
                }
                50% {
                    transform: scale(1.1);
                    opacity: 0.8;
                }
            }

            .checkmark {
                width: 35px;
                height: 35px;
                position: relative;
            }

            .checkmark::after {
                content: '';
                position: absolute;
                left: 12px;
                top: 6px;
                width: 8px;
                height: 16px;
                border: solid white;
                border-width: 0 3px 3px 0;
                transform: rotate(45deg);
                animation: checkmarkDraw 0.3s ease-in-out 0.3s both;
            }

            @keyframes checkmarkDraw {
                0% {
                    height: 0;
                    opacity: 0;
                }
                100% {
                    height: 16px;
                    opacity: 1;
                }
            }

            .modal-title {
                font-family: 'Playfair Display', serif;
                font-size: 2rem;
                font-weight: 700;
                color: #28a745;
                margin-bottom: 15px;
                animation: slideInUp 0.5s ease 0.2s both;
            }

            .modal-message {
                font-size: 1.1rem;
                color: #6c757d;
                line-height: 1.6;
                margin-bottom: 25px;
                animation: slideInUp 0.5s ease 0.3s both;
            }

            .modal-details {
                background: linear-gradient(135deg, rgba(212, 175, 55, 0.05), rgba(212, 175, 55, 0.02));
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 30px;
                border-left: 4px solid #d4af37;
                animation: slideInUp 0.5s ease 0.4s both;
            }

            .detail-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid rgba(212, 175, 55, 0.1);
            }

            .detail-item:last-child {
                border-bottom: none;
            }

            .detail-label {
                font-weight: 600;
                color: #495057;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .detail-value {
                font-weight: 700;
                color: #d4af37;
            }

            .modal-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
                animation: slideInUp 0.5s ease 0.5s both;
            }

            .modal-btn {
                padding: 15px 25px;
                border-radius: 50px;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                border: none;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                position: relative;
                overflow: hidden;
            }

            .modal-btn::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.5s ease;
            }

            .modal-btn:hover::before {
                width: 300px;
                height: 300px;
            }

            .modal-btn.primary {
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
            }

            .modal-btn.primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
            }

            .modal-btn.secondary {
                background: linear-gradient(135deg, #d4af37, #f4e4a6);
                color: #495057;
                box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
            }

            .modal-btn.secondary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
            }

            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Responsive */
            @media (max-width: 768px) {
                .modal-content {
                    padding: 30px 20px;
                }
                
                .modal-actions {
                    flex-direction: column;
                }
                
                .modal-btn {
                    width: 100%;
                    justify-content: center;
                }
                
                .modal-title {
                    font-size: 1.5rem;
                }
                
                .checkmark-circle {
                    width: 80px;
                    height: 80px;
                }
            }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
}

// Afficher le modal avec les détails de la réservation
function showReservationModal(reservationData = {}) {
    createReservationModal();
    
    const modal = document.getElementById('reservationModal');
    const detailsContainer = document.getElementById('modalDetails');
    
    // Construire les détails de la réservation
    const details = [
        {
            icon: 'fas fa-building',
            label: 'Hôtel',
            value: reservationData.hotel || 'Non spécifié'
        },
        {
            icon: 'fas fa-user',
            label: 'Client',
            value: `${reservationData.nom || ''} ${reservationData.prenom || ''}`.trim() || 'Non spécifié'
        },
        {
            icon: 'fas fa-calendar-alt',
            label: 'Période',
            value: reservationData.date_arrivee && reservationData.date_sortie 
                ? `${formatDate(reservationData.date_arrivee)} - ${formatDate(reservationData.date_sortie)}`
                : 'Non spécifiée'
        },
        {
            icon: 'fas fa-users',
            label: 'Personnes',
            value: reservationData.nombre_personnes || 'Non spécifié'
        },
        {
            icon: 'fas fa-credit-card',
            label: 'Paiement',
            value: getPaymentMethodText(reservationData.mode_paiement) || 'Non spécifié'
        }
    ];
    
    detailsContainer.innerHTML = details.map(detail => `
        <div class="detail-item">
            <div class="detail-label">
                <i class="${detail.icon}"></i>
                ${detail.label}
            </div>
            <div class="detail-value">${detail.value}</div>
        </div>
    `).join('');
    
    // Afficher le modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
    
    // Bloquer le défilement de la page
    document.body.style.overflow = 'hidden';
}

// Fermer le modal
function closeReservationModal() {
    const modal = document.getElementById('reservationModal');
    
    if (modal) {
        modal.classList.remove('show');
        
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 400);
    }
}

// Nouvelle réservation
function makeNewReservation() {
    closeReservationModal();
    
    // Réinitialiser le formulaire
    const form = document.getElementById('reservationForm');
    if (form) {
        form.reset();
        
        // Animation pour attirer l'attention sur le formulaire
        const reservationForm = document.querySelector('.reservation-form');
        if (reservationForm) {
            reservationForm.style.transform = 'scale(1.02)';
            reservationForm.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.3)';
            
            setTimeout(() => {
                reservationForm.style.transform = '';
                reservationForm.style.boxShadow = '';
            }, 600);
        }
    }
}

// Utilitaires
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function getPaymentMethodText(method) {
    const methods = {
        'carte': 'Carte bancaire',
        'mobile': 'Mobile Money',
        'espece': 'Espèces à l\'hôtel'
    };
    return methods[method] || method;
}

// ===============================
// INTÉGRATION AVEC LE FORMULAIRE
// ===============================

// Modifier votre fonction de soumission du formulaire existante
function handleReservationForm() {
    const form = document.getElementById('reservationForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les données du formulaire
            const formData = new FormData(form);
            const reservationData = {
                hotel: document.getElementById('hotel').options[document.getElementById('hotel').selectedIndex]?.text || '',
                nom: formData.get('nom'),
                prenom: formData.get('prenom'),
                telephone: formData.get('telephone'),
                date_arrivee: formData.get('date_arrivee'),
                date_sortie: formData.get('date_sortie'),
                nombre_personnes: formData.get('nombre_personnes'),
                mode_paiement: formData.get('mode_paiement')
            };
            
            // Simuler l'envoi (remplacez par votre logique d'envoi réelle)
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            }
            
            // Simuler un délai d'envoi
            setTimeout(() => {
                // Réinitialiser le bouton
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer la réservation';
                }
                
                // Afficher le modal de confirmation
                showReservationModal(reservationData);
            }, 2000);
        });
    }
}

// Fermer le modal en cliquant sur l'overlay
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        closeReservationModal();
    }
});

// Fermer le modal avec la touche Echap
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeReservationModal();
    }
});
                
// Initialiser les logos rotatifs
const logos = document.querySelectorAll('.nav-logo img, .footer-logo img');
logos.forEach(logo => {
    logo.classList.add('rotating-logo');
});

// Initialiser les particules
initParticles();