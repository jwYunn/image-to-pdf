import { Controller, Post, UploadedFiles, UseInterceptors, Res } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ConvertService } from './convert.service';
import { Response } from 'express';

@Controller('convert')
export class ConvertController {
  constructor(private readonly convertService: ConvertService) {}

  @Post('image-to-pdf')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async convertImagesToPdf(
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.convertService.createPdfFromImages(files.images || []);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="converted.pdf"',
    });
    res.send(pdfBuffer);
  }
}