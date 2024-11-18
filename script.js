// 입력 필드 및 버튼 선택
const fileInput = document.getElementById('fileInput'); // 파일 선택 필드
const urlInput = document.getElementById('urlInput');   // URL 입력 필드
const uploadButton = document.getElementById('uploadButton'); // 업로드 버튼

// 새 창에 이미지 미리보기를 띄우는 함수
function openPreviewWindow(imageSrc) {
    // 새 창 생성
    const previewWindow = window.open('', '_blank');
    // 새 창의 HTML 콘텐츠 설정
    previewWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>미리보기</title>
            <style>
                body {
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #f9f9f9;
                }
                img {
                    max-width: 90%;
                    max-height: 90%;
                    border: 1px solid #ddd;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <img src="${imageSrc}" alt="미리보기 이미지">
        </body>
        </html>
    `);
}

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
                openPreviewWindow(e.target.result); // 새 창에 미리보기 띄우기
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
            openPreviewWindow(url); // 새 창에 미리보기 띄우기
        } else {
            alert('유효한 이미지 URL을 입력하세요.');
            urlInput.value = ''; // URL 입력 초기화
        }
    } else {
        alert('파일을 선택하거나 이미지 URL을 입력하세요.');
    }
});
