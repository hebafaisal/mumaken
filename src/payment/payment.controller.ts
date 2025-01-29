/* eslint-disable prettier/prettier */
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';


@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment')
  @HttpCode(HttpStatus.CREATED)
  async createPayment(
    @Body()
    body: { 
      cardInfo: { name: string; cardNumber: string; expiryDate: string; cvv: string };
      amount: number;
      currency: string;
    },
  ) {
    const { cardInfo, amount, currency } = body;
    return await this.paymentService.createPayment(cardInfo, amount, currency);
  }
}


