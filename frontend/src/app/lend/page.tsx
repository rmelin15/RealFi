'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Plus,
  Cpu,
  Car,
  Sun,
  Zap,
  Radio,
  HardDrive,
  Bot,
  Battery,
  Loader2,
  TrendingUp,
  MapPin,
  Wrench,
  Home,
  Camera,
  Warehouse,
  Thermometer,
  Monitor,
  Gamepad2,
  Tent,
  Music2,
  Printer3d,
  Drill,
  Snowflake,
  Droplets,
  Clock,
  DollarSign,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Repeat,
  CircleDollarSign,
  CheckCircle2,
  Timer,
  Activity,
} from 'lucide-react';
import { lendableAssetsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  formatPercent,
  getLendableTypeLabel,
  getStatusColor,
  cn,
} from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

// Enhanced mock data with new lendable asset categories
const mockLendableAssets = [
  // Idle Compute
  {
    id: 'gpu-lend-1',
    title: 'NVIDIA RTX 4090 - Rendering Cluster',
    assetType: 'GPU',
    locationRegion: 'San Francisco, CA',
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800',
    targetYield: 28.5,
    capacityMax: 8,
    capacityUnit: 'GPUs',
    revenueModel: 'PER_UNIT',
    status: 'ACTIVE',
    earningBasis: 'Per compute hour',
    category: 'COMPUTE',
  },
  {
    id: 'gpu-lend-2',
    title: 'AI Training Rig - ML Workloads',
    assetType: 'GPU',
    locationRegion: 'Austin, TX',
    imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800',
    targetYield: 32.0,
    capacityMax: 4,
    capacityUnit: 'A100 GPUs',
    revenueModel: 'REV_SHARE',
    status: 'ACTIVE',
    earningBasis: 'Per training job',
    category: 'COMPUTE',
  },
  // Excess Energy
  {
    id: 'solar-lend-1',
    title: 'Rooftop Solar Array - Excess kWh',
    assetType: 'SOLAR',
    locationRegion: 'Phoenix, AZ',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    targetYield: 14.5,
    capacityMax: 15000,
    capacityUnit: 'kWh/month',
    revenueModel: 'PER_UNIT',
    status: 'ACTIVE',
    earningBasis: 'Per kWh sold',
    category: 'ENERGY',
  },
  {
    id: 'battery-lend-1',
    title: 'Powerwall Battery - Grid Services',
    assetType: 'BATTERY',
    locationRegion: 'Los Angeles, CA',
    imageUrl: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800',
    targetYield: 12.8,
    capacityMax: 40,
    capacityUnit: 'kWh',
    revenueModel: 'REV_SHARE',
    status: 'ACTIVE',
    earningBasis: 'Per grid cycle',
    category: 'ENERGY',
  },
  // Vehicles When Idle
  {
    id: 'vehicle-1',
    title: 'Tesla Model Y - Turo Fleet',
    assetType: 'VEHICLE',
    locationRegion: 'Los Angeles, CA',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
    targetYield: 22.5,
    capacityMax: 1,
    capacityUnit: 'vehicle',
    revenueModel: 'REV_SHARE',
    status: 'ACTIVE',
    earningBasis: 'Per rental day',
    category: 'VEHICLES',
  },
  {
    id: 'vehicle-2',
    title: 'Ford Transit Van - Delivery Service',
    assetType: 'VEHICLE',
    locationRegion: 'Chicago, IL',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    targetYield: 18.2,
    capacityMax: 1,
    capacityUnit: 'vehicle',
    revenueModel: 'PER_UNIT',
    status: 'ACTIVE',
    earningBasis: 'Per delivery route',
    category: 'VEHICLES',
  },
  // Tools & Equipment
  {
    id: 'tools-1',
    title: 'Professional Power Tool Set',
    assetType: 'TOOLS',
    locationRegion: 'Denver, CO',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800',
    targetYield: 35.0,
    capacityMax: 12,
    capacityUnit: 'tools',
    revenueModel: 'PER_UNIT',
    status: 'ACTIVE',
    earningBasis: 'Per rental day',
    category: 'TOOLS',
  },
  {
    id: 'tools-2',
    title: 'Commercial Pressure Washer',
    assetType: 'TOOLS',
    locationRegion: 'Seattle, WA',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    targetYield: 42.0,
    capacityMax: 1,
    capacityUnit: 'unit',
    revenueModel: 'PER_UNIT',
    status: 'ACTIVE',
    earningBasis: 'Per rental day',
    category: 'TOOLS',
  },
  // HomeHub Lending (Household Items)
  {
    id: 'home-1',
    title: 'Sony A7 IV Camera Kit',
    assetType: 'CAMERA',
    locationRegion: 'New York, NY',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    targetYield: 45.0,
    capacityMax: 1,
    capacityUnit: 'kit',
    revenueModel: 'PER_UNIT',
    status: 'ACTIVE',
    earningBasis: 'Per rental day',
    category: 'HOMEHUB',
  },
  {
    id: 'home-2',
    title: 'DJI Mavic 3 Pro Drone',
    assetType: 'DRONE',
    locationRegion: 'Miami, FL',
    imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800',
    targetYield: 52.0,
    capacityMax: 1,
    capacityUnit: 'drone',
    revenueModel: 'PER_UNIT',
    status: 'ACTIVE',
    earningBasis: 'Per flight day',
    category: 'HOMEHUB',
  },
  {
    id: 'home-3',
    title: 'Creality 3D Printer Farm',
    assetType: '3D_PRINTER',
    locationRegion: 'Austin, TX',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    targetYield: 38.0,
    capacityMax: 4,
    capacityUnit: 'printers',
    revenueModel: 'PER_UNIT',
    status: 'ACTIVE',
    earningBasis: 'Per print job',
    category: 'HOMEHUB',
  },
  {
    id: 'home-4',
    title: 'High-End Gaming PC',
    assetType: 'GAMING_PC',
    locationRegion: 'Portland, OR',
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800',
    targetYield: 25.0,
    capacityMax: 1,
    capacityUnit: 'PC',
    revenueModel: 'PER_UNIT',
    status: 'ACTIVE',
    earningBasis: 'Per gaming session',
    category: 'HOMEHUB',
  },
  {
    id: 'home-5',
    title: 'Premium Camping Gear Set',
    assetType: 'CAMPING',
    locationRegion: 'Denver, CO',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    targetYield: 30.0,
    capacityMax: 1,
    capacityUnit: 'set',
    revenueModel: 'PER_UNIT',
    status: 'ACTIVE',
    earningBasis: 'Per trip',
    category: 'HOMEHUB',
  },
  // Industrial/Business Resources
  {
    id: 'business-1',
    title: 'Cold Storage Unit - 500 sqft',
    assetType: 'COLD_STORAGE',
    locationRegion: 'Dallas, TX',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    targetYield: 16.5,
    capacityMax: 500,
    capacityUnit: 'sqft',
    revenueModel: 'FLAT_FEE',
    status: 'ACTIVE',
    earningBasis: 'Per month',
    category: 'BUSINESS',
  },
  {
    id: 'business-2',
    title: 'Warehouse Bay - Flex Space',
    assetType: 'WAREHOUSE',
    locationRegion: 'Atlanta, GA',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    targetYield: 14.2,
    capacityMax: 2000,
    capacityUnit: 'sqft',
    revenueModel: 'FLAT_FEE',
    status: 'ACTIVE',
    earningBasis: 'Per month',
    category: 'BUSINESS',
  },
  // IoT & Sensors
  {
    id: 'iot-1',
    title: 'Smart City Sensor Array',
    assetType: 'SENSOR',
    locationRegion: 'Chicago, IL',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    targetYield: 11.5,
    capacityMax: 50,
    capacityUnit: 'sensors',
    revenueModel: 'REV_SHARE',
    status: 'ACTIVE',
    earningBasis: 'Per data point',
    category: 'IOT',
  },
  // Delivery/Robotics
  {
    id: 'robot-1',
    title: 'Delivery Robot Fleet',
    assetType: 'DELIVERY_ROBOT',
    locationRegion: 'Seattle, WA',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    targetYield: 24.8,
    capacityMax: 10,
    capacityUnit: 'robots',
    revenueModel: 'REV_SHARE',
    status: 'ACTIVE',
    earningBasis: 'Per delivery',
    category: 'ROBOTICS',
  },
];

