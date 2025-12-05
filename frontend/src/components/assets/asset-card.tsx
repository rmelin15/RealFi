'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, TrendingUp, AlertTriangle, Sparkles, Zap, ChevronRight, DollarSign } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  formatCurrency,
  formatPercent,
  calculateProgress,
  getCategoryLabel,
  getRiskColor,
  getStatusColor,
  cn,
} from '@/lib/utils';

interface Asset {
  id: string;
  name: string;
  category: string;
  locationRegion: string;
  imageUrl?: string;
  projectedApy?: number;
  riskRating: string;
  targetRaise: number;
  totalRaised: number;
  status: string;
  featured?: boolean;
  revenueSource?: string;
  highlights?: string[];
}

interface AssetCardProps {
  asset: Asset;
  featured?: boolean;
  listView?: boolean;
}

export function AssetCard({ asset, featured = false, listView = false }: AssetCardProps) {
  const progress = calculateProgress(asset.totalRaised, asset.targetRaise);
  const isFeatured = featured || asset.featured;

  if (listView) {
    return (
      <Link href={`/assets/${asset.id}`} className="block group">
        <div className={cn(
          'glass-card overflow-hidden hover:border-primary/30 transition-all duration-300',
          isFeatured && 'border-neon-cyan/30 bg-gradient-to-r from-neon-cyan/5 to-transparent'
        )}>
          <div className="flex flex-col md:flex-row gap-4 p-4">
            {/* Image */}
            <div className="relative w-full md:w-48 h-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0">
              {asset.imageUrl ? (
                <Image
                  src={asset.imageUrl}
                  alt={asset.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
              )}
              {isFeatured && (
                <div className="absolute top-2 left-2">
                  <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-neon-cyan/20 text-neon-cyan backdrop-blur-sm">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      'px-2 py-0.5 text-xs font-medium rounded-full',
                      getStatusColor(asset.status)
                    )}>
                      {asset.status}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/10">
                      {getCategoryLabel(asset.category)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {asset.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{asset.locationRegion}</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-neon-green">
                    {asset.projectedApy ? formatPercent(asset.projectedApy) : 'TBD'}
                  </div>
                  <div className="text-xs text-muted-foreground">Projected APY</div>
                </div>
              </div>

              {/* Revenue Source */}
              {asset.revenueSource && (
                <div className="mt-3 text-sm text-muted-foreground flex items-start gap-2">
                  <DollarSign className="w-4 h-4 flex-shrink-0 text-neon-green/60" />
                  <span className="line-clamp-1">{asset.revenueSource}</span>
                </div>
              )}

              {/* Progress and Stats */}
              <div className="mt-4 flex items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Funding Progress</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
                <div className={cn('text-sm font-medium', getRiskColor(asset.riskRating))}>
                  {asset.riskRating} Risk
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/assets/${asset.id}`} className="block group">
      <div className={cn(
        'glass-card overflow-hidden hover:border-primary/30 transition-all duration-300 h-full',
        isFeatured && 'border-neon-cyan/30 ring-1 ring-neon-cyan/20'
      )}>
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {asset.imageUrl ? (
            <Image
              src={asset.imageUrl}
              alt={asset.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          
          {/* Featured Badge */}
          {isFeatured && (
            <div className="absolute top-3 left-3">
              <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-neon-cyan/20 text-neon-cyan backdrop-blur-sm border border-neon-cyan/30">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            </div>
          )}
          
          {/* Status Badge */}
          {!isFeatured && (
            <div className="absolute top-3 left-3">
              <span
                className={cn(
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusColor(asset.status)
                )}
              >
                {asset.status}
              </span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/10 backdrop-blur-sm">
              {getCategoryLabel(asset.category)}
            </span>
          </div>

          {/* APY Overlay */}
          <div className="absolute bottom-3 right-3">
            <div className="glass rounded-xl px-3 py-2 text-center">
              <div className="text-lg font-bold text-neon-green">
                {asset.projectedApy ? formatPercent(asset.projectedApy) : 'TBD'}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">APY</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {asset.name}
          </h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4" />
            <span>{asset.locationRegion}</span>
          </div>

          {/* Revenue Source */}
          {asset.revenueSource && (
            <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <DollarSign className="w-3 h-3 text-neon-green" />
                <span>Revenue Source</span>
              </div>
              <div className="text-sm line-clamp-2">{asset.revenueSource}</div>
            </div>
          )}

          {/* Highlights */}
          {asset.highlights && asset.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {asset.highlights.slice(0, 3).map((highlight, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-white/5 text-muted-foreground"
                >
                  {highlight}
                </span>
              ))}
            </div>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <TrendingUp className="w-3 h-3" />
                <span>Projected APY</span>
              </div>
              <div className="text-lg font-bold text-neon-green">
                {asset.projectedApy ? formatPercent(asset.projectedApy) : 'TBD'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Risk</span>
              </div>
              <div className={cn('text-lg font-bold', getRiskColor(asset.riskRating))}>
                {asset.riskRating}
              </div>
            </div>
          </div>

          {/* Funding Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Funding Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className={cn(
                'h-2',
                isFeatured && '[&>div]:bg-gradient-to-r [&>div]:from-neon-cyan [&>div]:to-neon-green'
              )} 
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(asset.totalRaised)} raised</span>
              <span>of {formatCurrency(asset.targetRaise)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
