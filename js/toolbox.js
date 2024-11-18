export function setupToolboxEvents() {
    const resetButton = document.getElementById('resetButton');

    resetButton.addEventListener('click', () => {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateImageTransform(document.getElementById('previewImage'));
    });
}
