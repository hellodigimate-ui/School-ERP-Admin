/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Move initialHTML outside the component to avoid useEffect dependency warnings
const initialHTML = `
<div class="preview-wrapper">
  <div class="certificate-container">
    <div class="certificate-border">
      <div class="title" contenteditable="true">Certificate of Achievement</div>
      <div class="subtitle" contenteditable="true">This certificate is proudly presented to</div>
      <div class="content">
        <div class="name" contenteditable="true">John Doe</div>
        For successfully completing the course<br>
        <strong contenteditable="true">Web Development Mastery</strong><br>
        With outstanding performance and dedication.
      </div>
      <div class="objective" contenteditable="true">
        Objective: Enhance web development skills and mastery
      </div>
      <div class="footer">
        <div class="signature" contenteditable="true">
          <div class="signature-line"></div>
          Instructor Signature
        </div>
        <div class="signature" contenteditable="true">
          <div class="signature-line"></div>
          Director Signature
        </div>
      </div>
      <div class="date" contenteditable="true">Date: 16 February 2026</div>
    </div>
  </div>
</div>
`;

const Page = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [html, setHtml] = useState<string>("");
  const [isReady, setIsReady] = useState(false);

  // Load iframe with the certificate HTML once
  useEffect(() => {
    if (!iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Certificate</title>
        <style>
          * { box-sizing: border-box; }
          body { margin:0; padding:0; background:#e5e7eb; display:flex; justify-content:center; align-items:center; min-height:100vh; }
          .preview-wrapper {
            /* Removed scale here for accurate PDF rendering */
            transform-origin: top center;
            width: 900px;
          }
          .certificate-container {
            width:900px;
            height:600px;
            background:#fff;
            padding:40px;
            border:15px solid #2c3e50;
            box-shadow:0 0 20px rgba(0,0,0,0.2);
            position:relative;
          }
          .certificate-border {
            border:5px solid #d4af37;
            height:100%;
            padding:30px;
          }
          .title {
            text-align:center;
            font-size:40px;
            font-weight:bold;
            color:#2c3e50;
            letter-spacing:2px;
          }
          .subtitle {
            text-align:center;
            font-size:20px;
            margin-top:10px;
            color:#555;
          }
          .content {
            text-align:center;
            margin-top:50px;
            font-size:22px;
            line-height:1.6;
            color:#333;
          }
          .name {
            font-size:34px;
            font-weight:bold;
            margin:25px 0;
            color:#d4af37;
          }
          .footer {
            position:absolute;
            bottom:60px;
            left:60px;
            right:60px;
            display:flex;
            justify-content:space-between;
            font-size:18px;
          }
          .signature {
            text-align:center;
          }
          .signature-line {
            width:200px;
            border-top:2px solid #000;
            margin:0 auto 5px;
          }
          .date {
            position:absolute;
            bottom:20px;
            right:40px;
            font-size:16px;
            color:#555;
          }
          .objective {
            text-align:center;
            margin-top:20px;
            font-size:18px;
            font-style:italic;
            color:#444;
          }
        </style>
      </head>
      <body>
        ${initialHTML}
        <script>
          function bindInputs() {
            const editable = document.querySelectorAll('[contenteditable="true"]');
            editable.forEach(el => {
              el.oninput = () => {
                window.parent.postMessage(document.body.innerHTML, "*");
              };
            });
          }
          bindInputs();
          window.parent.postMessage('ready', '*');

          window.addEventListener('message', (e) => {
            if (typeof e.data === 'string') {
              document.body.innerHTML = e.data;
              bindInputs();
            }
          });
        </script>
      </body>
      </html>
    `);
    doc.close();
    setHtml(initialHTML);
  }, []); // empty dependency array now correct because initialHTML is external

  // Listen to iframe messages
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data === "ready") {
        setIsReady(true);
      } else if (typeof event.data === "string") {
        setHtml(event.data);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Editor → preview
  const handleEditorChange = (value: string | undefined) => {
    if (!iframeRef.current) return;
    iframeRef.current.contentWindow?.postMessage(value ?? "", "*");
    setHtml(value ?? "");
  };

  // Save as PDF, fit to A4 size without overlapping
  const handleSavePDF = async () => {
    if (!iframeRef.current) return;
    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) return;

    const element = iframeDoc.querySelector(".certificate-container") as HTMLElement;
    if (!element) return;

    // Remove scale if any on parent container before capture for crisp result
    const previewWrapper = iframeDoc.querySelector(".preview-wrapper") as HTMLElement;
    if (previewWrapper) {
      previewWrapper.style.transform = "none";
    }

    // Use higher scale for better quality
    const canvas = await html2canvas(element, { scale: 3, backgroundColor: null });

    const imgData = canvas.toDataURL("image/png");

    // Calculate dimensions to fit A4 while keeping aspect ratio
    const pdf = new jsPDF("landscape", "pt", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Scale image to fit in PDF page
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgPDFWidth = imgWidth * ratio;
    const imgPDFHeight = imgHeight * ratio;

    const x = (pdfWidth - imgPDFWidth) / 2;
    const y = (pdfHeight - imgPDFHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, imgPDFWidth, imgPDFHeight);

    pdf.save("certificate.pdf");

    // Restore scale if needed
    if (previewWrapper) {
      previewWrapper.style.transform = "";
    }
  };

  // Reset certificate content
  const handleReset = () => {
    handleEditorChange(initialHTML);
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-2 gap-6 p-6 h-screen">

        <div className="border rounded-lg flex flex-col">
          <div className="bg-gray-200 p-2 font-semibold">HTML Editor</div>
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="html"
              theme="vs-dark"
              value={html}
              onChange={handleEditorChange}
            />
          </div>
          {isReady && (
            <div className="flex justify-end gap-2 p-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleSavePDF}
              >
                Save
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          )}
        </div>

        <div className="border rounded-lg flex flex-col bg-gray-100">
          <div className="bg-gray-200 p-2 font-semibold">Editable Preview</div>
          <iframe
            ref={iframeRef}
            sandbox="allow-scripts allow-same-origin"
            className="flex-1"
            title="preview"
          />
        </div>

      </div>
    </AdminLayout>
  );
};

export default Page;
