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
        const files = Array.from(fileInput.files);
        const url = urlInput.value.trim();

        if (files.length > 0) {
            handleFiles(files);
        } else if (url) {
            handleFiles([url]);
        } else {
            alert('파일을 선택하거나 이미지 URL을 입력하세요.');
        }
    });
}

// PDF 처리 함수
async function handlePDF(file) {
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
    const pdfPages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 }); // PDF 페이지 스케일 조정
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport: viewport }).promise;

        pdfPages.push(canvas.toDataURL()); // 각 페이지를 이미지 데이터로 변환
    }

    renderWorkScreen(pdfPages); // PDF 페이지 이미지를 작업 화면으로 렌더링
}

// 파일 처리 함수
function handleFiles(files) {
    files.forEach((file) => {
        if (file.type === 'application/pdf') {
            handlePDF(file); // PDF 파일 처리
        } else if (typeof file === 'string' || file.type.startsWith('image/')) {
            const imageURL = typeof file === 'string' ? file : URL.createObjectURL(file);
            renderWorkScreen([imageURL]); // 이미지 파일 처리
        } else {
            alert('지원하지 않는 파일 형식입니다.');
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
                ${images.map(
                    (image, index) => `
                    <div class="thumbnail-container ${
                        index === currentImageIndex ? 'selected' : ''
                    }" data-index="${index}">
                        <img class="thumbnail" src="${image}" alt="썸네일 ${index + 1}">
                        <span class="thumbnail-number ${
                            index === currentImageIndex ? 'selected' : ''
                        }">${index + 1}</span>
                    </div>`
                ).join('')}
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
                    <input type="range" id="scaleBar" min="0.1" max="5" step="0.1" value="1">
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

// 썸네일 클릭 이벤트
function setupThumbnailEvents() {
    const thumbnails = document.querySelectorAll('.thumbnail-container');

    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', () => {
            const index = Number(thumbnail.getAttribute('data-index'));
            currentImageIndex = index;

            // 모든 썸네일 상태 초기화
            document.querySelectorAll('.thumbnail-container').forEach((container, i) => {
                container.classList.toggle('selected', i === index);
            });

            document.querySelectorAll('.thumbnail-number').forEach((num, i) => {
                num.classList.toggle('selected', i === index);
            });

            // 중앙 이미지 변경
            const previewImage = document.getElementById('previewImage');
            previewImage.src = images[currentImageIndex];
        });
    });
}

// 초기 화면 렌더링
renderMainScreen();
