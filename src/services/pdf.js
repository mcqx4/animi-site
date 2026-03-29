const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'stories');

// Ensure the stories directory exists
function ensureStoriesDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getPDFPath(storyId) {
  return path.join(DATA_DIR, `${storyId}.pdf`);
}

/**
 * Generate a beautifully styled A5 PDF fairy tale.
 *
 * @param {Object} storyData
 * @param {string} storyData.title - Story title
 * @param {string} storyData.text - Full story text
 * @param {string} storyData.child_name - Child's name
 * @param {number} storyData.child_age - Child's age
 * @param {string|number} [storyData.id] - Story ID for saving to disk
 * @returns {Promise<Buffer>} PDF bytes
 */
function generatePDF(storyData) {
  return new Promise((resolve, reject) => {
    try {
      const { title, text, child_name, child_age, id } = storyData;

      const doc = new PDFDocument({
        size: 'A5',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: title,
          Author: 'ANIMI Stories',
          Subject: `Сказка для ${child_name}`,
          Creator: 'ANIMI Stories — animistories.com',
        },
        bufferPages: true,
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const buffer = Buffer.concat(chunks);

        // If an ID is provided, save to disk as well
        if (id) {
          ensureStoriesDir();
          const filePath = getPDFPath(id);
          fs.writeFileSync(filePath, buffer);
          console.log(`[PDF] Saved to ${filePath}`);
        }

        resolve(buffer);
      });
      doc.on('error', reject);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

      // ==========================================
      // PAGE 1 — COVER
      // ==========================================
      const pageHeight = doc.page.height;
      const centerY = pageHeight / 2 - 80;

      // "ANIMI" at top area
      doc
        .font('Times-Roman')
        .fontSize(14)
        .fillColor('#0B2E30');

      const animiText = 'A N I M I';
      const animiWidth = doc.widthOfString(animiText);
      doc.text(animiText, (doc.page.width - animiWidth) / 2, centerY - 60);

      // Decorative line above title
      const lineY = centerY - 25;
      const lineWidth = 60;
      doc
        .strokeColor('#0B2E30')
        .lineWidth(0.5)
        .moveTo((doc.page.width - lineWidth) / 2, lineY)
        .lineTo((doc.page.width + lineWidth) / 2, lineY)
        .stroke();

      // Story title — large serif
      doc
        .font('Times-Bold')
        .fontSize(22)
        .fillColor('#0B2E30');
      doc.text(title, doc.page.margins.left, centerY, {
        width: pageWidth,
        align: 'center',
        lineGap: 6,
      });

      // Subtitle
      const subtitleY = doc.y + 20;
      doc
        .font('Times-Italic')
        .fontSize(12)
        .fillColor('#4A6B6D');
      doc.text(`Сказка для ${child_name}`, doc.page.margins.left, subtitleY, {
        width: pageWidth,
        align: 'center',
      });

      // Small decorative line below subtitle
      const line2Y = doc.y + 15;
      doc
        .strokeColor('#4A6B6D')
        .lineWidth(0.5)
        .moveTo((doc.page.width - 40) / 2, line2Y)
        .lineTo((doc.page.width + 40) / 2, line2Y)
        .stroke();

      // ==========================================
      // PAGES 2+ — STORY TEXT
      // ==========================================
      doc.addPage();

      const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());

      paragraphs.forEach((paragraph, idx) => {
        const trimmed = paragraph.trim();
        if (!trimmed) return;

        // Check if we need a new page (leave room for at least 3 lines)
        if (doc.y > doc.page.height - doc.page.margins.bottom - 50) {
          doc.addPage();
        }

        if (idx === 0) {
          // First paragraph — larger first letter effect
          // We render the first character in a larger font, then continue with normal text
          const firstChar = trimmed[0];
          const restOfParagraph = trimmed.slice(1);

          doc
            .font('Times-Bold')
            .fontSize(20)
            .fillColor('#0B2E30');

          doc.text(firstChar, doc.page.margins.left, doc.y, {
            continued: true,
          });

          doc
            .font('Times-Roman')
            .fontSize(12)
            .fillColor('#1A1A1A');

          doc.text(restOfParagraph, {
            width: pageWidth,
            align: 'justify',
            lineGap: 8,
          });
        } else {
          doc
            .font('Times-Roman')
            .fontSize(12)
            .fillColor('#1A1A1A');

          doc.text(trimmed, doc.page.margins.left, doc.y, {
            width: pageWidth,
            align: 'justify',
            lineGap: 8,
            indent: 20,
          });
        }

        // Paragraph spacing
        doc.moveDown(0.5);
      });

      // ==========================================
      // LAST PAGE — COLOPHON
      // ==========================================
      doc.addPage();

      const colophonY = doc.page.height / 2 - 40;

      doc
        .font('Times-Bold')
        .fontSize(16)
        .fillColor('#0B2E30');
      doc.text('ANIMI Stories', doc.page.margins.left, colophonY, {
        width: pageWidth,
        align: 'center',
      });

      doc.moveDown(1);
      doc
        .font('Times-Italic')
        .fontSize(11)
        .fillColor('#4A6B6D');
      doc.text('Оживляем сказки. Бережём душу.', {
        width: pageWidth,
        align: 'center',
      });

      doc.moveDown(0.8);
      doc
        .font('Times-Roman')
        .fontSize(10)
        .fillColor('#4A6B6D');
      doc.text('animistories.com', {
        width: pageWidth,
        align: 'center',
        link: 'https://animistories.com',
      });

      // ==========================================
      // PAGE NUMBERS (skip cover page)
      // ==========================================
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 1; i < totalPages; i++) {
        doc.switchToPage(i);
        doc
          .font('Times-Roman')
          .fontSize(9)
          .fillColor('#999999');

        const pageNumText = String(i);
        const numWidth = doc.widthOfString(pageNumText);
        doc.text(
          pageNumText,
          (doc.page.width - numWidth) / 2,
          doc.page.height - 35,
        );
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generatePDF, getPDFPath };
