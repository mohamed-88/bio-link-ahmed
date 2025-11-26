// script.js (Guhertoya Dawî ya bi Çareseriya Mênyuyê ya Garantîkirî)
document.addEventListener('DOMContentLoaded', () => {

    // --- (نوو و سادەکری) Beşê Lojîka Mênyuyê ---
    const kebabMenuButton = document.getElementById('kebab-menu-button');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (kebabMenuButton && dropdownMenu) {
        // Fenkşena ji bo vekirin/girtina mênyuyê
        kebabMenuButton.addEventListener('click', (event) => {
            // Rê li ber belavbûna eventê digire da ku document.click tavilê kar neke
            event.stopPropagation();
            // Klasê 'visible' lê zêde dike yan jê dibe
            dropdownMenu.classList.toggle('visible');
        });

        // Fenkşena ji bo girtina mênyuyê dema ku li derve tê klîkkirin
        document.addEventListener('click', (event) => {
            // Kontrol dike ka klîk li derveyî mênyuyê û li derveyî duikmeyê bûye
            const isClickInsideMenu = dropdownMenu.contains(event.target);
            const isClickOnButton = kebabMenuButton.contains(event.target);

            if (!isClickInsideMenu && !isClickOnButton) {
                // Eger li derve bû, klasê 'visible' jê dibe
                dropdownMenu.classList.remove('visible');
            }
        });
    }


    // --- Beşê 1: Lojîka Pêşketî ya Light/Dark Mode ---
    const themeMenuItem = document.getElementById('theme-menu-item');
    if (themeMenuItem) {
        const themeIcon = themeMenuItem.querySelector('i');
        const themeText = themeMenuItem.querySelector('span');
        const htmlElement = document.documentElement;

        const applyTheme = (theme) => {
            htmlElement.classList.remove('light-mode');
            if (theme === 'light') {
                htmlElement.classList.add('light-mode');
            }
        };

        const updateThemeUI = (theme) => {
            if (theme === 'light') {
                themeIcon.className = 'fas fa-moon';
                themeText.textContent = 'Theme: Light';
            } else if (theme === 'dark') {
                themeIcon.className = 'fas fa-sun';
                themeText.textContent = 'Theme: Dark';
            } else { // Auto
                themeIcon.className = 'fas fa-adjust';
                themeText.textContent = 'Theme: Auto';
            }
        };

        const cycleTheme = () => {
            const currentTheme = localStorage.getItem('theme') || 'auto';
            let newTheme;

            if (currentTheme === 'auto') newTheme = 'dark';
            else if (currentTheme === 'dark') newTheme = 'light';
            else newTheme = 'auto';

            if (newTheme === 'auto') {
                localStorage.removeItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                applyTheme(prefersDark ? 'dark' : 'light');
            } else {
                localStorage.setItem('theme', newTheme);
                applyTheme(newTheme);
            }
            updateThemeUI(newTheme);
        };

        const initializeTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                applyTheme(savedTheme);
                updateThemeUI(savedTheme);
            } else {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                applyTheme(prefersDark ? 'dark' : 'light');
                updateThemeUI('auto');
            }
        };

        initializeTheme();
        themeMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            cycleTheme();
        });

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
                updateThemeUI('auto');
            }
        });
    }

    // --- Beşê 2: Anîmasyon û Preloader ---
    const preloader = document.getElementById('preloader');
    const profilePic = document.querySelector('.profile-pic');
    const itemsToAnimate = document.querySelectorAll('.animated-item');

    const startAnimations = () => {
        if (profilePic) {
            setTimeout(() => {
                profilePic.style.opacity = '1';
                profilePic.style.transform = 'translateY(0)';
            }, 200);
        }
        if (itemsToAnimate.length > 0) {
            itemsToAnimate.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 400 + (100 * index));
            });
        }
    };

    window.addEventListener('load', () => {
        if (preloader) preloader.classList.add('hidden');
        startAnimations();
    });

    // --- Beşê 4: Fenkşenên Çalakiyan (Share, Copy, QR) ---
    const qrMenuItem = document.getElementById('qr-menu-item');
    const shareMenuItem = document.getElementById('share-menu-item');
    const copyMenuItem = document.getElementById('copy-menu-item');
    const toast = document.getElementById('toast-notification');
    let isToastVisible = false;

    const copyLinkAndShowToast = () => {
        if (isToastVisible) return;
        navigator.clipboard.writeText(window.location.href).then(() => {
            isToastVisible = true;
            if (toast) toast.classList.add('toast-visible');
            document.body.classList.add('body-shake');
            setTimeout(() => document.body.classList.remove('body-shake'), 300);
            setTimeout(() => {
                if (toast) toast.classList.remove('toast-visible');
                isToastVisible = false;
            }, 3000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy link.');
        });
    };

    const shareProfile = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Ahmed Electric | Links', text: 'Check out all my links!', url: window.location.href });
            } catch (err) {
                if (err.name !== 'AbortError') console.error('Error sharing:', err);
            }
        } else {
            copyLinkAndShowToast();
        }
    };

    const qrModal = document.getElementById('qrModal');
    const qrcodeContainer = document.getElementById('qrcode');
    const qrUrlText = document.querySelector('.qr-url');
    let qrCodeInstance = null;

    const showQrModal = () => {
        if (!qrCodeInstance) {
            qrCodeInstance = new QRCodeStyling({
                width: 250, height: 250, data: window.location.href,
                image: "/img/IMG_7496.PNG",
                dotsOptions: { color: "#000000", type: "rounded" },
                backgroundOptions: { color: "#ffffff" },
                imageOptions: { crossOrigin: "anonymous", margin: 5, imageSize: 0.3 },
                cornersSquareOptions: { type: "extra-rounded" },
                cornersDotOptions: { type: "dot" }
            });
            qrCodeInstance.append(qrcodeContainer);
        }
        qrUrlText.textContent = window.location.href;
        qrModal.classList.add('visible');
    };

    if(qrMenuItem) qrMenuItem.addEventListener('click', (e) => { e.preventDefault(); showQrModal(); dropdownMenu.classList.remove('visible'); });
    if(shareMenuItem) shareMenuItem.addEventListener('click', (e) => { e.preventDefault(); shareProfile(); dropdownMenu.classList.remove('visible'); });
    if(copyMenuItem) copyMenuItem.addEventListener('click', (e) => { e.preventDefault(); copyLinkAndShowToast(); dropdownMenu.classList.remove('visible'); });

    const closeQrButton = document.getElementById('closeQrButton');
    const downloadQrButton = document.getElementById('downloadQrButton');
    const closeQrModal = () => { if (qrModal) qrModal.classList.remove('visible'); };
    if (closeQrButton) closeQrButton.addEventListener('click', closeQrModal);
    if (qrModal) qrModal.addEventListener('click', (event) => { if (event.target === qrModal) closeQrModal(); });
    if (downloadQrButton) {
        downloadQrButton.addEventListener('click', () => {
            if (qrCodeInstance) {
                qrCodeInstance.download({ name: "Ahmed-Electric-QR", extension: "png" });
            }
        });
    }

    // --- Beşê 5: Lojîka Fórma Peywendiyê ---
    const contactModal = document.getElementById('contactModal');
    const contactMenuItem = document.getElementById('contact-menu-item');
    const closeContactButton = document.getElementById('closeContactButton');
    const contactForm = document.getElementById('contact-form');
    
    if (contactMenuItem) {
        const openContactModal = () => contactModal.classList.add('visible');
        contactMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            openContactModal();
            dropdownMenu.classList.remove('visible');
        });
    }
    if (closeContactButton) {
        const closeContactModal = () => contactModal.classList.remove('visible');
        closeContactButton.addEventListener('click', closeContactModal);
    }
    if (contactModal) contactModal.addEventListener('click', (event) => { if (event.target === contactModal) contactModal.classList.remove('visible'); });

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const formStatus = contactForm.querySelector('#form-status');
            const submitButton = contactForm.querySelector('.submit-button');
            const buttonText = submitButton.querySelector('.button-text');
            const buttonLoader = submitButton.querySelector('.button-loader');
            
            buttonText.style.display = 'none';
            buttonLoader.style.display = 'block';
            submitButton.disabled = true;
            formStatus.textContent = '';

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    formStatus.textContent = "Thanks! Your message has been sent.";
                    formStatus.style.color = '#28a745';
                    contactForm.reset();
                    setTimeout(() => {
                        contactModal.classList.remove('visible');
                        formStatus.textContent = '';
                    }, 4000);
                } else {
                    response.json().then(data => {
                        formStatus.textContent = data.errors ? data.errors.map(error => error.message).join(', ') : "Oops! There was a problem.";
                        formStatus.style.color = '#dc3545';
                    })
                }
            }).catch(error => {
                formStatus.textContent = "Oops! There was a network error.";
                formStatus.style.color = '#dc3545';
            }).finally(() => {
                buttonText.style.display = 'block';
                buttonLoader.style.display = 'none';
                submitButton.disabled = false;
            });
        });
    }

    // --- Beşê 6: Lojîka Fórma Subscribe ---
    const subscribeModal = document.getElementById('subscribeModal');
    const subscribeMenuItem = document.getElementById('subscribe-menu-item');
    const closeSubscribeButton = document.getElementById('closeSubscribeButton');
    const subscribeForm = document.getElementById('subscribe-form');

    if (subscribeMenuItem) {
        const openSubscribeModal = () => subscribeModal.classList.add('visible');
        subscribeMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            openSubscribeModal();
            dropdownMenu.classList.remove('visible');
        });
    }
    if (closeSubscribeButton) {
        const closeSubscribeModal = () => subscribeModal.classList.remove('visible');
        closeSubscribeButton.addEventListener('click', closeSubscribeModal);
    }
    if (subscribeModal) subscribeModal.addEventListener('click', (event) => { if (event.target === subscribeModal) subscribeModal.classList.remove('visible'); });

    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(subscribeForm);
            const formStatus = subscribeForm.querySelector('#subscribe-form-status');
            const submitButton = subscribeForm.querySelector('.submit-button');
            const buttonText = submitButton.querySelector('.button-text');
            const buttonLoader = submitButton.querySelector('.button-loader');

            buttonText.style.display = 'none';
            buttonLoader.style.display = 'block';
            submitButton.disabled = true;
            formStatus.textContent = '';

            fetch(subscribeForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    formStatus.textContent = "Thanks for subscribing!";
                    formStatus.style.color = '#28a745';
                    subscribeForm.reset();
                    setTimeout(() => {
                        subscribeModal.classList.remove('visible');
                        formStatus.textContent = '';
                    }, 3000);
                } else {
                    formStatus.textContent = "Oops! Something went wrong.";
                    formStatus.style.color = '#dc3545';
                }
            }).catch(error => {
                formStatus.textContent = "Oops! There was a network error.";
                formStatus.style.color = '#dc3545';
            }).finally(() => {
                buttonText.style.display = 'block';
                buttonLoader.style.display = 'none';
                submitButton.disabled = false;
            });
        });
    }

    // --- Beşê 7: Anîmasyona Touch a Pêşketî ---
    const linkCards = document.querySelectorAll('.link-card');

    linkCards.forEach(card => {
        card.addEventListener('touchstart', () => {
            card.classList.add('link-active');
        }, { passive: true });

        card.addEventListener('touchend', () => {
            card.classList.remove('link-active');
        });

        card.addEventListener('touchcancel', () => {
            card.classList.remove('link-active');
        });
    });

	// --- (نوو) Beşê 8: Lojîka FAQ Accordion ---
	
	    // // --- (نوو) Beşê 9: Lojîka Pull-to-Refresh ---
	    // const ptrIndicator = document.getElementById('ptr-indicator');
        // const spinner = document.getElementById('ptr-svg');
	    // const REFRESH_THRESHOLD = 80; // Pîkselên ku pêdivî ye were kişandin
	    // const MAX_PULL = 150; // Pîkselên herî zêde yên kişandinê
	    // let startY = 0;
	    // let currentY = 0;
	    // let isPulling = false;
	    // let isRefreshing = false;
	
	    // const handlePull = (e) => {
	    //     // Tenê dema ku li serê rûpelê ye dest pê bike
	    //     if (window.scrollY > 0 || isRefreshing) return;
	
	    //     if (e.type === 'touchstart') {
	    //         startY = e.touches[0].clientY;
	    //         isPulling = true;
	    //     } else if (e.type === 'touchmove' && isPulling) {
	    //         currentY = e.touches[0].clientY;
	    //         let pullDistance = currentY - startY;
	
	    //         if (pullDistance > 0) {
	    //             e.preventDefault(); // Rê li ber scrolla normal digire
	                
	    //             // Bi nermî sînorê kişandinê bicîh tîne
	    //             const easedPull = Math.min(pullDistance, MAX_PULL);
	                
	    //             // Bilindahiya nîşankerê nûve dike
	    //             ptrIndicator.style.height = `${easedPull}px`;
	
	    //             // Eger gihîşt sînorê nûvekirinê, nîşan dide ku amade ye
	    //             if (easedPull >= REFRESH_THRESHOLD) {
	    //                 ptrIndicator.classList.add('releasing');
	    //             } else {
	    //                 ptrIndicator.classList.remove('releasing');
	    //             }
	    //         } else {
	    //             // Eger ber bi jor ve biçe, kişandinê betal dike
	    //             isPulling = false;
	    //             ptrIndicator.style.height = '0';
	    //         }
	    //     } else if (e.type === 'touchend' && isPulling) {
	    //         isPulling = false;
	    //         ptrIndicator.classList.remove('releasing');
	            
	    //         const pullDistance = currentY - startY;
	
	    //         if (pullDistance >= REFRESH_THRESHOLD) {
	    //             // Nûvekirinê dest pê dike
	    //             isRefreshing = true;
	    //             ptrIndicator.classList.add('loading');
	                
	    //             // Simulekirina barkirina daneyan û nûvekirina rûpelê
	    //             setTimeout(() => {
	    //                 // Dema ku barkirin qediya, rûpelê nûve dike
	    //                 window.location.reload();
	    //             }, 1500); // 1.5 saniye ji bo dîtina spînnerê
	
	    //         } else {
	    //             // Vedigere rewşa destpêkê
	    //             ptrIndicator.style.height = '0';
	    //         }
	    //     }
	    // };
	
	    // if (ptrIndicator) {
	    //     document.addEventListener('touchstart', handlePull, { passive: false });
	    //     document.addEventListener('touchmove', handlePull, { passive: false });
	    //     document.addEventListener('touchend', handlePull, { passive: false });
	    // }

        // --- Beşê 99: Lojîka Pull-to-Refresh (PTR) ---

