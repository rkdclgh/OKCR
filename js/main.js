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
    const numPages = pdf.numPages;
    const imagePromises = [];

    for (let i = 1; i <= numPages; i++) {
        imagePromises.push(
            pdf.getPage(i).then(async (page) => {
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({ canvasContext: context, viewport }).promise;
                return canvas.toDataURL();
            })
        );
    }

    return Promise.all(imagePromises);
}

// 파일 처리 함수
async function handleFiles(files) {
    const loadedImages = [];
    for (const file of files) {
        if (typeof file === 'string') {
            loadedImages.push(file); // URL 처리
        } else if (file.type === 'application/pdf') {
            const pdfImages = await handlePDF(file); // PDF 처리
            loadedImages.push(...pdfImages);
        } else if (file.type.startsWith('image/')) {
            loadedImages.push(URL.createObjectURL(file)); // 이미지 파일 처리
        } else {
            alert(`${file.name}은(는) 지원하지 않는 형식입니다.`);
        }
    }

    if (loadedImages.length > 0) {
        renderWorkScreen(loadedImages);
    } else {
        alert('유효한 파일이나 URL을 입력하세요.');
    }
}

// 검색 필드 오버레이 설정
function setupThumbnailSearchOverlay() {
    const currentPageInput = document.getElementById('thumbnailCurrentPage');
    const totalPagesSpan = document.getElementById('thumbnailTotalPages');
    const prevPageButton = document.getElementById('prevPageButton');
    const nextPageButton = document.getElementById('nextPageButton');

    // 초기값 설정
    totalPagesSpan.textContent = `/ ${images.length}`;
    currentPageInput.value = currentImageIndex + 1;

    // 현재 페이지 입력 이벤트
    currentPageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const inputValue = parseInt(currentPageInput.value.trim(), 10);

            // 유효성 검사
            if (isNaN(inputValue) || inputValue < 1 || inputValue > images.length) {
                alert(`1에서 ${images.length} 사이의 번호를 입력하세요.`);
                currentPageInput.value = currentImageIndex + 1;
                return;
            }

            // 페이지 이동
            changeToPage(inputValue - 1);
        }
    });

    // 이전 페이지 버튼 클릭 이벤트
    prevPageButton.addEventListener('click', () => {
        if (currentImageIndex > 0) {
            changeToPage(currentImageIndex - 1);
        }
    });

    // 다음 페이지 버튼 클릭 이벤트
    nextPageButton.addEventListener('click', () => {
        if (currentImageIndex < images.length - 1) {
            changeToPage(currentImageIndex + 1);
        }
    });

    // 페이지 이동 함수
    function changeToPage(newIndex) {
        // 선택된 썸네일으로 스크롤
        const targetThumbnail = document.querySelector(
            `.thumbnail-container:nth-child(${newIndex + 1})`
        );

        if (targetThumbnail) {
            targetThumbnail.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });

            // 선택된 썸네일 강조
            document.querySelectorAll('.thumbnail-container').forEach((el) =>
                el.classList.remove('selected')
            );
            targetThumbnail.classList.add('selected');

            // 이미지 갱신
            currentImageIndex = newIndex;
            document.querySelector('.image-preview img').src = images[currentImageIndex];

            // 검색 필드 값 갱신
            currentPageInput.value = currentImageIndex + 1;

            // 썸네일 번호 강조 업데이트
            updateThumbnailNumbers();

            // 이전/다음 버튼 활성화 상태 업데이트
            updateButtonStates();
        }
    }

    // 썸네일 번호 강조 업데이트 함수
    function updateThumbnailNumbers() {
        document.querySelectorAll('.thumbnail-number').forEach((num, index) => {
            if (index === currentImageIndex) {
                num.classList.add('selected'); // 현재 페이지 번호 강조
            } else {
                num.classList.remove('selected'); // 다른 번호는 강조 해제
            }
        });
    }

    // 이전/다음 버튼 활성화 상태 업데이트
    function updateButtonStates() {
        prevPageButton.disabled = currentImageIndex === 0;
        nextPageButton.disabled = currentImageIndex === images.length - 1;
    }

    // 초기 버튼 상태 설정
    updateButtonStates();
    updateThumbnailNumbers(); // 썸네일 번호 강조 초기화
}

// 썸네일 선택 함수
function selectThumbnail(index) {
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

    // 검색 필드 업데이트
    const searchInput = document.getElementById('thumbnailSearchInput');
    searchInput.value = `${currentImageIndex + 1} / ${images.length}`;
}

// 작업 화면 렌더링
function renderWorkScreen(loadedImages = []) {
    images = loadedImages;

    app.innerHTML = `
        <div class="work-area">
            <!-- 검색 필드 동적 생성 -->
            <div id="thumbnailSearchOverlay">
                <button id="prevPageButton" class="search-button">&lt;</button>
                <input 
                    type="number" 
                    id="thumbnailCurrentPage" 
                    value="1" 
                    min="1" 
                    max="${images.length}" 
                    aria-label="현재 페이지 입력">
                <span id="thumbnailTotalPages">/ ${images.length}</span>
                <button id="nextPageButton" class="search-button">&gt;</button>
            </div>

            <!-- 썸네일 미리보기 -->
            <div class="thumbnail-grid">
                ${images.map(
                    (image, index) => `
                    <div class="thumbnail-container ${
                        index === currentImageIndex ? 'selected' : ''
                    }" data-index="${index}">
                        <img class="thumbnail" 
                            src="${image}" alt="썸네일 ${index + 1}">
                        <span class="thumbnail-number ${
                            index === currentImageIndex ? 'selected' : ''
                        }">${index + 1}</span>
                    </div>`
                ).join('')}
            </div>

            <!-- 중앙 작업 화면 -->
            <div class="main-work-area">
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
                <div class="ocr-interface">
                    <p>OCR 결과 텍스트</p>
                    <div id="ocrResults"></div>
                </div>
            </div>
        </div>
    `;

    // 검색 필드와 썸네일, 이미지 조작 기능 설정
    setupThumbnailEvents();
    setupZoomAndPan();
    setupToolboxEvents();
    setupThumbnailSearchOverlay();
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

// 초기 화면 렌더링 호출
renderMainScreen();