// Main category tabs
const mainCategories = [
  { value: 'all', label: 'All Resources', icon: Repeat, color: 'text-foreground' },
  { value: 'COMPUTE', label: 'Idle Compute', icon: Cpu, color: 'text-neon-purple' },
  { value: 'ENERGY', label: 'Excess Energy', icon: Sun, color: 'text-amber-400' },
  { value: 'VEHICLES', label: 'Vehicles', icon: Car, color: 'text-blue-400' },
  { value: 'TOOLS', label: 'Tools & Equipment', icon: Wrench, color: 'text-orange-400' },
  { value: 'HOMEHUB', label: 'HomeHub', icon: Home, color: 'text-neon-pink' },
  { value: 'BUSINESS', label: 'Business Space', icon: Warehouse, color: 'text-emerald-400' },
  { value: 'IOT', label: 'IoT & Sensors', icon: Radio, color: 'text-cyan-400' },
  { value: 'ROBOTICS', label: 'Robotics', icon: Bot, color: 'text-rose-400' },
];

const revenueModels = [
  { value: 'all', label: 'All Earning Models' },
  { value: 'FLAT_FEE', label: 'Flat Fee' },
  { value: 'REV_SHARE', label: 'Revenue Share' },
  { value: 'PER_UNIT', label: 'Per Usage' },
];

