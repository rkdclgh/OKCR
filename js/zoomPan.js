let scale = 1;
let translateX = 0;
let translateY = 0;
let isPanning = false;

export function setupZoomAndPan() {
    const image = document.getElementById('previewImage');
    const previewContainer = document.querySelector('.image-preview');
    const scaleBar = document.getElementById('scaleBar');

    if (!image || !previewContainer || !scaleBar) {
        console.error('이미지 또는 컨테이너, 스케일 바를 찾을 수 없습니다.');
        return;
    }

    image.addEventListener('dragstart', (event) => {
        event.preventDefault();
    });

    previewContainer.addEventListener('wheel', (event) => {
        event.preventDefault();
        scale += event.deltaY < 0 ? 0.05 : -0.05;
        scale = Math.min(Math.max(0.1, scale), 5);
        updateImageTransform(image);
        updateScaleBar(scale);
    });

    scaleBar.addEventListener('input', (event) => {
        scale = parseFloat(event.target.value);
        updateImageTransform(image);
    });

    previewContainer.addEventListener('mousedown', (event) => {
        event.preventDefault();
        isPanning = true;

        const startX = event.clientX - translateX;
        const startY = event.clientY - translateY;

        const onMouseMove = (e) => {
            if (!isPanning) return;
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateImageTransform(image);
        };

        const onMouseUp = () => {
            isPanning = false;
            previewContainer.style.cursor = 'grab';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        previewContainer.style.cursor = 'grabbing';
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

function updateImageTransform(image) {
    image.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

function updateScaleBar(scale) {
    const scaleBar = document.getElementById('scaleBar');
    scaleBar.value = scale;
}
