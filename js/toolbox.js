export function setupToolboxEvents() {
    const panButton = document.getElementById('panButton');
    const resetButton = document.getElementById('resetButton');

    // Pan 버튼 클릭 시
    panButton.addEventListener('click', () => {
        const previewContainer = document.querySelector('.image-preview');
        if (previewContainer) {
            previewContainer.style.cursor = 'grab';
            alert('Pan 기능 활성화!');
        }
    });

    // Reset 버튼 클릭 시
    resetButton.addEventListener('click', () => {
        const image = document.getElementById('previewImage');
        if (image) {
            scale = 1;
            translateX = 0;
            translateY = 0;
            image.style.transform = `translate(0px, 0px) scale(1)`;
            alert('이미지가 초기화되었습니다!');
        }
    });
}
