'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import {
  Gift,
  Leaf,
  Recycle,
  Train,
  Zap,
  Heart,
  Trophy,
  Loader2,
  ArrowRight,
  Sparkles,
  Bike,
  Car,
  Footprints,
  Home,
  Sun,
  Droplets,
  Thermometer,
  Vote,
  Users,
  Award,
  Flame,
  Target,
  Star,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Shield,
  CircleDollarSign,
  Ticket,
  ShoppingBag,
  Building2,
  Globe,
  Smartphone,
  Wifi,
  Battery,
  TreePine,
  Wind,
  Waves,
  Coffee,
  Utensils,
  MapPin,
  ChevronRight,
  Play,
  Pause,
  RefreshCw,
  Coins,
  CreditCard,
  BadgeCheck,
  Siren,
  Gauge,
  Activity,
} from 'lucide-react';
import { instrumentsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { Progress } from '@/components/ui/progress';

// ============================================================================
// EARNING CATEGORIES DATA
// ============================================================================

const earningCategories = [
  {
    id: 'transit',
    name: 'Transit & Mobility',
    icon: Train,
    color: 'blue',
    description: 'Earn rewards for sustainable transportation choices',
    actions: [
      { name: 'Walking (per mile)', points: 15, icon: Footprints, daily: true },
      { name: 'Biking (per mile)', points: 20, icon: Bike, daily: true },
      { name: 'Public Transit Ride', points: 25, icon: Train, daily: true },
      { name: 'Carpooling Trip', points: 30, icon: Car, daily: true },
      { name: 'E-Scooter/Micro-mobility', points: 18, icon: Bike, daily: true },
      { name: 'Low-emission Vehicle Trip', points: 10, icon: Car, daily: true },
      { name: 'Telecommuting Day', points: 50, icon: Home, daily: true },
    ],
  },
  {
    id: 'energy',
    name: 'Energy Efficiency',
    icon: Zap,
    color: 'yellow',
    description: 'Reduce your energy footprint and earn',
    actions: [
      { name: 'Smart Thermostat Savings', points: 35, icon: Thermometer, daily: true },
      { name: 'Off-peak Power Usage', points: 20, icon: Clock, daily: true },
      { name: 'Home Solar Generation', points: 40, icon: Sun, daily: true },
      { name: 'Grid Energy Sell-back', points: 75, icon: Battery, daily: true },
      { name: 'Demand Response Event', points: 100, icon: Gauge, special: true },
      { name: 'Smart EV Charging', points: 30, icon: Zap, daily: true },
    ],
  },
  {
    id: 'recycling',
    name: 'Recycling & Sustainability',
    icon: Recycle,
    color: 'emerald',
    description: 'Every recycled item counts towards impact',
    actions: [
      { name: 'Textile Recycling Drop-off', points: 50, icon: ShoppingBag, weekly: true },
      { name: 'Composting (weekly)', points: 40, icon: TreePine, weekly: true },
      { name: 'E-waste Drop-off', points: 100, icon: Smartphone, monthly: true },
      { name: 'Appliance Recycling', points: 200, icon: Home, monthly: true },
      { name: 'General Recycling', points: 15, icon: Recycle, daily: true },
      { name: 'Sustainable Shopping', points: 25, icon: ShoppingBag, daily: true },
    ],
  },
  {
    id: 'community',
    name: 'Community Engagement',
    icon: Heart,
    color: 'pink',
    description: 'Make a difference in your neighborhood',
    actions: [
      { name: 'Voting in Elections', points: 500, icon: Vote, special: true },
      { name: 'Volunteer Hours', points: 100, icon: Users, hourly: true },
      { name: 'Blood Donation', points: 300, icon: Heart, monthly: true },
      { name: 'Local Fundraising', points: 150, icon: CircleDollarSign, monthly: true },
      { name: 'Neighborhood Watch', points: 75, icon: Shield, weekly: true },
      { name: 'Community Cleanup', points: 200, icon: Leaf, monthly: true },
    ],
  },
  {
    id: 'smartcity',
    name: 'Smart City Integration',
    icon: Globe,
    color: 'purple',
    description: 'Connect to smart city systems and earn',
    actions: [
      { name: 'IoT Waste Bin Reporting', points: 30, icon: Recycle, daily: true },
      { name: 'Water Conservation Meter', points: 45, icon: Droplets, daily: true },
      { name: 'Smart EV Charger Usage', points: 35, icon: Zap, daily: true },
      { name: 'Air Quality Sensor Data', points: 50, icon: Wind, daily: true },
      { name: 'Traffic Pattern Sharing', points: 25, icon: Car, daily: true },
      { name: 'Emergency Alert Response', points: 40, icon: Siren, special: true },
    ],
  },
];

// ============================================================================
// REDEMPTION OPTIONS DATA
// ============================================================================

const redemptionCategories = [
  {
    name: 'Green Merchants',
    description: 'Discounts at sustainable businesses',
    options: [
      { name: 'Local Coffee Shop Credit', points: 500, value: '$5', icon: Coffee },
      { name: 'Organic Grocery Voucher', points: 1000, value: '$10', icon: ShoppingBag },
      { name: 'Sustainable Restaurant Card', points: 1500, value: '$15', icon: Utensils },
      { name: 'Eco-Friendly Store Credit', points: 2500, value: '$25', icon: Leaf },
    ],
  },
  {
    name: 'Transit & Mobility',
    description: 'Free rides and passes',
    options: [
      { name: 'Single Transit Ride', points: 200, value: '1 ride', icon: Train },
      { name: 'Day Pass', points: 500, value: '1 day', icon: Ticket },
      { name: 'Weekly Transit Pass', points: 2000, value: '7 days', icon: Ticket },
      { name: 'Monthly Transit Pass', points: 6000, value: '30 days', icon: Ticket },
    ],
  },
  {
    name: 'Platform Benefits',
    description: 'RealFi investment credits',
    options: [
      { name: 'Investment Credit', points: 2500, value: '$25', icon: Coins },
      { name: 'Premium Features (1mo)', points: 5000, value: '1 month', icon: Star },
      { name: 'Priority Municipal Access', points: 3000, value: '3 months', icon: Building2 },
      { name: 'Fee Discount', points: 1500, value: '10% off', icon: CircleDollarSign },
    ],
  },
  {
    name: 'City Contributions',
    description: 'Give back to your community',
    options: [
      { name: 'City Park Fund', points: 500, value: 'Matched', icon: TreePine },
      { name: 'Community Garden', points: 750, value: 'Matched', icon: Leaf },
      { name: 'Youth Programs', points: 1000, value: 'Matched', icon: Users },
      { name: 'Emergency Services', points: 1500, value: 'Matched', icon: Shield },
    ],
  },
];

// ============================================================================
// CHALLENGES & GAMIFICATION DATA
// ============================================================================

const activeChallenges = [
  {
    id: 'c1',
    name: 'Green Commuter Week',
    description: 'Use sustainable transport for 5 days straight',
    icon: Bike,
    reward: 500,
    progress: 3,
    total: 5,
    endsIn: '4 days',
    type: 'streak',
  },
  {
    id: 'c2',
    name: 'Energy Saver',
    description: 'Reduce energy usage by 20% this month',
    icon: Zap,
    reward: 750,
    progress: 65,
    total: 100,
    endsIn: '12 days',
    type: 'progress',
  },
  {
    id: 'c3',
    name: 'Community Champion',
    description: 'Complete 10 community actions',
    icon: Heart,
    reward: 1000,
    progress: 7,
    total: 10,
    endsIn: '8 days',
    type: 'count',
  },
  {
    id: 'c4',
    name: 'Recycle Master',
    description: 'Log 15 recycling activities',
    icon: Recycle,
    reward: 400,
    progress: 12,
    total: 15,
    endsIn: '3 days',
    type: 'count',
  },
];

const seasonalChallenges = [
  {
    name: 'Winter Energy Challenge',
    description: 'Reduce heating usage while staying comfortable',
    reward: 2500,
    participants: 12450,
    endsIn: '28 days',
    icon: Thermometer,
  },
  {
    name: 'Holiday Recycling Sprint',
    description: 'Recycle packaging and decorations responsibly',
    reward: 1500,
    participants: 8920,
    endsIn: '14 days',
    icon: Gift,
  },
];

const leaderboardData = [
  { rank: 1, name: 'Sarah M.', city: 'Austin', points: 45280, avatar: '👩‍💼' },
  { rank: 2, name: 'James K.', city: 'Seattle', points: 42150, avatar: '👨‍🔬' },
  { rank: 3, name: 'Emma L.', city: 'Portland', points: 39840, avatar: '👩‍🎨' },
  { rank: 4, name: 'Michael R.', city: 'Denver', points: 38520, avatar: '👨‍💻' },
  { rank: 5, name: 'You', city: 'Austin', points: 12450, avatar: '🧑', isUser: true },
];

const cityLeaderboard = [
  { rank: 1, city: 'Portland, OR', points: 2840000, participants: 15420 },
  { rank: 2, city: 'Seattle, WA', points: 2650000, participants: 14200 },
  { rank: 3, city: 'Austin, TX', points: 2420000, participants: 12800 },
  { rank: 4, city: 'Denver, CO', points: 2180000, participants: 11500 },
  { rank: 5, city: 'Minneapolis, MN', points: 1950000, participants: 10200 },
];

// ============================================================================
// USER STATS (MOCK)
// ============================================================================

const userStats = {
  totalPoints: 12450,
  lifetimePoints: 28750,
  currentStreak: 7,
  longestStreak: 23,
  carbonSaved: 1.2, // tons
  actionsCompleted: 342,
  rank: 156,
  tier: 'Eco Champion',
  nextTier: 'Impact Leader',
  pointsToNextTier: 2550,
  weeklyGoal: 750,
  weeklyProgress: 520,
};

// ============================================================================
// COMPONENTS
// ============================================================================

function UserStatsCard() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</h2>
          <p className="text-muted-foreground">Impact Points</p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 flex items-center justify-center">
          <Leaf className="w-8 h-8 text-neon-green" />
        </div>
      </div>

      {/* Weekly Goal */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Weekly Goal</span>
          <span>{userStats.weeklyProgress}/{userStats.weeklyGoal} pts</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(userStats.weeklyProgress / userStats.weeklyGoal) * 100}%` }}
            className="h-full bg-gradient-to-r from-neon-green to-neon-cyan"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-xl bg-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-muted-foreground">Streak</span>
          </div>
          <div className="text-xl font-bold">{userStats.currentStreak} days</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="w-4 h-4 text-neon-green" />
            <span className="text-sm text-muted-foreground">CO₂ Saved</span>
          </div>
          <div className="text-xl font-bold">{userStats.carbonSaved}t</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-muted-foreground">Rank</span>
          </div>
          <div className="text-xl font-bold">#{userStats.rank}</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm text-muted-foreground">Actions</span>
          </div>
          <div className="text-xl font-bold">{userStats.actionsCompleted}</div>
        </div>
      </div>
    </div>
  );
}

function CarbonDashboard() {
  const monthlyData = [
    { month: 'Jun', saved: 0.08 },
    { month: 'Jul', saved: 0.12 },
    { month: 'Aug', saved: 0.15 },
    { month: 'Sep', saved: 0.18 },
    { month: 'Oct', saved: 0.22 },
    { month: 'Nov', saved: 0.25 },
  ];
  const maxSaved = Math.max(...monthlyData.map((d) => d.saved));

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-neon-green" />
          Personal Carbon Dashboard
        </h3>
        <span className="text-sm text-muted-foreground">Last 6 months</span>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-2 h-32 mb-4">
        {monthlyData.map((d, i) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.saved / maxSaved) * 100}%` }}
              transition={{ delay: i * 0.1 }}
              className="w-full bg-gradient-to-t from-neon-green/50 to-neon-green rounded-t-lg"
            />
            <span className="text-xs text-muted-foreground">{d.month}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl bg-neon-green/10">
        <div>
          <div className="text-sm text-muted-foreground">Total CO₂ Saved</div>
          <div className="text-2xl font-bold text-neon-green">{userStats.carbonSaved} tons</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Equivalent to</div>
          <div className="font-medium">54 trees planted 🌳</div>
        </div>
      </div>
    </div>
  );
}

