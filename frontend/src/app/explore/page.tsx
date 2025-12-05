'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  LayoutGrid,
  List,
  Loader2,
  Zap,
  ArrowRight,
  Cpu,
  Sun,
  Car,
  Building2,
  Factory,
  Landmark,
  Sparkles,
  TrendingUp,
  Shield,
  Globe,
  Bot,
  Battery,
  Coffee,
  Dumbbell,
  Droplets,
  Bike,
  Server,
  ChevronRight,
  CircleDollarSign,
  Users,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { assetsApi } from '@/lib/api';
import { AssetCard } from '@/components/assets/asset-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Enhanced mock data with advanced asset types
const mockAssets = [
  // GPU & Compute Infrastructure
  {
    id: 'gpu-1',
    name: 'NVIDIA H100 Datacenter Pod',
    category: 'GPU_CLUSTER',
    locationRegion: 'San Francisco, CA',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    projectedApy: 24.5,
    riskRating: 'MEDIUM',
    targetRaise: 5000000,
    totalRaised: 3750000,
    status: 'FUNDING',
    featured: true,
    revenueSource: 'AI training, inference pipelines, ML workloads',
    highlights: ['Enterprise contracts', '99.9% uptime SLA', 'Tier-4 datacenter'],
  },
  {
    id: 'gpu-2',
    name: 'Denver AI Render Farm',
    category: 'GPU_CLUSTER',
    locationRegion: 'Denver, CO',
    imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800',
    projectedApy: 22.0,
    riskRating: 'HIGH',
    targetRaise: 3000000,
    totalRaised: 1200000,
    status: 'FUNDING',
    revenueSource: '3D rendering, VFX studios, game development',
    highlights: ['Hollywood studio contracts', 'Carbon neutral'],
  },
  // Automated Restaurants & QSR
  {
    id: 'robot-restaurant-1',
    name: 'AutoServe Robotic Kitchen - LA',
    category: 'AUTOMATED_RESTAURANT',
    locationRegion: 'Los Angeles, CA',
    imageUrl: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800',
    projectedApy: 18.5,
    riskRating: 'MEDIUM',
    targetRaise: 2000000,
    totalRaised: 1400000,
    status: 'FUNDING',
    featured: true,
    revenueSource: 'Autonomous food prep, 24/7 service, delivery orders',
    highlights: ['Zero labor costs', 'AI-driven inventory', '800+ orders/day'],
  },
  // EV Charging Infrastructure
  {
    id: 'charger-1',
    name: 'LA Metro Charging Network',
    category: 'EV_CHARGING',
    locationRegion: 'Los Angeles, CA',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
    projectedApy: 16.5,
    riskRating: 'LOW',
    targetRaise: 2000000,
    totalRaised: 1800000,
    status: 'FUNDING',
    featured: true,
    revenueSource: 'Per kWh charging fees, idle fees, premium locations',
    highlights: ['350kW fast chargers', 'Prime retail locations', 'Growing EV demand'],
  },
  {
    id: 'charger-2',
    name: 'Bay Area Supercharger Hub',
    category: 'EV_CHARGING',
    locationRegion: 'San Francisco, CA',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    projectedApy: 18.2,
    riskRating: 'LOW',
    targetRaise: 1500000,
    totalRaised: 1500000,
    status: 'LIVE',
    revenueSource: 'Premium charging rates, Tesla destination partnerships',
    highlights: ['100% funded', 'Generating returns'],
  },
  // Mobility Fleets
  {
    id: 'mobility-1',
    name: 'Tesla Model Y Rideshare Fleet',
    category: 'MOBILITY_FLEET',
    locationRegion: 'Austin, TX',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
    projectedApy: 19.8,
    riskRating: 'MEDIUM',
    targetRaise: 1800000,
    totalRaised: 900000,
    status: 'FUNDING',
    revenueSource: 'Uber/Lyft bookings, airport transfers, events',
    highlights: ['Fleet management AI', 'Insurance included', '85% utilization'],
  },
  {
    id: 'scooter-1',
    name: 'Miami Micromobility Network',
    category: 'MICROMOBILITY',
    locationRegion: 'Miami, FL',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    projectedApy: 15.8,
    riskRating: 'MEDIUM',
    targetRaise: 800000,
    totalRaised: 640000,
    status: 'FUNDING',
    revenueSource: 'Per-ride fees, subscription plans, tourist hotspots',
    highlights: ['1,200 scooters', 'City contract', 'High tourist traffic'],
  },
  // Clean Energy Infrastructure
  {
    id: 'solar-1',
    name: 'Arizona Solar Microgrid',
    category: 'SOLAR_PLANT',
    locationRegion: 'Phoenix, AZ',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    projectedApy: 11.5,
    riskRating: 'LOW',
    targetRaise: 4000000,
    totalRaised: 4000000,
    status: 'LIVE',
    revenueSource: 'Grid energy sales, PPA contracts, net metering',
    highlights: ['25-year PPA', 'Utility-grade panels', 'Tax incentives'],
  },
  {
    id: 'battery-1',
    name: 'Texas Grid Battery Farm',
    category: 'BATTERY_STORAGE',
    locationRegion: 'Austin, TX',
    imageUrl: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800',
    projectedApy: 14.2,
    riskRating: 'MEDIUM',
    targetRaise: 6000000,
    totalRaised: 3600000,
    status: 'FUNDING',
    revenueSource: 'Peak shaving, grid arbitrage, frequency regulation',
    highlights: ['ERCOT certified', '100MWh capacity', 'Revenue stacking'],
  },
  // Automated Service Businesses
  {
    id: 'carwash-1',
    name: 'AutoSpa Express Tunnel',
    category: 'CAR_WASH',
    locationRegion: 'Dallas, TX',
    imageUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800',
    projectedApy: 16.8,
    riskRating: 'LOW',
    targetRaise: 750000,
    totalRaised: 600000,
    status: 'FUNDING',
    revenueSource: 'Per-wash fees, monthly memberships, detailing upsells',
    highlights: ['Fully automated', '150 cars/day capacity', 'Subscription model'],
  },
  {
    id: 'laundromat-1',
    name: 'SmartWash Laundromat Network',
    category: 'LAUNDROMAT',
    locationRegion: 'Chicago, IL',
    imageUrl: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800',
    projectedApy: 14.5,
    riskRating: 'LOW',
    targetRaise: 500000,
    totalRaised: 425000,
    status: 'FUNDING',
    revenueSource: 'Per-cycle fees, app-based payments, wash-fold services',
    highlights: ['IoT-enabled machines', 'Remote monitoring', '24/7 operation'],
  },
  // Industrial Robotics
  {
    id: 'robotics-1',
    name: 'Warehouse Robotics Cell',
    category: 'INDUSTRIAL_ROBOTICS',
    locationRegion: 'Memphis, TN',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    projectedApy: 20.5,
    riskRating: 'HIGH',
    targetRaise: 2500000,
    totalRaised: 1000000,
    status: 'FUNDING',
    revenueSource: 'Pick-and-pack automation, 3PL contracts, fulfillment fees',
    highlights: ['Amazon DSP partner', '10x efficiency', 'Multi-tenant'],
  },
  // Tokenized Retail
  {
    id: 'coffee-1',
    name: 'Artisan Coffee Collective',
    category: 'COFFEE_SHOP',
    locationRegion: 'Seattle, WA',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
    projectedApy: 12.5,
    riskRating: 'MEDIUM',
    targetRaise: 600000,
    totalRaised: 420000,
    status: 'FUNDING',
    revenueSource: 'Daily coffee sales, wholesale beans, catering events',
    highlights: ['Prime downtown location', 'Award-winning roasts', 'Growing brand'],
  },
  {
    id: 'gym-1',
    name: '24/7 Fitness Hub',
    category: 'GYM',
    locationRegion: 'Denver, CO',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    projectedApy: 13.2,
    riskRating: 'MEDIUM',
    targetRaise: 900000,
    totalRaised: 630000,
    status: 'FUNDING',
    revenueSource: 'Monthly memberships, personal training, supplements',
    highlights: ['Keycard access', 'Low overhead', '2,400 members'],
  },
  // Vending & ATM Networks
  {
    id: 'vending-1',
    name: 'Smart Vending Network',
    category: 'VENDING_MACHINE',
    locationRegion: 'New York, NY',
    imageUrl: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=800',
    projectedApy: 18.0,
    riskRating: 'MEDIUM',
    targetRaise: 400000,
    totalRaised: 400000,
    status: 'LIVE',
    revenueSource: 'Product sales, advertising displays, data monetization',
    highlights: ['AI inventory', 'Touchless payment', 'Premium locations'],
  },
  {
    id: 'atm-1',
    name: 'Metro ATM Network',
    category: 'ATM',
    locationRegion: 'Boston, MA',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    projectedApy: 11.8,
    riskRating: 'LOW',
    targetRaise: 350000,
    totalRaised: 280000,
    status: 'FUNDING',
    revenueSource: 'Transaction fees, surcharge revenue, interchange',
    highlights: ['High-traffic venues', 'Crypto-enabled', 'Low maintenance'],
  },
];

