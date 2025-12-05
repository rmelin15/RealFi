import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          const user = useAuthStore.getState().user;

          if (user) {
            useAuthStore.getState().setAuth(user, accessToken, newRefreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    country?: string;
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  me: () => api.get('/auth/me'),
};

// Assets API
export const assetsApi = {
  list: (params?: {
    category?: string;
    status?: string;
    riskRating?: string;
    region?: string;
    minYield?: number;
    maxYield?: number;
    page?: number;
    limit?: number;
  }) => api.get('/assets', { params }),

  get: (id: string) => api.get(`/assets/${id}`),

  getStats: () => api.get('/assets/stats'),
};

// Offerings API
export const offeringsApi = {
  list: (params?: {
    status?: string;
    assetId?: string;
    page?: number;
    limit?: number;
  }) => api.get('/offerings', { params }),

  get: (id: string) => api.get(`/offerings/${id}`),

  subscribe: (offeringId: string, amount: number) =>
    api.post(`/offerings/${offeringId}/subscribe`, { amount }),
};

// Lendable Assets API
export const lendableAssetsApi = {
  list: (params?: {
    assetType?: string;
    status?: string;
    revenueModel?: string;
    region?: string;
    minYield?: number;
    maxYield?: number;
    page?: number;
    limit?: number;
  }) => api.get('/lendable-assets', { params }),

  get: (id: string) => api.get(`/lendable-assets/${id}`),

  create: (data: any) => api.post('/lendable-assets', data),

  getPerformance: (id: string) => api.get(`/lendable-assets/${id}/performance`),

  getStats: () => api.get('/lendable-assets/stats'),
};

// Portfolio API
export const portfolioApi = {
  getSummary: () => api.get('/portfolio'),

  getPositions: () => api.get('/portfolio/positions'),

  getLendable: () => api.get('/portfolio/lendable'),

  getRewards: () => api.get('/portfolio/rewards'),
};

// ============================================================================
// ROYALTIES & CONTRACTS API
// ============================================================================
export const royaltiesApi = {
  list: (params?: {
    category?: string;
    riskBand?: string;
    subcategory?: string;
    minApy?: number;
    maxApy?: number;
    page?: number;
    limit?: number;
  }) => api.get('/royalties', { params }),

  get: (id: string) => api.get(`/royalties/${id}`),

  getStats: () => api.get('/royalties/stats'),

  getCashFlowProjection: (id: string, years: number) =>
    api.get(`/royalties/${id}/projection`, { params: { years } }),

  getRevenueHistory: (id: string) => api.get(`/royalties/${id}/revenue-history`),

  subscribe: (id: string, tokenAmount: number) =>
    api.post(`/royalties/${id}/subscribe`, { tokenAmount }),
};

// ============================================================================
// MUNICIPAL PROJECTS API
// ============================================================================
export const municipalApi = {
  list: (params?: {
    projectType?: string;
    city?: string;
    region?: string;
    status?: string;
    isLocal?: boolean;
    page?: number;
    limit?: number;
  }) => api.get('/municipal-projects', { params }),

  get: (id: string) => api.get(`/municipal-projects/${id}`),

  getByCity: (city: string) => api.get(`/municipal-projects/city/${city}`),

  getStats: () => api.get('/municipal-projects/stats'),

  invest: (id: string, amount: number) =>
    api.post(`/municipal-projects/${id}/invest`, { amount }),

  getImpactMetrics: (id: string) =>
    api.get(`/municipal-projects/${id}/impact`),

  // Municipal Rewards
  getMunicipalPoints: () => api.get('/municipal-rewards/points'),

  getMunicipalTier: () => api.get('/municipal-rewards/tier'),

  getRedemptionOptions: () => api.get('/municipal-rewards/redemption-options'),

  redeemReward: (rewardId: string, points: number) =>
    api.post('/municipal-rewards/redeem', { rewardId, points }),
};

// ============================================================================
// ESG REWARDS API
// ============================================================================
export const rewardsApi = {
  // User rewards data
  getUserStats: () => api.get('/rewards/user-stats'),

  getPointsBalance: () => api.get('/rewards/balance'),

  getPointsHistory: (params?: {
    page?: number;
    limit?: number;
    category?: string;
  }) => api.get('/rewards/history', { params }),

  // Earning actions
  getEarningCategories: () => api.get('/rewards/earning-categories'),

  logAction: (data: {
    categoryId: string;
    actionId: string;
    quantity?: number;
    metadata?: Record<string, any>;
  }) => api.post('/rewards/log-action', data),

  // Challenges
  getActiveChallenges: () => api.get('/rewards/challenges/active'),

  getSeasonalChallenges: () => api.get('/rewards/challenges/seasonal'),

  joinChallenge: (challengeId: string) =>
    api.post(`/rewards/challenges/${challengeId}/join`),

  getChallengeProgress: (challengeId: string) =>
    api.get(`/rewards/challenges/${challengeId}/progress`),

  // Streaks
  getCurrentStreak: () => api.get('/rewards/streak'),

  // Leaderboards
  getIndividualLeaderboard: (params?: { limit?: number; timeframe?: string }) =>
    api.get('/rewards/leaderboard/individual', { params }),

  getCityLeaderboard: (params?: { limit?: number; timeframe?: string }) =>
    api.get('/rewards/leaderboard/city', { params }),

  getNeighborhoodScore: () => api.get('/rewards/neighborhood-score'),

  // Redemption
  getRedemptionCategories: () => api.get('/rewards/redemption'),

  redeemPoints: (data: {
    optionId: string;
    points: number;
  }) => api.post('/rewards/redeem', data),

  getRedemptionHistory: () => api.get('/rewards/redemption-history'),

  // Carbon dashboard
  getCarbonImpact: () => api.get('/rewards/carbon-impact'),

  getCarbonHistory: (params?: { months?: number }) =>
    api.get('/rewards/carbon-history', { params }),

  // Smart city integrations
  connectSmartDevice: (deviceType: string, deviceId: string) =>
    api.post('/rewards/smart-city/connect', { deviceType, deviceId }),

  getConnectedDevices: () => api.get('/rewards/smart-city/devices'),

  syncDeviceData: (deviceId: string) =>
    api.post(`/rewards/smart-city/devices/${deviceId}/sync`),
};

// ============================================================================
// INSTRUMENTS API (Combined Coming Soon)
// ============================================================================
export const instrumentsApi = {
  getRoyaltyStreams: (params?: { page?: number; limit?: number }) =>
    api.get('/royalty-streams', { params }),

  getContractInstruments: (params?: { page?: number; limit?: number }) =>
    api.get('/contract-instruments', { params }),

  getMunicipalProjects: (params?: { 
    page?: number; 
    limit?: number;
    projectType?: string;
  }) => api.get('/municipal-projects', { params }),

  getRewardPrograms: (params?: { page?: number; limit?: number }) =>
    api.get('/rewards/programs', { params }),

  getComingSoonStats: () => api.get('/coming-soon/stats'),
};

// ============================================================================
// RENTALS API (P2P Marketplace)
// ============================================================================
export const rentalsApi = {
  list: (params?: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    available?: boolean;
    page?: number;
    limit?: number;
  }) => api.get('/rentals', { params }),

  get: (id: string) => api.get(`/rentals/${id}`),

  create: (data: any) => api.post('/rentals', data),

  update: (id: string, data: any) => api.patch(`/rentals/${id}`, data),

  delete: (id: string) => api.delete(`/rentals/${id}`),

  book: (id: string, data: { startDate: string; endDate: string }) =>
    api.post(`/rentals/${id}/book`, data),

  getMyListings: () => api.get('/rentals/my-listings'),

  getMyBookings: () => api.get('/rentals/my-bookings'),
};
