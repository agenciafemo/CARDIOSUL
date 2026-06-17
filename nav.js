/**
 * Navigation Module
 * Menu mobile toggle + smooth scroll
 */

export const initNav = () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-item, .btn-nav-whatsapp');
  const header = document.getElementById('main-header');
  
  if (!hamburger) return;
  
  // Toggle menu mobile
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    
    if (isOpen) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
      hamburger.setAttribute('aria-expanded', 'true');
    } else {
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-times');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close menu ao clicar em link
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = hamburger.querySelector('i');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-times');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
  
  // Add shadow ao scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Smooth scroll para âncoras
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
};