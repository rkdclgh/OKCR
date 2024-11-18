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
            const reader = new FileReader();
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
        // fetch를 사용해 이미지 데이터를 가져옴
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('이미지를 불러올 수 없습니다.');
                }
                return response.blob(); // Blob 객체로 변환
            })
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    imagePreview.src = reader.result; // Base64 데이터로 설정
                    imagePreview.style.display = 'block'; // 미리보기 표시
                };
                reader.readAsDataURL(blob); // Blob 데이터를 Base64로 변환
            })
            .catch(error => {
                console.error('이미지를 불러오는 중 문제가 발생했습니다:', error);
                alert('유효한 이미지 URL을 입력하세요.');
            });
    } else {
        alert('파일을 선택하거나 이미지 URL을 입력하세요.');
    }
});
