/* ============================================
   Image to PDF — js/script.js
   Author : gorupa (https://github.com/gorupa)
   License: MIT

   Dependencies:
     - jsPDF 2.5.1 (loaded via CDN in index.html)
   ============================================ */

/* ── jsPDF shortcut ── */
const { jsPDF } = window.jspdf;

/* ────────────────────────────────────────────
   State
   ──────────────────────────────────────────── */
let images      = [];        // Array of { file, dataUrl, name, size }
let pageSize    = 'a4';      // 'a4' | 'letter' | 'fit'
let orientation = 'portrait';// 'portrait' | 'landscape'
let margin      = 10;        // mm — 0 | 10 | 20

/* ────────────────────────────────────────────
   DOM References
   ──────────────────────────────────────────── */
const uploadZone    = document.getElementById('uploadZone');
const fileInput     = document.getElementById('fileInput');
const addMoreBtn    = document.getElementById('addMoreBtn');
const addMoreInput  = document.getElementById('addMoreInput');
const queuePanel    = document.getElementById('queuePanel');
const imageList     = document.getElementById('imageList');
const queueCount    = document.getElementById('queueCount');
const convertBtn    = document.getElementById('convertBtn');
const progressWrap  = document.getElementById('progressWrap');
const progressBar   = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');
const resultsPanel  = document.getElementById('resultsPanel');
const resultImages  = document.getElementById('resultImages');
const resultPages   = document.getElementById('resultPages');
const resultSize    = document.getElementById('resultSize');
const downloadLink  = document.getElementById('downloadLink');
const resetBtn      = document.getElementById('resetBtn');

/* ────────────────────────────────────────────
   Utilities
   ──────────────────────────────────────────── */

/**
 * Formats a byte value into a human-readable string (B / KB / MB).
 * @param {number} bytes
 * @returns {string}
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Reads a File and returns its data URL via a Promise.
 * @param {File} file
 * @returns {Promise<string>}
 */
function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Returns the natural pixel dimensions of an image data URL.
 * @param {string} dataUrl
 * @returns {Promise<{w: number, h: number}>}
 */
function getImageDimensions(dataUrl) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.src = dataUrl;
    });
}

/* ────────────────────────────────────────────
   Image Queue
   ──────────────────────────────────────────── */

/**
 * Accepts an array of File objects, reads them, and adds them to the
 * images queue, then re-renders the list and shows the queue panel.
 * @param {File[]} files
 */
async function addFiles(files) {
    for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        const dataUrl = await readFileAsDataUrl(file);
        images.push({ file, dataUrl, name: file.name, size: file.size });
    }
    renderQueue();
    if (images.length > 0) {
        uploadZone.classList.add('hidden');
        queuePanel.classList.remove('hidden');
    }
}

/**
 * Re-renders the image list from the current `images` array.
 * Attaches remove-button handlers and initialises drag-to-sort.
 */
function renderQueue() {
    imageList.innerHTML = '';
    queueCount.textContent = images.length;

    images.forEach((img, i) => {
        const item = document.createElement('div');
        item.className  = 'image-item';
        item.draggable  = true;
        item.dataset.index = i;
        item.innerHTML = `
            <span class="material-icons-round item-drag-handle">drag_indicator</span>
            <img class="item-thumb" src="${img.dataUrl}" alt="${img.name}">
            <div class="item-info">
                <div class="item-name">${img.name}</div>
                <div class="item-size">${formatBytes(img.size)}</div>
            </div>
            <button class="item-remove" data-index="${i}" title="Remove image">
                <span class="material-icons-round">close</span>
            </button>
        `;
        imageList.appendChild(item);
    });

    // Remove individual images
    imageList.querySelectorAll('.item-remove').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = parseInt(e.currentTarget.dataset.index);
            images.splice(idx, 1);
            renderQueue();
            if (images.length === 0) {
                queuePanel.classList.add('hidden');
                uploadZone.classList.remove('hidden');
                fileInput.value = '';
            }
        });
    });

    setupDragSort();
}

/* ────────────────────────────────────────────
   Drag-to-Reorder
   ──────────────────────────────────────────── */
let dragSrc = null;

/**
 * Wires up HTML5 drag events on each image-item to allow reordering
 * by dragging rows within the list.
 */
function setupDragSort() {
    const items = imageList.querySelectorAll('.image-item');

    items.forEach(item => {
        item.addEventListener('dragstart', e => {
            dragSrc = item;
            item.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'move';
        });

        item.addEventListener('dragend', () => {
            item.style.opacity = '1';
            dragSrc = null;
        });

        item.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        item.addEventListener('drop', e => {
            e.preventDefault();
            if (!dragSrc || dragSrc === item) return;
            const fromIdx = parseInt(dragSrc.dataset.index);
            const toIdx   = parseInt(item.dataset.index);
            const moved   = images.splice(fromIdx, 1)[0];
            images.splice(toIdx, 0, moved);
            renderQueue();
        });
    });
}

