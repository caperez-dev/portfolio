import resumePDF from '../assets/Carlos Alfonso B. Perez - Updated Resume.pdf';

const RESUME_FILENAME = 'Carlos Alfonso B. Perez - Updated Resume.pdf';

export async function generateResumePDF() {
  const response = await fetch(resumePDF);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = RESUME_FILENAME;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
