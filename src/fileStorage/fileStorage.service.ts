/* eslint-disable prettier/prettier */
import * as fs from 'fs-extra';
import * as path from 'path';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class FileStorageService {
  private readonly filePath = path.join(__dirname, '..', 'data', 'payments.json');

  constructor() {
    fs.ensureDirSync(path.dirname(this.filePath));
  }

  private async readFile(): Promise<any[]> {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = await fs.readJson(this.filePath);
        return data;
      }
      return []; 
    } catch (error) {
      console.error('Error details:', error);
      throw new HttpException(
        { status: 'failure', message: 'Error reading file' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async writeFile(data: any[]): Promise<void> {
    try {
      await fs.writeJson(this.filePath, data, { spaces: 2 });
    } catch (error) {
      console.error('Error details:', error);
      throw new HttpException(
        { status: 'failure', message: 'Error writing to file' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addPayment(paymentDetails: any): Promise<any> {
    const data = await this.readFile();
    data.push(paymentDetails); 
    await this.writeFile(data); 
    return { message: 'Payment data stored in JSON file successfully' };
  }
}