/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MockGatewayService } from './mockGateway.service';


@Module({
  providers: [MockGatewayService],
  exports: [MockGatewayService], 
})
export class MockGatewayModule {}
