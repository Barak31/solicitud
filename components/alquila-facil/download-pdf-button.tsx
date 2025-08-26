
"use client";

import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

type Props = {
  getElement: () => HTMLElement | null;
};

export function DownloadPDFButton({ getElement }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { dictionary } = useLanguage();

  const handleDownload = async () => {
    setIsLoading(true);
    const element = getElement();

    if (!element) {
      console.error("Element not found for PDF generation");
      setIsLoading(false);
      return;
    }

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: true,
        });

        const imgData = canvas.toDataURL('image/png');
      
        // Letter size in inches: 8.5 x 11
        // jsPDF uses points (72 points per inch)
        const pdfWidth = 8.5 * 72; // 612
        const pdfHeight = 11 * 72; // 792

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'letter',
        });

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const canvasAspectRatio = canvasWidth / canvasHeight;
        
        const margin = 20; // 20 points margin
        const usableWidth = pdfWidth - (margin * 2);
        const usableHeight = pdfHeight - (margin * 2);

        const imgWidth = usableWidth;
        const imgHeight = imgWidth / canvasAspectRatio;

        let position = 0;
        let heightLeft = imgHeight;

        while (heightLeft > 0) {
            pdf.addImage(imgData, 'PNG', margin, margin - position, imgWidth, imgHeight);
            heightLeft -= usableHeight;
            
            if (heightLeft > 0) {
                pdf.addPage();
            }
            position += usableHeight;
        }

        pdf.save('solicitud-alquiler.pdf');

    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={isLoading} variant="outline">
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Download />
      )}
      <span className="ml-2">{dictionary.buttons.downloadPdf}</span>
    </Button>
  );
}
