// 입력 필드 및 버튼 선택
const fileInput = document.getElementById('fileInput');
const urlInput = document.getElementById('urlInput');
const uploadButton = document.getElementById('uploadButton');
const popupContainer = document.getElementById('popupContainer');

// 파일 업로드 또는 URL 입력 후 팝업 표시
uploadButton.addEventListener('click', () => {
    const files = fileInput.files;
    const url = urlInput.value.trim();

    if (files.length > 0) {
        showPopup(files);
    } else if (url) {
        showPopup([url]);
    } else {
        alert('파일을 선택하거나 이미지 URL을 입력하세요.');
    }
});

// 팝업 생성 함수
function showPopup(items) {
    // 팝업 HTML 생성
    popupContainer.innerHTML = `
        <div class="popup-overlay">
            <div class="popup">
                <h2>업로드 확인</h2>
                <p>이 이미지를 사용해 작업을 진행하시겠습니까?</p>
                <button class="yes">예</button>
                <button class="no">아니오</button>
            </div>
        </div>
    `;

    // 팝업 동작 설정
    const yesButton = document.querySelector('.popup .yes');
    const noButton = document.querySelector('.popup .no');

    // "예" 버튼 클릭 시
    yesButton.addEventListener('click', () => {
        popupContainer.innerHTML = ''; // 팝업 제거
        navigateToWorkArea(items); // 작업 화면으로 이동
    });

    // "아니오" 버튼 클릭 시
    noButton.addEventListener('click', () => {
        popupContainer.innerHTML = ''; // 팝업 제거
        fileInput.value = ''; // 입력 초기화
        urlInput.value = ''; // URL 초기화
    });
}

// 작업 화면으로 이동 함수
function navigateToWorkArea(items) {
    alert(`작업 화면으로 이동합니다. 처리할 항목: ${items.length}`);
}
