import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency = 'USD',
  options?: Intl.NumberFormatOptions
) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  }).format(amount);
}

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
) {
  return new Intl.NumberFormat('en-US', options).format(value);
}

export function formatPercent(value: number, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function calculateProgress(current: number, target: number) {
  if (target === 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

// Enhanced category labels for Marketplace (Own → Earn)
export function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    // Core Infrastructure
    GPU_CLUSTER: 'AI & Compute',
    SOLAR_PLANT: 'Solar Energy',
    BATTERY_STORAGE: 'Battery Storage',
    EV_CHARGING: 'EV Charging',
    
    // Mobility
    MOBILITY_FLEET: 'Mobility Fleet',
    MICROMOBILITY: 'Micromobility',
    
    // Automated Systems
    AUTOMATED_RESTAURANT: 'Automated QSR',
    INDUSTRIAL_ROBOTICS: 'Robotics',
    
    // Service Businesses
    CAR_WASH: 'Car Wash',
    LAUNDROMAT: 'Laundromat',
    COFFEE_SHOP: 'Coffee Shop',
    GYM: 'Fitness',
    QSR: 'Restaurant',
    
    // Retail & Finance Infrastructure
    VENDING_MACHINE: 'Vending',
    ATM: 'ATM Network',
    
    // Storage & Logistics
    STORAGE_UNIT: 'Storage',
    MICRO_WAREHOUSE: 'Warehouse',
    
    // Compute & Rendering
    RENDER_FARM: 'Render Farm',
    
    // Government
    GOVERNMENT: 'Gov Infrastructure',
    
    // Legacy
    OTHER: 'Other',
  };
  return labels[category] || category;
}

// Enhanced lendable type labels for Lending (Lend → Earn)
export function getLendableTypeLabel(type: string) {
  const labels: Record<string, string> = {
    // Compute
    GPU: 'GPU Compute',
    CPU: 'CPU Cycles',
    RENDER: 'Rendering',
    ML_TRAINING: 'ML Training',
    
    // Energy
    SOLAR: 'Solar Energy',
    BATTERY: 'Battery',
    WIND: 'Wind Energy',
    
    // Vehicles
    VEHICLE: 'Vehicle',
    EV: 'Electric Vehicle',
    TRUCK: 'Truck/Van',
    
    // Mobility
    SCOOTER: 'E-Scooter',
    BIKE: 'E-Bike',
    
    // Tools & Equipment
    TOOLS: 'Tools',
    POWER_TOOLS: 'Power Tools',
    PRESSURE_WASHER: 'Pressure Washer',
    SNOW_EQUIPMENT: 'Snow Equipment',
    CONSTRUCTION: 'Construction',
    
    // HomeHub - Household Items
    CAMERA: 'Camera',
    DRONE: 'Drone',
    '3D_PRINTER': '3D Printer',
    GAMING_PC: 'Gaming PC',
    PROJECTOR: 'Projector',
    CAMPING: 'Camping Gear',
    INSTRUMENTS: 'Instruments',
    ELECTRONICS: 'Electronics',
    FURNITURE: 'Furniture',
    APPLIANCES: 'Appliances',
    
    // Business/Industrial
    COLD_STORAGE: 'Cold Storage',
    WAREHOUSE: 'Warehouse Space',
    STORAGE: 'Storage',
    
    // IoT & Sensors
    SENSOR: 'IoT Sensor',
    TRAFFIC_CAMERA: 'Traffic Camera',
    
    // Robotics
    DELIVERY_ROBOT: 'Delivery Robot',
    BATTERY_SWAP: 'Battery Swap',
    
    // Legacy
    OTHER: 'Other',
  };
  return labels[type] || type;
}

export function getRiskColor(rating: string) {
  switch (rating) {
    case 'LOW':
      return 'text-emerald-400';
    case 'MEDIUM':
      return 'text-amber-400';
    case 'HIGH':
      return 'text-rose-400';
    default:
      return 'text-muted-foreground';
  }
}

export function getRiskBgColor(rating: string) {
  switch (rating) {
    case 'LOW':
      return 'bg-emerald-400/10 border-emerald-400/20';
    case 'MEDIUM':
      return 'bg-amber-400/10 border-amber-400/20';
    case 'HIGH':
      return 'bg-rose-400/10 border-rose-400/20';
    default:
      return 'bg-muted/10 border-muted/20';
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'FUNDING':
    case 'OPEN':
    case 'ACTIVE':
      return 'bg-emerald-500/20 text-emerald-400';
    case 'LIVE':
      return 'bg-neon-cyan/20 text-neon-cyan';
    case 'PENDING':
    case 'DRAFT':
    case 'PENDING_APPROVAL':
      return 'bg-amber-500/20 text-amber-400';
    case 'CLOSED':
    case 'INACTIVE':
    case 'ARCHIVED':
      return 'bg-gray-500/20 text-gray-400';
    case 'CONFIRMED':
      return 'bg-emerald-500/20 text-emerald-400';
    case 'CANCELLED':
    case 'REJECTED':
      return 'bg-rose-500/20 text-rose-400';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
}

export function truncateAddress(address: string, chars = 4) {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Format earning basis for lendable assets
export function formatEarningBasis(basis: string, revenueModel: string) {
  const modelLabels: Record<string, string> = {
    FLAT_FEE: 'Fixed monthly',
    REV_SHARE: 'Revenue share',
    PER_UNIT: 'Per usage',
  };
  return `${modelLabels[revenueModel] || revenueModel} - ${basis}`;
}

// Get category color for visual differentiation
export function getCategoryColor(category: string) {
  const colors: Record<string, { text: string; bg: string; border: string }> = {
    GPU_CLUSTER: { text: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/20' },
    EV_CHARGING: { text: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/20' },
    SOLAR_PLANT: { text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
    BATTERY_STORAGE: { text: 'text-neon-cyan', bg: 'bg-neon-cyan/10', border: 'border-neon-cyan/20' },
    MOBILITY_FLEET: { text: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    MICROMOBILITY: { text: 'text-lime-400', bg: 'bg-lime-400/10', border: 'border-lime-400/20' },
    AUTOMATED_RESTAURANT: { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
    INDUSTRIAL_ROBOTICS: { text: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
    CAR_WASH: { text: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20' },
    COFFEE_SHOP: { text: 'text-amber-600', bg: 'bg-amber-600/10', border: 'border-amber-600/20' },
    GYM: { text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  };
  return colors[category] || { text: 'text-foreground', bg: 'bg-white/5', border: 'border-white/10' };
}
