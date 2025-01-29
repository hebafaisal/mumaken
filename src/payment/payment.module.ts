/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FileStorageModule } from 'src/fileStorage/fileStorage.module';
import { MockGatewayModule } from 'src/mockGateways/mockGatewa.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';


@Module({
  imports: [
    MockGatewayModule, 
    FileStorageModule, 
  ],
  providers: [PaymentService], 
  controllers: [PaymentController],
})
export class PaymentModule {}