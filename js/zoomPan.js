let scale = 1;
let translateX = 0;
let translateY = 0;
let isPanning = false; // Pan 상태 추가

export function setupZoomAndPan() {
    const image = document.getElementById('previewImage');
    const previewContainer = document.querySelector('.image-preview');

    if (!image || !previewContainer) {
        console.error('이미지나 컨테이너 요소를 찾을 수 없습니다.');
        return;
    }

    // Zoom 기능 (휠 이벤트)
    previewContainer.addEventListener('wheel', (event) => {
        event.preventDefault();

        // 확대/축소 비율 변경
        scale += event.deltaY < 0 ? 0.1 : -0.1;
        scale = Math.min(Math.max(0.5, scale), 3);

        // 이미지 변환 적용
        updateImageTransform(image);
    });

    // Pan 기능 (마우스 드래그)
    previewContainer.addEventListener('mousedown', (event) => {
        isPanning = true;
        previewContainer.style.cursor = 'grabbing'; // Pan 시작 시 커서 변경

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
            previewContainer.style.cursor = 'grab'; // Pan 종료 시 커서 복구
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

// 이미지 변환 상태 업데이트
function updateImageTransform(image) {
    image.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}
