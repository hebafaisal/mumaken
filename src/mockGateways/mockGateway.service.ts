/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MockGatewayService {
  private readonly gatewayResponses = {
    Mada: { success: true, message: 'Payment successful' },
    Telr: { success: false, message: 'Gateway unavailable' },
    Geidea: { success: true, message: 'Payment successful' },
    CCAvenue: { success: false, message: 'Payment failed' },
  };

  private readonly aiModelUrl = 'https://5ac3-51-211-220-20.ngrok-free.app/docs/'; 

  private async decideGateway(paymentDetails: any): Promise<string> {
    try {
      const response = await axios.post(this.aiModelUrl, paymentDetails);
      if (response.data.bestGateway && this.gatewayResponses[response.data.bestGateway]) {
        return response.data.bestGateway;
      } else {
        return 'Mada'; 
      }
    } catch (error) {
      console.error('AI model error:', error.message);
      return 'Mada'; 
    }
  }

  async processPayment(
    cardInfo: { name: string; cardNumber: string; expiryDate: string; cvv: string },
    amount: number,
    currency: string
  ): Promise<any> {
    if (currency !== 'SAR') {
      throw new HttpException(
        { status: 'failure', message: 'Only SAR currency is supported' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const paymentDetails = {
      amount,
      timestamp: new Date().toISOString(),
      card_number: cardInfo.cardNumber,
    };

    const selectedGateway = await this.decideGateway(paymentDetails);
    const gatewayResponse = this.gatewayResponses[selectedGateway];

    if (gatewayResponse.success) {
      return {
        status: 'success',
        message: gatewayResponse.message,
        amount,
        currency,
        cardholderName: cardInfo.name,
      };
    } else {
      throw new HttpException(
        { status: 'failure', message: gatewayResponse.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}