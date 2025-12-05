'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Plus,
  Wrench,
  Car,
  Sofa,
  Camera,
  Bike,
  Tractor,
  Drill,
  Loader2,
  MapPin,
  Clock,
  Star,
  DollarSign,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { rentalsApi } from '@/lib/api';
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
import { useAuthStore } from '@/stores/auth-store';

// Mock data for rentals
const mockRentals = [
  // Tools
  {
    id: 'r1',
    title: 'DeWalt Power Drill Set',
    category: 'TOOLS',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800',
    dailyRate: 25,
    weeklyRate: 100,
    location: 'Brooklyn, NY',
    rating: 4.8,
    reviews: 24,
    available: true,
    owner: 'Mike T.',
  },
  {
    id: 'r2',
    title: 'Pressure Washer 3000 PSI',
    category: 'TOOLS',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    dailyRate: 45,
    weeklyRate: 180,
    location: 'Queens, NY',
    rating: 4.9,
    reviews: 18,
    available: true,
    owner: 'Sarah K.',
  },
  {
    id: 'r3',
    title: 'Extension Ladder 24ft',
    category: 'TOOLS',
    imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800',
    dailyRate: 20,
    weeklyRate: 75,
    location: 'Manhattan, NY',
    rating: 4.7,
    reviews: 31,
    available: true,
    owner: 'James L.',
  },
  // Equipment & Vehicles
  {
    id: 'r4',
    title: 'John Deere Compact Tractor',
    category: 'EQUIPMENT',
    imageUrl: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800',
    dailyRate: 150,
    weeklyRate: 600,
    location: 'Long Island, NY',
    rating: 4.6,
    reviews: 12,
    available: true,
    owner: 'Farm Co.',
  },
  {
    id: 'r5',
    title: 'Utility Trailer 6x12',
    category: 'EQUIPMENT',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800',
    dailyRate: 45,
    weeklyRate: 175,
    location: 'Bronx, NY',
    rating: 4.8,
    reviews: 42,
    available: true,
    owner: 'Tony M.',
  },
  {
    id: 'r6',
    title: 'Riding Lawn Mower',
    category: 'EQUIPMENT',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800',
    dailyRate: 75,
    weeklyRate: 300,
    location: 'Staten Island, NY',
    rating: 4.5,
    reviews: 15,
    available: false,
    owner: 'Green Thumb',
  },
  // Household & Party
  {
    id: 'r7',
    title: 'Epson 4K Projector',
    category: 'HOUSEHOLD',
    imageUrl: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=800',
    dailyRate: 50,
    weeklyRate: 200,
    location: 'Manhattan, NY',
    rating: 4.9,
    reviews: 67,
    available: true,
    owner: 'Tech Rentals',
  },
  {
    id: 'r8',
    title: 'JBL PartyBox Speaker Set',
    category: 'HOUSEHOLD',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800',
    dailyRate: 75,
    weeklyRate: 275,
    location: 'Brooklyn, NY',
    rating: 4.8,
    reviews: 89,
    available: true,
    owner: 'Party Pro',
  },
  {
    id: 'r9',
    title: 'Folding Tables & Chairs Set (20)',
    category: 'HOUSEHOLD',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    dailyRate: 100,
    weeklyRate: 350,
    location: 'Queens, NY',
    rating: 4.7,
    reviews: 35,
    available: true,
    owner: 'Event Supply',
  },
  // Recreation
  {
    id: 'r10',
    title: 'Electric Mountain Bike',
    category: 'RECREATION',
    imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800',
    dailyRate: 60,
    weeklyRate: 250,
    location: 'Manhattan, NY',
    rating: 4.9,
    reviews: 52,
    available: true,
    owner: 'Bike Share NYC',
  },
  {
    id: 'r11',
    title: 'Sony A7 IV Camera Kit',
    category: 'RECREATION',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    dailyRate: 85,
    weeklyRate: 350,
    location: 'Brooklyn, NY',
    rating: 4.8,
    reviews: 28,
    available: true,
    owner: 'Photo Gear',
  },
  {
    id: 'r12',
    title: 'Camping Gear Complete Set',
    category: 'RECREATION',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    dailyRate: 40,
    weeklyRate: 150,
    location: 'Bronx, NY',
    rating: 4.6,
    reviews: 19,
    available: true,
    owner: 'Outdoor Adventures',
  },
];

