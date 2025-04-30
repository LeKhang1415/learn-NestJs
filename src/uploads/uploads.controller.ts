import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './providers/uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(
    /**
     * inject uploadsService
     */
    private readonly uploadsService: UploadsService,
  ) {}

  // File is the field name
  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadFileToCloudinary(file);
  }
}