// HomeHub subcategories
const homeHubCategories = [
  { icon: Camera, label: 'Cameras & Photo', type: 'CAMERA' },
  { icon: Gamepad2, label: 'Gaming Equipment', type: 'GAMING_PC' },
  { icon: Printer3d, label: '3D Printers', type: '3D_PRINTER' },
  { icon: Monitor, label: 'Electronics', type: 'ELECTRONICS' },
  { icon: Tent, label: 'Camping & Outdoor', type: 'CAMPING' },
  { icon: Music2, label: 'Instruments', type: 'INSTRUMENTS' },
];

// Tools subcategories
const toolsCategories = [
  { icon: Drill, label: 'Power Tools', type: 'POWER_TOOLS' },
  { icon: Droplets, label: 'Pressure Washers', type: 'PRESSURE_WASHER' },
  { icon: Snowflake, label: 'Snow Equipment', type: 'SNOW' },
  { icon: Wrench, label: 'Construction', type: 'CONSTRUCTION' },
];

function getCategoryIcon(assetType: string) {
  const icons: Record<string, any> = {
    GPU: Cpu,
    SOLAR: Sun,
    BATTERY: Battery,
    VEHICLE: Car,
    TOOLS: Wrench,
    CAMERA: Camera,
    DRONE: Camera,
    '3D_PRINTER': Printer3d,
    GAMING_PC: Gamepad2,
    CAMPING: Tent,
    COLD_STORAGE: Thermometer,
    WAREHOUSE: Warehouse,
    SENSOR: Radio,
    DELIVERY_ROBOT: Bot,
  };
  return icons[assetType] || HardDrive;
}

