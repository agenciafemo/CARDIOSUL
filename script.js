document.addEventListener("DOMContentLoaded", () => {
    // Seleciona todos os links com a classe js-scroll
    const scrollLinks = document.querySelectorAll('.js-scroll');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Previne o comportamento padrão apenas se for um link interno (âncora)
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                // Faz a rolagem suave até a seção de destino
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Acordeão do FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = question.nextElementSibling;
            
            // Alterna a classe ativa
            faqItem.classList.toggle('active');
            
            // Anima a altura máxima para mostrar/esconder a resposta de forma fluida
            if (faqItem.classList.contains('active')) {
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px";
                question.setAttribute('aria-expanded', 'true');
            } else {
                faqAnswer.style.maxHeight = null;
                question.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // --- ANIMAÇÃO DE CONTAGEM DE ESTATÍSTICAS ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const animateNumber = (element, target, duration = 2000) => {
        const suffix = element.getAttribute('data-suffix') || '';
        const prefix = element.textContent.startsWith('+') ? '+' : '';
        const easeOut = (t) => 1 - Math.pow(1 - t, 3); // cubic easeOut

        const startTime = performance.now();
        let isRunning = true;

        const animate = (currentTime) => {
            if (!isRunning) return;

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOut(progress);
            const currentValue = Math.floor(target * easedProgress);

            element.textContent = prefix + currentValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                isRunning = false;
            }
        };

        requestAnimationFrame(animate);
    };

    // Usar IntersectionObserver para ativar animação quando a seção entra na viewport
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statNumbers.forEach((element) => {
                    const target = parseInt(element.getAttribute('data-target'));
                    animateNumber(element, target, 2000);
                });
                observer.disconnect();
            }
        });
    }, observerOptions);

    // Observar a primeira stat-box para detectar quando a seção entra na viewport
    if (statNumbers.length > 0) {
        const statsBar = statNumbers[0].closest('.sobre-stats-bar');
        if (statsBar) {
            observer.observe(statsBar);
        }
    }

    // Navbar: Sombra ao rolar e Menu Mobile
    const header = document.getElementById('main-header');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-item, .btn-nav-whatsapp');

    // Adiciona sombra na navbar ao rolar a página
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Abre/fecha o menu mobile e altera o ícone
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Fecha o menu mobile ao clicar em qualquer link da navbar
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });


    // --- POPUP DE COOKIES ---
    const cookieBanner = document.getElementById('cookie-banner');
    const btnClose = document.getElementById('cookie-close');
    const btnReject = document.getElementById('cookie-reject');
    const btnAcceptSelected = document.getElementById('cookie-accept-selected');
    const btnAcceptAll = document.getElementById('cookie-accept-all');

    if (cookieBanner) {
        // 1. Verifica se já aceitou antes (garante que não apareça de novo)
        if (localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'none';
        }

        // 2. Função segura para fechar e remover da tela
        const closeBanner = () => {
            cookieBanner.classList.add('hidden'); // Faz a animação CSS
            setTimeout(() => { cookieBanner.style.display = 'none'; }, 300); // Remove o elemento físico
        };

        // 3. Função que salva a escolha e fecha
        const saveAndClose = (consentData) => {
            localStorage.setItem('cookieConsent', JSON.stringify(consentData));
            closeBanner();
        };

        // 4. Ações dos cliques
        if (btnClose) btnClose.addEventListener('click', closeBanner);
        
        if (btnReject) btnReject.addEventListener('click', () => {
            saveAndClose({ essential: true, analytics: false, marketing: false });
        });

        if (btnAcceptSelected) btnAcceptSelected.addEventListener('click', () => {
            const analytics = document.querySelector('input[name="cookies-analytics"]')?.checked || false;
            const marketing = document.querySelector('input[name="cookies-marketing"]')?.checked || false;
            saveAndClose({ essential: true, analytics, marketing });
        });

        if (btnAcceptAll) btnAcceptAll.addEventListener('click', () => {
            saveAndClose({ essential: true, analytics: true, marketing: true });
        });
    }

    // --- MODAL DE EXAMES ---
    const modalExame = document.getElementById('modal-exame');
    const modalClose = modalExame.querySelector('.modal-close');
    const modalOverlay = modalExame.querySelector('.modal-overlay');

    // Mapeamento de imagens para cada exame
    const imagemMap = {
        'eletrocardiograma': 'eletro.png',
        'ecocardiograma': 'ecocardi.jpg',
        'ecodoppler': 'eco.jpg',
        'holter': 'holte.jpg',
        'mapa': 'mapa.jpg',
        'ergometrico': 'teste.jpeg'
    };

    const examesDetalhes = {
        'eletrocardiograma': {
            titulo: 'Eletrocardiograma (ECG)',
            descricao: 'Registro da atividade elétrica do coração para identificar arritmias, sobrecargas, isquemia ou infarto, além de outras alterações cardiovasculares.',
            detalhes: '<div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Preparo:</strong> Nenhum preparo especial necessário. Chegue com roupas confortáveis que permitam acesso fácil ao tórax.</p></div><div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Duração:</strong> Aproximadamente 5 a 10 minutos.</p></div><div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Para quem é indicado:</strong> Pacientes com palpitações, falta de ar, dor torácica, desmaio, histórico de problemas cardíacos.</p></div>',
            whatsapp: 'https://wa.me/5548999122022?text=Olá! Gostaria de agendar um Eletrocardiograma (ECG) na SULCARDIO.'
        },
        'ecocardiograma': {
            titulo: 'Ecocardiograma',
            descricao: 'Exame de ultrassom do coração que fornece imagens detalhadas da estrutura e do funcionamento do órgão.',
            detalhes: '<div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Preparo:</strong> Jejum não é necessário. Chegue com roupas confortáveis que permitam acesso ao tórax.</p></div><div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Duração:</strong> Aproximadamente 20 a 30 minutos.</p></div><div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Para quem é indicado:</strong> Investigação de sopro cardíaco, doenças valvares, miocardiopatias, insuficiência cardíaca, acompanhamento de outras doenças do coração.</p></div>',
            whatsapp: 'https://wa.me/5548999122022?text=Olá! Gostaria de agendar um Ecocardiograma na SULCARDIO.'
        },
        'ecodoppler': {
            titulo: 'EcoDoppler de Carótidas',
            descricao: 'Avaliação das artérias do pescoço para diagnosticar placas de gordura e risco de doenças vasculares.',
            detalhes: '<div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Preparo:</strong> Nenhum preparo especial necessário.</p></div><div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Duração:</strong> Aproximadamente 20 minutos.</p></div><div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Para quem é indicado:</strong> Prevenção de acidentes vasculares cerebrais (AVC), avaliação de risco cardiovascular, investigação de síncope (desmaio).</p></div>',
            whatsapp: 'https://wa.me/5548999122022?text=Olá! Gostaria de agendar um EcoDoppler de Carótidas na SULCARDIO.'
        },
        'holter': {
            titulo: 'Holter de 24 horas',
            descricao: 'Monitoramento contínuo do ritmo cardíaco por 24 horas para detectar arritmias ocultas no dia a dia.',
            detalhes: '<div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Preparo:</strong> Use roupas confortáveis e fáceis de remover. O equipamento será afixado ao tórax.</p></div><div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Duração:</strong> Monitoramento contínuo por 24 horas. A colocação leva 10-15 minutos.</p></div><div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Para quem é indicado:</strong> Detecção de arritmias, síncopes inexplicadas ou tonturas.</p></div>',
            whatsapp: 'https://wa.me/5548999122022?text=Olá! Gostaria de agendar um Holter de 24 horas na SULCARDIO.'
        },
        'mapa': {
            titulo: 'Monitorização Ambulatorial da Pressão Arterial (MAPA)',
            descricao: 'Acompanhamento da pressão arterial durante 24 horas para um diagnóstico preciso de hipertensão.',
            detalhes: '<div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Preparo:</strong> Use roupas com manga folgada. Mantenha o braço relaxado durante as medições automáticas.</p></div><div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Duração:</strong> Monitoramento contínuo por 24 horas. A colocação leva 5-10 minutos.</p></div><div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Para quem é indicado:</strong> Diagnóstico de hipertensão, hipertensão do avental branco ou mascarada, avaliação de medicamentos anti-hipertensivos.</p></div>',
            whatsapp: 'https://wa.me/5548999122022?text=Olá! Gostaria de agendar um MAPA (Monitorização Ambulatorial da Pressão Arterial) na SULCARDIO.'
        },
        'ergometrico': {
            titulo: 'Teste Ergométrico',
            descricao: 'Avaliação do funcionamento cardiovascular durante o esforço físico em esteira.',
            detalhes: '<div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Preparo:</strong> Jejum de 2-3 horas. Use roupas confortáveis e tênis apropriado para exercício. Não aplicar cremes ou hidratantes na pele. Informar medicações de uso contínuo. Homens devem vir com o peito depilado.</p></div><div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Duração:</strong> Aproximadamente 30-40 minutos.</p></div><div class="modal-detail-item"><div class="modal-detail-icon"></div><p><strong>Para quem é indicado:</strong> Avaliação de isquemia miocárdica, tolerância ao exercício, arritmias induzidas pelo esforço, prescrição de programas de reabilitação cardíaca.</p></div>',
            whatsapp: 'https://wa.me/5548999122022?text=Olá! Gostaria de agendar um Teste Ergométrico na SULCARDIO.'
        }
    };

    // Função para abrir modal
    function abrirModal(exameKey) {
        const exame = examesDetalhes[exameKey];
        if (exame) {
            const modalHeader = document.querySelector('.modal-header');
            const bgImage = imagemMap[exameKey];

            // Aplicar imagem de fundo do header
            modalHeader.style.setProperty('--modal-bg-image', `url('${bgImage}')`);
            modalHeader.setAttribute('data-exame', exameKey);

            document.getElementById('modal-title').textContent = exame.titulo;
            document.getElementById('modal-description').textContent = exame.descricao;
            document.getElementById('modal-details').innerHTML = exame.detalhes;
            document.getElementById('modal-btn-whatsapp').href = exame.whatsapp;

            modalExame.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Função para fechar modal
    function fecharModal() {
        modalExame.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Event listeners dos botões "Saiba mais"
    document.querySelectorAll('.btn-saiba-mais').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.service-card');
            const titulo = card.querySelector('h3').textContent.trim();

            // Mapear título para chave do exame
            let exameKey = '';
            if (titulo.includes('Eletrocardiograma')) exameKey = 'eletrocardiograma';
            else if (titulo.includes('Ecocardiograma') && !titulo.includes('Doppler')) exameKey = 'ecocardiograma';
            else if (titulo.includes('Doppler')) exameKey = 'ecodoppler';
            else if (titulo.includes('Holter')) exameKey = 'holter';
            else if (titulo.includes('Monitorização') || titulo.includes('MAPA')) exameKey = 'mapa';
            else if (titulo.includes('Teste')) exameKey = 'ergometrico';

            if (exameKey) abrirModal(exameKey);
        });
    });

    // Fechar modal
    modalClose.addEventListener('click', fecharModal);
    modalOverlay.addEventListener('click', fecharModal);

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalExame.classList.contains('active')) {
            fecharModal();
        }
    });

    // --- MODAL DO CORPO CLÍNICO ---
    const modalMedico = document.getElementById('modal-medico');
    const modalMedicoClose = modalMedico.querySelector('.modal-close');
    const modalMedicoOverlay = modalMedico.querySelector('.modal-overlay');

    const medicosDetalhes = {
        'leandro': {
            foto: 'LEANDROMED.png',
            fotoPosicao: 'center 25%',
            badge: 'Cardiologista',
            nome: 'Dr. Leandro Vieira',
            especialidade: 'Médico Cardiologista',
            crm: 'CRM-SC 15408 · RQE 13319',
            bio: 'O Dr. Leandro acredita que, para além de exames e diagnósticos, a Medicina é construída sobre confiança e empatia. Com uma trajetória de mais de 20 anos, ele dedica sua carreira ao cuidado cardiovascular, unindo excelência técnica e um atendimento profundamente humanizado.',
            timeline: [
                { ano: '2004', texto: 'Graduação em Medicina — FURG, Rio Grande, RS' },
                { ano: '2007', texto: 'Residência em Clínica Médica — HU/FURG, Rio Grande, RS' },
                { ano: '2009', texto: 'Residência em Cardiologia — Santa Casa de Porto Alegre, RS' },
                { ano: '2009', texto: 'Título de Especialista em Cardiologia pela Sociedade Brasileira de Cardiologia' },
                { ano: '2010', texto: 'Especialização em Ecocardiografia — Santa Casa de Porto Alegre, RS' },
                { ano: '2010', texto: 'Fundação da Clínica SulCardio — Içara, SC' },
                { ano: '2015', texto: 'Título de Especialista em Ergometria pela Sociedade Brasileira de Cardiologia' }
            ],
            whatsapp: 'https://wa.me/5548999122022?text=Olá! Gostaria de agendar uma consulta com o Dr. Leandro Vieira.'
        },
        'matheus': {
            foto: 'Matheus.png',
            fotoPosicao: 'center 30%',
            badge: 'Cirurgião Cardíaco',
            nome: 'Dr. Matheus Heluany',
            especialidade: 'Cirurgião Cardíaco',
            crm: 'CRM-SC 20245 · RQE 20123',
            bio: '',
            timeline: [
                { ano: '2013', texto: 'Graduação em Medicina — UNESC, Criciúma, SC' },
                { ano: '2021', texto: 'Residência em Cirurgia Cardíaca — Instituto de Cardiologia do Rio Grande do Sul (IC/FUC), Porto Alegre, RS' },
                { ano: '2023', texto: 'Fellowship em Fibrilação Atrial — Itália' },
                { ano: '2024', texto: 'Pós-graduação em Cirurgia Minimamente Invasiva' },
                { ano: '2025', texto: 'Fellowship em Fibrilação Atrial — EUA' },
                { ano: 'Atual', texto: 'Professor universitário do curso de Medicina — UNESC, Criciúma, SC' }
            ],
            whatsapp: 'https://wa.me/5548999122022?text=Olá! Gostaria de agendar uma consulta com o Dr. Matheus Heluany.'
        },
        'mathias': {
            foto: 'Mathias.png',
            fotoPosicao: 'center 22%',
            badge: 'Cardiologista e Ecocardiografista',
            nome: 'Dr. Mathias Silvestre de Brida',
            especialidade: 'Cardiologista e Ecocardiografista',
            crm: 'CRM-SC 24672 · RQE 22128 / 25368',
            bio: '',
            timeline: [
                { ano: '2017', texto: 'Graduação em Medicina — UNESC, Criciúma, SC' },
                { ano: '2020', texto: 'Residência em Medicina Interna — Hospital Nossa Senhora da Conceição (GHC), Porto Alegre, RS' },
                { ano: '2022', texto: 'Residência em Cardiologia — Instituto de Cardiologia do Rio Grande do Sul (IC/FUC), Porto Alegre, RS' },
                { ano: '2022', texto: 'Título de Especialista em Cardiologia pela Sociedade Brasileira de Cardiologia' },
                { ano: '2024', texto: 'Residência em Ecocardiografia — Instituto de Cardiologia do Rio Grande do Sul (IC/FUC), Porto Alegre, RS' },
                { ano: '2024', texto: 'Título de Especialista em Ecocardiografia pela Sociedade Brasileira de Cardiologia' }
            ],
            whatsapp: 'https://wa.me/5548999122022?text=Olá! Gostaria de agendar uma consulta com o Dr. Mathias Silvestre de Brida.'
        }
    };

    function abrirModalMedico(medicoKey) {
        const medico = medicosDetalhes[medicoKey];
        if (!medico) return;

        const foto = document.getElementById('modal-medico-photo');
        foto.src = medico.foto;
        foto.alt = 'Foto do ' + medico.nome;
        foto.style.objectPosition = medico.fotoPosicao || 'center';

        document.getElementById('modal-medico-badge').textContent = medico.badge;
        document.getElementById('modal-medico-name').textContent = medico.nome;
        document.getElementById('modal-medico-specialty').textContent = medico.especialidade;
        document.getElementById('modal-medico-crm').textContent = medico.crm;

        const bioEl = document.getElementById('modal-medico-bio');
        bioEl.textContent = medico.bio;
        bioEl.style.display = medico.bio ? 'block' : 'none';

        const timelineEl = document.getElementById('modal-medico-timeline');
        timelineEl.innerHTML = medico.timeline.map(item =>
            `<div class="timeline-item"><span class="timeline-year">${item.ano}</span><span class="timeline-text">${item.texto}</span></div>`
        ).join('');

        document.getElementById('modal-medico-btn-whatsapp').href = medico.whatsapp;

        modalMedico.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function fecharModalMedico() {
        modalMedico.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    document.querySelectorAll('.btn-saiba-mais-team').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const medicoKey = btn.getAttribute('data-doctor');
            if (medicoKey) abrirModalMedico(medicoKey);
        });
    });

    modalMedicoClose.addEventListener('click', fecharModalMedico);
    modalMedicoOverlay.addEventListener('click', fecharModalMedico);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalMedico.classList.contains('active')) {
            fecharModalMedico();
        }
    });

    // --- PEEK CAROUSEL AUTOMÁTICO ---
    const carouselTrack = document.getElementById('carouselTrack');

    if (carouselTrack) {
        let currentIndex = 0;
        const imageWidth = 195;
        const gap = 12;
        const slideWidth = imageWidth + gap;
        let isResetting = false;

        // Inicializar sem transição para renderização correta
        carouselTrack.style.transition = 'none';
        carouselTrack.style.transform = 'translateX(0)';

        const moveCarousel = () => {
            if (isResetting) return;

            currentIndex++;

            // Aplicar transição suave apenas após primeira renderização
            carouselTrack.style.transition = 'transform 0.6s ease';
            const offset = -(currentIndex * slideWidth);
            carouselTrack.style.transform = `translateX(${offset}px)`;

            // Ao atingir o clone, resetar para índice 0 sem transição
            if (currentIndex === 3) {
                isResetting = true;

                // Usar transitionend para sincronização perfeita
                const handleTransitionEnd = () => {
                    carouselTrack.removeEventListener('transitionend', handleTransitionEnd);

                    // Reset imediato sem transição
                    carouselTrack.style.transition = 'none';
                    currentIndex = 0;
                    carouselTrack.style.transform = 'translateX(0)';

                    // Força reflow e habilita transição novamente
                    carouselTrack.offsetHeight;

                    isResetting = false;
                };

                carouselTrack.addEventListener('transitionend', handleTransitionEnd, { once: true });
            }
        };

        // Aguarda 100ms para garantir que as imagens estão renderizadas antes de começar a animar
        setTimeout(() => {
            setInterval(moveCarousel, 3000);
            // Animar primeira vez após um delay para garantir renderização
            moveCarousel();
        }, 100);
    }
});