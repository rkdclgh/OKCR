import { setupZoomAndPan } from './zoomPan.js';
import { setupToolboxEvents } from './toolbox.js';

const app = document.getElementById('app');
let currentImageIndex = 0;
let images = [];

// PDF.js 라이브러리 사용
const pdfjsLib = window['pdfjs-dist/build/pdf'];

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

// 파일 처리 함수
function handleFiles(files) {
    const loadedImages = files.map((file) =>
        typeof file === 'string' ? file : URL.createObjectURL(file)
    );
    renderWorkScreen(loadedImages);
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
                        <button class="tool-icon" id="panButton">
                            <span class="material-icons">pan_tool</span>
                        </button>
                        <button class="tool-icon" id="resetButton">
                            <span class="material-icons">restart_alt</span>
                        </button>
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
    setupZoomAndPan();
    setupToolboxEvents();
}

// 초기 화면 렌더링 호출
renderMainScreen();
