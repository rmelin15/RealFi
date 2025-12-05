import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AssetStatus, AssetCategory, RiskRating, Prisma } from '@prisma/client';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

export interface AssetFilters {
  category?: AssetCategory;
  status?: AssetStatus;
  riskRating?: RiskRating;
  region?: string;
  minYield?: number;
  maxYield?: number;
}

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAssetDto, sponsorOrgId: string) {
    return this.prisma.realFiAsset.create({
      data: {
        name: dto.name,
        category: dto.category,
        description: dto.description,
        locationRegion: dto.locationRegion,
        sponsorOrgId,
        totalShares: dto.totalShares,
        pricePerShare: dto.pricePerShare,
        currency: dto.currency || 'USD',
        minInvestment: dto.minInvestment,
        maxInvestment: dto.maxInvestment,
        targetRaise: dto.targetRaise,
        projectedApy: dto.projectedApy,
        riskRating: dto.riskRating || RiskRating.MEDIUM,
        imageUrl: dto.imageUrl,
        documents: dto.documents || [],
        highlights: dto.highlights || [],
        status: AssetStatus.DRAFT,
      },
      include: {
        sponsorOrg: true,
        offerings: true,
      },
    });
  }

  async findAll(filters: AssetFilters, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where: Prisma.RealFiAssetWhereInput = {
      ...(filters.category && { category: filters.category }),
      ...(filters.status && { status: filters.status }),
      ...(filters.riskRating && { riskRating: filters.riskRating }),
      ...(filters.region && {
        locationRegion: { contains: filters.region, mode: 'insensitive' as const },
      }),
      ...(filters.minYield !== undefined && {
        projectedApy: { gte: filters.minYield },
      }),
      ...(filters.maxYield !== undefined && {
        projectedApy: { lte: filters.maxYield },
      }),
    };

    const [assets, total] = await Promise.all([
      this.prisma.realFiAsset.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          sponsorOrg: {
            select: { id: true, name: true, logoUrl: true },
          },
          offerings: {
            where: { status: 'OPEN' },
            take: 1,
          },
        },
      }),
      this.prisma.realFiAsset.count({ where }),
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

  async findPublic(filters: AssetFilters, page = 1, limit = 20) {
    // Only return assets that are visible to public
    const publicStatuses = [
      AssetStatus.FUNDING,
      AssetStatus.LIVE,
      AssetStatus.CLOSED,
    ];

    return this.findAll(
      { ...filters, status: filters.status || undefined },
      page,
      limit,
    );
  }

  async findById(id: string) {
    const asset = await this.prisma.realFiAsset.findUnique({
      where: { id },
      include: {
        sponsorOrg: true,
        offerings: {
          orderBy: { createdAt: 'desc' },
        },
        payoutEvents: {
          orderBy: { eventDate: 'desc' },
          take: 10,
        },
      },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    return asset;
  }

  async update(id: string, dto: UpdateAssetDto) {
    const asset = await this.findById(id);

    if (
      asset.status !== AssetStatus.DRAFT &&
      asset.status !== AssetStatus.PENDING_APPROVAL
    ) {
      throw new BadRequestException(
        'Cannot update asset that is already in funding or live',
      );
    }

    return this.prisma.realFiAsset.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.category && { category: dto.category }),
        ...(dto.description && { description: dto.description }),
        ...(dto.locationRegion && { locationRegion: dto.locationRegion }),
        ...(dto.totalShares && { totalShares: dto.totalShares }),
        ...(dto.pricePerShare && { pricePerShare: dto.pricePerShare }),
        ...(dto.minInvestment && { minInvestment: dto.minInvestment }),
        ...(dto.maxInvestment && { maxInvestment: dto.maxInvestment }),
        ...(dto.targetRaise && { targetRaise: dto.targetRaise }),
        ...(dto.projectedApy !== undefined && { projectedApy: dto.projectedApy }),
        ...(dto.riskRating && { riskRating: dto.riskRating }),
        ...(dto.imageUrl && { imageUrl: dto.imageUrl }),
        ...(dto.documents && { documents: dto.documents }),
        ...(dto.highlights && { highlights: dto.highlights }),
      },
      include: {
        sponsorOrg: true,
        offerings: true,
      },
    });
  }

  async submitForApproval(id: string) {
    const asset = await this.findById(id);

    if (asset.status !== AssetStatus.DRAFT) {
      throw new BadRequestException('Only draft assets can be submitted');
    }

    return this.prisma.realFiAsset.update({
      where: { id },
      data: { status: AssetStatus.PENDING_APPROVAL },
    });
  }

  async approve(id: string) {
    const asset = await this.findById(id);

    if (asset.status !== AssetStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Only pending assets can be approved');
    }

    return this.prisma.realFiAsset.update({
      where: { id },
      data: { status: AssetStatus.FUNDING },
    });
  }

  async reject(id: string) {
    const asset = await this.findById(id);

    if (asset.status !== AssetStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Only pending assets can be rejected');
    }

    return this.prisma.realFiAsset.update({
      where: { id },
      data: { status: AssetStatus.DRAFT },
    });
  }

  async setLive(id: string) {
    const asset = await this.findById(id);

    if (asset.status !== AssetStatus.FUNDING) {
      throw new BadRequestException('Only funding assets can go live');
    }

    return this.prisma.realFiAsset.update({
      where: { id },
      data: { status: AssetStatus.LIVE },
    });
  }

  async close(id: string) {
    return this.prisma.realFiAsset.update({
      where: { id },
      data: { status: AssetStatus.CLOSED },
    });
  }

  async getStats() {
    const [totalAssets, fundingAssets, liveAssets, totalRaised] =
      await Promise.all([
        this.prisma.realFiAsset.count(),
        this.prisma.realFiAsset.count({ where: { status: AssetStatus.FUNDING } }),
        this.prisma.realFiAsset.count({ where: { status: AssetStatus.LIVE } }),
        this.prisma.realFiAsset.aggregate({
          _sum: { totalRaised: true },
        }),
      ]);

    return {
      totalAssets,
      fundingAssets,
      liveAssets,
      totalRaised: totalRaised._sum.totalRaised || 0,
    };
  }
}


















