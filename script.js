// script.js (Guhertoya Dawî ya bi Çareseriya Girtina Mênyuyê)
document.addEventListener('DOMContentLoaded', () => {

    // --- Beşê 1: Anîmasyon û Preloader (wekî xwe dimîne) ---
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

    // --- (دروستکرن) Beşê 2: Lojîka Mênyuyê ---
    const kebabMenuButton = document.getElementById('kebab-menu-button');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const qrMenuItem = document.getElementById('qr-menu-item');
    const shareMenuItem = document.getElementById('share-menu-item');
    const copyMenuItem = document.getElementById('copy-menu-item');

    kebabMenuButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Ev rê li ber digire ku klîk yekser bigihîje 'window'
        dropdownMenu.classList.toggle('visible');
    });

    // (گرنگ) Lojîka nû ji bo girtina mênyuyê
    document.addEventListener('click', (event) => {
        const isClickInsideMenu = dropdownMenu.contains(event.target);
        const isClickOnButton = kebabMenuButton.contains(event.target);

        if (!isClickInsideMenu && !isClickOnButton) {
            dropdownMenu.classList.remove('visible');
        }
    });

    // --- Beşê 3: Fenkşenên Çalakiyan (Share, Copy, QR) ---
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
});
