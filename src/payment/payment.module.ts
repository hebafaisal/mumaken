/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { FileStorageModule } from 'src/fileStorage/fileStorage.module';
import { MockGatewayModule } from 'src/mockGateways/mockGatewa.module';

@Module({
  imports: [MockGatewayModule, FileStorageModule], // Import these modules here
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}