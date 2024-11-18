const app = document.getElementById('app');
let currentImageIndex = 0;
let images = [];
let scale = 1; // 이미지 확대/축소 초기값

// 메인 화면 렌더링
function renderMainScreen() {
    app.innerHTML = `
        <header>
            <h1>OKCR에 오신 것을 환영합니다!</h1>
            <p>이미지 파일을 업로드하거나 URL을 입력하여 작업을 시작하세요.</p>
        </header>
        <section class="upload-area">
            <form id="uploadForm">
                <input type="file" id="fileInput" name="files" accept=".jpg, .png, .pdf" multiple>
                <input type="text" id="urlInput" placeholder="이미지 URL을 입력하세요">
                <button type="button" id="uploadButton">파일 올리기</button>
            </form>
        </section>
        <footer>
            <a href="https://github.com/rkdclgh/OKCR" target="_blank">Github에서 프로젝트 보기</a>
        </footer>
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
function renderWorkScreen(loadedImages = []) {
    images = loadedImages;
    app.innerHTML = `
        <div class="work-area">
            <!-- 썸네일 미리보기 -->
            <div class="thumbnail-grid">
                ${images
                    .map(
                        (image, index) =>
                            `<img class="thumbnail ${index === currentImageIndex ? 'selected' : ''}" 
                                  src="${image}" alt="썸네일 ${index + 1}" data-index="${index}">`
                    )
                    .join('')}
            </div>

            <!-- 중앙 작업 화면 -->
            <div class="main-work-area">
                <!-- 이미지 큰 화면 -->
                <div class="image-preview">
                    <div class="toolbox">
                        <div class="tool">
                            <button class="tool-icon">
                                <span class="material-icons">add_box</span>
                            </button>
                        </div>
                        <div class="tool">
                            <button class="tool-icon">
                                <span class="material-icons">delete</span>
                            </button>
                        </div>
                    </div>
                    <img src="${images[currentImageIndex]}" alt="이미지 미리보기" id="previewImage">
                </div>

                <!-- OCR 작업 창 -->
                <div class="ocr-interface">
                    <p>OCR 결과 텍스트</p>
                    <div id="ocrResults"></div>
                </div>
            </div>
        </div>
    `;

    setupThumbnailEvents();
    setupZoomFunctionality();
}

// 썸네일 클릭 이벤트 설정
function setupThumbnailEvents() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const imagePreview = document.querySelector('.image-preview img');

    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', () => {
            thumbnails.forEach((thumb) => thumb.classList.remove('selected'));
            thumbnail.classList.add('selected');
            currentImageIndex = parseInt(thumbnail.dataset.index, 10);
            imagePreview.src = images[currentImageIndex];
        });
    });
}

// 이미지 확대/축소 설정
function setupZoomFunctionality() {
    const image = document.getElementById('previewImage');

    image.addEventListener('wheel', (event) => {
        event.preventDefault();

        // 확대 또는 축소 비율 변경
        if (event.deltaY < 0) {
            scale += 0.1; // 휠 위로: 확대
        } else {
            scale -= 0.1; // 휠 아래로: 축소
        }

        // 최소/최대 비율 제한
        scale = Math.min(Math.max(0.5, scale), 3);

        // 이미지에 변환 적용
        image.style.transform = `scale(${scale})`;
    });
}

// 파일 처리 함수
function handleFiles(files) {
    const loadedImages = files.map((file) =>
        typeof file === 'string' ? file : URL.createObjectURL(file)
    );
    renderWorkScreen(loadedImages);
}

// 초기 화면 렌더링
renderMainScreen();
