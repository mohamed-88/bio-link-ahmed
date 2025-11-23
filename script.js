// script.js (Guhertoya Dawî ya bi Çareseriya Formspree AJAX)
document.addEventListener('DOMContentLoaded', () => {

    // --- Beşên 1, 2, 3 (Theme, Anîmasyon, Mênyu, hwd.) wekî xwe dimînin ---
    // ... (Hemî koda te ya berê li vir e) ...
    const themeMenuItem = document.getElementById('theme-menu-item');
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

    const kebabMenuButton = document.getElementById('kebab-menu-button');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const qrMenuItem = document.getElementById('qr-menu-item');
    const shareMenuItem = document.getElementById('share-menu-item');
    const copyMenuItem = document.getElementById('copy-menu-item');

    kebabMenuButton.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdownMenu.classList.toggle('visible');
    });

    document.addEventListener('click', (event) => {
        const isClickInsideMenu = dropdownMenu.contains(event.target);
        const isClickOnButton = kebabMenuButton.contains(event.target);
        if (!isClickInsideMenu && !isClickOnButton) {
            dropdownMenu.classList.remove('visible');
        }
    });

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

    qrMenuItem.addEventListener('click', (e) => { e.preventDefault(); showQrModal(); dropdownMenu.classList.remove('visible'); });
    shareMenuItem.addEventListener('click', (e) => { e.preventDefault(); shareProfile(); dropdownMenu.classList.remove('visible'); });
    copyMenuItem.addEventListener('click', (e) => { e.preventDefault(); copyLinkAndShowToast(); dropdownMenu.classList.remove('visible'); });

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

    // --- (دروستکرن) Beşê Dawî: Lojîka Fórma Peywendiyê ---
    const contactModal = document.getElementById('contactModal');
    const contactMenuItem = document.getElementById('contact-menu-item');
    const closeContactButton = document.getElementById('closeContactButton');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitButton = contactForm.querySelector('.submit-button');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoader = submitButton.querySelector('.button-loader');

    const openContactModal = () => contactModal.classList.add('visible');
    const closeContactModal = () => contactModal.classList.remove('visible');

    if (contactMenuItem) {
        contactMenuItem.addEventListener('click', (e) => {
            e.preventDefault();
            openContactModal();
            dropdownMenu.classList.remove('visible');
        });
    }
    
    if (closeContactButton) closeContactButton.addEventListener('click', closeContactModal);
    if (contactModal) contactModal.addEventListener('click', (event) => {
        if (event.target === contactModal) closeContactModal();
    });

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // (گرنگ) Rê li ber refreshkirina rûpelê digire

            const formData = new FormData(contactForm);
            
            buttonText.style.display = 'none';
            buttonLoader.style.display = 'block';
            submitButton.disabled = true;
            formStatus.textContent = '';

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    formStatus.textContent = "Thanks! Your message has been sent.";
                    formStatus.style.color = '#28a745';
                    contactForm.reset();
                    setTimeout(() => {
                        closeContactModal();
                        formStatus.textContent = '';
                    }, 4000);
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formStatus.textContent = "Oops! There was a problem submitting your form.";
                        }
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
});