const rentalCategories = [
  { value: 'all', label: 'All Categories', icon: Sparkles },
  { value: 'TOOLS', label: 'Tools', icon: Drill },
  { value: 'EQUIPMENT', label: 'Equipment & Vehicles', icon: Tractor },
  { value: 'HOUSEHOLD', label: 'Household & Party', icon: Sofa },
  { value: 'RECREATION', label: 'Recreation', icon: Camera },
];

export default function RentalsPage() {
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['rentals', category],
    queryFn: async () => {
      try {
        const params: any = {};
        if (category !== 'all') params.category = category;
        const response = await rentalsApi.list(params);
        return response.data;
      } catch (e) {
        // Return mock data when API is unavailable
        let filtered = [...mockRentals];
        if (category !== 'all') filtered = filtered.filter(r => r.category === category);
        return { data: filtered };
      }
    },
  });

  const rentals = data?.data || [];

  const filteredRentals = rentals.filter((rental: any) =>
    searchQuery
      ? rental.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rental.location.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-purple w-[400px] h-[400px] top-20 -left-32 opacity-20" />
        <div className="orb orb-cyan w-[300px] h-[300px] bottom-40 -right-20 opacity-15" />
      </div>

      <div className="container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-neon-purple/20 border border-neon-purple/30">
                <Sparkles className="w-4 h-4 text-neon-purple" />
                <span className="text-sm font-medium text-neon-purple">P2P Rentals</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
                Rent <span className="gradient-text">Anything</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Rent tools, equipment, and gear from neighbors. Save money by renting instead of buying. 
                Or list your own items and earn passive income.
              </p>
            </div>
            {isAuthenticated && (
              <Button asChild size="lg" className="gap-2">
                <Link href="/rentals/list">
                  <Plus className="w-5 h-5" />
                  List Your Item
                </Link>
              </Button>
            )}
          </div>
        </motion.div>

        {/* Value Prop Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid md:grid-cols-2 gap-4 mb-8"
        >
          <div className="glass-card p-6 border-neon-green/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-neon-green" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Earn by Lending</h3>
                <p className="text-muted-foreground text-sm">
                  Turn your unused tools, equipment, and gear into passive income. 
                  Set your own rates and availability.
                </p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 border-neon-cyan/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center flex-shrink-0">
                <Wrench className="w-6 h-6 text-neon-cyan" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Save by Renting</h3>
                <p className="text-muted-foreground text-sm">
                  Why buy when you can rent? Access tools and equipment for a fraction 
                  of the cost. Perfect for one-time projects.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {rentalCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                category === cat.value
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground'
              )}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by item or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredRentals.length === 0 ? (
          <div className="text-center py-20">
            <Wrench className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or be the first to list an item.
            </p>
            {isAuthenticated && (
              <Button asChild>
                <Link href="/rentals/list">List Your Item</Link>
              </Button>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredRentals.map((rental: any, index: number) => (
              <motion.div
                key={rental.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  href={`/rentals/${rental.id}`}
                  className="block group glass-card overflow-hidden hover:border-primary/30 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {rental.imageUrl ? (
                      <Image
                        src={rental.imageUrl}
                        alt={rental.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                    {/* Availability Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          rental.available
                            ? 'bg-neon-green/20 text-neon-green'
                            : 'bg-rose-500/20 text-rose-400'
                        )}
                      >
                        {rental.available ? 'Available' : 'Rented'}
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-white/10 backdrop-blur-sm">
                        {rental.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-base mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {rental.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-3 h-3" />
                      <span>{rental.location}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-medium">{rental.rating}</span>
                      <span className="text-muted-foreground text-sm">({rental.reviews})</span>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-neon-green">${rental.dailyRate}</span>
                      <span className="text-sm text-muted-foreground">/day</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        ${rental.weeklyRate}/week
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA for unauthenticated users */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 glass-card p-8 text-center"
          >
            <Wrench className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Have items to rent out?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              List your tools, equipment, or gear and start earning money from items 
              sitting in your garage.
            </p>
            <Button asChild>
              <Link href="/auth/register">
                Create Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}















