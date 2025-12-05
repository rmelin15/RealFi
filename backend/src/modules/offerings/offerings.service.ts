import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  OfferingStatus,
  OfferingType,
  SubscriptionStatus,
  KycStatus,
  Prisma,
} from '@prisma/client';
import { CreateOfferingDto } from './dto/create-offering.dto';
import { SubscribeDto } from './dto/subscribe.dto';

@Injectable()
export class OfferingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOfferingDto) {
    // Verify asset exists
    const asset = await this.prisma.realFiAsset.findUnique({
      where: { id: dto.assetId },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    return this.prisma.offering.create({
      data: {
        assetId: dto.assetId,
        name: dto.name,
        description: dto.description,
        offeringType: dto.offeringType || OfferingType.EQUITY,
        startDate: dto.startDate,
        endDate: dto.endDate,
        allowedInvestorTypes: dto.allowedInvestorTypes || ['RETAIL'],
        allowedCountries: dto.allowedCountries || [],
        restrictedCountries: dto.restrictedCountries || [],
        minInvestment: dto.minInvestment,
        maxInvestment: dto.maxInvestment,
        targetRaise: dto.targetRaise,
        status: OfferingStatus.DRAFT,
      },
      include: {
        asset: true,
      },
    });
  }

  async findAll(
    filters: { status?: OfferingStatus; assetId?: string },
    page = 1,
    limit = 20,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.OfferingWhereInput = {
      ...(filters.status && { status: filters.status }),
      ...(filters.assetId && { assetId: filters.assetId }),
    };

    const [offerings, total] = await Promise.all([
      this.prisma.offering.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          asset: {
            select: {
              id: true,
              name: true,
              category: true,
              imageUrl: true,
              locationRegion: true,
            },
          },
          _count: {
            select: { subscriptions: true },
          },
        },
      }),
      this.prisma.offering.count({ where }),
    ]);

    return {
      offerings,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const offering = await this.prisma.offering.findUnique({
      where: { id },
      include: {
        asset: {
          include: {
            sponsorOrg: true,
          },
        },
        subscriptions: {
          select: {
            id: true,
            amountCommitted: true,
            sharesAllocated: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!offering) {
      throw new NotFoundException('Offering not found');
    }

    return offering;
  }

  async openOffering(id: string) {
    const offering = await this.findById(id);

    if (offering.status !== OfferingStatus.DRAFT) {
      throw new BadRequestException('Only draft offerings can be opened');
    }

    return this.prisma.offering.update({
      where: { id },
      data: { status: OfferingStatus.OPEN },
    });
  }

  async closeOffering(id: string) {
    const offering = await this.findById(id);

    if (offering.status !== OfferingStatus.OPEN) {
      throw new BadRequestException('Only open offerings can be closed');
    }

    // Update offering and allocate shares to confirmed subscriptions
    await this.prisma.$transaction(async (tx) => {
      const subscriptions = await tx.subscription.findMany({
        where: {
          offeringId: id,
          status: SubscriptionStatus.PENDING,
        },
      });

      // Calculate shares for each subscription
      for (const sub of subscriptions) {
        const shares = Math.floor(
          Number(sub.amountCommitted) / Number(offering.asset.pricePerShare),
        );

        await tx.subscription.update({
          where: { id: sub.id },
          data: {
            sharesAllocated: shares,
            status: SubscriptionStatus.CONFIRMED,
          },
        });
      }

      await tx.offering.update({
        where: { id },
        data: { status: OfferingStatus.CLOSED },
      });
    });

    return this.findById(id);
  }

  async subscribe(offeringId: string, userId: string, dto: SubscribeDto) {
    const offering = await this.findById(offeringId);

    // Verify offering is open
    if (offering.status !== OfferingStatus.OPEN) {
      throw new BadRequestException('Offering is not open for investment');
    }

    // Verify user KYC
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.kycStatus !== KycStatus.APPROVED) {
      throw new ForbiddenException('KYC approval required to invest');
    }

    // Verify investment amount is within bounds
    if (
      dto.amount < Number(offering.minInvestment) ||
      dto.amount > Number(offering.maxInvestment)
    ) {
      throw new BadRequestException(
        `Investment must be between ${offering.minInvestment} and ${offering.maxInvestment}`,
      );
    }

    // Check if user already has a subscription
    const existingSub = await this.prisma.subscription.findFirst({
      where: {
        offeringId,
        userId,
        status: { not: SubscriptionStatus.CANCELLED },
      },
    });

    if (existingSub) {
      throw new BadRequestException(
        'You already have an active subscription to this offering',
      );
    }

    // Calculate estimated shares
    const estimatedShares = Math.floor(
      dto.amount / Number(offering.asset.pricePerShare),
    );

    // Create subscription
    const subscription = await this.prisma.subscription.create({
      data: {
        offeringId,
        userId,
        amountCommitted: dto.amount,
        sharesAllocated: estimatedShares,
        status: SubscriptionStatus.PENDING,
      },
    });

    // Update offering total raised
    await this.prisma.offering.update({
      where: { id: offeringId },
      data: {
        totalRaised: {
          increment: dto.amount,
        },
      },
    });

    // Also update asset total raised
    await this.prisma.realFiAsset.update({
      where: { id: offering.assetId },
      data: {
        totalRaised: {
          increment: dto.amount,
        },
      },
    });

    return subscription;
  }

  async getSubscriptions(offeringId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [subscriptions, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where: { offeringId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.prisma.subscription.count({ where: { offeringId } }),
    ]);

    return {
      subscriptions,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async cancelSubscription(subscriptionId: string, userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { offering: true },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own subscriptions');
    }

    if (subscription.status !== SubscriptionStatus.PENDING) {
      throw new BadRequestException('Only pending subscriptions can be cancelled');
    }

    // Update subscription status
    await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: SubscriptionStatus.CANCELLED },
    });

    // Decrement offering total raised
    await this.prisma.offering.update({
      where: { id: subscription.offeringId },
      data: {
        totalRaised: {
          decrement: subscription.amountCommitted,
        },
      },
    });

    return { message: 'Subscription cancelled successfully' };
  }
}


















