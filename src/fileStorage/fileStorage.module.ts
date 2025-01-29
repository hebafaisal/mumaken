/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FileStorageService } from './fileStorage.service';

@Module({
  providers: [FileStorageService],
  exports: [FileStorageService], 
})
export class FileStorageModule {}
