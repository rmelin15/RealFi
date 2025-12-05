'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Wallet,
  LayoutDashboard,
  Building2,
  Cpu,
  Gift,
  LogOut,
  User,
  Coins,
  Leaf,
  TrendingUp,
  Sparkles,
  Target,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth-store';

const navigation = [
  { name: 'Explore', href: '/explore' },
  { name: 'Lend & Earn', href: '/lend' },
  {
    name: 'Invest',
    href: '#',
    children: [
      { 
        name: 'Royalties & Contracts', 
        href: '/royalties', 
        icon: Coins,
        description: 'Tokenized cash flows',
        badge: 'New'
      },
      { 
        name: 'Municipal Projects', 
        href: '/municipal', 
        icon: Building2,
        description: 'Civic infrastructure',
        badge: 'New'
      },
    ],
  },
  {
    name: 'Rewards',
    href: '/rewards',
    icon: Gift,
    badge: 'New',
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b border-white/5">
        <nav className="container flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <span className="font-bold text-background text-sm">RF</span>
            </div>
            <span className="font-display font-bold text-lg">RealFi</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) =>
              item.children ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-1">
                      {item.name}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-64">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.name} asChild className="p-0">
                        <Link 
                          href={child.href} 
                          className="flex items-start gap-3 p-3 w-full hover:bg-white/5 rounded-lg"
                        >
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center flex-shrink-0">
                            <child.icon className="w-4 h-4 text-neon-cyan" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{child.name}</span>
                              {child.badge && (
                                <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-neon-green/20 text-neon-green">
                                  {child.badge}
                                </span>
                              )}
                            </div>
                            {child.description && (
                              <span className="text-xs text-muted-foreground">
                                {child.description}
                              </span>
                            )}
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  key={item.name}
                  variant="ghost"
                  asChild
                  className={cn(
                    'gap-2',
                    pathname === item.href && 'bg-white/5 text-primary'
                  )}
                >
                  <Link href={item.href}>
                    {item.name}
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-neon-green/20 text-neon-green">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </Button>
              )
            )}
          </div>

          {/* Auth / Wallet */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/portfolio">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Portfolio
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                        <User className="w-4 h-4 text-background" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user?.firstName} {user?.lastName}</span>
                        <span className="text-xs text-muted-foreground">
                          {user?.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/portfolio">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Portfolio
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/rewards">
                        <Gift className="w-4 h-4 mr-2" />
                        Impact Points
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <User className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">
                    <Wallet className="w-4 h-4 mr-2" />
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden glass border-b border-white/5"
        >
          <div className="container py-4 space-y-2">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.name} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                    {item.name}
                  </div>
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                        <child.icon className="w-4 h-4 text-neon-cyan" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{child.name}</span>
                          {child.badge && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-neon-green/20 text-neon-green">
                              {child.badge}
                            </span>
                          )}
                        </div>
                        {child.description && (
                          <span className="text-xs text-muted-foreground">
                            {child.description}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5',
                    pathname === item.href && 'bg-white/5 text-primary'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-neon-green/20 text-neon-green">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            )}
            <div className="pt-4 border-t border-white/5 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/portfolio"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Portfolio
                  </Link>
                  <Link
                    href="/rewards"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Gift className="w-4 h-4" />
                    Impact Points
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-white/5 text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 rounded-lg hover:bg-white/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-3 py-2 rounded-lg bg-primary text-primary-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
