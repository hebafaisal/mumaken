/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { FileStorageService } from "src/fileStorage/fileStorage.service";
import { MockGatewayService } from "src/mockGateways/mockGateway.service";

@Injectable()
export class PaymentService {
  private gateways = [
    { name: 'Telr', priority: 1, acceptedCards: ['Visa', 'MasterCard', 'Mada'], attempts: 0 },
    { name: 'Geidea', priority: 2, acceptedCards: ['Visa', 'MasterCard', 'Mada'], attempts: 0 },
    { name: 'CCAvenue', priority: 3, acceptedCards: ['Visa', 'MasterCard', 'Mada'], attempts: 0 },
  ];

  private gatewayFailures = new Map<string, number>();

  constructor(
    private readonly mockGatewayService: MockGatewayService,
    private readonly fileStorageService: FileStorageService 
  ) { }

  private detectCardType(cardNumber: string): string {
    const bin = cardNumber.substring(0, 6); 

    if (/^4[0-9]{5}/.test(bin)) {
      return 'Visa';
    } else if (/^5[1-5][0-9]{4}/.test(bin)) {
      return 'MasterCard';
    } else if (/^6(222|5[0-9]{2})/.test(bin)) {
      return 'Mada'; 
    } else {
      throw new HttpException(
        { status: 'failure', message: 'Unsupported card type or invalid card number' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private resetGatewayAttempts(): void {
    this.gateways.forEach((gateway) => {
      gateway.attempts = 0;
    });
  }

  private incrementFailureCount(gatewayName: string): void {
    const failures = this.gatewayFailures.get(gatewayName) || 0;
    this.gatewayFailures.set(gatewayName, failures + 1);

    const gateway = this.gateways.find(g => g.name === gatewayName);
    if (gateway && failures >= 20) {
      gateway.attempts = 0; 
    }
  }

  async createPayment(
  cardInfo: { name: string; cardNumber: string; expiryDate: string; cvv: string },
  amount: number,
  currency: string,
): Promise<any> {
  if (amount <= 0) {
    throw new HttpException({ status: 'failure', message: 'Amount must be greater than zero' }, HttpStatus.BAD_REQUEST);
  }

  const isCardNumberValid = cardInfo.cardNumber.length === 16 && !isNaN(Number(cardInfo.cardNumber));
  const isExpiryDateValid = /^\d{2}\/\d{2}$/.test(cardInfo.expiryDate);
  const isCvvValid = cardInfo.cvv.length === 3 && !isNaN(Number(cardInfo.cvv));

  if (!isCardNumberValid && !isExpiryDateValid && !isCvvValid) {
    throw new HttpException(
      { status: 'failure', message: 'Payment processed failed because of invalid data' },
      HttpStatus.BAD_REQUEST
    );
  }

  const cardType = this.detectCardType(cardInfo.cardNumber);

  for (const gateway of this.gateways) {
    if (!gateway.acceptedCards.includes(cardType)) {
      console.log(`Skipping gateway ${gateway.name} - does not accept ${cardType}`);
      continue; 
    }

    console.log(`Attempting payment with gateway: ${gateway.name}`);
    gateway.attempts++; 

    try {
      const paymentResult = await this.mockGatewayService.processPayment(cardInfo, amount, currency);

      if (paymentResult.status === 'success') {
        const paymentDetails = {
          cardholderName: cardInfo.name,
          cardType: cardType,
          cardNumber: cardInfo.cardNumber,
          amount: amount,
          currency: currency,
          status: paymentResult.status,
          message: paymentResult.message, 
          gateway: gateway.name,
        };

        await this.fileStorageService.addPayment(paymentDetails);  
        return { status: 'success', message: 'Payment processed successfully', paymentDetails };
      }

      throw new HttpException({ status: 'failure', message: paymentResult.message }, HttpStatus.BAD_REQUEST);

    } catch (error) {
      console.error(`Payment failed with gateway ${gateway.name}:`, error.message);
      this.incrementFailureCount(gateway.name);
      if (this.gateways.filter(g => g.attempts < 20).length === 0) {
        throw new HttpException({ status: 'failure', message: 'All gateways failed' }, HttpStatus.BAD_REQUEST);
      }
    }
  }
    throw new HttpException({ status: 'failure', message: 'All payment attempts failed' }, HttpStatus.BAD_REQUEST);
  }
}
