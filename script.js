// DOM 요소
const app = document.getElementById('app');

// 메인 화면 렌더링
function renderMainScreen() {
    app.innerHTML = `
        <header>
            <h1>OKCR에 오신 것을 환영합니다!</h1>
            <p>이미지 파일을 업로드하거나 URL을 입력하여 작업을 시작하세요.</p>
            <p>다양한 형태의 한글, 옛한글, 한자 텍스트를 인식할 수 있습니다.</p>
        </header>
        <section class="upload-area">
            <form id="uploadForm">
                <input type="file" id="fileInput" name="files" accept=".jpg, .png, .pdf" multiple>
                <input type="text" id="urlInput" placeholder="이미지 URL을 입력하세요">
                <button type="button" id="uploadButton">파일 올리기</button>
            </form>
        </section>
    `;

    // 이벤트 리스너 추가
    const fileInput = document.getElementById('fileInput');
    const urlInput = document.getElementById('urlInput');
    const uploadButton = document.getElementById('uploadButton');

    uploadButton.addEventListener('click', () => {
        const files = fileInput.files;
        const url = urlInput.value.trim();

        if (files.length > 0) {
            handleFiles(Array.from(files));
        } else if (url) {
            handleFiles([url]);
        } else {
            alert('파일을 선택하거나 이미지 URL을 입력하세요.');
        }
    });
}

// 작업 화면 렌더링
function renderWorkScreen(images) {
    app.innerHTML = `
        <header>
            <h1>작업 화면</h1>
            <p>이미지를 선택하여 OCR 작업을 수행하세요.</p>
        </header>
        <div class="work-area">
            <!-- 썸네일 그리드 -->
            <div class="thumbnail-grid">
                ${images
                    .map(
                        (image, index) =>
                            `<img class="thumbnail" src="${image}" data-index="${index}" alt="썸네일 ${index + 1}">`
                    )
                    .join('')}
            </div>
            <!-- 이미지 미리보기 -->
            <div class="image-preview">
                <img src="${images[0]}" alt="미리보기 이미지">
            </div>
            <!-- OCR 인터페이스 -->
            <div class="ocr-interface">
                <button id="startOCRButton">OCR 시작</button>
                <textarea id="ocrResult" placeholder="OCR 결과가 여기에 표시됩니다."></textarea>
            </div>
        </div>
    `;

    // 썸네일 클릭 이벤트 추가
    const thumbnails = document.querySelectorAll('.thumbnail');
    const imagePreview = document.querySelector('.image-preview img');
    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', () => {
            // 썸네일 선택 강조
            thumbnails.forEach((thumb) => thumb.classList.remove('selected'));
            thumbnail.classList.add('selected');

            // 이미지 미리보기 업데이트
            imagePreview.src = thumbnail.src;
        });
    });

    // OCR 시작 버튼 이벤트
    const startOCRButton = document.getElementById('startOCRButton');
    startOCRButton.addEventListener('click', () => {
        const ocrResult = document.getElementById('ocrResult');
        ocrResult.value = 'OCR 처리 중...'; // 실제 OCR 로직을 추가하세요.
    });
}

// 파일 처리 함수
function handleFiles(files) {
    const images = files.map((file) =>
        typeof file === 'string' ? file : URL.createObjectURL(file)
    );
    renderWorkScreen(images);
}

// 초기 화면 렌더링
renderMainScreen();
