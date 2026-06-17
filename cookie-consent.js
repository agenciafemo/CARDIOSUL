export const initCookieConsent = () => {
  const banner = document.getElementById('cookie-banner');
  const closeBtn = document.getElementById('cookie-close');
  const rejectBtn = document.getElementById('cookie-reject');
  const acceptSelectedBtn = document.getElementById('cookie-accept-selected');
  const acceptAllBtn = document.getElementById('cookie-accept-all');

  // Carregar preferências salvas
  const savedConsent = localStorage.getItem('cookieConsent');
  if (savedConsent) {
    banner.classList.add('hidden');
    return;
  }

  // FECHAR BANNER (função reutilizável)
  const closeBanner = () => {
    banner.classList.add('hidden');
  };

  // Botão X fechar
  closeBtn.addEventListener('click', closeBanner);

  // Rejeitar tudo
  rejectBtn.addEventListener('click', () => {
    const consent = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    closeBanner();
  });

  // Aceitar selecionados
  acceptSelectedBtn.addEventListener('click', () => {
    const analytics = document.querySelector('input[name="cookies-analytics"]').checked;
    const marketing = document.querySelector('input[name="cookies-marketing"]').checked;

    const consent = {
      essential: true,
      analytics: analytics,
      marketing: marketing,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    closeBanner();
  });

  // Aceitar tudo
  acceptAllBtn.addEventListener('click', () => {
    const consent = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    closeBanner();
  });

  // Fechar com Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !banner.classList.contains('hidden')) {
      closeBanner();
    }
  });
};

function saveConsent(consent) {
  localStorage.setItem('cookieConsent', JSON.stringify(consent));
  applyConsent(consent);
}

function applyConsent(consent) {
  if (consent.analytics) {
    // Inicializar Google Analytics ou equivalente
    console.log('Analytics enabled');
  }
  if (consent.marketing) {
    // Inicializar scripts de marketing
    console.log('Marketing enabled');
  }
}