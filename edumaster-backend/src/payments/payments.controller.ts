import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('paystack')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Initialize Paystack payment' })
  initializePaystack(@Request() req, @Body() dto: { amount: number; plan?: string }) {
    return this.paymentsService.initializePaystack(req.user.id, req.user.email, dto.amount, dto.plan);
  }

  @Post('flutterwave')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Initialize Flutterwave payment' })
  initializeFlutterwave(@Request() req, @Body() dto: { amount: number; plan?: string }) {
    return this.paymentsService.initializeFlutterwave(req.user.id, req.user.email, dto.amount, dto.plan);
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verify payment status' })
  verify(@Query('reference') reference: string) {
    return this.paymentsService.verifyPayment(reference);
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get available plans' })
  getPlans() {
    return this.paymentsService.getPlans();
  }
}