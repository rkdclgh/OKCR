// 입력 필드 및 버튼 선택
const fileInput = document.getElementById('fileInput'); // 파일 선택 필드
const urlInput = document.getElementById('urlInput');   // URL 입력 필드
const imagePreview = document.getElementById('imagePreview'); // 미리보기 이미지
const uploadButton = document.getElementById('uploadButton'); // 업로드 버튼

// 업로드 버튼 클릭 시 처리
uploadButton.addEventListener('click', () => {
    const file = fileInput.files[0]; // 선택된 파일
    const url = urlInput.value.trim(); // 입력된 URL

    // 파일 업로드 처리
    if (file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.type)) {
            const reader = new FileReader(); // FileReader 생성
            reader.onload = function (e) {
                imagePreview.src = e.target.result; // 파일의 Data URL 설정
                imagePreview.style.display = 'block'; // 미리보기 표시
            };
            reader.readAsDataURL(file); // 파일을 Data URL로 읽음
        } else {
            alert('JPG, PNG, 또는 WEBP 형식의 이미지만 업로드할 수 있습니다.');
            fileInput.value = ''; // 입력 초기화
        }
    }
    // URL 업로드 처리
    else if (url) {
        const allowedExtensions = /\.(jpeg|jpg|png|webp)(\?.*)?$/i; // 쿼리 문자열 포함 허용
        if (allowedExtensions.test(url)) {
            imagePreview.src = url; // URL을 미리보기로 설정
            imagePreview.style.display = 'block'; // 미리보기 표시
        } else {
            alert('유효한 이미지 URL을 입력하세요.');
            urlInput.value = ''; // URL 입력 초기화
        }
    } else {
        alert('파일을 선택하거나 이미지 URL을 입력하세요.');
    }
});
