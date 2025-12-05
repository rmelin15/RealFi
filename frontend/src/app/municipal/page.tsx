'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Loader2,
  MapPin,
  Target,
  Leaf,
  Clock,
  Building2,
  Train,
  Droplets,
  Home,
  Zap,
  Car,
  Wifi,
  Shield,
  Heart,
  Award,
  Star,
  TrendingUp,
  Users,
  Globe,
  TreePine,
  Sun,
  Wind,
  Waves,
  Lightbulb,
  Truck,
  Battery,
  Radio,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Vote,
  Gift,
  Ticket,
  BadgeCheck,
  Trophy,
  Flame,
  CircleDollarSign,
  BarChart3,
  Activity,
  CheckCircle2,
  Timer,
  AlertCircle,
  Map,
  Filter,
} from 'lucide-react';
import { instrumentsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency, cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

// Mock Municipal Projects Data
const mockMunicipalProjects = [
  // Transit Projects
  {
    id: 'mun1',
    name: 'Downtown Light Rail Extension',
    projectType: 'TRANSIT',
    city: 'Portland',
    region: 'Oregon',
    country: 'USA',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
    targetRaise: 45000000,
    totalRaised: 35250000,
    apy: 5.2,
    status: 'FUNDING',
    esgTags: ['Carbon Neutral', 'Accessibility', 'Community Impact'],
    impactMetrics: { co2Saved: 12500, citizensServed: 450000, jobsCreated: 890 },
    constructionStage: 'Phase 2 - Track Installation',
    completionDate: '2026-Q3',
    partnerBadge: 'City of Portland',
    isLocalToUser: false,
    municipalPoints: 150,
  },
  {
    id: 'mun2',
    name: 'Autonomous Bus Network',
    projectType: 'TRANSIT',
    city: 'Phoenix',
    region: 'Arizona',
    country: 'USA',
    imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
    targetRaise: 28000000,
    totalRaised: 19600000,
    apy: 6.8,
    status: 'FUNDING',
    esgTags: ['Smart City', 'Zero Emission', 'Innovation'],
    impactMetrics: { co2Saved: 8200, citizensServed: 320000, jobsCreated: 245 },
    constructionStage: 'Phase 1 - Infrastructure Setup',
    completionDate: '2025-Q4',
    partnerBadge: 'City of Phoenix',
    isLocalToUser: false,
    municipalPoints: 200,
  },
  // Affordable Housing
  {
    id: 'mun3',
    name: 'Riverside Affordable Housing',
    projectType: 'HOUSING',
    city: 'Austin',
    region: 'Texas',
    country: 'USA',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    targetRaise: 32000000,
    totalRaised: 29120000,
    apy: 4.8,
    status: 'FUNDING',
    esgTags: ['Affordable Housing', 'Green Building', 'Solar Powered'],
    impactMetrics: { co2Saved: 3200, citizensServed: 1200, jobsCreated: 340 },
    constructionStage: 'Phase 3 - Interior Finishing',
    completionDate: '2025-Q2',
    partnerBadge: 'City of Austin',
    isLocalToUser: true,
    municipalPoints: 175,
  },
  // Water Infrastructure
  {
    id: 'mun4',
    name: 'Smart Water Treatment Facility',
    projectType: 'WATER',
    city: 'Denver',
    region: 'Colorado',
    country: 'USA',
    imageUrl: 'https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=800',
    targetRaise: 55000000,
    totalRaised: 41250000,
    apy: 5.5,
    status: 'FUNDING',
    esgTags: ['Water Conservation', 'Sustainability', 'Public Health'],
    impactMetrics: { waterSaved: 2500000, citizensServed: 680000, jobsCreated: 420 },
    constructionStage: 'Phase 2 - Filtration Systems',
    completionDate: '2026-Q1',
    partnerBadge: 'Denver Water',
    isLocalToUser: false,
    municipalPoints: 250,
  },
  // Energy Projects
  {
    id: 'mun5',
    name: 'Community Solar Array',
    projectType: 'ENERGY',
    city: 'Seattle',
    region: 'Washington',
    country: 'USA',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    targetRaise: 18000000,
    totalRaised: 16200000,
    apy: 7.2,
    status: 'FUNDING',
    esgTags: ['Clean Energy', 'Net Zero', 'Community Owned'],
    impactMetrics: { co2Saved: 18500, citizensServed: 45000, jobsCreated: 180 },
    constructionStage: 'Phase 4 - Grid Connection',
    completionDate: '2025-Q1',
    partnerBadge: 'Seattle City Light',
    isLocalToUser: false,
    municipalPoints: 300,
  },
  {
    id: 'mun6',
    name: 'Community Battery Storage Hub',
    projectType: 'ENERGY',
    city: 'San Diego',
    region: 'California',
    country: 'USA',
    imageUrl: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800',
    targetRaise: 22000000,
    totalRaised: 8800000,
    apy: 8.5,
    status: 'FUNDING',
    esgTags: ['Energy Storage', 'Grid Resilience', 'Peak Shaving'],
    impactMetrics: { co2Saved: 9800, citizensServed: 125000, jobsCreated: 95 },
    constructionStage: 'Phase 1 - Site Preparation',
    completionDate: '2026-Q2',
    partnerBadge: 'SDG&E Partnership',
    isLocalToUser: false,
    municipalPoints: 350,
  },
  // EV Infrastructure
  {
    id: 'mun7',
    name: 'Public EV Charging Network',
    projectType: 'EV_CHARGING',
    city: 'Los Angeles',
    region: 'California',
    country: 'USA',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
    targetRaise: 15000000,
    totalRaised: 12750000,
    apy: 6.2,
    status: 'FUNDING',
    esgTags: ['Zero Emission', 'Green Transport', 'Smart City'],
    impactMetrics: { co2Saved: 14200, citizensServed: 890000, jobsCreated: 210 },
    constructionStage: 'Phase 3 - Station Deployment',
    completionDate: '2025-Q2',
    partnerBadge: 'City of LA',
    isLocalToUser: false,
    municipalPoints: 225,
  },
  // Broadband
  {
    id: 'mun8',
    name: 'Rural Broadband Initiative',
    projectType: 'BROADBAND',
    city: 'Burlington',
    region: 'Vermont',
    country: 'USA',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800',
    targetRaise: 12000000,
    totalRaised: 7200000,
    apy: 5.8,
    status: 'FUNDING',
    esgTags: ['Digital Equity', 'Rural Development', 'Education Access'],
    impactMetrics: { householdsConnected: 15000, citizensServed: 42000, jobsCreated: 85 },
    constructionStage: 'Phase 2 - Fiber Installation',
    completionDate: '2025-Q4',
    partnerBadge: 'State of Vermont',
    isLocalToUser: false,
    municipalPoints: 180,
  },
  // Smart City
  {
    id: 'mun9',
    name: 'Smart Intersection Network',
    projectType: 'SMART_CITY',
    city: 'Columbus',
    region: 'Ohio',
    country: 'USA',
    imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
    targetRaise: 8500000,
    totalRaised: 5950000,
    apy: 7.5,
    status: 'FUNDING',
    esgTags: ['Traffic Safety', 'AI-Powered', 'Emissions Reduction'],
    impactMetrics: { accidentsPrevented: 450, citizensServed: 520000, jobsCreated: 65 },
    constructionStage: 'Phase 2 - Sensor Deployment',
    completionDate: '2025-Q3',
    partnerBadge: 'Smart Columbus',
    isLocalToUser: false,
    municipalPoints: 275,
  },
  // Emergency Services
  {
    id: 'mun10',
    name: 'Emergency Microgrid System',
    projectType: 'EMERGENCY',
    city: 'Miami',
    region: 'Florida',
    country: 'USA',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    targetRaise: 25000000,
    totalRaised: 17500000,
    apy: 6.5,
    status: 'FUNDING',
    esgTags: ['Disaster Resilience', 'Critical Infrastructure', 'Community Safety'],
    impactMetrics: { facilitiesProtected: 85, citizensServed: 380000, jobsCreated: 145 },
    constructionStage: 'Phase 2 - Generator Installation',
    completionDate: '2025-Q4',
    partnerBadge: 'Miami-Dade County',
    isLocalToUser: false,
    municipalPoints: 320,
  },
  // Parks & Green Space
  {
    id: 'mun11',
    name: 'Urban Green Corridor',
    projectType: 'PARKS',
    city: 'Minneapolis',
    region: 'Minnesota',
    country: 'USA',
    imageUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800',
    targetRaise: 9000000,
    totalRaised: 7650000,
    apy: 4.5,
    status: 'FUNDING',
    esgTags: ['Urban Greening', 'Biodiversity', 'Mental Health'],
    impactMetrics: { treesPlanted: 5200, citizensServed: 180000, jobsCreated: 120 },
    constructionStage: 'Phase 3 - Landscaping',
    completionDate: '2025-Q2',
    partnerBadge: 'Minneapolis Parks',
    isLocalToUser: false,
    municipalPoints: 200,
  },
  // Flood Prevention
  {
    id: 'mun12',
    name: 'Flood Prevention System',
    projectType: 'FLOOD_PREVENTION',
    city: 'Houston',
    region: 'Texas',
    country: 'USA',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800',
    targetRaise: 75000000,
    totalRaised: 48750000,
    apy: 5.0,
    status: 'FUNDING',
    esgTags: ['Climate Adaptation', 'Infrastructure', 'Community Safety'],
    impactMetrics: { propertiesProtected: 45000, citizensServed: 850000, jobsCreated: 680 },
    constructionStage: 'Phase 2 - Channel Construction',
    completionDate: '2027-Q1',
    partnerBadge: 'Harris County Flood Control',
    isLocalToUser: false,
    municipalPoints: 400,
  },
];

// Project type configurations
const projectTypeConfig: Record<string, { icon: any; label: string; color: string }> = {
  TRANSIT: { icon: Train, label: 'Transit', color: 'blue' },
  HOUSING: { icon: Home, label: 'Housing', color: 'amber' },
  WATER: { icon: Droplets, label: 'Water', color: 'cyan' },
  ENERGY: { icon: Zap, label: 'Energy', color: 'yellow' },
  EV_CHARGING: { icon: Car, label: 'EV Charging', color: 'green' },
  BROADBAND: { icon: Wifi, label: 'Broadband', color: 'purple' },
  SMART_CITY: { icon: Lightbulb, label: 'Smart City', color: 'pink' },
  EMERGENCY: { icon: Shield, label: 'Emergency', color: 'red' },
  PARKS: { icon: TreePine, label: 'Parks', color: 'emerald' },
  FLOOD_PREVENTION: { icon: Waves, label: 'Flood Prevention', color: 'sky' },
  ROAD: { icon: Building2, label: 'Roads', color: 'gray' },
  OTHER: { icon: Building2, label: 'Other', color: 'gray' },
};

// Municipal Rewards Tiers
const municipalRewardsTiers = [
  {
    name: 'Civic Starter',
    minPoints: 0,
    maxPoints: 500,
    benefits: ['Priority project updates', 'Community badge'],
    icon: Star,
    color: 'gray',
  },
  {
    name: 'Community Builder',
    minPoints: 500,
    maxPoints: 2000,
    benefits: ['5% transit discount', 'Early project access', 'Quarterly reports'],
    icon: Users,
    color: 'emerald',
  },
  {
    name: 'City Champion',
    minPoints: 2000,
    maxPoints: 5000,
    benefits: ['15% rec facility discount', 'Voting rights on projects', 'VIP city events'],
    icon: Award,
    color: 'blue',
  },
  {
    name: 'Municipal Partner',
    minPoints: 5000,
    maxPoints: Infinity,
    benefits: ['Property tax incentive eligibility', 'Advisory board access', 'Priority service lines'],
    icon: Trophy,
    color: 'amber',
  },
];

// View tabs
const viewTabs = [
  { id: 'all', label: 'All Projects', icon: Globe },
  { id: 'local', label: 'My Municipality', icon: MapPin },
  { id: 'portfolio', label: 'City Portfolio', icon: BarChart3 },
  { id: 'rewards', label: 'Municipal Rewards', icon: Gift },
];

// Filter options
const projectTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'TRANSIT', label: 'Transit' },
  { value: 'HOUSING', label: 'Housing' },
  { value: 'WATER', label: 'Water' },
  { value: 'ENERGY', label: 'Energy' },
  { value: 'EV_CHARGING', label: 'EV Charging' },
  { value: 'BROADBAND', label: 'Broadband' },
  { value: 'SMART_CITY', label: 'Smart City' },
  { value: 'EMERGENCY', label: 'Emergency Services' },
  { value: 'PARKS', label: 'Parks & Green Space' },
  { value: 'FLOOD_PREVENTION', label: 'Flood Prevention' },
];

