import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function PDFViewer({ file }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="flex flex-col h-full bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 bg-white border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                        disabled={pageNumber <= 1}
                        className="p-1 hover:bg-slate-100 rounded disabled:opacity-50"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-medium text-slate-600">
                        Page {pageNumber} of {numPages || '--'}
                    </span>
                    <button
                        onClick={() => setPageNumber(p => Math.min(numPages || Infinity, p + 1))}
                        disabled={pageNumber >= numPages}
                        className="p-1 hover:bg-slate-100 rounded disabled:opacity-50"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                        className="p-1 hover:bg-slate-100 rounded"
                    >
                        <ZoomOut size={20} />
                    </button>
                    <span className="text-sm font-medium text-slate-600 w-12 text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={() => setScale(s => Math.min(2.0, s + 0.1))}
                        className="p-1 hover:bg-slate-100 rounded"
                    >
                        <ZoomIn size={20} />
                    </button>
                </div>
            </div>

            {/* PDF Content */}
            <div className="flex-1 overflow-auto flex justify-center p-4 bg-slate-50">
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="shadow-lg"
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="bg-white"
                    />
                </Document>
            </div>
        </div>
    );
}
