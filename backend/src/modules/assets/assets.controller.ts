import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserRole, AssetCategory, AssetStatus, RiskRating } from '@prisma/client';

import { AssetsService, AssetFilters } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all public assets' })
  @ApiQuery({ name: 'category', required: false, enum: AssetCategory })
  @ApiQuery({ name: 'status', required: false, enum: AssetStatus })
  @ApiQuery({ name: 'riskRating', required: false, enum: RiskRating })
  @ApiQuery({ name: 'region', required: false })
  @ApiQuery({ name: 'minYield', required: false, type: Number })
  @ApiQuery({ name: 'maxYield', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('category') category?: AssetCategory,
    @Query('status') status?: AssetStatus,
    @Query('riskRating') riskRating?: RiskRating,
    @Query('region') region?: string,
    @Query('minYield') minYield?: number,
    @Query('maxYield') maxYield?: number,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const filters: AssetFilters = {
      category,
      status,
      riskRating,
      region,
      minYield,
      maxYield,
    };

    const result = await this.assetsService.findAll(filters, page, limit);
    return {
      data: result.assets,
      meta: result.meta,
    };
  }

  @Get('stats')
  @Public()
  @ApiOperation({ summary: 'Get asset statistics' })
  async getStats() {
    const stats = await this.assetsService.getStats();
    return { data: stats };
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get asset by ID' })
  async findOne(@Param('id') id: string) {
    const asset = await this.assetsService.findById(id);
    return { data: asset };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ISSUER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new asset (Issuer/Admin only)' })
  async create(@Body() dto: CreateAssetDto, @Request() req: any) {
    // TODO: Get sponsor org from user's memberships
    const sponsorOrgId = dto.sponsorOrgId;
    const asset = await this.assetsService.create(dto, sponsorOrgId);
    return {
      data: asset,
      message: 'Asset created successfully',
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ISSUER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update asset (Issuer/Admin only)' })
  async update(@Param('id') id: string, @Body() dto: UpdateAssetDto) {
    const asset = await this.assetsService.update(id, dto);
    return {
      data: asset,
      message: 'Asset updated successfully',
    };
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ISSUER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit asset for approval' })
  async submit(@Param('id') id: string) {
    const asset = await this.assetsService.submitForApproval(id);
    return {
      data: asset,
      message: 'Asset submitted for approval',
    };
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve asset (Admin only)' })
  async approve(@Param('id') id: string) {
    const asset = await this.assetsService.approve(id);
    return {
      data: asset,
      message: 'Asset approved',
    };
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject asset (Admin only)' })
  async reject(@Param('id') id: string) {
    const asset = await this.assetsService.reject(id);
    return {
      data: asset,
      message: 'Asset rejected',
    };
  }

  @Post(':id/set-live')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set asset to live status (Admin only)' })
  async setLive(@Param('id') id: string) {
    const asset = await this.assetsService.setLive(id);
    return {
      data: asset,
      message: 'Asset is now live',
    };
  }
}


















