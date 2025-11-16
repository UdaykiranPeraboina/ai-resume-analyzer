/**
 * Converts a PDF file to an image (PNG format)
 * @param file - The PDF file to convert
 * @returns Object containing the converted image file and its data URL
 */
export async function convertPdfToImage(file: File | null): Promise<{
  file: File | null;
  dataUrl: string;
}> {
  if (!file) {
    return { file: null, dataUrl: '' };
  }

  try {
    // Import pdf.js library dynamically
    const pdfjsLib = await import('pdfjs-dist');
    
    // Use unpkg CDN for the worker (more reliable than cdnjs)
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    // Get first page
    const page = await pdf.getPage(1);
    
    // Set scale for rendering
    const scale = 2.0;
    const viewport = page.getViewport({ scale });
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Render PDF page to canvas
    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    }).promise;
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      }, 'image/png');
    });
    
    // Create File from blob
    const imageFile = new File(
      [blob],
      file.name.replace('.pdf', '.png'),
      { type: 'image/png' }
    );
    
    // Create data URL for preview
    const dataUrl = canvas.toDataURL('image/png');
    
    return {
      file: imageFile,
      dataUrl,
    };
  } catch (error) {
    console.error('Error converting PDF to image:', error);
    return { file: null, dataUrl: '' };
  }
}
