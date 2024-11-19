export function setupToolboxEvents() {
    const resetButton = document.getElementById('resetButton');

    resetButton.addEventListener('click', () => {
        const image = document.getElementById('previewImage');
        if (image) {
            scale = 1;
            translateX = 0;
            translateY = 0;
            image.style.transform = `translate(0px, 0px) scale(1)`;
        }
    });
}
