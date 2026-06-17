/**
 * FAQ Module
 * Alterna aria-expanded quando pergunta é clicada
 * CSS handle a animação
 */

export const initFAQ = () => {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  if (!faqQuestions.length) return; // Guard clause
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const isOpen = question.getAttribute('aria-expanded') === 'true';
      
      // Toggle state
      question.setAttribute('aria-expanded', !isOpen);
      
      // Toggle class para CSS (opcional, aria-expanded é suficiente)
      faqItem.classList.toggle('active');
    });
    
    // Keyboard accessibility (Enter/Space)
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
};