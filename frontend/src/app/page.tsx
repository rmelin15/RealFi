'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  Cpu,
  Sun,
  Car,
  Coins,
  Shield,
  TrendingUp,
  Users,
  Zap,
  Globe,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssetCard } from '@/components/assets/asset-card';
import { StatsCard } from '@/components/ui/stats-card';

const featuredAssets = [
  {
    id: '1',
    name: 'Downtown Manhattan Coffee Co.',
    category: 'COFFEE_SHOP',
    locationRegion: 'New York, NY',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
    projectedApy: 12.5,
    riskRating: 'MEDIUM',
    targetRaise: 1000000,
    totalRaised: 425000,
    status: 'FUNDING',
  },
  {
    id: '2',
    name: 'Atlas AI GPU Cluster',
    category: 'GPU_CLUSTER',
    locationRegion: 'San Francisco, CA',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    projectedApy: 18.0,
    riskRating: 'MEDIUM',
    targetRaise: 2500000,
    totalRaised: 1875000,
    status: 'FUNDING',
  },
  {
    id: '3',
    name: 'Arizona Solar Array',
    category: 'SOLAR_PLANT',
    locationRegion: 'Phoenix, AZ',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    projectedApy: 9.5,
    riskRating: 'LOW',
    targetRaise: 2500000,
    totalRaised: 2500000,
    status: 'LIVE',
  },
];

const features = [
  {
    icon: Building2,
    title: 'Real World Assets',
    description:
      'Invest in tangible infrastructure like coffee shops, car washes, and manufacturing facilities.',
  },
  {
    icon: Cpu,
    title: 'AI & Compute',
    description:
      'Own fractions of GPU clusters and data centers powering the AI revolution.',
  },
  {
    icon: Sun,
    title: 'Clean Energy',
    description:
      'Participate in solar arrays, EV charging networks, and battery storage systems.',
  },
  {
    icon: Car,
    title: 'Mobility Networks',
    description:
      'Invest in vehicle fleets, scooter networks, and autonomous delivery robots.',
  },
];

const stats = [
  { label: 'Total Value Locked', value: '$12.4M', icon: Coins },
  { label: 'Active Investors', value: '2,847', icon: Users },
  { label: 'Assets Listed', value: '24', icon: Building2 },
  { label: 'Avg. APY', value: '14.2%', icon: TrendingUp },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-cyan w-[600px] h-[600px] -top-48 -left-48 opacity-30" />
        <div className="orb orb-purple w-[500px] h-[500px] top-96 right-0 opacity-20" />
        <div className="orb orb-pink w-[400px] h-[400px] bottom-0 left-1/3 opacity-20" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass border border-neon-cyan/30">
              <Zap className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm font-medium text-neon-cyan">
                The Future of Real-World Investing
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight">
              Own the{' '}
              <span className="gradient-text">Real Economy</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Turn real-world infrastructure into programmable, investable assets.
              From coffee shops to GPU clusters — invest in what powers the world.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="group" asChild>
                <Link href="/explore">
                  Start Investing
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/lend">Lend & Earn</Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
          >
            {stats.map((stat, index) => (
              <StatsCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                delay={index * 0.1}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Assets */}
      <section className="py-24 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Featured Opportunities
              </h2>
              <p className="text-muted-foreground text-lg">
                Curated selection of high-quality, yield-generating assets
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link href="/explore">
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AssetCard asset={asset} />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild>
              <Link href="/explore">View All Assets</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Invest in What Matters
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Access a diverse range of real-world assets generating real yield
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 group hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to start building your real-world asset portfolio
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Browse Assets',
                description:
                  'Explore curated opportunities across categories like retail, compute, energy, and mobility.',
                icon: Globe,
              },
              {
                step: '02',
                title: 'Invest',
                description:
                  'Choose your investment amount and complete your subscription. Fractional ownership starts at $100.',
                icon: BarChart3,
              },
              {
                step: '03',
                title: 'Earn Yield',
                description:
                  'Receive distributions from your portfolio of real-world assets generating real cash flow.',
                icon: TrendingUp,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="glass-card p-8 h-full">
                  <div className="text-6xl font-bold text-primary/10 mb-4">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 via-neon-purple/20 to-neon-pink/20" />
            <div className="absolute inset-0 bg-grid opacity-30" />
            
            <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
              <Shield className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">
                Ready to Own the Future?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join thousands of investors building portfolios of real-world assets.
                Start with as little as $100.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="group" asChild>
                  <Link href="/auth/register">
                    Create Account
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/explore">Browse Assets</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


















