import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class PaymentsService {
  private paystackKey = process.env.PAYSTACK_SECRET_KEY;
  private flutterwaveKey = process.env.FLUTTERWAVE_SECRET_KEY;

  constructor(private prisma: PrismaService) {}

  async initializePaystack(userId: string, email: string, amount: number, plan?: string) {
    const reference = `EDM-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        amount,
        provider: 'PAYSTACK',
        reference,
        status: 'PENDING',
        metadata: { plan },
      },
    });

    if (!this.paystackKey) {
      return { authorizationUrl: `https://paystack.com/pay/${reference}?amount=${amount}`, reference };
    }

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.paystackKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, amount: amount * 100, reference }),
    });
    const data = (await response.json()) as any;
    return { authorizationUrl: data.data.authorization_url, reference };
  }

  async initializeFlutterwave(userId: string, email: string, amount: number, plan?: string) {
    const reference = `EDM-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        amount,
        provider: 'FLUTTERWAVE',
        reference,
        status: 'PENDING',
        metadata: { plan },
      },
    });

    if (!this.flutterwaveKey) {
      return { authorizationUrl: `https://flutterwave.com/pay/${reference}`, reference };
    }

    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.flutterwaveKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: reference,
        amount,
        currency: 'NGN',
        payment_options: 'card',
        customer: { email },
        customizations: { title: 'EduMaster Africa', description: `Premium Plan: ${plan}` },
      }),
    });
    const data = (await response.json()) as any;
    return { authorizationUrl: data.link, reference };
  }

  async verifyPayment(reference: string) {
    const payment = await this.prisma.payment.findUnique({ where: { reference } });
    if (!payment) throw new BadRequestException('Payment not found');

    if (payment.status === 'SUCCESS') return payment;

    // Verify with provider
    if (payment.provider === 'PAYSTACK' && this.paystackKey) {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: { 'Authorization': `Bearer ${this.paystackKey}` },
      });
    const data = (await response.json()) as any;
      if (data.status) {
        await this.prisma.payment.update({
          where: { reference },
          data: { status: 'SUCCESS' },
        });
      }
    }

    return payment;
  }

  async getPlans() {
    return [
      { id: 'free', name: 'Free', price: 0, features: ['1,000+ questions', 'Basic CBT', '3 AI questions/day'] },
      { id: 'premium', name: 'Premium', price: 2500, features: ['Unlimited questions', 'All CBT modes', 'Unlimited AI', 'All courses', 'Offline access'] },
      { id: 'school', name: 'School', price: 150000, features: ['Everything in Premium', 'Student management', 'Custom CBT', 'Report cards', 'Parent portal'] },
    ];
  }
}