import { BadRequestException } from '@nestjs/common';
import * as multer from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerOptions: MulterOptions = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50000
  },
  fileFilter: (req, file, callback) => {
    const { headers } = req;
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(new BadRequestException('Invalido tipo de Archivo. Solo se permiten archivos (xlsx|xls)'), false);
    }
    callback(null, true);
  }
};
