// script.js (Guhertoya Dawî ya bi Logo di QR Kodê de)
document.addEventListener('DOMContentLoaded', () => {

    // --- Beşê 1: Anîmasyon û Preloader ---
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

    // --- Beşê 2: Share & Copy Buttons ---
    const shareButton = document.querySelector('.share-button');
    const copyButton = document.querySelector('.copy-button');
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

    if (shareButton) {
        shareButton.addEventListener('click', async () => {
            if (navigator.share) {
                try {
                    await navigator.share({ title: 'Ahmed Electric | Links', text: 'Check out all my links!', url: window.location.href });
                } catch (err) {
                    if (err.name !== 'AbortError') console.error('Error sharing:', err);
                }
            } else {
                copyLinkAndShowToast();
            }
        });
    }
    if (copyButton) {
        copyButton.addEventListener('click', copyLinkAndShowToast);
    }

    // --- Beşê 3: (باشترکرن) QR Code with Logo Functionality ---
    const showQrButton = document.getElementById('showQrButton');
    const closeQrButton = document.getElementById('closeQrButton');
    const qrModal = document.getElementById('qrModal');
    const qrcodeContainer = document.getElementById('qrcode');
    const qrUrlText = document.querySelector('.qr-url');
    let qrCodeInstance = null;

    if (showQrButton && qrModal) {
        showQrButton.addEventListener('click', () => {
            // Tenê carekê QR kodê çêbike
            if (!qrCodeInstance) {
                qrCodeInstance = new QRCodeStyling({
                    width: 220,
                    height: 220,
                    data: window.location.href, // Lînka te
                    image: "/img/IMG_7496.PNG", // **(گرنگ) Rêça logoyê te**
                    dotsOptions: {
                        color: "#000000",
                        type: "rounded" // 'dots', 'classy', 'extra-rounded'
                    },
                    backgroundOptions: {
                        color: "#ffffff",
                    },
                    imageOptions: {
                        crossOrigin: "anonymous",
                        margin: 3, // Valahî li dora logoyê
                        imageSize: 0.5 // Mezinahiya logoyê (30%)
                    },
                    cornersSquareOptions: {
                        type: "extra-rounded"
                    },
                    cornersDotOptions: {
                        type: "dot"
                    }
                });
                // QR kodê li konteynirê zêde bike
                qrCodeInstance.append(qrcodeContainer);
            }
            
            qrUrlText.textContent = window.location.href;
            qrModal.classList.add('visible');
        });
    }

    const closeQrModal = () => {
        if (qrModal) qrModal.classList.remove('visible');
    };

    if (closeQrButton) closeQrButton.addEventListener('click', closeQrModal);
    if (qrModal) {
        qrModal.addEventListener('click', (event) => {
            if (event.target === qrModal) closeQrModal();
        });
    }
});
