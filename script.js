const app = document.getElementById('app');

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
function renderWorkScreen(images = []) {
    app.innerHTML = `
        <div class="work-area">
            <!-- 썸네일 미리보기 -->
            <div class="thumbnail-grid">
                ${images
                    .map(
                        (image, index) =>
                            `<img class="thumbnail" src="${image}" alt="썸네일 ${index + 1}" data-index="${index}">`
                    )
                    .join('')}
            </div>

            <!-- 작업 화면 본체 -->
            <div class="main-work-area">
                <!-- 이미지 큰 화면 -->
                <div class="image-preview">
                    <img src="${images[0] || ''}" alt="이미지 미리보기">
                </div>

                <!-- OCR 작업 창 -->
                <div class="ocr-interface">
                    ${images
                        .map(
                            (image, index) => `
                            <div class="ocr-box">
                                <p>OCR 결과 텍스트 ${index + 1}</p>
                                <button>수정</button>
                            </div>`
                        )
                        .join('')}
                </div>
            </div>

            <!-- 하단 도구 -->
            <div class="toolbar">
                <button id="addBox">OCR 박스 추가</button>
                <button id="removeBox">OCR 박스 삭제</button>
                <button id="zoomIn">확대</button>
                <button id="zoomOut">축소</button>
                <button id="nextImage">다음 이미지</button>
            </div>
        </div>
    `;

    // 이벤트 리스너 추가
    const thumbnails = document.querySelectorAll('.thumbnail');
    const imagePreview = document.querySelector('.image-preview img');

    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', () => {
            thumbnails.forEach((thumb) => thumb.classList.remove('selected'));
            thumbnail.classList.add('selected');
            imagePreview.src = thumbnail.src;
        });
    });

    document.getElementById('nextImage').addEventListener('click', () => {
        alert('다음 이미지로 이동합니다.'); // 실제 구현 시 작업 추가
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
