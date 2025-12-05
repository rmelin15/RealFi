'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Filter,
  Loader2,
  TrendingUp,
  Clock,
  Shield,
  DollarSign,
  ArrowRight,
  Sparkles,
  Building2,
  Factory,
  Music,
  Code,
  Cpu,
  Zap,
  Droplets,
  TreePine,
  Film,
  BookOpen,
  Satellite,
  Car,
  Leaf,
  Wind,
  Radio,
  Globe,
  BarChart3,
  CircleDollarSign,
  Calendar,
  Coins,
  Target,
  AlertTriangle,
  ChevronDown,
  LineChart,
  PieChart,
  Activity,
  Layers,
  Workflow,
  Database,
  Server,
  Bot,
  Wifi,
  CloudRain,
  Thermometer,
  Truck,
  Battery,
  Network,
} from 'lucide-react';
import { royaltiesApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

// Comprehensive mock data for all royalty categories
const mockRoyalties = [
  // Government Contracts
  {
    id: 'gov1',
    title: 'NYC Waste Management Contract',
    category: 'GOVERNMENT',
    subcategory: 'Waste Collection',
    icon: Factory,
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    contractTerm: '5 Years',
    monthlyRevenue: 285000,
    revenueHistory: [240000, 255000, 268000, 275000, 285000, 292000],
    expectedPayout: 'Monthly',
    riskBand: 'LOW',
    tokenSupply: 10000,
    tokenPrice: 250,
    apy: 8.2,
    funded: 78,
    counterparty: 'City of New York',
    jurisdiction: 'New York, USA',
  },
  {
    id: 'gov2',
    title: 'Boston Snow Removal Agreement',
    category: 'GOVERNMENT',
    subcategory: 'Snow Removal',
    icon: CloudRain,
    imageUrl: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800',
    contractTerm: '3 Years',
    monthlyRevenue: 180000,
    revenueHistory: [150000, 165000, 172000, 175000, 180000, 185000],
    expectedPayout: 'Seasonal',
    riskBand: 'MEDIUM',
    tokenSupply: 5000,
    tokenPrice: 300,
    apy: 12.5,
    funded: 62,
    counterparty: 'City of Boston',
    jurisdiction: 'Massachusetts, USA',
  },
  {
    id: 'gov3',
    title: 'Chicago Parking Enforcement Contract',
    category: 'GOVERNMENT',
    subcategory: 'Parking Enforcement',
    icon: Car,
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800',
    contractTerm: '7 Years',
    monthlyRevenue: 420000,
    revenueHistory: [380000, 395000, 405000, 412000, 420000, 428000],
    expectedPayout: 'Monthly',
    riskBand: 'LOW',
    tokenSupply: 15000,
    tokenPrice: 200,
    apy: 7.8,
    funded: 91,
    counterparty: 'City of Chicago',
    jurisdiction: 'Illinois, USA',
  },
  {
    id: 'gov4',
    title: 'LA School District IT Services',
    category: 'GOVERNMENT',
    subcategory: 'IT Servicing',
    icon: Server,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    contractTerm: '4 Years',
    monthlyRevenue: 156000,
    revenueHistory: [140000, 145000, 150000, 152000, 156000, 160000],
    expectedPayout: 'Monthly',
    riskBand: 'LOW',
    tokenSupply: 8000,
    tokenPrice: 175,
    apy: 9.1,
    funded: 55,
    counterparty: 'LA Unified School District',
    jurisdiction: 'California, USA',
  },
  // Corporate & Industrial
  {
    id: 'corp1',
    title: 'Permian Basin Oil Field Services',
    category: 'INDUSTRIAL',
    subcategory: 'Oil & Gas',
    icon: Factory,
    imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800',
    contractTerm: '10 Years',
    monthlyRevenue: 890000,
    revenueHistory: [780000, 820000, 855000, 870000, 890000, 905000],
    expectedPayout: 'Quarterly',
    riskBand: 'MEDIUM',
    tokenSupply: 25000,
    tokenPrice: 400,
    apy: 14.2,
    funded: 83,
    counterparty: 'ExxonMobil Corp',
    jurisdiction: 'Texas, USA',
  },
  {
    id: 'corp2',
    title: 'Colorado Water Rights Portfolio',
    category: 'INDUSTRIAL',
    subcategory: 'Water Rights',
    icon: Droplets,
    imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800',
    contractTerm: '15 Years',
    monthlyRevenue: 345000,
    revenueHistory: [300000, 315000, 330000, 340000, 345000, 352000],
    expectedPayout: 'Monthly',
    riskBand: 'LOW',
    tokenSupply: 12000,
    tokenPrice: 350,
    apy: 6.8,
    funded: 94,
    counterparty: 'Multiple Agricultural Corps',
    jurisdiction: 'Colorado, USA',
  },
  {
    id: 'corp3',
    title: 'Pacific Northwest Timber Harvesting',
    category: 'INDUSTRIAL',
    subcategory: 'Timber Rights',
    icon: TreePine,
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
    contractTerm: '20 Years',
    monthlyRevenue: 520000,
    revenueHistory: [480000, 495000, 505000, 515000, 520000, 528000],
    expectedPayout: 'Quarterly',
    riskBand: 'MEDIUM',
    tokenSupply: 20000,
    tokenPrice: 275,
    apy: 11.3,
    funded: 71,
    counterparty: 'Weyerhaeuser Company',
    jurisdiction: 'Oregon, USA',
  },
  {
    id: 'corp4',
    title: 'Iowa Agricultural Offtake Agreement',
    category: 'INDUSTRIAL',
    subcategory: 'Agricultural Offtake',
    icon: Leaf,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    contractTerm: '8 Years',
    monthlyRevenue: 215000,
    revenueHistory: [190000, 200000, 208000, 212000, 215000, 220000],
    expectedPayout: 'Seasonal',
    riskBand: 'MEDIUM',
    tokenSupply: 9000,
    tokenPrice: 225,
    apy: 10.5,
    funded: 67,
    counterparty: 'Cargill Inc',
    jurisdiction: 'Iowa, USA',
  },
  {
    id: 'corp5',
    title: 'Verified Carbon Credit Royalties',
    category: 'INDUSTRIAL',
    subcategory: 'Carbon Credits',
    icon: Wind,
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800',
    contractTerm: '12 Years',
    monthlyRevenue: 178000,
    revenueHistory: [145000, 155000, 165000, 172000, 178000, 185000],
    expectedPayout: 'Quarterly',
    riskBand: 'MEDIUM',
    tokenSupply: 7500,
    tokenPrice: 280,
    apy: 13.8,
    funded: 45,
    counterparty: 'Verra Registry',
    jurisdiction: 'Global',
  },
  // Media & Creative
  {
    id: 'media1',
    title: 'Billboard Top 100 Catalog Bundle',
    category: 'MEDIA',
    subcategory: 'Music Streaming',
    icon: Music,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    contractTerm: 'Perpetual',
    monthlyRevenue: 625000,
    revenueHistory: [580000, 595000, 608000, 618000, 625000, 632000],
    expectedPayout: 'Monthly',
    riskBand: 'LOW',
    tokenSupply: 30000,
    tokenPrice: 200,
    apy: 8.9,
    funded: 88,
    counterparty: 'Sony Music Publishing',
    jurisdiction: 'United States',
  },
  {
    id: 'media2',
    title: 'Independent Film Distribution Rights',
    category: 'MEDIA',
    subcategory: 'Film Distribution',
    icon: Film,
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
    contractTerm: '7 Years',
    monthlyRevenue: 89000,
    revenueHistory: [72000, 78000, 82000, 85000, 89000, 93000],
    expectedPayout: 'Quarterly',
    riskBand: 'HIGH',
    tokenSupply: 4000,
    tokenPrice: 150,
    apy: 18.5,
    funded: 52,
    counterparty: 'A24 Films',
    jurisdiction: 'California, USA',
  },
  {
    id: 'media3',
    title: 'Technical Publishing Royalty Pool',
    category: 'MEDIA',
    subcategory: 'Book/Publishing',
    icon: BookOpen,
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800',
    contractTerm: 'Perpetual',
    monthlyRevenue: 156000,
    revenueHistory: [142000, 148000, 152000, 154000, 156000, 159000],
    expectedPayout: 'Quarterly',
    riskBand: 'LOW',
    tokenSupply: 6000,
    tokenPrice: 300,
    apy: 7.2,
    funded: 79,
    counterparty: "O'Reilly Media",
    jurisdiction: 'United States',
  },
  {
    id: 'media4',
    title: 'Creator Platform Revenue Share',
    category: 'MEDIA',
    subcategory: 'Creator Subscriptions',
    icon: Radio,
    imageUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800',
    contractTerm: '5 Years',
    monthlyRevenue: 445000,
    revenueHistory: [380000, 405000, 425000, 438000, 445000, 455000],
    expectedPayout: 'Monthly',
    riskBand: 'MEDIUM',
    tokenSupply: 18000,
    tokenPrice: 225,
    apy: 15.3,
    funded: 61,
    counterparty: 'Top 50 Creators Pool',
    jurisdiction: 'Global',
  },
  // Software & Digital IP
  {
    id: 'soft1',
    title: 'Enterprise SaaS Revenue Stream',
    category: 'SOFTWARE',
    subcategory: 'SaaS Subscriptions',
    icon: Code,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    contractTerm: '10 Years',
    monthlyRevenue: 1250000,
    revenueHistory: [1100000, 1150000, 1200000, 1225000, 1250000, 1280000],
    expectedPayout: 'Monthly',
    riskBand: 'LOW',
    tokenSupply: 50000,
    tokenPrice: 250,
    apy: 9.6,
    funded: 72,
    counterparty: 'B2B SaaS Portfolio',
    jurisdiction: 'Delaware, USA',
  },
  {
    id: 'soft2',
    title: 'API Usage Royalty Platform',
    category: 'SOFTWARE',
    subcategory: 'API Usage',
    icon: Workflow,
    imageUrl: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800',
    contractTerm: '5 Years',
    monthlyRevenue: 380000,
    revenueHistory: [320000, 345000, 360000, 372000, 380000, 392000],
    expectedPayout: 'Monthly',
    riskBand: 'MEDIUM',
    tokenSupply: 15000,
    tokenPrice: 200,
    apy: 12.8,
    funded: 58,
    counterparty: 'Stripe/Twilio/Plaid',
    jurisdiction: 'United States',
  },
  {
    id: 'soft3',
    title: 'OEM Software License Royalties',
    category: 'SOFTWARE',
    subcategory: 'OEM Licensing',
    icon: Layers,
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800',
    contractTerm: '8 Years',
    monthlyRevenue: 565000,
    revenueHistory: [510000, 535000, 550000, 560000, 565000, 575000],
    expectedPayout: 'Quarterly',
    riskBand: 'LOW',
    tokenSupply: 22000,
    tokenPrice: 275,
    apy: 8.4,
    funded: 85,
    counterparty: 'Microsoft OEM Program',
    jurisdiction: 'Washington, USA',
  },
  {
    id: 'soft4',
    title: 'Enterprise AI Model Licensing',
    category: 'SOFTWARE',
    subcategory: 'AI Model Licensing',
    icon: Cpu,
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    contractTerm: '6 Years',
    monthlyRevenue: 920000,
    revenueHistory: [750000, 820000, 870000, 900000, 920000, 950000],
    expectedPayout: 'Monthly',
    riskBand: 'MEDIUM',
    tokenSupply: 40000,
    tokenPrice: 225,
    apy: 16.2,
    funded: 48,
    counterparty: 'OpenAI/Anthropic Licensing',
    jurisdiction: 'California, USA',
  },
  {
    id: 'soft5',
    title: 'Smart Contract API Royalties',
    category: 'SOFTWARE',
    subcategory: 'Smart Contract APIs',
    icon: Database,
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    contractTerm: '4 Years',
    monthlyRevenue: 185000,
    revenueHistory: [145000, 160000, 172000, 180000, 185000, 192000],
    expectedPayout: 'Weekly',
    riskBand: 'HIGH',
    tokenSupply: 8000,
    tokenPrice: 180,
    apy: 22.5,
    funded: 35,
    counterparty: 'Chainlink/The Graph',
    jurisdiction: 'Cayman Islands',
  },
  // Emerging & Novel
  {
    id: 'emer1',
    title: 'Global Weather Data Network',
    category: 'EMERGING',
    subcategory: 'Weather Data',
    icon: Thermometer,
    imageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800',
    contractTerm: '10 Years',
    monthlyRevenue: 125000,
    revenueHistory: [95000, 105000, 115000, 120000, 125000, 132000],
    expectedPayout: 'Monthly',
    riskBand: 'HIGH',
    tokenSupply: 5000,
    tokenPrice: 200,
    apy: 19.8,
    funded: 42,
    counterparty: 'IoT Sensor Network',
    jurisdiction: 'Global',
  },
  {
    id: 'emer2',
    title: 'Autonomous Traffic Analytics',
    category: 'EMERGING',
    subcategory: 'Traffic Data',
    icon: Car,
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800',
    contractTerm: '7 Years',
    monthlyRevenue: 210000,
    revenueHistory: [165000, 180000, 195000, 205000, 210000, 218000],
    expectedPayout: 'Monthly',
    riskBand: 'MEDIUM',
    tokenSupply: 9000,
    tokenPrice: 225,
    apy: 14.5,
    funded: 56,
    counterparty: 'Tesla/Waymo Data Partners',
    jurisdiction: 'Nevada, USA',
  },
  {
    id: 'emer3',
    title: 'Precision Agriculture Soil Data',
    category: 'EMERGING',
    subcategory: 'Soil Quality Data',
    icon: Leaf,
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    contractTerm: '12 Years',
    monthlyRevenue: 98000,
    revenueHistory: [75000, 82000, 88000, 94000, 98000, 103000],
    expectedPayout: 'Seasonal',
    riskBand: 'MEDIUM',
    tokenSupply: 4500,
    tokenPrice: 175,
    apy: 11.8,
    funded: 38,
    counterparty: 'John Deere/Climate Corp',
    jurisdiction: 'Nebraska, USA',
  },
  {
    id: 'emer4',
    title: 'Drone Delivery Network Royalties',
    category: 'EMERGING',
    subcategory: 'Drone Delivery',
    icon: Truck,
    imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800',
    contractTerm: '8 Years',
    monthlyRevenue: 340000,
    revenueHistory: [260000, 290000, 315000, 330000, 340000, 355000],
    expectedPayout: 'Monthly',
    riskBand: 'HIGH',
    tokenSupply: 14000,
    tokenPrice: 200,
    apy: 24.2,
    funded: 29,
    counterparty: 'Amazon Prime Air/Wing',
    jurisdiction: 'Arizona, USA',
  },
  {
    id: 'emer5',
    title: 'Robotic Workforce Revenue Share',
    category: 'EMERGING',
    subcategory: 'Robotic Workforce',
    icon: Bot,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    contractTerm: '6 Years',
    monthlyRevenue: 465000,
    revenueHistory: [380000, 410000, 440000, 455000, 465000, 480000],
    expectedPayout: 'Monthly',
    riskBand: 'HIGH',
    tokenSupply: 20000,
    tokenPrice: 225,
    apy: 21.5,
    funded: 33,
    counterparty: 'Boston Dynamics/Covariant',
    jurisdiction: 'California, USA',
  },
  {
    id: 'emer6',
    title: 'Microgrid Energy Dispatch',
    category: 'EMERGING',
    subcategory: 'Microgrid Energy',
    icon: Battery,
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    contractTerm: '15 Years',
    monthlyRevenue: 285000,
    revenueHistory: [240000, 258000, 270000, 280000, 285000, 295000],
    expectedPayout: 'Monthly',
    riskBand: 'MEDIUM',
    tokenSupply: 12000,
    tokenPrice: 250,
    apy: 13.2,
    funded: 64,
    counterparty: 'Tesla Energy/Enphase',
    jurisdiction: 'California, USA',
  },
  {
    id: 'emer7',
    title: 'Local ISP Bandwidth Royalties',
    category: 'EMERGING',
    subcategory: 'ISP Bandwidth',
    icon: Wifi,
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800',
    contractTerm: '10 Years',
    monthlyRevenue: 175000,
    revenueHistory: [148000, 158000, 165000, 172000, 175000, 182000],
    expectedPayout: 'Monthly',
    riskBand: 'LOW',
    tokenSupply: 7000,
    tokenPrice: 275,
    apy: 9.8,
    funded: 72,
    counterparty: 'Starlink/Fixed Wireless',
    jurisdiction: 'Global',
  },
];

const categories = [
  { value: 'all', label: 'All Categories', icon: Sparkles, color: 'neon-cyan' },
  { value: 'GOVERNMENT', label: 'Government', icon: Building2, color: 'blue-500' },
  { value: 'INDUSTRIAL', label: 'Industrial', icon: Factory, color: 'amber-500' },
  { value: 'MEDIA', label: 'Media & Creative', icon: Music, color: 'pink-500' },
  { value: 'SOFTWARE', label: 'Software & IP', icon: Code, color: 'purple-500' },
  { value: 'EMERGING', label: 'Emerging Tech', icon: Satellite, color: 'emerald-500' },
];

const riskBands = [
  { value: 'all', label: 'All Risk Levels' },
  { value: 'LOW', label: 'Low Risk', color: 'emerald' },
  { value: 'MEDIUM', label: 'Medium Risk', color: 'amber' },
  { value: 'HIGH', label: 'High Risk', color: 'rose' },
];

const sortOptions = [
  { value: 'apy', label: 'Highest APY' },
  { value: 'funded', label: 'Most Funded' },
  { value: 'revenue', label: 'Highest Revenue' },
  { value: 'newest', label: 'Newest' },
];

function MiniChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((value, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${((value - min) / range) * 100}%` }}
          transition={{ delay: i * 0.05 }}
          className="w-1.5 bg-gradient-to-t from-neon-cyan/50 to-neon-cyan rounded-t-full min-h-[4px]"
        />
      ))}
    </div>
  );
}

function CashFlowSimulator({ revenue, apy }: { revenue: number; apy: number }) {
  const [years, setYears] = useState(1);
  const projectedValue = revenue * 12 * years * (1 + apy / 100);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Projection Period</span>
        <div className="flex gap-1">
          {[1, 3, 5].map((y) => (
            <button
              key={y}
              onClick={() => setYears(y)}
              className={cn(
                'px-2 py-1 rounded text-xs font-medium transition-colors',
                years === y
                  ? 'bg-neon-cyan/20 text-neon-cyan'
                  : 'bg-white/5 hover:bg-white/10 text-muted-foreground'
              )}
            >
              {y}Y
            </button>
          ))}
        </div>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((years / 5) * 100, 100)}%` }}
          className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple"
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Projected Returns</span>
        <span className="text-lg font-bold text-neon-green">
          {formatCurrency(projectedValue)}
        </span>
      </div>
    </div>
  );
}

