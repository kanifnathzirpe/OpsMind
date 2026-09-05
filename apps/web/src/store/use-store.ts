import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FilterState {
  search?: string;
  status?: string;
  gateway?: string;
  currency?: string;
  country?: string;
  minAmount?: number;
  maxAmount?: number;
  riskLevel?: string;
  preset?: string;
}

interface AppState {
  // Multi-Workspace state
  workspaceId: string;
  setWorkspaceId: (id: string) => void;

  // Organization state
  organization: string | null;
  setOrganization: (orgId: string) => void;

  // Theme state
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;

  // Notification state
  notificationCount: number;
  setNotificationCount: (count: number) => void;
  incrementNotificationCount: () => void;
  archivedNotificationIds: string[];
  archiveNotification: (id: string) => void;
  deletedNotificationIds: string[];
  deleteNotification: (id: string) => void;

  // User preferences
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  chartView: 'area' | 'bar' | 'line';
  setChartView: (view: 'area' | 'bar' | 'line') => void;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;

  // Dashboard filters & persistence
  dateRange: string;
  setDateRange: (range: string) => void;
  advancedFilters: FilterState;
  setAdvancedFilters: (filters: Partial<FilterState>) => void;
  resetAdvancedFilters: () => void;

  // Realtime mode
  realtimeMode: boolean;
  setRealtimeMode: (enabled: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Multi-Workspace
      workspaceId: 'm_1',
      setWorkspaceId: (id) => set({ workspaceId: id }),

      // Organization
      organization: null,
      setOrganization: (orgId) => set({ organization: orgId }),

      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),

      // Notifications
      notificationCount: 3,
      setNotificationCount: (count) => set({ notificationCount: count }),
      incrementNotificationCount: () =>
        set((state) => ({ notificationCount: state.notificationCount + 1 })),
      archivedNotificationIds: [],
      archiveNotification: (id) =>
        set((state) => ({
          archivedNotificationIds: [...state.archivedNotificationIds, id],
        })),
      deletedNotificationIds: [],
      deleteNotification: (id) =>
        set((state) => ({
          deletedNotificationIds: [...state.deletedNotificationIds, id],
        })),

      // User preferences
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      chartView: 'area',
      setChartView: (view) => set({ chartView: view }),
      isCopilotOpen: false,
      setIsCopilotOpen: (open) => set({ isCopilotOpen: open }),

      // Dashboard filters
      dateRange: 'Last 30 Days',
      setDateRange: (range) => set({ dateRange: range }),
      advancedFilters: {},
      setAdvancedFilters: (filters) =>
        set((state) => ({
          advancedFilters: { ...state.advancedFilters, ...filters },
        })),
      resetAdvancedFilters: () => set({ advancedFilters: {} }),

      // Realtime mode
      realtimeMode: true,
      setRealtimeMode: (enabled) => set({ realtimeMode: enabled }),
    }),
    {
      name: 'opsmind-enterprise-storage',
      partialize: (state) => ({
        workspaceId: state.workspaceId,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        chartView: state.chartView,
        dateRange: state.dateRange,
        advancedFilters: state.advancedFilters,
        realtimeMode: state.realtimeMode,
        isCopilotOpen: state.isCopilotOpen,
        archivedNotificationIds: state.archivedNotificationIds,
        deletedNotificationIds: state.deletedNotificationIds,
      }),
    }
  )
);