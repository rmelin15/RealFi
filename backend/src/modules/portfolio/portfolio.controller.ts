import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('portfolio')
@Controller('portfolio')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  @ApiOperation({ summary: 'Get portfolio summary' })
  async getSummary(@Request() req: any) {
    const portfolio = await this.portfolioService.getPortfolioSummary(
      req.user.id,
    );
    return { data: portfolio };
  }

  @Get('positions')
  @ApiOperation({ summary: 'Get all Tier 1 positions (Direct Investments)' })
  async getTier1Positions(@Request() req: any) {
    const positions = await this.portfolioService.getTier1Positions(
      req.user.id,
    );
    return { data: positions };
  }

  @Get('lendable')
  @ApiOperation({ summary: 'Get all Tier 2 positions (Lendable Assets)' })
  async getTier2Positions(@Request() req: any) {
    const positions = await this.portfolioService.getTier2Positions(
      req.user.id,
    );
    return { data: positions };
  }

  @Get('rewards')
  @ApiOperation({ summary: 'Get reward balance and history' })
  async getRewards(@Request() req: any) {
    const rewards = await this.portfolioService.getRewards(req.user.id);
    return { data: rewards };
  }
}


















