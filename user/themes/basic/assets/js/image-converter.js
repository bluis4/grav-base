(() => {
    const modernImages = document.querySelectorAll('[data-modern-avif][data-modern-webp]');

    modernImages.forEach((image) => {
        // Native <picture> sources already select the best supported format.
        if (image.closest('picture')) {
            return;
        }

        const candidates = [
            image.dataset.modernAvif,
            image.dataset.modernWebp,
            image.getAttribute('src')
        ].filter(Boolean);
        let index = 0;

        const tryNextFormat = () => {
            if (index >= candidates.length) {
                image.onerror = null;
                return;
            }

            const candidate = candidates[index++];
            image.onerror = tryNextFormat;
            image.src = candidate;
        };

        tryNextFormat();
    });
})();
