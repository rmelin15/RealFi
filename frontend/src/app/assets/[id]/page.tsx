'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Building2,
  Users,
  Calendar,
  FileText,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Clock,
  DollarSign,
} from 'lucide-react';
import { assetsApi, offeringsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/stores/auth-store';
import {
  formatCurrency,
  formatPercent,
  calculateProgress,
  getCategoryLabel,
  getRiskColor,
  getStatusColor,
  cn,
} from '@/lib/utils';

// Mock asset data for demo
const mockAssets: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Downtown Manhattan Coffee Co.',
    category: 'COFFEE_SHOP',
    locationRegion: 'New York, NY',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
    projectedApy: 12.5,
    riskRating: 'MEDIUM',
    targetRaise: 1000000,
    totalRaised: 425000,
    pricePerShare: 100,
    totalShares: 10000,
    minInvestment: 100,
    maxInvestment: 50000,
    status: 'FUNDING',
    description: 'A premium coffee shop located in the heart of Downtown Manhattan, serving specialty coffee and artisan pastries. The location enjoys high foot traffic from nearby financial district offices and has established a loyal customer base since opening in 2022.',
    highlights: [
      'Prime location in Financial District with 50,000+ daily foot traffic',
      'Average ticket size of $12.50 with 85% customer retention rate',
      'Sustainable sourcing with direct-trade coffee partnerships',
      'Experienced management team with 20+ years in hospitality',
    ],
    sponsorOrg: { name: 'Manhattan Hospitality Group' },
    offerings: [{ id: 'off-1', status: 'OPEN' }],
  },
  '2': {
    id: '2',
    name: 'Atlas AI GPU Cluster',
    category: 'GPU_CLUSTER',
    locationRegion: 'San Francisco, CA',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    projectedApy: 18.0,
    riskRating: 'MEDIUM',
    targetRaise: 2500000,
    totalRaised: 1875000,
    pricePerShare: 250,
    totalShares: 10000,
    minInvestment: 250,
    maxInvestment: 100000,
    status: 'FUNDING',
    description: 'State-of-the-art NVIDIA H100 GPU cluster optimized for AI/ML training and inference workloads. Located in a Tier 4 data center with 99.999% uptime SLA. Already contracted with three Fortune 500 companies for compute capacity.',
    highlights: [
      '128 NVIDIA H100 GPUs with NVLink interconnect',
      '3-year contracts with Microsoft, Meta, and OpenAI',
      'Tier 4 data center with redundant power and cooling',
      'Average utilization rate of 94% across all GPUs',
    ],
    sponsorOrg: { name: 'Atlas Computing Inc.' },
    offerings: [{ id: 'off-2', status: 'OPEN' }],
  },
  '3': {
    id: '3',
    name: 'Arizona Solar Array',
    category: 'SOLAR_PLANT',
    locationRegion: 'Phoenix, AZ',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    projectedApy: 9.5,
    riskRating: 'LOW',
    targetRaise: 2500000,
    totalRaised: 2500000,
    pricePerShare: 50,
    totalShares: 50000,
    minInvestment: 100,
    maxInvestment: 100000,
    status: 'LIVE',
    description: 'A fully operational 5MW solar photovoltaic installation in the Arizona desert. Connected to the grid with a 20-year Power Purchase Agreement with Arizona Public Service. Generating consistent returns from day one.',
    highlights: [
      '5MW capacity with premium SunPower panels',
      '20-year PPA with APS at $0.08/kWh',
      'Annual generation of 9,000+ MWh',
      'ITC tax benefits passed through to investors',
    ],
    sponsorOrg: { name: 'SunRise Energy Partners' },
    offerings: [],
  },
  '4': {
    id: '4',
    name: 'Brooklyn Auto Spa',
    category: 'CAR_WASH',
    locationRegion: 'Brooklyn, NY',
    imageUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800',
    projectedApy: 14.2,
    riskRating: 'LOW',
    targetRaise: 500000,
    totalRaised: 275000,
    pricePerShare: 50,
    totalShares: 10000,
    minInvestment: 100,
    maxInvestment: 25000,
    status: 'FUNDING',
    description: 'Modern automated car wash facility with eco-friendly water recycling technology. Located at a high-traffic intersection in Brooklyn with easy access from the BQE. Offers express wash, full-service detail, and monthly membership plans.',
    highlights: [
      'Processes 200+ vehicles daily with 5-minute express wash',
      'Water recycling system reduces usage by 80%',
      '40% of customers are monthly subscribers',
      'Prime corner location with 24/7 self-service vacuum stations',
    ],
    sponsorOrg: { name: 'Brooklyn Auto Services LLC' },
    offerings: [{ id: 'off-4', status: 'OPEN' }],
  },
};

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuthStore();
  const [investAmount, setInvestAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);

  const assetId = params.id as string;

  const { data: assetData, isLoading } = useQuery({
    queryKey: ['asset', assetId],
    queryFn: async () => {
      try {
        const response = await assetsApi.get(assetId);
        return response.data.data;
      } catch (e) {
        // Return mock data when API is unavailable
        return mockAssets[assetId] || null;
      }
    },
  });

  const asset = assetData;
  const activeOffering = asset?.offerings?.find(
    (o: any) => o.status === 'OPEN'
  );

  const handleInvest = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!activeOffering) {
      toast({
        title: 'No active offering',
        description: 'This asset is not currently accepting investments.',
        variant: 'destructive',
      });
      return;
    }

    if (user?.kycStatus !== 'APPROVED') {
      toast({
        title: 'KYC Required',
        description: 'Please complete KYC verification to invest.',
        variant: 'destructive',
      });
      return;
    }

    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid investment amount.',
        variant: 'destructive',
      });
      return;
    }

    setIsInvesting(true);
    try {
      await offeringsApi.subscribe(activeOffering.id, amount);
      toast({
        title: 'Investment submitted!',
        description: `Your investment of ${formatCurrency(amount)} has been recorded.`,
      });
      setInvestAmount('');
      // Refresh data
      router.refresh();
    } catch (error: any) {
      toast({
        title: 'Investment failed',
        description: error.response?.data?.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setIsInvesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Asset not found</h1>
          <Button asChild>
            <Link href="/explore">Back to Explore</Link>
          </Button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress(
    Number(asset.totalRaised),
    Number(asset.targetRaise)
  );

  const estimatedShares = investAmount
    ? Math.floor(parseFloat(investAmount) / Number(asset.pricePerShare))
    : 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-cyan w-[400px] h-[400px] top-20 -right-32 opacity-20" />
        <div className="orb orb-purple w-[300px] h-[300px] bottom-40 -left-20 opacity-15" />
      </div>

      <div className="container relative">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" asChild>
            <Link href="/explore">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Explore
            </Link>
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[16/9] rounded-2xl overflow-hidden"
            >
              {asset.imageUrl ? (
                <Image
                  src={asset.imageUrl}
                  alt={asset.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span
                  className={cn(
                    'px-3 py-1 text-sm font-medium rounded-full',
                    getStatusColor(asset.status)
                  )}
                >
                  {asset.status}
                </span>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-white/10 backdrop-blur-sm">
                  {getCategoryLabel(asset.category)}
                </span>
              </div>
            </motion.div>

            {/* Title & Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold font-display mb-3">
                {asset.name}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{asset.locationRegion}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{asset.sponsorOrg?.name}</span>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-semibold mb-4">About This Asset</h2>
              <p className="text-muted-foreground leading-relaxed">
                {asset.description}
              </p>
            </motion.div>

            {/* Highlights */}
            {asset.highlights && asset.highlights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
              >
                <h2 className="text-lg font-semibold mb-4">Key Highlights</h2>
                <ul className="space-y-3">
                  {asset.highlights.map((highlight: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Documents */}
            {asset.documents && asset.documents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="glass-card p-6"
              >
                <h2 className="text-lg font-semibold mb-4">Documents</h2>
                <div className="grid gap-3">
                  {asset.documents.map((doc: any, index: number) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="flex-1">{doc.name}</span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Investment Panel */}
          <div className="space-y-6">
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 sticky top-24"
            >
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Projected APY</span>
                  </div>
                  <div className="text-2xl font-bold text-neon-green">
                    {asset.projectedApy
                      ? formatPercent(Number(asset.projectedApy))
                      : 'TBD'}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Risk Level</span>
                  </div>
                  <div
                    className={cn(
                      'text-2xl font-bold',
                      getRiskColor(asset.riskRating)
                    )}
                  >
                    {asset.riskRating}
                  </div>
                </div>
              </div>

              {/* Funding Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Funding Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 mb-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {formatCurrency(Number(asset.totalRaised))} raised
                  </span>
                  <span className="text-muted-foreground">
                    of {formatCurrency(Number(asset.targetRaise))}
                  </span>
                </div>
              </div>

              {/* Token Info */}
              <div className="space-y-3 mb-6 p-4 rounded-lg bg-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Price per Share
                  </span>
                  <span className="font-medium">
                    {formatCurrency(Number(asset.pricePerShare))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Shares
                  </span>
                  <span className="font-medium">
                    {Number(asset.totalShares).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Min Investment
                  </span>
                  <span className="font-medium">
                    {formatCurrency(Number(asset.minInvestment))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Max Investment
                  </span>
                  <span className="font-medium">
                    {formatCurrency(Number(asset.maxInvestment))}
                  </span>
                </div>
              </div>

              {/* Investment Form */}
              {activeOffering ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Investment Amount (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="1,000"
                        value={investAmount}
                        onChange={(e) => setInvestAmount(e.target.value)}
                        className="pl-10"
                        min={Number(asset.minInvestment)}
                        max={Number(asset.maxInvestment)}
                      />
                    </div>
                    {estimatedShares > 0 && (
                      <p className="text-sm text-muted-foreground">
                        ≈ {estimatedShares.toLocaleString()} shares
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleInvest}
                    className="w-full"
                    size="lg"
                    disabled={isInvesting || !investAmount}
                  >
                    {isInvesting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : isAuthenticated ? (
                      'Invest Now'
                    ) : (
                      'Sign In to Invest'
                    )}
                  </Button>

                  {!isAuthenticated && (
                    <p className="text-xs text-center text-muted-foreground">
                      <Link href="/auth/register" className="text-primary hover:underline">
                        Create an account
                      </Link>{' '}
                      to start investing
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {asset.status === 'LIVE'
                      ? 'Fully funded - No active offering'
                      : asset.status === 'CLOSED'
                      ? 'This offering has closed'
                      : 'Coming soon'}
                  </p>
                </div>
              )}

              {/* Risk Disclaimer */}
              <p className="text-xs text-muted-foreground text-center mt-4">
                Investment involves risk. Past performance is not indicative of
                future results.{' '}
                <Link href="/risk" className="text-primary hover:underline">
                  Read risk disclosure
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}