/* ────────────────────────────────────────────
   File Input Events
   ──────────────────────────────────────────── */
uploadZone.addEventListener('click',  () => fileInput.click());
fileInput.addEventListener('change',  e  => addFiles(Array.from(e.target.files)));

addMoreBtn.addEventListener('click',  () => addMoreInput.click());
addMoreInput.addEventListener('change', e => addFiles(Array.from(e.target.files)));

// Drag & drop onto the upload zone
uploadZone.addEventListener('dragover',  e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', ()  => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    addFiles(Array.from(e.dataTransfer.files));
});

/* ────────────────────────────────────────────
   Options
   ──────────────────────────────────────────── */
document.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-page]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        pageSize = btn.dataset.page;
    });
});

document.querySelectorAll('[data-orient]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-orient]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        orientation = btn.dataset.orient;
    });
});

document.querySelectorAll('[data-margin]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-margin]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        margin = parseInt(btn.dataset.margin);
    });
});

/* ────────────────────────────────────────────
   PDF Conversion
   ──────────────────────────────────────────── */

/**
 * Reads all queued images, creates a jsPDF document with one image per
 * page (respecting pageSize / orientation / margin settings), then
 * generates an object URL for download.
 */
convertBtn.addEventListener('click', async () => {
    if (images.length === 0) return;

    // Show loading state
    convertBtn.disabled = true;
    convertBtn.innerHTML = `<span class="material-icons-round" style="animation:spin 0.8s linear infinite">hourglass_empty</span> Building PDF…`;
    progressWrap.classList.add('visible');
    progressLabel.classList.add('visible');
    await new Promise(r => setTimeout(r, 50)); // allow browser to repaint

    try {
        // Standard page dimensions in mm
        const PAGE_SIZES = {
            a4:     [210,   297],
            letter: [215.9, 279.4],
        };

        let pdf = null;

        for (let i = 0; i < images.length; i++) {
            const img      = images[i];
            const progress = Math.round(((i + 0.5) / images.length) * 100);
            progressBar.style.width   = progress + '%';
            progressLabel.textContent = `Processing image ${i + 1} of ${images.length}…`;
            await new Promise(r => setTimeout(r, 10)); // yield to UI

            const dims = await getImageDimensions(img.dataUrl);
            const imgW = dims.w;
            const imgH = dims.h;

            // Determine page dimensions (mm)
            let pW, pH;
            if (pageSize === 'fit') {
                // Size the page to match the image (96 dpi assumed)
                pW = imgW * 25.4 / 96;
                pH = imgH * 25.4 / 96;
            } else {
                [pW, pH] = PAGE_SIZES[pageSize];
                if (orientation === 'landscape') [pW, pH] = [pH, pW];
            }

            const orient = (pW > pH) ? 'l' : 'p';

            if (!pdf) {
                pdf = new jsPDF({ orientation: orient, unit: 'mm', format: [pW, pH] });
            } else {
                pdf.addPage([pW, pH], orient);
            }

            // Scale image to fill available area while preserving aspect ratio
            const availW = pW - margin * 2;
            const availH = pH - margin * 2;
            const ratio  = Math.min(availW / imgW, availH / imgH);
            const drawW  = imgW * ratio;
            const drawH  = imgH * ratio;
            const x = margin + (availW - drawW) / 2;
            const y = margin + (availH - drawH) / 2;

            const fmt = img.file.type === 'image/png' ? 'PNG' : 'JPEG';
            pdf.addImage(img.dataUrl, fmt, x, y, drawW, drawH);
        }

        progressBar.style.width   = '100%';
        progressLabel.textContent = 'Finalising PDF…';
        await new Promise(r => setTimeout(r, 100));

        // Generate download URL
        const pdfBlob = pdf.output('blob');
        const pdfUrl  = URL.createObjectURL(pdfBlob);

        // Populate result panel
        resultImages.textContent = images.length;
        resultPages.textContent  = images.length;
        resultSize.textContent   = formatBytes(pdfBlob.size);
        downloadLink.href        = pdfUrl;
        downloadLink.download    = 'images_converted.pdf';

        queuePanel.classList.add('hidden');
        resultsPanel.classList.remove('hidden');

    } catch (err) {
        console.error('PDF creation failed:', err);
        alert('Something went wrong creating the PDF. Please try again.');
    } finally {
        progressWrap.classList.remove('visible');
        progressLabel.classList.remove('visible');
        progressBar.style.width = '0%';
        convertBtn.innerHTML = `<span class="material-icons-round">picture_as_pdf</span> Convert to PDF`;
        convertBtn.disabled  = false;
    }
});

/* ────────────────────────────────────────────
   Reset
   ──────────────────────────────────────────── */
resetBtn.addEventListener('click', () => {
    images = [];
    resultsPanel.classList.add('hidden');
    uploadZone.classList.remove('hidden');
    fileInput.value      = '';
    addMoreInput.value   = '';
    imageList.innerHTML  = '';
    queueCount.textContent = '0';
});