function ChallengeCard({ challenge }: { challenge: typeof activeChallenges[0] }) {
  const progress = (challenge.progress / challenge.total) * 100;
  
  return (
    <div className="glass-card p-4 hover:border-neon-cyan/30 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 flex items-center justify-center flex-shrink-0">
          <challenge.icon className="w-5 h-5 text-neon-cyan" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium">{challenge.name}</h4>
              <p className="text-sm text-muted-foreground">{challenge.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-medium text-neon-green">+{challenge.reward}</div>
              <div className="text-xs text-muted-foreground">{challenge.endsIn}</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>{challenge.progress}/{challenge.total}</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EarningCategoryCard({ category, isExpanded, onToggle }: { 
  category: typeof earningCategories[0];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={cn(
      'glass-card overflow-hidden transition-all duration-300',
      isExpanded && 'border-neon-cyan/30'
    )}>
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-4 text-left"
      >
        <div className={`w-12 h-12 rounded-xl bg-${category.color}-500/20 flex items-center justify-center`}>
          <category.icon className={`w-6 h-6 text-${category.color}-400`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{category.name}</h3>
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </div>
        <ChevronRight className={cn(
          'w-5 h-5 text-muted-foreground transition-transform',
          isExpanded && 'rotate-90'
        )} />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {category.actions.map((action, i) => (
                <div
                  key={action.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <action.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{action.name}</span>
                    {action.daily && (
                      <span className="px-1.5 py-0.5 text-xs rounded bg-blue-500/20 text-blue-400">Daily</span>
                    )}
                    {action.weekly && (
                      <span className="px-1.5 py-0.5 text-xs rounded bg-purple-500/20 text-purple-400">Weekly</span>
                    )}
                    {action.monthly && (
                      <span className="px-1.5 py-0.5 text-xs rounded bg-amber-500/20 text-amber-400">Monthly</span>
                    )}
                    {action.special && (
                      <span className="px-1.5 py-0.5 text-xs rounded bg-pink-500/20 text-pink-400">Special</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-neon-green">+{action.points} pts</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RedemptionCard({ option }: { option: typeof redemptionCategories[0]['options'][0] }) {
  return (
    <div className="glass-card p-4 hover:border-neon-purple/30 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-neon-purple/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <option.icon className="w-5 h-5 text-neon-purple" />
        </div>
        <div className="flex-1">
          <div className="font-medium">{option.name}</div>
          <div className="text-sm text-muted-foreground">{option.value}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-neon-purple">{option.points.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">points</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function RewardsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'earn' | 'redeem' | 'challenges' | 'leaderboard'>('earn');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('transit');

  const tabs = [
    { id: 'earn', label: 'Earn Points', icon: Sparkles },
    { id: 'redeem', label: 'Redeem', icon: Gift },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-pink w-[500px] h-[500px] top-0 -right-32 opacity-15" />
        <div className="orb orb-cyan w-[400px] h-[400px] bottom-20 -left-32 opacity-20" />
        <div className="orb orb-purple w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="container relative">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 border border-neon-green/30">
            <Leaf className="w-4 h-4 text-neon-green" />
            <span className="text-sm font-medium text-neon-green">
              Impact Economy Rewards
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
            Every <span className="gradient-text">Action</span> Has
            <br />
            <span className="gradient-text">Impact</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Earn Impact Points for sustainable choices. Walk to work, recycle electronics, 
            volunteer in your community — every green action earns real rewards.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Total Points Earned', value: '2.8M+', icon: Coins },
              { label: 'Active Members', value: '45K+', icon: Users },
              { label: 'CO₂ Saved (tons)', value: '12.5K', icon: Leaf },
              { label: 'Rewards Redeemed', value: '$890K', icon: Gift },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="glass-card p-4"
              >
                <stat.icon className="w-5 h-5 text-neon-green mb-2 mx-auto" />
                <div className="text-2xl font-bold text-neon-green">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* User Stats & Dashboard */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid lg:grid-cols-2 gap-6 mb-12"
          >
            <UserStatsCard />
            <CarbonDashboard />
          </motion.div>
        )}

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 text-white border border-neon-green/30 shadow-lg shadow-neon-green/10'
                  : 'bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground border border-white/5'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Earn Points Tab */}
        {activeTab === 'earn' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {earningCategories.map((category) => (
              <EarningCategoryCard
                key={category.id}
                category={category}
                isExpanded={expandedCategory === category.id}
                onToggle={() => setExpandedCategory(
                  expandedCategory === category.id ? null : category.id
                )}
              />
            ))}
          </motion.div>
        )}

        {/* Redeem Tab */}
        {activeTab === 'redeem' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {redemptionCategories.map((category, i) => (
              <div key={category.name}>
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.options.map((option) => (
                    <RedemptionCard key={option.name} option={option} />
                  ))}
          </div>
          </div>
            ))}
          </motion.div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Active Challenges */}
            <div>
              <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-neon-cyan" />
                Active Challenges
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {activeChallenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </div>

            {/* Seasonal Challenges */}
            <div>
              <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-neon-purple" />
                Seasonal Events
              </h3>
            <div className="grid md:grid-cols-2 gap-6">
                {seasonalChallenges.map((challenge, i) => (
                  <div
                    key={challenge.name}
                    className="glass-card p-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-neon-purple/20 to-transparent rounded-bl-full" />
                    <div className="relative">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-neon-purple/20 flex items-center justify-center">
                          <challenge.icon className="w-7 h-7 text-neon-purple" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{challenge.name}</h4>
                          <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Reward</div>
                            <div className="font-bold text-neon-green">+{challenge.reward.toLocaleString()} pts</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Participants</div>
                            <div className="font-medium">{challenge.participants.toLocaleString()}</div>
                          </div>
                        </div>
                        <Button size="sm" className="gap-2">
                          Join <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Streak */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Daily Streak</h3>
                    <p className="text-sm text-muted-foreground">Complete any action daily to maintain</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-400">{userStats.currentStreak}</div>
                  <div className="text-sm text-muted-foreground">days</div>
                </div>
              </div>

              {/* Streak Calendar */}
              <div className="flex gap-1 justify-between">
                {Array.from({ length: 14 }, (_, i) => {
                  const isActive = i < userStats.currentStreak;
                  const isToday = i === userStats.currentStreak - 1;
                  return (
                    <div
                      key={i}
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium',
                        isActive
                          ? 'bg-gradient-to-br from-orange-500/30 to-amber-500/30 text-orange-400'
                          : 'bg-white/5 text-muted-foreground',
                        isToday && 'ring-2 ring-orange-400'
                      )}
                    >
                      {isActive ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-orange-500/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">Longest streak: {userStats.longestStreak} days</span>
                </div>
                <span className="text-sm text-muted-foreground">Keep going!</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* Individual Leaderboard */}
            <div>
              <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-neon-cyan" />
                Top Earners
              </h3>
              <div className="space-y-2">
                {leaderboardData.map((user, i) => (
                  <div
                    key={user.rank}
                    className={cn(
                      'glass-card p-4 flex items-center gap-4',
                      user.isUser && 'border-neon-cyan/30 bg-neon-cyan/5'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                      user.rank === 1 && 'bg-amber-500/20 text-amber-400',
                      user.rank === 2 && 'bg-gray-400/20 text-gray-300',
                      user.rank === 3 && 'bg-amber-700/20 text-amber-600',
                      user.rank > 3 && 'bg-white/10 text-muted-foreground'
                    )}>
                      {user.rank}
                    </div>
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.city}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-neon-green">{user.points.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* City Leaderboard */}
            <div>
              <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-neon-purple" />
                City vs City
              </h3>
              <div className="space-y-2">
                {cityLeaderboard.map((city, i) => (
                  <div
                    key={city.city}
                    className="glass-card p-4 flex items-center gap-4"
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                      city.rank === 1 && 'bg-amber-500/20 text-amber-400',
                      city.rank === 2 && 'bg-gray-400/20 text-gray-300',
                      city.rank === 3 && 'bg-amber-700/20 text-amber-600',
                      city.rank > 3 && 'bg-white/10 text-muted-foreground'
                    )}>
                      {city.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{city.city}</div>
                      <div className="text-sm text-muted-foreground">
                        {city.participants.toLocaleString()} participants
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-neon-purple">
                        {(city.points / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Neighborhood Score */}
              <div className="mt-6 glass-card p-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-neon-green" />
                  Neighborhood Impact Score
                </h4>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-neon-cyan">
                    847
                  </div>
                  <div className="text-sm text-muted-foreground">East Austin, TX</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">City Average: 720</span>
                  <span className="text-neon-green">+18% above</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              How <span className="gradient-text">Impact Points</span> Work
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect your sustainable actions to real rewards through our verified impact tracking system.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Take Action',
                description: 'Walk, bike, recycle, volunteer — any sustainable action counts.',
                icon: Footprints,
              },
              {
                step: '02',
                title: 'Log or Auto-Track',
                description: 'Manual logging or automatic via smart city integrations.',
                icon: Smartphone,
              },
              {
                step: '03',
                title: 'Earn Points',
                description: 'Points are awarded based on verified impact metrics.',
                icon: Coins,
              },
              {
                step: '04',
                title: 'Redeem Rewards',
                description: 'Convert points to discounts, credits, or community donations.',
                icon: Gift,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass-card p-6 relative"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center text-sm font-bold text-background">
                  {item.step}
              </div>
                <item.icon className="w-10 h-10 text-neon-green mb-4" />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
            </div>
        </motion.div>

        {/* CTA for unauthenticated */}
        {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
            className="mt-16 glass-card p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-green/10 to-neon-cyan/10" />
            <div className="relative">
              <Leaf className="w-12 h-12 mx-auto mb-4 text-neon-green" />
              <h3 className="text-2xl font-bold mb-2">Start Earning Today</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Join thousands of impact-driven users earning rewards for sustainable actions.
                Every step counts.
              </p>
              <Button asChild size="lg">
              <Link href="/auth/register">
                Create Account
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
