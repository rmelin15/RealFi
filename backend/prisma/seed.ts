import { PrismaClient, UserRole, KycStatus, AssetCategory, AssetStatus, RiskRating, OfferingType, OfferingStatus, LendableAssetType, RevenueModel, LendableAssetStatus, RoyaltyType, ContractType, ContractStatus, ProjectType, ProjectStatus, OrganizationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.rewardEvent.deleteMany();
  await prisma.rewardProgram.deleteMany();
  await prisma.municipalProject.deleteMany();
  await prisma.contractInstrument.deleteMany();
  await prisma.royaltyStream.deleteMany();
  await prisma.lendableAssetPerformance.deleteMany();
  await prisma.lendableAsset.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.payoutEvent.deleteMany();
  await prisma.offering.deleteMany();
  await prisma.realFiAsset.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@realfi.network',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      kycStatus: KycStatus.APPROVED,
      country: 'US',
    },
  });

  const investorUser = await prisma.user.create({
    data: {
      email: 'investor@example.com',
      passwordHash,
      firstName: 'John',
      lastName: 'Investor',
      role: UserRole.RETAIL_INVESTOR,
      kycStatus: KycStatus.APPROVED,
      country: 'US',
    },
  });

  const operatorUser = await prisma.user.create({
    data: {
      email: 'operator@example.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Operator',
      role: UserRole.OPERATOR,
      kycStatus: KycStatus.APPROVED,
      country: 'US',
    },
  });

  const issuerUser = await prisma.user.create({
    data: {
      email: 'issuer@example.com',
      passwordHash,
      firstName: 'Mike',
      lastName: 'Issuer',
      role: UserRole.ISSUER,
      kycStatus: KycStatus.APPROVED,
      country: 'US',
    },
  });

  console.log('✅ Users created');

  // Create organizations
  const issuerOrg = await prisma.organization.create({
    data: {
      name: 'RealFi Capital Partners',
      type: OrganizationType.ISSUER,
      kybStatus: KycStatus.APPROVED,
      description: 'Leading real-world asset tokenization firm',
      website: 'https://realfi.network',
      logoUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=200',
    },
  });

  const operatorOrg = await prisma.organization.create({
    data: {
      name: 'NextGen Fleet Operations',
      type: OrganizationType.OPERATOR,
      kybStatus: KycStatus.APPROVED,
      description: 'Fleet management and mobility services',
      website: 'https://nextgenfleet.example.com',
      logoUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200',
    },
  });

  const computeOrg = await prisma.organization.create({
    data: {
      name: 'Atlas AI Compute',
      type: OrganizationType.OPERATOR,
      kybStatus: KycStatus.APPROVED,
      description: 'Decentralized AI compute infrastructure',
      website: 'https://atlascompute.example.com',
      logoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200',
    },
  });

  // Add organization members
  await prisma.organizationMember.createMany({
    data: [
      { userId: issuerUser.id, organizationId: issuerOrg.id, role: 'owner' },
      { userId: operatorUser.id, organizationId: operatorOrg.id, role: 'manager' },
      { userId: operatorUser.id, organizationId: computeOrg.id, role: 'manager' },
    ],
  });

  console.log('✅ Organizations created');

  // Create Tier 1 Assets
  const coffeeShopAsset = await prisma.realFiAsset.create({
    data: {
      name: 'Downtown Manhattan Coffee Co.',
      category: AssetCategory.COFFEE_SHOP,
      description: 'Premium specialty coffee shop franchise in the heart of Manhattan\'s financial district. High foot traffic location with established customer base and consistent revenue streams. The location features modern décor, premium espresso equipment, and a loyal customer base of finance professionals.',
      locationRegion: 'New York, NY',
      sponsorOrgId: issuerOrg.id,
      status: AssetStatus.FUNDING,
      totalShares: 10000,
      pricePerShare: 100,
      minInvestment: 500,
      maxInvestment: 50000,
      targetRaise: 1000000,
      totalRaised: 425000,
      projectedApy: 12.5,
      riskRating: RiskRating.MEDIUM,
      imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
      highlights: [
        'Prime location in financial district',
        'Established 3-year track record',
        'Monthly revenue: $85,000+',
        'Profit margin: 22%',
        'Long-term lease secured',
      ],
      documents: [
        { name: 'Investment Memorandum', type: 'pdf', url: '#' },
        { name: 'Financial Statements', type: 'pdf', url: '#' },
      ],
    },
  });

  const gpuClusterAsset = await prisma.realFiAsset.create({
    data: {
      name: 'Atlas AI GPU Cluster - Bay Area',
      category: AssetCategory.GPU_CLUSTER,
      description: 'State-of-the-art NVIDIA H100 GPU cluster deployed in a Tier-4 data center in Silicon Valley. The cluster is optimized for AI/ML training and inference workloads, with contracts from major AI startups and research institutions. Revenue generated from compute time sales.',
      locationRegion: 'San Francisco, CA',
      sponsorOrgId: issuerOrg.id,
      status: AssetStatus.FUNDING,
      totalShares: 50000,
      pricePerShare: 50,
      minInvestment: 250,
      maxInvestment: 100000,
      targetRaise: 2500000,
      totalRaised: 1875000,
      projectedApy: 18.0,
      riskRating: RiskRating.MEDIUM,
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      highlights: [
        '64x NVIDIA H100 GPUs',
        'Tier-4 data center',
        '99.99% uptime SLA',
        'Current utilization: 87%',
        '3-year enterprise contracts',
      ],
      documents: [
        { name: 'Technical Specifications', type: 'pdf', url: '#' },
        { name: 'Revenue Projections', type: 'pdf', url: '#' },
      ],
    },
  });

  const solarAsset = await prisma.realFiAsset.create({
    data: {
      name: 'Arizona Solar Array - Phoenix Metro',
      category: AssetCategory.SOLAR_PLANT,
      description: 'Utility-scale solar installation in the Phoenix metropolitan area. 15MW capacity with power purchase agreement with local utility. The project benefits from Arizona\'s exceptional solar irradiance and favorable energy policies.',
      locationRegion: 'Phoenix, AZ',
      sponsorOrgId: issuerOrg.id,
      status: AssetStatus.LIVE,
      totalShares: 100000,
      pricePerShare: 25,
      minInvestment: 100,
      maxInvestment: 250000,
      targetRaise: 2500000,
      totalRaised: 2500000,
      projectedApy: 9.5,
      riskRating: RiskRating.LOW,
      imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
      highlights: [
        '15MW capacity',
        '25-year PPA with utility',
        'Capacity factor: 28%',
        'Annual production: 36.8 GWh',
        'ITC tax benefits available',
      ],
      documents: [
        { name: 'PPA Agreement Summary', type: 'pdf', url: '#' },
        { name: 'Environmental Impact Study', type: 'pdf', url: '#' },
      ],
    },
  });

  const evChargingAsset = await prisma.realFiAsset.create({
    data: {
      name: 'California EV Charging Network',
      category: AssetCategory.EV_CHARGING,
      description: 'Network of 50 fast-charging stations strategically located along major California highways and urban centers. DC fast chargers (150kW-350kW) serving the rapidly growing EV market.',
      locationRegion: 'California',
      sponsorOrgId: issuerOrg.id,
      status: AssetStatus.FUNDING,
      totalShares: 25000,
      pricePerShare: 80,
      minInvestment: 400,
      maxInvestment: 80000,
      targetRaise: 2000000,
      totalRaised: 680000,
      projectedApy: 14.0,
      riskRating: RiskRating.MEDIUM,
      imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
      highlights: [
        '50 charging locations',
        'Mix of 150kW and 350kW chargers',
        'Average utilization: 45%',
        'Growing 15% monthly',
        'Prime highway locations',
      ],
      documents: [
        { name: 'Network Map', type: 'pdf', url: '#' },
        { name: 'Revenue Model', type: 'pdf', url: '#' },
      ],
    },
  });

  const carWashAsset = await prisma.realFiAsset.create({
    data: {
      name: 'Express Auto Spa - Texas Portfolio',
      category: AssetCategory.CAR_WASH,
      description: 'Portfolio of 5 express tunnel car washes across the Dallas-Fort Worth metroplex. Automated operations with subscription membership model driving 65% of revenue. High-margin business with proven operators.',
      locationRegion: 'Dallas-Fort Worth, TX',
      sponsorOrgId: issuerOrg.id,
      status: AssetStatus.FUNDING,
      totalShares: 15000,
      pricePerShare: 100,
      minInvestment: 500,
      maxInvestment: 75000,
      targetRaise: 1500000,
      totalRaised: 890000,
      projectedApy: 16.0,
      riskRating: RiskRating.LOW,
      imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800',
      highlights: [
        '5 locations in DFW area',
        '8,500+ monthly members',
        'Average wash: $15',
        '65% subscription revenue',
        'Fully automated operations',
      ],
      documents: [
        { name: 'Location Analysis', type: 'pdf', url: '#' },
        { name: 'Membership Data', type: 'pdf', url: '#' },
      ],
    },
  });

  console.log('✅ Tier 1 Assets created');

  // Create offerings for assets
  const coffeeOffering = await prisma.offering.create({
    data: {
      assetId: coffeeShopAsset.id,
      name: 'Series A Funding Round',
      description: 'Initial funding round for Downtown Manhattan Coffee Co.',
      offeringType: OfferingType.REVENUE_SHARE,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-15'),
      status: OfferingStatus.OPEN,
      allowedInvestorTypes: ['RETAIL', 'ACCREDITED'],
      allowedCountries: ['US', 'CA', 'GB'],
      restrictedCountries: [],
      minInvestment: 500,
      maxInvestment: 50000,
      targetRaise: 1000000,
      totalRaised: 425000,
    },
  });

  const gpuOffering = await prisma.offering.create({
    data: {
      assetId: gpuClusterAsset.id,
      name: 'GPU Cluster Expansion Round',
      description: 'Funding to expand the Atlas AI GPU cluster capacity',
      offeringType: OfferingType.EQUITY,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-07-01'),
      status: OfferingStatus.OPEN,
      allowedInvestorTypes: ['RETAIL', 'ACCREDITED'],
      allowedCountries: ['US'],
      restrictedCountries: ['CN', 'RU'],
      minInvestment: 250,
      maxInvestment: 100000,
      targetRaise: 2500000,
      totalRaised: 1875000,
    },
  });

  const evOffering = await prisma.offering.create({
    data: {
      assetId: evChargingAsset.id,
      name: 'Network Expansion Round',
      description: 'Funding for additional charging station installations',
      offeringType: OfferingType.REVENUE_SHARE,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-09-01'),
      status: OfferingStatus.OPEN,
      allowedInvestorTypes: ['RETAIL', 'ACCREDITED'],
      allowedCountries: ['US'],
      restrictedCountries: [],
      minInvestment: 400,
      maxInvestment: 80000,
      targetRaise: 2000000,
      totalRaised: 680000,
    },
  });

  console.log('✅ Offerings created');

  // Create sample subscriptions
  await prisma.subscription.createMany({
    data: [
      {
        offeringId: coffeeOffering.id,
        userId: investorUser.id,
        amountCommitted: 5000,
        sharesAllocated: 50,
        status: 'CONFIRMED',
      },
      {
        offeringId: gpuOffering.id,
        userId: investorUser.id,
        amountCommitted: 10000,
        sharesAllocated: 200,
        status: 'CONFIRMED',
      },
    ],
  });

  console.log('✅ Subscriptions created');

  // Create payout events
  await prisma.payoutEvent.createMany({
    data: [
      {
        assetId: solarAsset.id,
        eventDate: new Date('2024-01-31'),
        totalPayoutAmount: 62500,
        currency: 'USD',
        notes: 'Q4 2023 dividend distribution',
      },
      {
        assetId: solarAsset.id,
        eventDate: new Date('2024-04-30'),
        totalPayoutAmount: 65000,
        currency: 'USD',
        notes: 'Q1 2024 dividend distribution',
      },
    ],
  });

  console.log('✅ Payout events created');

  // Create Tier 2 Lendable Assets
  const gpuLendable = await prisma.lendableAsset.create({
    data: {
      ownerUserId: operatorUser.id,
      operatorOrgId: computeOrg.id,
      assetType: LendableAssetType.GPU,
      title: 'NVIDIA A100 80GB Compute Node',
      description: 'High-performance GPU compute node optimized for AI/ML training. Includes 4x A100 80GB GPUs with NVLink interconnect.',
      locationRegion: 'Austin, TX',
      capacityUnit: 'TFLOPs_hour',
      capacityMax: 1248,
      revenueModel: RevenueModel.PER_UNIT,
      targetYield: 22,
      isBuyToRent: false,
      status: LendableAssetStatus.ACTIVE,
      imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800',
    },
  });

  const scooterLendable = await prisma.lendableAsset.create({
    data: {
      ownerUserId: operatorUser.id,
      operatorOrgId: operatorOrg.id,
      assetType: LendableAssetType.SCOOTER,
      title: 'Lime E-Scooter Fleet Unit',
      description: 'Electric scooter deployed in shared mobility network. Revenue from per-ride and per-minute charges.',
      locationRegion: 'Miami, FL',
      capacityUnit: 'rides_month',
      capacityMax: 300,
      revenueModel: RevenueModel.REV_SHARE,
      targetYield: 18,
      isBuyToRent: true,
      status: LendableAssetStatus.ACTIVE,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    },
  });

  const solarLendable = await prisma.lendableAsset.create({
    data: {
      ownerUserId: investorUser.id,
      assetType: LendableAssetType.SOLAR,
      title: 'Residential Solar Array - 10kW',
      description: 'Rooftop solar installation generating clean energy. Revenue from net metering credits and SRECs.',
      locationRegion: 'San Diego, CA',
      capacityUnit: 'kWh_month',
      capacityMax: 1500,
      revenueModel: RevenueModel.FLAT_FEE,
      targetYield: 8,
      isBuyToRent: false,
      status: LendableAssetStatus.ACTIVE,
      imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800',
    },
  });

  const sensorLendable = await prisma.lendableAsset.create({
    data: {
      ownerUserId: operatorUser.id,
      operatorOrgId: operatorOrg.id,
      assetType: LendableAssetType.SENSOR,
      title: 'Smart City IoT Sensor Array',
      description: 'Network of environmental and traffic sensors deployed across urban areas. Data sold to municipal and private clients.',
      locationRegion: 'Denver, CO',
      capacityUnit: 'data_points_day',
      capacityMax: 100000,
      revenueModel: RevenueModel.REV_SHARE,
      targetYield: 15,
      isBuyToRent: false,
      status: LendableAssetStatus.ACTIVE,
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    },
  });

  console.log('✅ Tier 2 Lendable Assets created');

  // Create performance data for lendable assets
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const periodStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

    await prisma.lendableAssetPerformance.create({
      data: {
        lendableAssetId: gpuLendable.id,
        periodStart,
        periodEnd,
        utilizationValue: 950 + Math.random() * 200,
        grossRevenue: 8500 + Math.random() * 2000,
        expenses: 1200 + Math.random() * 300,
        netYield: 7300 + Math.random() * 1700,
        uploadedByUserId: operatorUser.id,
      },
    });

    await prisma.lendableAssetPerformance.create({
      data: {
        lendableAssetId: scooterLendable.id,
        periodStart,
        periodEnd,
        utilizationValue: 180 + Math.random() * 80,
        grossRevenue: 850 + Math.random() * 300,
        expenses: 150 + Math.random() * 50,
        netYield: 700 + Math.random() * 250,
        uploadedByUserId: operatorUser.id,
      },
    });
  }

  console.log('✅ Performance data created');

  // Create Tier 3 Coming Soon data - Royalty Streams
  await prisma.royaltyStream.createMany({
    data: [
      {
        name: 'Tech Patent Pool - AI/ML',
        underlyingReference: 'Patent portfolio covering machine learning inference optimizations',
        type: RoyaltyType.IP,
        sharePercentage: 5,
        payoutSchedule: 'quarterly',
        jurisdiction: 'US',
        riskRating: RiskRating.HIGH,
        status: AssetStatus.DRAFT,
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      },
      {
        name: 'Music Royalty - Indie Catalog',
        underlyingReference: 'Streaming royalties from independent artist catalog (500+ tracks)',
        type: RoyaltyType.IP,
        sharePercentage: 10,
        payoutSchedule: 'monthly',
        jurisdiction: 'US',
        riskRating: RiskRating.MEDIUM,
        status: AssetStatus.DRAFT,
        imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
      },
      {
        name: 'Mining Output Share - Lithium',
        underlyingReference: 'Revenue share from Nevada lithium extraction operation',
        type: RoyaltyType.INDUSTRIAL,
        sharePercentage: 2.5,
        payoutSchedule: 'quarterly',
        jurisdiction: 'US',
        riskRating: RiskRating.HIGH,
        status: AssetStatus.DRAFT,
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      },
    ],
  });

  console.log('✅ Royalty Streams created');

  // Create Contract Instruments
  await prisma.contractInstrument.createMany({
    data: [
      {
        name: 'AWS Data Center Maintenance Contract',
        contractType: ContractType.SERVICE,
        counterpartyA: 'CloudServe Facilities Inc.',
        counterpartyB: 'Amazon Web Services',
        expectedCashflows: { annual: 2400000, duration_years: 5 },
        tokenizationParams: { total_tokens: 100000, price_per_token: 120 },
        status: ContractStatus.DRAFT,
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      },
      {
        name: 'LNG Offtake Agreement - Gulf Coast',
        contractType: ContractType.OFFTAKE,
        counterpartyA: 'Texas LNG Partners',
        counterpartyB: 'European Energy Consortium',
        expectedCashflows: { annual: 50000000, duration_years: 20 },
        tokenizationParams: { total_tokens: 1000000, price_per_token: 50 },
        status: ContractStatus.DRAFT,
        imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
      },
    ],
  });

  console.log('✅ Contract Instruments created');

  // Create Municipal Projects
  await prisma.municipalProject.createMany({
    data: [
      {
        city: 'Austin',
        region: 'Texas',
        projectType: ProjectType.TRANSIT,
        name: 'Downtown Light Rail Extension',
        description: 'Extension of the existing light rail system to connect downtown with the airport and major employment centers.',
        targetRaise: 250000000,
        totalRaised: 0,
        projectedApy: 5.5,
        status: ProjectStatus.PLANNED,
        esgTags: ['Carbon Reduction', 'Public Transit', 'Urban Development'],
        imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
      },
      {
        city: 'Miami',
        region: 'Florida',
        projectType: ProjectType.WATER,
        name: 'Coastal Resilience - Sea Wall Project',
        description: 'Construction of modern sea walls and water management infrastructure to protect against rising sea levels.',
        targetRaise: 180000000,
        totalRaised: 0,
        projectedApy: 4.8,
        status: ProjectStatus.PLANNED,
        esgTags: ['Climate Adaptation', 'Infrastructure', 'Coastal Protection'],
        imageUrl: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800',
      },
      {
        city: 'Denver',
        region: 'Colorado',
        projectType: ProjectType.HOUSING,
        name: 'Affordable Housing Initiative',
        description: 'Development of 2,000 affordable housing units across multiple neighborhoods.',
        targetRaise: 150000000,
        totalRaised: 0,
        projectedApy: 6.2,
        status: ProjectStatus.PLANNED,
        esgTags: ['Affordable Housing', 'Community Development', 'Social Impact'],
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      },
    ],
  });

  console.log('✅ Municipal Projects created');

  // Create Reward Programs
  const transitRewardProgram = await prisma.rewardProgram.create({
    data: {
      name: 'Green Transit Rewards',
      description: 'Earn rewards for using public transportation and reducing carbon emissions.',
      sponsorOrgId: issuerOrg.id,
      criteria: {
        actions: ['bus_ride', 'train_ride', 'bike_share', 'ev_charging'],
        points_per_action: { bus_ride: 10, train_ride: 15, bike_share: 20, ev_charging: 25 },
      },
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
    },
  });

  const recyclingProgram = await prisma.rewardProgram.create({
    data: {
      name: 'Circular Economy Rewards',
      description: 'Get rewarded for recycling, composting, and reducing waste.',
      criteria: {
        actions: ['recycle', 'compost', 'reuse', 'donate'],
        points_per_action: { recycle: 5, compost: 10, reuse: 15, donate: 20 },
      },
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    },
  });

  // Create sample reward events
  await prisma.rewardEvent.createMany({
    data: [
      {
        programId: transitRewardProgram.id,
        userId: investorUser.id,
        amount: 150,
        reason: 'Monthly transit usage',
        metadata: { rides: 15, type: 'train' },
      },
      {
        programId: recyclingProgram.id,
        userId: investorUser.id,
        amount: 75,
        reason: 'Recycling milestone',
        metadata: { kg_recycled: 25 },
      },
    ],
  });

  console.log('✅ Reward Programs created');

  console.log('🎉 Database seed completed successfully!');
  console.log('\nTest accounts:');
  console.log('  Admin: admin@realfi.network / Password123!');
  console.log('  Investor: investor@example.com / Password123!');
  console.log('  Operator: operator@example.com / Password123!');
  console.log('  Issuer: issuer@example.com / Password123!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });









