/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PaymentService } from './payment/payment.service';
import { FileStorageService } from './fileStorage/fileStorage.service';
import { MockGatewayService } from './mockGateways/mockGateway.service';
import { PaymentController } from './payment/payment.controller';


@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [PaymentService, MockGatewayService, FileStorageService],
})
export class AppModule {}