// Enhanced filter categories
const categories = [
  { value: 'all', label: 'All Infrastructure', icon: Building2, color: 'text-foreground' },
  { value: 'GPU_CLUSTER', label: 'AI & Compute', icon: Cpu, color: 'text-neon-purple' },
  { value: 'EV_CHARGING', label: 'EV Chargers', icon: Zap, color: 'text-neon-green' },
  { value: 'SOLAR_PLANT', label: 'Solar & Energy', icon: Sun, color: 'text-amber-400' },
  { value: 'BATTERY_STORAGE', label: 'Battery Storage', icon: Battery, color: 'text-neon-cyan' },
  { value: 'MOBILITY_FLEET', label: 'Mobility Fleets', icon: Car, color: 'text-blue-400' },
  { value: 'MICROMOBILITY', label: 'Micromobility', icon: Bike, color: 'text-lime-400' },
  { value: 'AUTOMATED_RESTAURANT', label: 'Automated QSR', icon: Bot, color: 'text-orange-400' },
  { value: 'INDUSTRIAL_ROBOTICS', label: 'Industrial Robotics', icon: Factory, color: 'text-rose-400' },
  { value: 'CAR_WASH', label: 'Car Washes', icon: Droplets, color: 'text-sky-400' },
  { value: 'LAUNDROMAT', label: 'Laundromats', icon: Building2, color: 'text-indigo-400' },
  { value: 'COFFEE_SHOP', label: 'Coffee & Retail', icon: Coffee, color: 'text-amber-600' },
  { value: 'GYM', label: 'Fitness Centers', icon: Dumbbell, color: 'text-red-400' },
  { value: 'VENDING_MACHINE', label: 'Vending Networks', icon: Server, color: 'text-emerald-400' },
  { value: 'ATM', label: 'ATM Networks', icon: CircleDollarSign, color: 'text-green-400' },
  { value: 'GOVERNMENT', label: 'Gov Infrastructure', icon: Landmark, color: 'text-slate-400' },
];

