// Ajoute la classe rotating-logo à tous les logos
const logos = document.querySelectorAll('.nav-logo img, .footer-logo img');
logos.forEach(logo => {
    logo.classList.add('rotating-logo');
});
