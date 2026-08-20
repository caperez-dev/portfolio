import resumePDF from '../assets/Carlos Alfonso B. Perez - Updated Resume.pdf';

export function generateResumePDF() {
  const link = document.createElement('a');
  link.href = resumePDF;
  link.download = 'Carlos Alfonso B. Perez - Resume.pdf';
  link.click();
}
