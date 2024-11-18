let scale = 1;
let translateX = 0;
let translateY = 0;

export function setupZoomAndPan() {
    const image = document.getElementById('previewImage');
    const previewContainer = document.querySelector('.image-preview');

    image.addEventListener('wheel', (event) => {
        event.preventDefault();
        scale += event.deltaY < 0 ? 0.1 : -0.1;
        scale = Math.min(Math.max(0.5, scale), 3);
        updateImageTransform(image);
    });

    previewContainer.addEventListener('mousedown', (event) => {
        const startX = event.clientX - translateX;
        const startY = event.clientY - translateY;

        const onMouseMove = (e) => {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateImageTransform(image);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

function updateImageTransform(image) {
    image.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}
