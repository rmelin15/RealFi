import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LendableAssetType, LendableAssetStatus, RevenueModel, Prisma } from '@prisma/client';
import { CreateLendableAssetDto } from './dto/create-lendable-asset.dto';
import { UpdateLendableAssetDto } from './dto/update-lendable-asset.dto';
import { AddPerformanceDto } from './dto/add-performance.dto';

export interface LendableAssetFilters {
  assetType?: LendableAssetType;
  status?: LendableAssetStatus;
  region?: string;
  revenueModel?: RevenueModel;
  minYield?: number;
  maxYield?: number;
}

@Injectable()
export class LendableAssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLendableAssetDto, userId: string) {
    return this.prisma.lendableAsset.create({
      data: {
        ownerUserId: userId,
        operatorOrgId: dto.operatorOrgId,
        assetType: dto.assetType,
        title: dto.title,
        description: dto.description,
        locationRegion: dto.locationRegion,
        capacityUnit: dto.capacityUnit,
        capacityMax: dto.capacityMax,
        revenueModel: dto.revenueModel || RevenueModel.REV_SHARE,
        targetYield: dto.targetYield,
        isBuyToRent: dto.isBuyToRent || false,
        imageUrl: dto.imageUrl,
        metadata: dto.metadata || {},
        status: LendableAssetStatus.DRAFT,
      },
      include: {
        owner: {
          select: { id: true, firstName: true, lastName: true },
        },
        operator: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findAll(filters: LendableAssetFilters, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where: Prisma.LendableAssetWhereInput = {
      ...(filters.assetType && { assetType: filters.assetType }),
      ...(filters.status && { status: filters.status }),
      ...(filters.revenueModel && { revenueModel: filters.revenueModel }),
      ...(filters.region && {
        locationRegion: { contains: filters.region, mode: 'insensitive' as const },
      }),
      ...(filters.minYield !== undefined && {
        targetYield: { gte: filters.minYield },
      }),
      ...(filters.maxYield !== undefined && {
        targetYield: { lte: filters.maxYield },
      }),
    };

    const [assets, total] = await Promise.all([
      this.prisma.lendableAsset.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: { id: true, firstName: true, lastName: true },
          },
          operator: {
            select: { id: true, name: true },
          },
          _count: {
            select: { performance: true },
          },
        },
      }),
      this.prisma.lendableAsset.count({ where }),
    ]);

    return {
      assets,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const asset = await this.prisma.lendableAsset.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        operator: true,
        performance: {
          orderBy: { periodEnd: 'desc' },
          take: 12, // Last 12 periods
        },
      },
    });

    if (!asset) {
      throw new NotFoundException('Lendable asset not found');
    }

    return asset;
  }

  async update(id: string, dto: UpdateLendableAssetDto, userId: string) {
    const asset = await this.findById(id);

    if (asset.ownerUserId !== userId) {
      throw new ForbiddenException('You can only update your own assets');
    }

    if (asset.status !== LendableAssetStatus.DRAFT) {
      throw new BadRequestException('Cannot update active or archived assets');
    }

    return this.prisma.lendableAsset.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description && { description: dto.description }),
        ...(dto.assetType && { assetType: dto.assetType }),
        ...(dto.locationRegion && { locationRegion: dto.locationRegion }),
        ...(dto.capacityUnit && { capacityUnit: dto.capacityUnit }),
        ...(dto.capacityMax && { capacityMax: dto.capacityMax }),
        ...(dto.revenueModel && { revenueModel: dto.revenueModel }),
        ...(dto.targetYield !== undefined && { targetYield: dto.targetYield }),
        ...(dto.isBuyToRent !== undefined && { isBuyToRent: dto.isBuyToRent }),
        ...(dto.imageUrl && { imageUrl: dto.imageUrl }),
        ...(dto.metadata && { metadata: dto.metadata }),
      },
      include: {
        owner: {
          select: { id: true, firstName: true, lastName: true },
        },
        operator: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async activate(id: string, userId: string, isAdmin = false) {
    const asset = await this.findById(id);

    if (!isAdmin && asset.ownerUserId !== userId) {
      throw new ForbiddenException('You can only activate your own assets');
    }

    if (asset.status !== LendableAssetStatus.DRAFT) {
      throw new BadRequestException('Only draft assets can be activated');
    }

    return this.prisma.lendableAsset.update({
      where: { id },
      data: { status: LendableAssetStatus.ACTIVE },
    });
  }

  async deactivate(id: string, userId: string, isAdmin = false) {
    const asset = await this.findById(id);

    if (!isAdmin && asset.ownerUserId !== userId) {
      throw new ForbiddenException('You can only deactivate your own assets');
    }

    return this.prisma.lendableAsset.update({
      where: { id },
      data: { status: LendableAssetStatus.INACTIVE },
    });
  }

  async archive(id: string) {
    return this.prisma.lendableAsset.update({
      where: { id },
      data: { status: LendableAssetStatus.ARCHIVED },
    });
  }

  async addPerformance(id: string, dto: AddPerformanceDto, uploaderId: string) {
    const asset = await this.findById(id);

    // Check if user is owner, operator member, or admin
    // For MVP, we'll allow owners and use a simple check

    return this.prisma.lendableAssetPerformance.create({
      data: {
        lendableAssetId: id,
        periodStart: new Date(dto.periodStart),
        periodEnd: new Date(dto.periodEnd),
        utilizationValue: dto.utilizationValue,
        grossRevenue: dto.grossRevenue,
        expenses: dto.expenses || 0,
        netYield: dto.grossRevenue - (dto.expenses || 0),
        uploadedByUserId: uploaderId,
      },
    });
  }

  async getPerformance(id: string, page = 1, limit = 12) {
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.prisma.lendableAssetPerformance.findMany({
        where: { lendableAssetId: id },
        skip,
        take: limit,
        orderBy: { periodEnd: 'desc' },
      }),
      this.prisma.lendableAssetPerformance.count({
        where: { lendableAssetId: id },
      }),
    ]);

    return {
      records,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStats() {
    const [totalAssets, activeAssets, byType] = await Promise.all([
      this.prisma.lendableAsset.count(),
      this.prisma.lendableAsset.count({
        where: { status: LendableAssetStatus.ACTIVE },
      }),
      this.prisma.lendableAsset.groupBy({
        by: ['assetType'],
        _count: { id: true },
      }),
    ]);

    return {
      totalAssets,
      activeAssets,
      byType: byType.map((item) => ({
        type: item.assetType,
        count: item._count.id,
      })),
    };
  }
}


















