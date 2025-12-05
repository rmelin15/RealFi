import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserRole, OfferingStatus } from '@prisma/client';

import { OfferingsService } from './offerings.service';
import { CreateOfferingDto } from './dto/create-offering.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('offerings')
@Controller('offerings')
export class OfferingsController {
  constructor(private readonly offeringsService: OfferingsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all offerings' })
  @ApiQuery({ name: 'status', required: false, enum: OfferingStatus })
  @ApiQuery({ name: 'assetId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('status') status?: OfferingStatus,
    @Query('assetId') assetId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const result = await this.offeringsService.findAll(
      { status, assetId },
      page,
      limit,
    );
    return {
      data: result.offerings,
      meta: result.meta,
    };
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get offering by ID' })
  async findOne(@Param('id') id: string) {
    const offering = await this.offeringsService.findById(id);
    return { data: offering };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ISSUER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new offering (Issuer/Admin only)' })
  async create(@Body() dto: CreateOfferingDto) {
    const offering = await this.offeringsService.create(dto);
    return {
      data: offering,
      message: 'Offering created successfully',
    };
  }

  @Post(':id/open')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ISSUER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Open offering for investments' })
  async open(@Param('id') id: string) {
    const offering = await this.offeringsService.openOffering(id);
    return {
      data: offering,
      message: 'Offering is now open',
    };
  }

  @Post(':id/close')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Close offering (Admin only)' })
  async close(@Param('id') id: string) {
    const offering = await this.offeringsService.closeOffering(id);
    return {
      data: offering,
      message: 'Offering closed',
    };
  }

  @Post(':id/subscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subscribe to an offering (invest)' })
  async subscribe(
    @Param('id') id: string,
    @Body() dto: SubscribeDto,
    @Request() req: any,
  ) {
    const subscription = await this.offeringsService.subscribe(
      id,
      req.user.id,
      dto,
    );
    return {
      data: subscription,
      message: 'Investment commitment recorded',
    };
  }

  @Get(':id/subscriptions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ISSUER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get offering subscriptions (Issuer/Admin only)' })
  async getSubscriptions(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const result = await this.offeringsService.getSubscriptions(id, page, limit);
    return {
      data: result.subscriptions,
      meta: result.meta,
    };
  }

  @Post('subscriptions/:subId/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel your subscription' })
  async cancelSubscription(
    @Param('subId') subId: string,
    @Request() req: any,
  ) {
    const result = await this.offeringsService.cancelSubscription(
      subId,
      req.user.id,
    );
    return result;
  }
}


