const ptrIndicator = document.getElementById('ptr-indicator');
const ptrSVG = document.getElementById('ptr-svg');
const container = document.querySelector('.container');
const headerControls = document.querySelector('.header-controls'); // نوو
let startY = 0;
let isPulling = false;
let maxPull = 120; // مەزنترین دووری بۆ گرتنێ (بۆ وێ چەندێ کو گەلەک درێژ نەبیت)
const releaseThreshold = 70; // دوورییا پێتڤی بۆ دهێنە Loading

function handleTouchStart(e) {
    if (window.scrollY === 0 && !ptrIndicator.classList.contains('loading')) {
        startY = e.touches[0].clientY;
        isPulling = true;
        
        // دیسان چاڤدێرییا eventên بزاڤێ بکە
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
        
        // ئەڤە دڤێت بۆ کو Indicator بێی گێڕانێ دیار ببت (بێی animation)
        ptrIndicator.classList.remove('loading');
        container.style.transition = 'none'; // ڕاگرتنا ڤەگوهاستنا گشتی
        headerControls.style.transition = 'none';
    }
}

function handleTouchMove(e) {
    if (!isPulling) return;

    const currentY = e.touches[0].clientY;
    let deltaY = currentY - startY;

    if (deltaY > 0) {
        e.preventDefault(); 
        
        // هێدی دکەین (Friction) ل سەر کێشانا پەرەی
        const pullDistance = Math.min(deltaY * 0.5, maxPull);
        
        // *گرنگ*: سەفحێ ب تەواوی دگەل بزاڤێ دکێشینە خار
        container.style.transform = `translateY(${pullDistance}px)`;
        headerControls.style.transform = `translateY(${pullDistance}px)`;

        // Indicator ل جهێ خوە یێ سەرەکی دمینیت (fixed) لێ دڤێت Indicator Height ل گۆری pullDistance بهێتە ڤەڤەکرن.
        ptrIndicator.style.height = `${pullDistance}px`;

        // گوهارتنا گۆشێ (Angle) یێ SVG - هێدی هێدی دگێڕینین
        let rotation = Math.min(pullDistance, releaseThreshold) * 5; 
        ptrSVG.style.transform = `scale(1) rotate(${rotation}deg)`;
        
        // هێدی هێدی دەرکەڤیت
        ptrSVG.style.opacity = Math.min(pullDistance / 50, 1); 
        ptrIndicator.classList.add('releasing');

        if (pullDistance >= releaseThreshold) {
             ptrIndicator.classList.add('ready-to-refresh');
        } else {
             ptrIndicator.classList.remove('ready-to-refresh');
        }

    } else {
        // ئەگەر بۆ سەر دچیت
        isPulling = false;
        container.style.transform = `translateY(0px)`;
        headerControls.style.transform = `translateY(0px)`;
        ptrIndicator.style.height = `0px`;
        ptrSVG.style.opacity = 0;
    }
}

