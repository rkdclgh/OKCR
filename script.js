// script.js

// 파일 입력 필드와 URL 입력 필드 선택
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const urlInput = document.getElementById('urlInput');
const urlButton = document.getElementById('urlButton');

// 파일 선택 시 미리보기 처리
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.type)) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            alert('JPG, PNG, 또는 WEBP 형식의 이미지만 업로드할 수 있습니다.');
            fileInput.value = '';
            imagePreview.style.display = 'none';
        }
    }
});

// URL 입력 시 미리보기 처리
urlButton.addEventListener('click', () => {
    const url = urlInput.value.trim(); // 입력된 URL
    if (url) {
        // URL이 이미지 형식인지 확인
        const allowedExtensions = /\.(jpeg|jpg|png|webp)$/i;
        if (allowedExtensions.test(url)) {
            imagePreview.src = url; // 이미지 URL을 설정
            imagePreview.style.display = 'block'; // 미리보기 표시
        } else {
            alert('JPG, PNG, 또는 WEBP 형식의 이미지 URL만 지원합니다.');
        }
    } else {
        alert('유효한 이미지 URL을 입력하세요.');
    }
});