const riskLevels = [
  { value: 'all', label: 'All Risk Levels' },
  { value: 'LOW', label: 'Low Risk' },
  { value: 'MEDIUM', label: 'Medium Risk' },
  { value: 'HIGH', label: 'High Risk' },
];

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'FUNDING', label: 'Now Funding' },
  { value: 'LIVE', label: 'Live & Earning' },
  { value: 'CLOSED', label: 'Closed' },
];

// DEPIN partner platforms
const depinPartners = [
  { name: 'Render Network', category: 'GPU Compute', status: 'Coming Soon' },
  { name: 'Helium', category: 'IoT & 5G', status: 'Coming Soon' },
  { name: 'Filecoin', category: 'Storage', status: 'Coming Soon' },
  { name: 'Akash Network', category: 'Cloud Compute', status: 'Coming Soon' },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [riskRating, setRiskRating] = useState('all');
  const [status, setStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data, isLoading, error } = useQuery({
    queryKey: ['assets', category, riskRating, status],
    queryFn: async () => {
      try {
        const params: any = {};
        if (category !== 'all') params.category = category;
        if (riskRating !== 'all') params.riskRating = riskRating;
        if (status !== 'all') params.status = status;
        
        const response = await assetsApi.list(params);
        return response.data;
      } catch (e) {
        // Return mock data when API is unavailable
        let filtered = [...mockAssets];
        if (category !== 'all') filtered = filtered.filter(a => a.category === category);
        if (riskRating !== 'all') filtered = filtered.filter(a => a.riskRating === riskRating);
        if (status !== 'all') filtered = filtered.filter(a => a.status === status);
        return { data: filtered };
      }
    },
  });

  const assets = data?.data || [];

  // Filter by search query (client-side)
  const filteredAssets = assets.filter((asset: any) =>
    searchQuery
      ? asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.locationRegion.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const featuredAssets = filteredAssets.filter((a: any) => a.featured);
  const regularAssets = filteredAssets.filter((a: any) => !a.featured);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background - Cyan/Green theme for Ownership */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-cyan w-[500px] h-[500px] top-10 -right-40 opacity-15" />
        <div className="orb orb-green w-[400px] h-[400px] bottom-40 -left-32 opacity-10" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="container relative">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-6">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-neon-cyan">Own Real Infrastructure</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 leading-tight">
            Fractional Ownership of<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-neon-green to-emerald-400">
              Revenue-Generating Assets
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8">
            Own pieces of physical infrastructure, automated systems, and DEPIN assets that generate 
            real-world revenue. From GPU clusters powering AI to EV chargers and robotic restaurants — 
            build wealth from the autonomous economy.
          </p>

          {/* Value Props */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: TrendingUp, label: 'Projected Returns', value: '10-25% APY' },
              { icon: Shield, label: 'Asset-Backed', value: 'Real Collateral' },
              { icon: Globe, label: 'Geographic', value: 'Diversification' },
              { icon: Users, label: 'Community', value: '10K+ Investors' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="glass-card p-4 text-center"
              >
                <item.icon className="w-5 h-5 mx-auto mb-2 text-neon-cyan" />
                <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                <div className="font-semibold text-sm">{item.value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 relative overflow-hidden rounded-2xl border border-neon-cyan/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-green/5 to-transparent" />
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-green/20 flex items-center justify-center flex-shrink-0 border border-neon-cyan/30">
                <Cpu className="w-8 h-8 text-neon-cyan" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">Own GPU Infrastructure</h2>
                <p className="text-muted-foreground max-w-lg">
                  High-performance GPUs in commercial datacenters earning from AI workloads, 
                  training jobs, and decentralized compute networks. The AI economy, tokenized.
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className="text-neon-green font-medium">Up to 24.5% APY</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">Enterprise contracts</span>
                </div>
              </div>
            </div>
            <Button asChild className="gap-2 bg-neon-cyan hover:bg-neon-cyan/90 text-background font-semibold">
              <Link href="/explore?category=GPU_CLUSTER">
                View GPU Assets
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Quick Category Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
            Browse by Asset Type
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { icon: Cpu, label: 'AI & Compute', category: 'GPU_CLUSTER', color: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/20' },
              { icon: Zap, label: 'EV Chargers', category: 'EV_CHARGING', color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/20' },
              { icon: Sun, label: 'Solar Energy', category: 'SOLAR_PLANT', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
              { icon: Car, label: 'Mobility Fleets', category: 'MOBILITY_FLEET', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
              { icon: Bot, label: 'Automated QSR', category: 'AUTOMATED_RESTAURANT', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
              { icon: Factory, label: 'Robotics', category: 'INDUSTRIAL_ROBOTICS', color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
            ].map((item, index) => (
              <button
                key={item.category}
                onClick={() => setCategory(item.category)}
                className={cn(
                  'glass-card p-4 text-left transition-all group border',
                  category === item.category 
                    ? `${item.border} ${item.bg}` 
                    : 'border-white/5 hover:border-white/20'
                )}
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', item.bg)}>
                  <item.icon className={cn('w-5 h-5', item.color)} />
                </div>
                <div className="font-medium text-sm group-hover:text-foreground transition-colors">{item.label}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Advanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 mb-8 border border-neon-cyan/10"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, or asset type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>

            {/* Category Filter */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full lg:w-[200px] bg-white/5 border-white/10">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <cat.icon className={cn('w-4 h-4', cat.color)} />
                      {cat.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Risk Filter */}
            <Select value={riskRating} onValueChange={setRiskRating}>
              <SelectTrigger className="w-full lg:w-[160px] bg-white/5 border-white/10">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                {riskLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full lg:w-[160px] bg-white/5 border-white/10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex items-center gap-1 border border-white/10 rounded-lg p-1 bg-white/5">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-neon-cyan" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              Failed to load assets. Please try again.
            </p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No assets found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Assets */}
            {featuredAssets.length > 0 && category === 'all' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mb-12"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-neon-cyan" />
                  Featured Opportunities
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredAssets.map((asset: any, index: number) => (
                    <motion.div
                      key={asset.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <AssetCard asset={asset} featured />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* All Assets */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {category === 'all' && featuredAssets.length > 0 && (
                <h3 className="text-lg font-semibold mb-4">All Investment Opportunities</h3>
              )}
              <div
                className={cn(
                  'grid gap-6',
                  viewMode === 'grid'
                    ? 'md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                )}
              >
                {(category === 'all' ? regularAssets : filteredAssets).map((asset: any, index: number) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <AssetCard asset={asset} listView={viewMode === 'list'} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          Showing {filteredAssets.length} of {assets.length} investment opportunities
        </motion.div>

        {/* DEPIN Partners Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 glass-card p-8 border border-neon-purple/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center">
              <Globe className="w-5 h-5 text-neon-purple" />
            </div>
            <div>
              <h3 className="text-xl font-bold">DEPIN Network Integrations</h3>
              <p className="text-sm text-muted-foreground">Third-party decentralized infrastructure coming to RealFi</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {depinPartners.map((partner) => (
              <div
                key={partner.name}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="font-semibold mb-1">{partner.name}</div>
                <div className="text-xs text-muted-foreground mb-2">{partner.category}</div>
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-neon-purple/10 text-neon-purple">
                  {partner.status}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline" className="gap-2 border-neon-purple/30 hover:bg-neon-purple/10">
              Learn About DEPIN Integration
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8">How Fractional Ownership Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Choose Your Asset',
                description: 'Browse curated infrastructure opportunities — from GPU clusters to EV chargers to automated businesses.',
                icon: Search,
              },
              {
                step: '02',
                title: 'Invest Any Amount',
                description: 'Purchase fractional ownership tokens starting from $100. Each token represents real equity in physical assets.',
                icon: CircleDollarSign,
              },
              {
                step: '03',
                title: 'Earn Passive Income',
                description: 'Receive your share of revenue generated by the asset — distributed automatically to your wallet.',
                icon: TrendingUp,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass-card p-6 text-center border border-neon-cyan/10"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neon-cyan/10 mb-4">
                  <item.icon className="w-6 h-6 text-neon-cyan" />
                </div>
                <div className="text-sm font-mono text-neon-cyan mb-2">{item.step}</div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