export default function LendPage() {
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [mainCategory, setMainCategory] = useState('all');
  const [revenueModel, setRevenueModel] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['lendable-assets', mainCategory, revenueModel],
    queryFn: async () => {
      try {
        const params: any = { status: 'ACTIVE' };
        if (revenueModel !== 'all') params.revenueModel = revenueModel;

        const response = await lendableAssetsApi.list(params);
        return response.data;
      } catch (e) {
        // Return mock data when API is unavailable
        let filtered = [...mockLendableAssets];
        if (mainCategory !== 'all') filtered = filtered.filter(a => a.category === mainCategory);
        if (revenueModel !== 'all') filtered = filtered.filter(a => a.revenueModel === revenueModel);
        return { data: filtered };
      }
    },
  });

  const assets = data?.data || [];

  const filteredAssets = assets.filter((asset: any) => {
    const matchesSearch = searchQuery
      ? asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.locationRegion.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = mainCategory === 'all' || asset.category === mainCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background - Purple/Pink theme for Lending (distinct from Ownership) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-[500px] h-[500px] top-10 -left-40 opacity-15" />
        <div className="orb orb-pink w-[400px] h-[400px] bottom-40 -right-32 opacity-10" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="container relative">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/20 mb-6">
            <Repeat className="w-4 h-4 text-neon-purple" />
            <span className="text-sm font-medium text-neon-purple">Lend Your Resources</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 leading-tight">
                Turn Idle Resources Into<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-purple via-neon-pink to-rose-400">
                  Passive Income
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                If you own it — you can lend it. If it sits idle — you can earn from it. 
                Supply your unused compute, energy, vehicles, tools, and household items 
                to earning networks and get paid per use.
              </p>
            </div>
            
            {isAuthenticated && (
              <Button asChild size="lg" className="gap-2 bg-neon-purple hover:bg-neon-purple/90">
                <Link href="/lend/create">
                  <Plus className="w-5 h-5" />
                  List Your Resource
                </Link>
              </Button>
            )}
          </div>

          {/* Value Props - Different from Marketplace */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Timer, label: 'Earnings Model', value: 'Per Use/Hour' },
              { icon: Activity, label: 'Flexibility', value: 'No Lock-up' },
              { icon: CircleDollarSign, label: 'Dynamic Rates', value: 'Market-Based' },
              { icon: CheckCircle2, label: 'Protection', value: 'Full Insurance' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="glass-card p-4 text-center border border-neon-purple/10"
              >
                <item.icon className="w-5 h-5 mx-auto mb-2 text-neon-purple" />
                <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                <div className="font-semibold text-sm">{item.value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Differentiator Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 relative overflow-hidden rounded-2xl border-2 border-dashed border-neon-purple/40"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-neon-pink/5 to-transparent" />
          <div className="relative p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 flex items-center justify-center flex-shrink-0 border border-neon-purple/30">
                <Sparkles className="w-7 h-7 text-neon-purple" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold mb-2 text-neon-purple">
                  Buy for Personal Use. Lend When Idle.
                </h2>
                <p className="text-muted-foreground max-w-2xl mb-4">
                  This is a RealFi exclusive: Purchase assets for your own use through the Marketplace, 
                  then list them here when you're not using them. Your tools, your solar panels, 
                  your EV chargers, your GPUs — now earn money for you automatically.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-neon-green" />
                    <span>Use it yourself</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-neon-green" />
                    <span>Lend when idle</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-neon-green" />
                    <span>Earn passive income</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
            What Can You Lend?
          </h3>
          <div className="flex flex-wrap gap-2">
            {mainCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setMainCategory(cat.value)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border',
                  mainCategory === cat.value
                    ? 'bg-neon-purple/20 text-neon-purple border-neon-purple/30 shadow-lg shadow-neon-purple/10'
                    : 'bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground border-white/5'
                )}
              >
                <cat.icon className={cn('w-4 h-4', mainCategory === cat.value && cat.color)} />
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* HomeHub Subcategories (show when HomeHub is selected) */}
        {mainCategory === 'HOMEHUB' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-neon-pink/10 to-transparent border border-neon-pink/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-neon-pink" />
              <h3 className="font-semibold">HomeHub Lending</h3>
              <span className="px-2 py-0.5 text-xs rounded-full bg-neon-pink/20 text-neon-pink">New</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Turn your household items into income streams. From cameras to camping gear.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {homeHubCategories.map((item) => (
                <button
                  key={item.type}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-neon-pink/30 transition-all text-center group"
                >
                  <item.icon className="w-6 h-6 mx-auto mb-2 text-muted-foreground group-hover:text-neon-pink transition-colors" />
                  <div className="text-xs font-medium">{item.label}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tools Subcategories (show when Tools is selected) */}
        {mainCategory === 'TOOLS' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-5 h-5 text-orange-400" />
              <h3 className="font-semibold">Tools & Equipment</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your tools sitting in the garage? Let them earn while you're not using them.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {toolsCategories.map((item) => (
                <button
                  key={item.type}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-orange-400/30 transition-all text-center group"
                >
                  <item.icon className="w-6 h-6 mx-auto mb-2 text-muted-foreground group-hover:text-orange-400 transition-colors" />
                  <div className="text-xs font-medium">{item.label}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>

          <Select value={revenueModel} onValueChange={setRevenueModel}>
            <SelectTrigger className="w-full md:w-[200px] bg-white/5 border-white/10">
              <SelectValue placeholder="Earning Model" />
            </SelectTrigger>
            <SelectContent>
              {revenueModels.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-neon-purple" />
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-20">
            <Repeat className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No resources found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or be the first to list a resource.
            </p>
            {isAuthenticated && (
              <Button asChild className="bg-neon-purple hover:bg-neon-purple/90">
                <Link href="/lend/create">List Your Resource</Link>
              </Button>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAssets.map((asset: any, index: number) => {
              const CategoryIcon = getCategoryIcon(asset.assetType);
              return (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link
                    href={`/lend/${asset.id}`}
                    className="block group glass-card overflow-hidden hover:border-neon-purple/30 transition-all duration-300 border border-white/5"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {asset.imageUrl ? (
                        <Image
                          src={asset.imageUrl}
                          alt={asset.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neon-purple/20 to-neon-pink/20" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-neon-purple/20 text-neon-purple backdrop-blur-sm border border-neon-purple/30">
                          <CategoryIcon className="w-3 h-3" />
                          {getLendableTypeLabel(asset.assetType)}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={cn(
                            'px-2 py-1 text-xs font-medium rounded-full',
                            getStatusColor(asset.status)
                          )}
                        >
                          {asset.status}
                        </span>
                      </div>

                      {/* Yield Overlay */}
                      <div className="absolute bottom-3 right-3">
                        <div className="glass rounded-xl px-3 py-2 text-center border border-neon-purple/20">
                          <div className="text-lg font-bold text-neon-purple">
                            {asset.targetYield
                              ? formatPercent(Number(asset.targetYield))
                              : 'TBD'}
                          </div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Yield</div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-neon-purple transition-colors">
                        {asset.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{asset.locationRegion}</span>
                      </div>

                      {/* Earning Basis */}
                      {asset.earningBasis && (
                        <div className="mb-4 p-3 rounded-lg bg-neon-purple/5 border border-neon-purple/10">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <DollarSign className="w-3 h-3 text-neon-purple" />
                            <span>You Earn</span>
                          </div>
                          <div className="text-sm font-medium text-neon-purple">{asset.earningBasis}</div>
                        </div>
                      )}

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">
                            Target Yield
                          </div>
                          <div className="text-lg font-bold text-neon-green">
                            {asset.targetYield
                              ? formatPercent(Number(asset.targetYield))
                              : 'TBD'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">
                            Capacity
                          </div>
                          <div className="text-lg font-bold">
                            {Number(asset.capacityMax).toLocaleString()}{' '}
                            <span className="text-xs text-muted-foreground font-normal">
                              {asset.capacityUnit}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Revenue Model */}
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Earning Model</span>
                          <span className="font-medium px-2 py-0.5 rounded bg-white/5">
                            {asset.revenueModel.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Comparison Section - Lending vs Ownership */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid md:grid-cols-2 gap-6"
        >
          {/* Lending Card */}
          <div className="glass-card p-6 border-2 border-neon-purple/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center">
                <Repeat className="w-5 h-5 text-neon-purple" />
              </div>
              <h3 className="text-xl font-bold">Lend → Earn</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-purple flex-shrink-0 mt-0.5" />
                <span>Temporarily supply excess resources</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-purple flex-shrink-0 mt-0.5" />
                <span>Earn per use, per hour, per kWh, per cycle</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-purple flex-shrink-0 mt-0.5" />
                <span>No long-term ownership commitments</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-purple flex-shrink-0 mt-0.5" />
                <span>Flexible, dynamic earnings</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-muted-foreground">
              Best for: GPU owners, solar panel owners, vehicle owners, tool owners
            </div>
          </div>

          {/* Ownership Card */}
          <div className="glass-card p-6 border border-neon-cyan/20 opacity-80">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-neon-cyan" />
              </div>
              <h3 className="text-xl font-bold">Own → Earn</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-muted-foreground">Marketplace</span>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-cyan/60 flex-shrink-0 mt-0.5" />
                <span>Own infrastructure fractionally</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-cyan/60 flex-shrink-0 mt-0.5" />
                <span>Receive passive yield from real-world revenue</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-cyan/60 flex-shrink-0 mt-0.5" />
                <span>Long-term yields with clear APY projections</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-cyan/60 flex-shrink-0 mt-0.5" />
                <span>Fractional or full asset purchase</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <Button asChild variant="outline" size="sm" className="gap-2 border-neon-cyan/30 hover:bg-neon-cyan/10">
                <Link href="/explore">
                  View Marketplace
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* CTA for unauthenticated users */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-16 glass-card p-8 text-center border border-neon-purple/20"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 flex items-center justify-center">
              <Repeat className="w-8 h-8 text-neon-purple" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Have resources to lend?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              List your GPUs, vehicles, solar panels, tools, or household items and start
              earning passive income today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="gap-2 bg-neon-purple hover:bg-neon-purple/90">
                <Link href="/auth/register">
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20">
                <Link href="/explore">
                  Explore Marketplace
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
