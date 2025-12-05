import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  async getPortfolioSummary(userId: string) {
    // Get Tier 1 positions (Direct Investments)
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        userId,
        status: { in: [SubscriptionStatus.CONFIRMED, SubscriptionStatus.PENDING] },
      },
      include: {
        offering: {
          include: {
            asset: {
              select: {
                id: true,
                name: true,
                category: true,
                imageUrl: true,
                pricePerShare: true,
                projectedApy: true,
                status: true,
              },
            },
          },
        },
      },
    });

    // Get Tier 2 positions (Lendable Assets)
    const lendableAssets = await this.prisma.lendableAsset.findMany({
      where: {
        ownerUserId: userId,
      },
      include: {
        performance: {
          orderBy: { periodEnd: 'desc' },
          take: 1,
        },
      },
    });

    // Calculate totals
    const tier1Positions = subscriptions.map((sub) => ({
      id: sub.id,
      assetId: sub.offering.assetId,
      assetName: sub.offering.asset.name,
      assetCategory: sub.offering.asset.category,
      imageUrl: sub.offering.asset.imageUrl,
      sharesOwned: sub.sharesAllocated,
      amountInvested: Number(sub.amountCommitted),
      currentValue:
        sub.sharesAllocated * Number(sub.offering.asset.pricePerShare),
      projectedApy: Number(sub.offering.asset.projectedApy) || 0,
      status: sub.status,
      assetStatus: sub.offering.asset.status,
    }));

    const tier2Positions = lendableAssets.map((asset) => {
      const latestPerformance = asset.performance[0];
      return {
        id: asset.id,
        title: asset.title,
        assetType: asset.assetType,
        imageUrl: asset.imageUrl,
        targetYield: Number(asset.targetYield) || 0,
        status: asset.status,
        latestRevenue: latestPerformance
          ? Number(latestPerformance.grossRevenue)
          : 0,
        latestYield: latestPerformance
          ? Number(latestPerformance.netYield)
          : 0,
      };
    });

    const totalInvested = tier1Positions.reduce(
      (sum, pos) => sum + pos.amountInvested,
      0,
    );
    const totalValue = tier1Positions.reduce(
      (sum, pos) => sum + pos.currentValue,
      0,
    );
    const avgYield =
      tier1Positions.length > 0
        ? tier1Positions.reduce((sum, pos) => sum + pos.projectedApy, 0) /
          tier1Positions.length
        : 0;

    return {
      summary: {
        totalInvested,
        totalValue,
        unrealizedGain: totalValue - totalInvested,
        avgProjectedYield: avgYield,
        tier1Count: tier1Positions.length,
        tier2Count: tier2Positions.length,
      },
      tier1Positions,
      tier2Positions,
    };
  }

  async getTier1Positions(userId: string) {
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        userId,
        status: { in: [SubscriptionStatus.CONFIRMED, SubscriptionStatus.PENDING] },
      },
      include: {
        offering: {
          include: {
            asset: {
              include: {
                sponsorOrg: {
                  select: { name: true, logoUrl: true },
                },
                payoutEvents: {
                  orderBy: { eventDate: 'desc' },
                  take: 5,
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return subscriptions.map((sub) => ({
      subscriptionId: sub.id,
      asset: {
        id: sub.offering.asset.id,
        name: sub.offering.asset.name,
        category: sub.offering.asset.category,
        imageUrl: sub.offering.asset.imageUrl,
        status: sub.offering.asset.status,
        sponsor: sub.offering.asset.sponsorOrg,
      },
      investment: {
        amountCommitted: Number(sub.amountCommitted),
        sharesAllocated: sub.sharesAllocated,
        pricePerShare: Number(sub.offering.asset.pricePerShare),
        currentValue:
          sub.sharesAllocated * Number(sub.offering.asset.pricePerShare),
        projectedApy: Number(sub.offering.asset.projectedApy),
      },
      status: sub.status,
      createdAt: sub.createdAt,
      recentPayouts: sub.offering.asset.payoutEvents.map((p) => ({
        date: p.eventDate,
        amount: Number(p.totalPayoutAmount),
        notes: p.notes,
      })),
    }));
  }

  async getTier2Positions(userId: string) {
    const assets = await this.prisma.lendableAsset.findMany({
      where: {
        ownerUserId: userId,
      },
      include: {
        operator: {
          select: { id: true, name: true, logoUrl: true },
        },
        performance: {
          orderBy: { periodEnd: 'desc' },
          take: 6,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return assets.map((asset) => ({
      id: asset.id,
      title: asset.title,
      assetType: asset.assetType,
      imageUrl: asset.imageUrl,
      locationRegion: asset.locationRegion,
      capacityUnit: asset.capacityUnit,
      capacityMax: Number(asset.capacityMax),
      revenueModel: asset.revenueModel,
      targetYield: Number(asset.targetYield),
      status: asset.status,
      operator: asset.operator,
      performance: asset.performance.map((p) => ({
        periodStart: p.periodStart,
        periodEnd: p.periodEnd,
        utilization: Number(p.utilizationValue),
        grossRevenue: Number(p.grossRevenue),
        expenses: Number(p.expenses),
        netYield: Number(p.netYield),
      })),
      createdAt: asset.createdAt,
    }));
  }

  async getRewards(userId: string) {
    const rewards = await this.prisma.rewardEvent.findMany({
      where: { userId },
      include: {
        program: {
          select: { id: true, name: true, description: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const totalRewards = await this.prisma.rewardEvent.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    return {
      totalBalance: Number(totalRewards._sum.amount) || 0,
      recentEvents: rewards.map((r) => ({
        id: r.id,
        program: r.program,
        amount: Number(r.amount),
        reason: r.reason,
        metadata: r.metadata,
        createdAt: r.createdAt,
      })),
    };
  }
}









