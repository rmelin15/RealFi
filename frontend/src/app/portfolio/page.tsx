'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Building2,
  Cpu,
  DollarSign,
  PieChart,
  ArrowUpRight,
  Loader2,
  Lock,
} from 'lucide-react';
import { portfolioApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/stores/auth-store';
import {
  formatCurrency,
  formatPercent,
  getCategoryLabel,
  getLendableTypeLabel,
  getStatusColor,
  cn,
} from '@/lib/utils';

export default function PortfolioPage() {
  const { isAuthenticated, user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const response = await portfolioApi.getSummary();
      return response.data.data;
    },
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container">
          <div className="max-w-md mx-auto text-center py-20">
            <Lock className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">Sign in to view your portfolio</h1>
            <p className="text-muted-foreground mb-8">
              Track your investments, monitor yields, and manage your real-world asset
              positions.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const { summary, tier1Positions, tier2Positions } = data || {
    summary: { totalInvested: 0, totalValue: 0, unrealizedGain: 0, avgProjectedYield: 0, tier1Count: 0, tier2Count: 0 },
    tier1Positions: [],
    tier2Positions: [],
  };

  const isGain = summary.unrealizedGain >= 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-cyan w-[400px] h-[400px] top-20 -right-32 opacity-20" />
        <div className="orb orb-purple w-[300px] h-[300px] bottom-40 -left-20 opacity-15" />
      </div>

      <div className="container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold font-display mb-2">
            Welcome back, <span className="gradient-text">{user?.firstName}</span>
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your real-world asset portfolio.
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Invested</span>
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalInvested)}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Current Value</span>
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalValue)}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Unrealized Gain</span>
              {isGain ? (
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-rose-400" />
              )}
            </div>
            <div
              className={cn(
                'text-2xl font-bold',
                isGain ? 'text-emerald-400' : 'text-rose-400'
              )}
            >
              {isGain ? '+' : ''}
              {formatCurrency(summary.unrealizedGain)}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Avg. Yield</span>
              <PieChart className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-neon-green">
              {formatPercent(summary.avgProjectedYield)}
            </div>
          </div>
        </motion.div>

        {/* Tier 1 Positions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Direct Investments</h2>
              <span className="text-sm text-muted-foreground">
                ({tier1Positions.length} positions)
              </span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/explore">
                Browse More
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          {tier1Positions.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-semibold mb-2">No investments yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start building your portfolio by investing in real-world assets.
              </p>
              <Button asChild>
                <Link href="/explore">Explore Opportunities</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {tier1Positions.map((position: any) => (
                <Link
                  key={position.id}
                  href={`/assets/${position.assetId}`}
                  className="glass-card p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      {position.imageUrl ? (
                        <Image
                          src={position.imageUrl}
                          alt={position.assetName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{position.assetName}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{getCategoryLabel(position.assetCategory)}</span>
                        <span className={cn('px-2 py-0.5 rounded-full text-xs', getStatusColor(position.status))}>
                          {position.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(position.currentValue)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {position.sharesOwned} shares
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-neon-green font-semibold">
                        {formatPercent(position.projectedApy)} APY
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Tier 2 Positions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-accent" />
              <h2 className="text-xl font-semibold">Lendable Assets</h2>
              <span className="text-sm text-muted-foreground">
                ({tier2Positions.length} assets)
              </span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/lend">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          {tier2Positions.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Cpu className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-semibold mb-2">No lendable assets</h3>
              <p className="text-sm text-muted-foreground mb-4">
                List your assets and earn passive income.
              </p>
              <Button variant="outline" asChild>
                <Link href="/lend">Lend & Earn</Link>
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {tier2Positions.map((asset: any) => (
                <Link
                  key={asset.id}
                  href={`/lend/${asset.id}`}
                  className="glass-card p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      {asset.imageUrl ? (
                        <Image
                          src={asset.imageUrl}
                          alt={asset.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{asset.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        {getLendableTypeLabel(asset.assetType)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-neon-green font-semibold">
                        {formatPercent(asset.targetYield)} Yield
                      </div>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs', getStatusColor(asset.status))}>
                        {asset.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}


















