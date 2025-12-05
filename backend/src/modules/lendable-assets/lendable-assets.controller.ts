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
import { UserRole, LendableAssetType, LendableAssetStatus, RevenueModel } from '@prisma/client';

import { LendableAssetsService, LendableAssetFilters } from './lendable-assets.service';
import { CreateLendableAssetDto } from './dto/create-lendable-asset.dto';
import { UpdateLendableAssetDto } from './dto/update-lendable-asset.dto';
import { AddPerformanceDto } from './dto/add-performance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('lendable-assets')
@Controller('lendable-assets')
export class LendableAssetsController {
  constructor(private readonly lendableAssetsService: LendableAssetsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all lendable assets' })
  @ApiQuery({ name: 'assetType', required: false, enum: LendableAssetType })
  @ApiQuery({ name: 'status', required: false, enum: LendableAssetStatus })
  @ApiQuery({ name: 'revenueModel', required: false, enum: RevenueModel })
  @ApiQuery({ name: 'region', required: false })
  @ApiQuery({ name: 'minYield', required: false, type: Number })
  @ApiQuery({ name: 'maxYield', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('assetType') assetType?: LendableAssetType,
    @Query('status') status?: LendableAssetStatus,
    @Query('revenueModel') revenueModel?: RevenueModel,
    @Query('region') region?: string,
    @Query('minYield') minYield?: number,
    @Query('maxYield') maxYield?: number,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const filters: LendableAssetFilters = {
      assetType,
      status,
      revenueModel,
      region,
      minYield,
      maxYield,
    };

    const result = await this.lendableAssetsService.findAll(filters, page, limit);
    return {
      data: result.assets,
      meta: result.meta,
    };
  }

  @Get('stats')
  @Public()
  @ApiOperation({ summary: 'Get lendable assets statistics' })
  async getStats() {
    const stats = await this.lendableAssetsService.getStats();
    return { data: stats };
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get lendable asset by ID' })
  async findOne(@Param('id') id: string) {
    const asset = await this.lendableAssetsService.findById(id);
    return { data: asset };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new lendable asset listing' })
  async create(@Body() dto: CreateLendableAssetDto, @Request() req: any) {
    const asset = await this.lendableAssetsService.create(dto, req.user.id);
    return {
      data: asset,
      message: 'Lendable asset created successfully',
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lendable asset' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateLendableAssetDto,
    @Request() req: any,
  ) {
    const asset = await this.lendableAssetsService.update(id, dto, req.user.id);
    return {
      data: asset,
      message: 'Lendable asset updated successfully',
    };
  }

  @Post(':id/activate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate lendable asset' })
  async activate(@Param('id') id: string, @Request() req: any) {
    const isAdmin = req.user.role === UserRole.ADMIN;
    const asset = await this.lendableAssetsService.activate(
      id,
      req.user.id,
      isAdmin,
    );
    return {
      data: asset,
      message: 'Lendable asset activated',
    };
  }

  @Post(':id/deactivate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate lendable asset' })
  async deactivate(@Param('id') id: string, @Request() req: any) {
    const isAdmin = req.user.role === UserRole.ADMIN;
    const asset = await this.lendableAssetsService.deactivate(
      id,
      req.user.id,
      isAdmin,
    );
    return {
      data: asset,
      message: 'Lendable asset deactivated',
    };
  }

  @Get(':id/performance')
  @Public()
  @ApiOperation({ summary: 'Get performance history' })
  async getPerformance(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 12,
  ) {
    const result = await this.lendableAssetsService.getPerformance(id, page, limit);
    return {
      data: result.records,
      meta: result.meta,
    };
  }

  @Post(':id/performance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add performance metrics (Operator/Admin)' })
  async addPerformance(
    @Param('id') id: string,
    @Body() dto: AddPerformanceDto,
    @Request() req: any,
  ) {
    const record = await this.lendableAssetsService.addPerformance(
      id,
      dto,
      req.user.id,
    );
    return {
      data: record,
      message: 'Performance metrics added',
    };
  }
}


