function handleTouchEnd() {
    if (!isPulling) return;

    isPulling = false;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    
    // ڤەگێڕاندنا ڤەگوهاستنا (Transition) بۆ کو ڤەگەڕیانا Loading هێدی بیت
    container.style.transition = 'transform 0.3s ease-out';
    headerControls.style.transition = 'transform 0.3s ease-out';

    const currentPull = parseInt(ptrIndicator.style.height);

    if (currentPull >= releaseThreshold) {
        // LOADING STATE
        ptrIndicator.classList.add('loading');
        ptrIndicator.style.height = `70px`; 
        container.style.transform = `translateY(70px)`; // سەفحێ ل 70px ب راگریت
        headerControls.style.transform = `translateY(70px)`;
        
        ptrSVG.style.transform = `scale(1) rotate(0deg)`;
        
        refreshPage(); 

    } else {
        // RESET
        container.style.transform = `translateY(0px)`;
        headerControls.style.transform = `translateY(0px)`;
        ptrIndicator.style.height = `0px`;
        ptrSVG.style.opacity = 0;
        ptrSVG.style.transform = `scale(0.8) rotate(0deg)`;
    }
    
    ptrIndicator.classList.remove('releasing');
    ptrIndicator.classList.remove('ready-to-refresh');
}

// فەنکشەنا Refresh (ل ڤێرێ دڤێت تو گوهارتنێ بکەی)
function refreshPage() {
    console.log("Refreshing data...");
    
    // 1. Refresh Logic (بۆ نموونە: AJAX call for new data)
    
    // 2. پاشان، وەختێ کار دوماهیک هات، Indicator ڤەگێڕە
    setTimeout(() => {
        ptrIndicator.classList.remove('loading');
        
        // ڤەگێڕانا سەفحێ بۆ جهێ سەرەکی (دێ ب transition هێدی ڤەگەریت)
        container.style.transform = `translateY(0px)`;
        headerControls.style.transform = `translateY(0px)`;
        
        ptrIndicator.style.height = `0px`;
        ptrSVG.style.opacity = 0;
    }, 2000); // 2 سانیە بۆ دیتنا Loading
}

// Events
document.addEventListener('touchstart', handleTouchStart);


    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Hemî aytemên din digire
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Eger aytem neçalak bû, wî çalak dike
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });


});