<div align="center">

<img src="https://img.shields.io/badge/Image%20to%20PDF-e8410a?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Image to PDF" height="50"/>

<br/>
<br/>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-image--to--pdf--afb.pages.dev-e8410a?style=for-the-badge)](https://image-to-pdf-afb.pages.dev/)

<br/>

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Open Source](https://img.shields.io/badge/Open%20Source-❤️-purple?style=flat-square)](https://github.com/gorupa/image-to-pdf)
[![Ad-Free](https://img.shields.io/badge/Ad--Free-✓-green?style=flat-square)](https://image-to-pdf-afb.pages.dev/)
[![No Server](https://img.shields.io/badge/No%20Server-100%25%20Local-blue?style=flat-square)](https://image-to-pdf-afb.pages.dev/)
[![Made with jsPDF](https://img.shields.io/badge/jsPDF-Powered-orange?style=flat-square)](https://github.com/parallax/jsPDF)
[![Deployed on Cloudflare](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://image-to-pdf-afb.pages.dev/)

<br/>

# 📄 Image to PDF

### Convert JPG, PNG & WebP images into a PDF — instantly, privately, right in your browser.
### No uploads. No server. No ads. Ever.

<br/>

[**🌐 Try it Live →**](https://image-to-pdf-afb.pages.dev/) · [**📖 How it Works**](#️-how-it-works) · [**🛠 Run Locally**](#-run-locally) · [**🤝 Contributing**](#-contributing)

<br/>

> 🔗 Also from the same suite: **[Local Image Compressor](https://local-image-compressor.pages.dev/)** — compress images privately in your browser.

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **Multi-Image to PDF** | Combine multiple images into a single PDF in one click |
| 🖱️ **Drag to Reorder** | Drag images up and down to set the exact page order |
| ➕ **Add More Anytime** | Add extra images to the queue after your initial selection |
| ⚙️ **Page Size Options** | Choose A4, US Letter, or Fit Image (page sized to each image) |
| 🔄 **Portrait & Landscape** | Switch orientation freely before converting |
| 📐 **Margin Control** | Set None, Small, or Large margins around each image |
| 📊 **Live Progress Bar** | See which image is being processed in real time |
| 🔒 **100% Private** | Your images never leave your device — zero uploads |
| 🚫 **Zero Ads** | Completely ad-free, always |
| 🌐 **No Install Needed** | Works in any modern browser, no extensions required |
| 🧑‍💻 **Open Source** | MIT licensed — fork it, improve it, share it |

---

## 🖼️ How it Works

```
   You select images (JPG / PNG / WebP)
                │
                ▼
   Images load into browser memory
   ┌──────────────────────────────┐
   │  Drag to set page order      │
   │  Add more images if needed   │
   │  Remove any you don't want   │
   └──────────────────────────────┘
                │
                ▼
   Choose your settings:
   ┌──────────────────────────────┐
   │  Page size  →  A4 / Letter / Fit Image  │
   │  Orientation →  Portrait / Landscape    │
   │  Margin     →  None / Small / Large     │
   └──────────────────────────────┘
                │
                ▼
   Click "Convert to PDF"
                │
                ▼
   jsPDF builds the PDF in memory
   — one image per page —
                │
                ▼
   PDF downloads directly
   to your device
```

> **No data is ever sent anywhere.** All processing happens in your browser using [jsPDF](https://github.com/parallax/jsPDF) — a battle-tested open source library.

---

## 🚀 Run Locally

No build tools. No npm install. No config. Just open the file.

```bash
# 1. Clone the repository
git clone https://github.com/gorupa/image-to-pdf.git

# 2. Enter the project folder
cd image-to-pdf

# 3. Open in your browser
open index.html
# — or simply double-click index.html in your file explorer
```

That's it. ✅

---

## 📁 Project Structure

```
image-to-pdf/
│
├── index.html           # App structure & markup
├── css/
│   └── style.css        # All styles, animations & design tokens
├── js/
│   └── script.js        # Conversion logic, drag-sort, queue management
├── README.md            # You are here
└── LICENSE              # MIT License
```

---

## 🛠️ Built With

| Technology | Purpose |
|---|---|
| **HTML5** | App structure & semantic markup |
| **CSS3** | Animations, layout & CSS design tokens |
| **Vanilla JavaScript** | Queue management, drag-to-sort, PDF logic |
| **[jsPDF 2.5.1](https://github.com/parallax/jsPDF)** | Client-side PDF generation |
| **Google Material Icons** | UI icons |
| **DM Sans & DM Mono** | Typography (Google Fonts) |

> No frameworks. No bundlers. No build step. Pure web standards.

---

## 🔬 Under the Hood

Each image is placed onto a jsPDF page, scaled to fit within the chosen margin:

```javascript
// Create the PDF document
const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: [210, 297] }); // A4

// Scale image to fill available area, preserving aspect ratio
const availW = pageWidth  - margin * 2;
const availH = pageHeight - margin * 2;
const ratio  = Math.min(availW / imgW, availH / imgH);

pdf.addImage(dataUrl, 'JPEG', x, y, imgW * ratio, imgH * ratio);

// Generate a local download URL — nothing is sent to any server
const blob = pdf.output('blob');
const url  = URL.createObjectURL(blob);
```

Images are read with the browser's native `FileReader` API and held in memory as data URLs — they never touch a network connection.

---

## 🔒 Privacy Policy

This tool has the simplest privacy policy possible:

| | |
|---|---|
| ❌ | No data collection |
| ❌ | No analytics or tracking |
| ❌ | No cookies |
| ❌ | No server communication |
| ❌ | No ads |
| ✅ | All images stay 100% on your device |

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-idea`
3. **Commit** your changes: `git commit -m 'Add: your feature'`
4. **Push** to the branch: `git push origin feature/your-idea`
5. **Open** a Pull Request

### 💡 Ideas for contributions

- [ ] Merge multiple PDFs together
- [ ] Reorder pages inside an existing PDF
- [ ] Custom filename before download
- [ ] Dark mode toggle
- [ ] WebP → PDF direct support improvement
- [ ] Image rotation per page (0°, 90°, 180°, 270°)
- [ ] Password-protect the output PDF

---

## 🔗 Related Tools

| Tool | Description | Link |
|---|---|---|
| 🗜️ **Local Image Compressor** | Compress JPG & PNG privately in your browser | [local-image-compressor.pages.dev](https://local-image-compressor.pages.dev/) |
| 📄 **Image to PDF** | This tool | [image-to-pdf-afb.pages.dev](https://image-to-pdf-afb.pages.dev/) |

---

## 📄 License

```
MIT License

Copyright (c) 2026 gorupa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

See the full [LICENSE](./LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [gorupa](https://github.com/gorupa)

🌐 **Live at [image-to-pdf-afb.pages.dev](https://image-to-pdf-afb.pages.dev/)**

⭐ If this project helped you, consider giving it a star!

</div>
