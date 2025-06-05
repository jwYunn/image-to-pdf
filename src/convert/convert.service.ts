import { Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs/promises';

@Injectable()
export class ConvertService {
  async createPdfFromImages(images: Express.Multer.File[]): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();

    for (const image of images) {
      const imageBytes = await fs.readFile(image.path);
      const ext = image.mimetype;

      let imageEmbed;
      if (ext === 'image/jpeg') {
        imageEmbed = await pdfDoc.embedJpg(imageBytes);
      } else if (ext === 'image/png') {
        imageEmbed = await pdfDoc.embedPng(imageBytes);
      } else {
        continue; // 지원하지 않는 포맷
      }

      const { width, height } = imageEmbed.scale(1);
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(imageEmbed, { x: 0, y: 0, width, height });
    }

    return Buffer.from(await pdfDoc.save());
  }
}