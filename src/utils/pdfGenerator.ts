import { jsPDF } from 'jspdf';
import { resumeData } from '../data/resume';

export function generateResumePDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = 40;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(20, 30, 55); // Dark blue primary
  doc.text(resumeData.name.toUpperCase(), margin, y);
  y += 18;

  // Contact line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const contactText = `${resumeData.contact.location} | ${resumeData.contact.phone} | ${resumeData.contact.email} | ${resumeData.contact.linkedin.replace('https://', '')}`;
  doc.text(contactText, margin, y);
  y += 15;

  // Divider Line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(1);
  doc.line(margin, y, margin + contentWidth, y);
  y += 15;

  // Helper function for Section Titles
  const addSectionTitle = (title: string) => {
    if (y > 720) {
      doc.addPage();
      y = 40;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), margin, y);
    y += 5;
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.75);
    doc.line(margin, y, margin + contentWidth, y);
    y += 12;
  };

  // Professional Summary
  addSectionTitle('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(40, 40, 40);
  const summaryLines = doc.splitTextToSize(resumeData.summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 12 + 10;

  // Skills
  addSectionTitle('Skills');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('IT Operations & Deployment:', margin, y);
  doc.setFont('helvetica', 'normal');
  const itOpsText = resumeData.skills.itOps.join(', ');
  const itOpsLines = doc.splitTextToSize(itOpsText, contentWidth - 140);
  doc.text(itOpsLines, margin + 140, y);
  y += Math.max(1, itOpsLines.length) * 12 + 4;

  doc.setFont('helvetica', 'bold');
  doc.text('Web Development:', margin, y);
  y += 12;

  resumeData.skills.webDev.forEach((sub) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`• ${sub.category}:`, margin + 10, y);
    doc.setFont('helvetica', 'normal');
    const skillListStr = sub.skills.map((s) => s.name).join(', ');
    const lines = doc.splitTextToSize(skillListStr, contentWidth - 160);
    doc.text(lines, margin + 150, y);
    y += Math.max(1, lines.length) * 11 + 2;
  });

  if (resumeData.skills.other.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('Other Skills:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(resumeData.skills.other.join(', '), margin + 140, y);
    y += 14;
  }

  if (resumeData.skills.softSkills.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text('Soft Skills:', margin, y);
    doc.setFont('helvetica', 'normal');
    const softStr = resumeData.skills.softSkills.join(', ');
    const softLines = doc.splitTextToSize(softStr, contentWidth - 140);
    doc.text(softLines, margin + 140, y);
    y += softLines.length * 12 + 10;
  }

  // Experience
  addSectionTitle('Experience');
  resumeData.experience.forEach((exp) => {
    if (y > 700) {
      doc.addPage();
      y = 40;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(exp.title, margin, y);

    doc.setFont('helvetica', 'bold');
    doc.text(exp.period, margin + contentWidth, y, { align: 'right' });
    y += 12;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.text(exp.company, margin, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    exp.highlights.forEach((bullet) => {
      const bLines = doc.splitTextToSize(`• ${bullet}`, contentWidth - 15);
      if (y + bLines.length * 11 > 740) {
        doc.addPage();
        y = 40;
      }
      doc.text(bLines, margin + 10, y);
      y += bLines.length * 11 + 2;
    });
    y += 8;
  });

  // Education
  addSectionTitle('Education');
  resumeData.education.forEach((edu) => {
    if (y > 700) {
      doc.addPage();
      y = 40;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(edu.institution, margin, y);
    doc.text(edu.period, margin + contentWidth, y, { align: 'right' });
    y += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text(`${edu.degree} ${edu.honors ? `— ${edu.honors}` : ''}`, margin, y);
    y += 12;

    if (edu.gwa) {
      doc.setFontSize(9);
      doc.text(`• Cumulative GWA: ${edu.gwa} - ${edu.honors}`, margin + 10, y);
      y += 12;
    }
    if (edu.coursework) {
      const cwStr = `• Relevant Coursework: ${edu.coursework.join(', ')}`;
      const cwLines = doc.splitTextToSize(cwStr, contentWidth - 15);
      doc.text(cwLines, margin + 10, y);
      y += cwLines.length * 11 + 4;
    }
    y += 6;
  });

  // Projects
  addSectionTitle('Projects');
  resumeData.projects.forEach((proj) => {
    if (y > 700) {
      doc.addPage();
      y = 40;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(proj.title, margin, y);
    y += 12;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(70, 70, 70);
    doc.text(`${proj.technologies.join(', ')} | Role: ${proj.role}`, margin, y);
    y += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    proj.description.forEach((d) => {
      const dLines = doc.splitTextToSize(`• ${d}`, contentWidth - 15);
      if (y + dLines.length * 10 > 740) {
        doc.addPage();
        y = 40;
      }
      doc.text(dLines, margin + 10, y);
      y += dLines.length * 10 + 2;
    });
    y += 6;
  });

  // Certifications
  addSectionTitle('Certifications & Achievements');
  resumeData.certifications.forEach((cert) => {
    if (y > 720) {
      doc.addPage();
      y = 40;
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const certText = `• ${cert.title} — ${cert.issuer} (${cert.date})`;
    const certLines = doc.splitTextToSize(certText, contentWidth - 10);
    doc.text(certLines, margin + 5, y);
    y += certLines.length * 11 + 1;
  });

  // Save PDF
  doc.save('Carlos_Alfonso_Perez_Resume.pdf');
}