function ImpactCard({ label, value, icon: Icon, suffix }: { label: string; value: number | string; icon: any; suffix?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-neon-green/20 flex items-center justify-center">
        <Icon className="w-5 h-5 text-neon-green" />
      </div>
      <div>
        <div className="text-lg font-bold">{typeof value === 'number' ? value.toLocaleString() : value}{suffix}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function MunicipalRewardsCard({ userPoints = 1250 }: { userPoints?: number }) {
  const currentTier = municipalRewardsTiers.find(
    (tier) => userPoints >= tier.minPoints && userPoints < tier.maxPoints
  ) || municipalRewardsTiers[0];
  
  const nextTier = municipalRewardsTiers[municipalRewardsTiers.indexOf(currentTier) + 1];
  const progress = nextTier
    ? ((userPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-${currentTier.color}-500/20 flex items-center justify-center`}>
            <currentTier.icon className={`w-6 h-6 text-${currentTier.color}-400`} />
          </div>
          <div>
            <div className="font-semibold">{currentTier.name}</div>
            <div className="text-sm text-muted-foreground">{userPoints.toLocaleString()} Municipal Points</div>
          </div>
        </div>
        <div className="text-right">
          {nextTier && (
            <>
              <div className="text-xs text-muted-foreground">Next tier</div>
              <div className="text-sm font-medium">{nextTier.name}</div>
            </>
          )}
        </div>
      </div>

      {nextTier && (
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1">
            <span>{userPoints - currentTier.minPoints} / {nextTier.minPoints - currentTier.minPoints}</span>
            <span>{(nextTier.minPoints - userPoints).toLocaleString()} pts to go</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full bg-gradient-to-r from-${currentTier.color}-500 to-${nextTier.color}-500`}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="text-sm font-medium">Your Benefits</div>
        {currentTier.benefits.map((benefit, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-neon-green" />
            {benefit}
          </div>
        ))}
      </div>
    </div>
  );
}

function RewardsRedemptionSection() {
  const redemptionOptions = [
    { icon: Ticket, title: 'Transit Passes', description: '25% off monthly passes', points: 500 },
    { icon: TreePine, title: 'Rec Facility Access', description: 'Free day passes', points: 300 },
    { icon: Gift, title: 'Local Business Vouchers', description: '$25 gift cards', points: 750 },
    { icon: Vote, title: 'Project Voting Power', description: 'Double vote weight', points: 1000 },
    { icon: CircleDollarSign, title: 'Investment Credits', description: '$50 platform credit', points: 1500 },
    { icon: Heart, title: 'City Fund Donation', description: 'Match your contribution', points: 250 },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {redemptionOptions.map((option, i) => (
        <motion.div
          key={option.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass-card p-4 hover:border-neon-cyan/30 transition-colors cursor-pointer group"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-neon-cyan/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <option.icon className="w-5 h-5 text-neon-cyan" />
            </div>
            <div className="flex-1">
              <div className="font-medium mb-1">{option.title}</div>
              <div className="text-sm text-muted-foreground mb-2">{option.description}</div>
              <div className="text-xs font-medium text-neon-purple">{option.points} pts</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function MunicipalPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [activeView, setActiveView] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectType, setProjectType] = useState('all');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['municipal-projects', projectType],
    queryFn: async () => {
      try {
        const params: any = {};
        if (projectType !== 'all') params.projectType = projectType;
        const response = await instrumentsApi.getMunicipalProjects(params);
        return response.data;
      } catch (e) {
        // Return mock data when API is unavailable
        let filtered = [...mockMunicipalProjects];
        if (projectType !== 'all') {
          filtered = filtered.filter((p) => p.projectType === projectType);
        }
        return { data: filtered };
      }
    },
  });

  const projects = data?.data || [];

  const filteredProjects = useMemo(() => {
    let result = projects;

    // Filter by view
    if (activeView === 'local') {
      result = result.filter((p: any) => p.isLocalToUser);
    }

    // Filter by search
    if (searchQuery) {
      result = result.filter(
        (p: any) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.region.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [projects, activeView, searchQuery]);

  // Calculate platform stats
  const platformStats = useMemo(() => {
    const totalTargetRaise = mockMunicipalProjects.reduce((acc, p) => acc + p.targetRaise, 0);
    const totalRaised = mockMunicipalProjects.reduce((acc, p) => acc + p.totalRaised, 0);
    const totalCitizensBenefited = mockMunicipalProjects.reduce(
      (acc, p) => acc + (p.impactMetrics.citizensServed || 0),
      0
    );
    const totalCO2Saved = mockMunicipalProjects.reduce(
      (acc, p) => acc + (p.impactMetrics.co2Saved || 0),
      0
    );
    return {
      totalRaised,
      totalTargetRaise,
      totalCitizensBenefited,
      totalCO2Saved,
      avgApy: mockMunicipalProjects.reduce((acc, p) => acc + p.apy, 0) / mockMunicipalProjects.length,
    };
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-cyan w-[600px] h-[600px] top-0 -left-48 opacity-15" />
        <div className="orb orb-purple w-[400px] h-[400px] bottom-20 -right-32 opacity-20" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="container relative">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">
              Citizen-Driven Infrastructure Finance
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
            Invest In Your <span className="gradient-text">City</span>
            <br />
            <span className="text-2xl md:text-4xl text-muted-foreground font-normal">
              Build the Communities of Tomorrow
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Fund municipal infrastructure, earn competitive returns, and unlock exclusive civic rewards.
            From transit systems to smart grids — directly impact the places you live and love.
          </p>

          {/* Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Total Invested', value: formatCurrency(platformStats.totalRaised), icon: CircleDollarSign },
              { label: 'Citizens Benefited', value: `${(platformStats.totalCitizensBenefited / 1000000).toFixed(1)}M`, icon: Users },
              { label: 'CO₂ Saved (tons)', value: platformStats.totalCO2Saved.toLocaleString(), icon: Leaf },
              { label: 'Average APY', value: `${platformStats.avgApy.toFixed(1)}%`, icon: TrendingUp },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="glass-card p-4"
              >
                <stat.icon className="w-5 h-5 text-emerald-400 mb-2 mx-auto" />
                <div className="text-2xl font-bold text-emerald-400">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* View Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {viewTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                activeView === tab.id
                  ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : 'bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground border border-white/5'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Rewards View */}
        {activeView === 'rewards' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Municipal Points Overview */}
            <div className="grid lg:grid-cols-2 gap-6">
              <MunicipalRewardsCard userPoints={1250} />
              
              <div className="glass-card p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-neon-cyan" />
                  Earn Municipal Points
                </h3>
                <div className="space-y-3">
                  {[
                    { action: 'Invest in your local municipality', points: '2x base points', icon: MapPin },
                    { action: 'First investment in a new city', points: '+100 bonus', icon: Globe },
                    { action: 'Complete a civic bond term', points: '+250 bonus', icon: Timer },
                    { action: 'Refer a neighbor', points: '+150 each', icon: Users },
                    { action: 'Project reaches funding goal', points: '+50 bonus', icon: Target },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{item.action}</span>
                      </div>
                      <span className="text-sm font-medium text-neon-green">{item.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Redemption Options */}
            <div>
              <h3 className="font-semibold text-xl mb-4">Redeem Your Points</h3>
              <RewardsRedemptionSection />
            </div>

            {/* Tier Benefits */}
            <div>
              <h3 className="font-semibold text-xl mb-4">Reward Tiers</h3>
              <div className="grid md:grid-cols-4 gap-4">
                {municipalRewardsTiers.map((tier, i) => (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      'glass-card p-5 relative overflow-hidden',
                      i === 3 && 'border-amber-500/30'
                    )}
                  >
                    {i === 3 && (
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-bl">
                        Premium
                      </div>
                    )}
                    <div className={`w-10 h-10 rounded-lg bg-${tier.color}-500/20 flex items-center justify-center mb-3`}>
                      <tier.icon className={`w-5 h-5 text-${tier.color}-400`} />
                    </div>
                    <div className="font-semibold mb-1">{tier.name}</div>
                    <div className="text-xs text-muted-foreground mb-3">
                      {tier.minPoints.toLocaleString()}+ points
                    </div>
                    <div className="space-y-1">
                      {tier.benefits.map((benefit, j) => (
                        <div key={j} className="text-xs text-muted-foreground flex items-start gap-1">
                          <CheckCircle2 className="w-3 h-3 text-neon-green mt-0.5 flex-shrink-0" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Projects View */}
        {activeView !== 'rewards' && (
          <>
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4 mb-8"
            >
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search cities, projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10"
                />
              </div>

              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Project Type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Map className="w-4 h-4" />
                Map View
              </Button>
            </motion.div>

            {/* Local Municipality Banner */}
            {activeView === 'local' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 mb-8 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-transparent"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">Austin, Texas</h3>
                    <p className="text-muted-foreground">
                      Invest locally and earn <span className="text-neon-green font-medium">2x Municipal Points</span> on all investments in your city.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-400">3</div>
                    <div className="text-sm text-muted-foreground">Active Projects</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Results */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search query.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="grid lg:grid-cols-2 gap-6"
              >
                {filteredProjects.map((project: any, index: number) => {
                  const typeConfig = projectTypeConfig[project.projectType] || projectTypeConfig.OTHER;
                  const Icon = typeConfig.icon;
                  const fundedPercent = (project.totalRaised / project.targetRaise) * 100;

                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                      className={cn(
                        'glass-card overflow-hidden cursor-pointer transition-all duration-300',
                        selectedProject === project.id
                          ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                          : 'hover:border-white/20',
                        project.isLocalToUser && 'ring-2 ring-emerald-500/20'
                      )}
                    >
                      {/* Image Section */}
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {project.imageUrl ? (
                          <Image
                            src={project.imageUrl}
                            alt={project.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {project.isLocalToUser && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400 backdrop-blur-sm border border-emerald-500/30">
                              Your City
                            </span>
                          )}
                          <span className={cn(
                            'px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm border',
                            `bg-${typeConfig.color}-500/20 text-${typeConfig.color}-400 border-${typeConfig.color}-500/30`
                          )}>
                            {typeConfig.label}
                          </span>
                        </div>

                        {/* Partner Badge */}
                        {project.partnerBadge && (
                          <div className="absolute top-3 right-3">
                            <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-black/50 backdrop-blur-sm">
                              <BadgeCheck className="w-3 h-3 text-neon-cyan" />
                              {project.partnerBadge}
                            </span>
                          </div>
                        )}

                        {/* Location */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{project.city}, {project.region}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-semibold text-lg mb-3">{project.name}</h3>

                        {/* ESG Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.esgTags.slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/10 text-emerald-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Target</div>
                            <div className="font-semibold">{formatCurrency(project.targetRaise)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">APY</div>
                            <div className="font-semibold text-neon-green">{project.apy}%</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Points</div>
                            <div className="font-semibold text-neon-purple">+{project.municipalPoints}</div>
                          </div>
                        </div>

                        {/* Funding Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">
                              {formatCurrency(project.totalRaised)} raised
                            </span>
                            <span className="font-medium">{fundedPercent.toFixed(0)}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${fundedPercent}%` }}
                              transition={{ duration: 0.5, delay: index * 0.03 }}
                              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            />
                          </div>
                        </div>

                        {/* Construction Stage */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{project.constructionStage}</span>
                          </div>
                          <span className="text-muted-foreground">Est. {project.completionDate}</span>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {selectedProject === project.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/10"
                          >
                            <div className="p-5">
                              {/* Impact Metrics */}
                              <h4 className="font-semibold mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-neon-green" />
                                Impact Metrics
                              </h4>
                              <div className="grid grid-cols-3 gap-4 mb-6">
                                {project.impactMetrics.co2Saved && (
                                  <ImpactCard
                                    label="CO₂ Saved (tons/yr)"
                                    value={project.impactMetrics.co2Saved}
                                    icon={Leaf}
                                  />
                                )}
                                {project.impactMetrics.waterSaved && (
                                  <ImpactCard
                                    label="Gallons Saved/yr"
                                    value={project.impactMetrics.waterSaved}
                                    icon={Droplets}
                                  />
                                )}
                                {project.impactMetrics.citizensServed && (
                                  <ImpactCard
                                    label="Citizens Served"
                                    value={project.impactMetrics.citizensServed}
                                    icon={Users}
                                  />
                                )}
                                {project.impactMetrics.jobsCreated && (
                                  <ImpactCard
                                    label="Jobs Created"
                                    value={project.impactMetrics.jobsCreated}
                                    icon={Building2}
                                  />
                                )}
                              </div>

                              {/* CTA */}
                              <div className="flex gap-3">
                                <Button className="flex-1 gap-2" size="lg" asChild>
                                  <Link href={`/municipal/${project.id}`}>
                                    Invest Now
                                    <ArrowRight className="w-4 h-4" />
                                  </Link>
                                </Button>
                                <Button variant="outline" size="lg" asChild>
                                  <Link href={`/municipal/${project.id}`}>
                                    View Details
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </>
        )}

        {/* City Portfolio Section */}
        {activeView === 'portfolio' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <div className="glass-card p-8 text-center">
              <Globe className="w-16 h-16 mx-auto mb-4 text-neon-cyan" />
              <h3 className="text-2xl font-bold mb-2">Build Your City Portfolio</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Diversify across multiple municipalities. High-growth cities offer better yields,
                stable cities offer predictable payouts. Mix and match to optimize your returns.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { type: 'High Growth', yield: '7-12% APY', risk: 'Higher', example: 'Austin, Phoenix' },
                  { type: 'Stable', yield: '4-6% APY', risk: 'Lower', example: 'Portland, Seattle' },
                  { type: 'Emerging', yield: '5-8% APY', risk: 'Medium', example: 'Columbus, Burlington' },
                ].map((tier, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5">
                    <div className="font-semibold mb-2">{tier.type} Cities</div>
                    <div className="text-2xl font-bold text-neon-green mb-1">{tier.yield}</div>
                    <div className="text-sm text-muted-foreground mb-2">{tier.risk} Risk</div>
                    <div className="text-xs text-muted-foreground">e.g., {tier.example}</div>
                  </div>
                ))}
              </div>
              <Button asChild size="lg">
                <Link href="/explore">
                  Start Building Portfolio
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}

        {/* CTA for unauthenticated */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 glass-card p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10" />
            <div className="relative">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
              <h3 className="text-2xl font-bold mb-2">Join the Civic Investment Revolution</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start investing in your community today. Earn returns while making a real impact
                on the places you call home.
              </p>
              <Button asChild size="lg">
                <Link href="/auth/register">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
