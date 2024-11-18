import { setupZoomAndPan } from './zoomPan.js';
import { setupToolboxEvents } from './toolbox.js';

const app = document.getElementById('app');
let currentImageIndex = 0;
let images = [];

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
            <div class="main-work-area">
                <div class="image-preview">
                    <div class="toolbox"></div>
                    <img src="${images[currentImageIndex]}" alt="이미지 미리보기" id="previewImage">
                </div>
            </div>
        </div>
    `;
    setupZoomAndPan();
    setupToolboxEvents();
}

renderMainScreen();