export default function RoyaltiesPage() {
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [riskBand, setRiskBand] = useState('all');
  const [sortBy, setSortBy] = useState('apy');
  const [selectedRoyalty, setSelectedRoyalty] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['royalties', category, riskBand],
    queryFn: async () => {
      try {
        const params: any = {};
        if (category !== 'all') params.category = category;
        if (riskBand !== 'all') params.riskBand = riskBand;
        const response = await royaltiesApi.list(params);
        return response.data;
      } catch (e) {
        // Return mock data when API is unavailable
        let filtered = [...mockRoyalties];
        if (category !== 'all') filtered = filtered.filter(r => r.category === category);
        if (riskBand !== 'all') filtered = filtered.filter(r => r.riskBand === riskBand);
        return { data: filtered };
      }
    },
  });

  const royalties = data?.data || [];

  const filteredAndSortedRoyalties = useMemo(() => {
    let result = royalties.filter((r: any) =>
      searchQuery
        ? r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.counterparty.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

    // Sort
    switch (sortBy) {
      case 'apy':
        result.sort((a: any, b: any) => b.apy - a.apy);
        break;
      case 'funded':
        result.sort((a: any, b: any) => b.funded - a.funded);
        break;
      case 'revenue':
        result.sort((a: any, b: any) => b.monthlyRevenue - a.monthlyRevenue);
        break;
      case 'newest':
        result.reverse();
        break;
    }

    return result;
  }, [royalties, searchQuery, sortBy]);

  const totalStats = useMemo(() => {
    return {
      totalValue: mockRoyalties.reduce((acc, r) => acc + r.tokenSupply * r.tokenPrice, 0),
      totalRevenue: mockRoyalties.reduce((acc, r) => acc + r.monthlyRevenue, 0),
      avgApy: mockRoyalties.reduce((acc, r) => acc + r.apy, 0) / mockRoyalties.length,
      totalListings: mockRoyalties.length,
    };
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-cyan w-[600px] h-[600px] top-0 -left-48 opacity-20" />
        <div className="orb orb-purple w-[500px] h-[500px] bottom-20 -right-32 opacity-15" />
        <div className="orb orb-pink w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="container relative">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">
              Tokenized Cash Flow Marketplace
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
            Turn <span className="gradient-text">Contracts</span> Into
            <br />
            <span className="gradient-text">Liquid Assets</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            The world's first marketplace for tokenized contractual cash flows. 
            Invest in government contracts, industrial royalties, media rights, 
            software licensing, and emerging technology revenue streams.
          </p>

          {/* Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Total Market Value', value: formatCurrency(totalStats.totalValue), icon: CircleDollarSign },
              { label: 'Monthly Revenue', value: formatCurrency(totalStats.totalRevenue), icon: TrendingUp },
              { label: 'Average APY', value: `${totalStats.avgApy.toFixed(1)}%`, icon: BarChart3 },
              { label: 'Active Listings', value: totalStats.totalListings.toString(), icon: Layers },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="glass-card p-4"
              >
                <stat.icon className="w-5 h-5 text-neon-cyan mb-2 mx-auto" />
                <div className="text-2xl font-bold text-neon-cyan">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Value Props */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-4 mb-12"
        >
          {[
            {
              icon: Shield,
              title: 'Contract-Backed Security',
              description: 'Every token is backed by verified, legally-binding contracts with real counterparties.',
              color: 'neon-cyan',
            },
            {
              icon: Workflow,
              title: 'On-Chain Payouts',
              description: 'Automated smart contract distributions. Revenue flows directly to token holders.',
              color: 'neon-purple',
            },
            {
              icon: LineChart,
              title: 'Oracle-Verified Revenue',
              description: 'Real-world revenue data pulled via oracles for complete transparency.',
              color: 'neon-green',
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="glass-card p-6 hover:border-primary/30 transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl bg-${feature.color}/20 flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                category === cat.value
                  ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 text-white border border-neon-cyan/30 shadow-lg shadow-neon-cyan/10'
                  : 'bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground border border-white/5'
              )}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search contracts, counterparties, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
          
          <Select value={riskBand} onValueChange={setRiskBand}>
            <SelectTrigger className="w-[160px] bg-white/5 border-white/10">
              <Shield className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              {riskBands.map((risk) => (
                <SelectItem key={risk.value} value={risk.value}>
                  {risk.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] bg-white/5 border-white/10">
              <BarChart3 className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredAndSortedRoyalties.length === 0 ? (
          <div className="text-center py-20">
            <Coins className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No contracts found</h3>
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
            {filteredAndSortedRoyalties.map((royalty: any, index: number) => {
              const IconComponent = royalty.icon || Coins;
              const riskColor = {
                LOW: 'emerald',
                MEDIUM: 'amber',
                HIGH: 'rose',
              }[royalty.riskBand as string] || 'gray';

              return (
                <motion.div
                  key={royalty.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setSelectedRoyalty(selectedRoyalty === royalty.id ? null : royalty.id)}
                  className={cn(
                    'glass-card overflow-hidden cursor-pointer transition-all duration-300',
                    selectedRoyalty === royalty.id
                      ? 'border-neon-cyan/50 shadow-lg shadow-neon-cyan/10'
                      : 'hover:border-white/20'
                  )}
                >
                  <div className="flex">
                    {/* Image */}
                    <div className="relative w-1/3 aspect-square flex-shrink-0">
                      {royalty.imageUrl ? (
                        <Image
                          src={royalty.imageUrl}
                          alt={royalty.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                          <IconComponent className="w-12 h-12 text-neon-cyan/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                          {royalty.subcategory}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-1">{royalty.title}</h3>
                          <p className="text-sm text-muted-foreground">{royalty.counterparty}</p>
                        </div>
                        <span
                          className={cn(
                            'px-2 py-1 text-xs font-medium rounded-full',
                            `bg-${riskColor}-500/20 text-${riskColor}-400`
                          )}
                        >
                          {royalty.riskBand} Risk
                        </span>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>Contract Term</span>
                          </div>
                          <div className="font-medium">{royalty.contractTerm}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>Payout</span>
                          </div>
                          <div className="font-medium">{royalty.expectedPayout}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <DollarSign className="w-3 h-3" />
                            <span>Monthly Revenue</span>
                          </div>
                          <div className="font-medium text-neon-green">
                            {formatCurrency(royalty.monthlyRevenue)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <TrendingUp className="w-3 h-3" />
                            <span>APY</span>
                          </div>
                          <div className="font-medium text-neon-cyan">{royalty.apy}%</div>
                        </div>
                      </div>

                      {/* Revenue Chart */}
                      <div className="flex items-end justify-between gap-4">
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground mb-1">Revenue History</div>
                          <MiniChart data={royalty.revenueHistory} />
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Token Price</div>
                          <div className="text-lg font-bold">${royalty.tokenPrice}</div>
                        </div>
                      </div>

                      {/* Funding Progress */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Funded</span>
                          <span className="font-medium">{royalty.funded}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${royalty.funded}%` }}
                            transition={{ duration: 0.5, delay: index * 0.03 }}
                            className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Section */}
                  <AnimatePresence>
                    {selectedRoyalty === royalty.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10"
                      >
                        <div className="p-5 grid md:grid-cols-2 gap-6">
                          {/* Cash Flow Simulator */}
                          <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Activity className="w-4 h-4 text-neon-cyan" />
                              Cash Flow Projection
                            </h4>
                            <CashFlowSimulator revenue={royalty.monthlyRevenue} apy={royalty.apy} />
                          </div>

                          {/* Token Details */}
                          <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Coins className="w-4 h-4 text-neon-purple" />
                              Token Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Supply</span>
                                <span>{royalty.tokenSupply.toLocaleString()} tokens</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Market Cap</span>
                                <span>{formatCurrency(royalty.tokenSupply * royalty.tokenPrice)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Jurisdiction</span>
                                <span>{royalty.jurisdiction}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="px-5 pb-5">
                          <Button className="w-full gap-2" size="lg" asChild>
                            <Link href={`/royalties/${royalty.id}`}>
                              View Full Details
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Architecture Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              How <span className="gradient-text">Tokenization</span> Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From contract verification to automated payouts — every step is secured by smart contracts and verified by oracles.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Contract Verification',
                description: 'Legal contracts are verified by our compliance team and encoded into smart contracts.',
                icon: Shield,
              },
              {
                step: '02',
                title: 'Token Issuance',
                description: 'ERC-1400 compliant tokens are minted representing fractional ownership of cash flows.',
                icon: Coins,
              },
              {
                step: '03',
                title: 'Oracle Integration',
                description: 'Real-world revenue data is pulled via Chainlink oracles for transparency.',
                icon: Globe,
              },
              {
                step: '04',
                title: 'Automated Payouts',
                description: 'Smart contracts distribute revenue to token holders automatically.',
                icon: Workflow,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass-card p-6 relative"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-sm font-bold text-background">
                  {item.step}
                </div>
                <item.icon className="w-10 h-10 text-neon-cyan mb-4" />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 glass-card p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10" />
            <div className="relative">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-neon-cyan" />
              <h3 className="text-2xl font-bold mb-2">Ready to Invest in Cash Flows?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Join the future of contractual finance. Start investing in tokenized 
                revenue streams from government contracts to cutting-edge technology.
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











