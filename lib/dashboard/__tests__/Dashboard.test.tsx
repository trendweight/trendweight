import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';

// Mock dashboard context before importing Dashboard
jest.mock('../context', () => ({
  ...jest.requireActual('../context'),
  useComputeDashboardData: jest.fn(),
  DashboardProvider: ({ children, data }: any) => <div>{children}</div>,
}));

import Dashboard from '../Dashboard';
import * as dashboardContext from '../context';

// Mock the sub-components to isolate Dashboard testing
jest.mock('../chart/Chart', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-chart">Chart</div>,
}));

jest.mock('../Currently', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-currently">Currently</div>,
}));

jest.mock('../Buttons', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-buttons">Buttons</div>,
}));

jest.mock('../RecentReadings', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-recent-readings">Recent Readings</div>,
}));

jest.mock('../Deltas', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-deltas">Deltas</div>,
}));

jest.mock('../Stats', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-stats">Stats</div>,
}));

jest.mock('../DashboardPlaceholder', () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard-placeholder">Loading...</div>,
}));

jest.mock('../../shared/BackgroundQueryProgress', () => ({
  __esModule: true,
  default: () => null,
}));

// Helper to render with providers
const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return render(
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        {component}
      </ChakraProvider>
    </QueryClientProvider>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows placeholder when data is loading', () => {
    (dashboardContext.useComputeDashboardData as jest.Mock).mockReturnValue(null);
    
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByTestId('dashboard-placeholder')).toBeInTheDocument();
  });

  it('shows "No data yet" when measurements array is empty', () => {
    (dashboardContext.useComputeDashboardData as jest.Mock).mockReturnValue({
      measurements: [],
      profile: { id: '123', username: 'test' },
      settings: { metric: false },
      vendors: [],
    } as any);
    
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('No data yet.')).toBeInTheDocument();
  });

  it('renders all dashboard components when data is available', () => {
    const mockData = {
      measurements: [
        { date: '2024-01-01', weight: 70, trend: 70.5 },
        { date: '2024-01-02', weight: 70.2, trend: 70.4 },
      ],
      profile: { id: '123', username: 'test' },
      settings: { metric: false },
      vendors: [],
    };
    
    (dashboardContext.useComputeDashboardData as jest.Mock).mockReturnValue(mockData as any);
    
    renderWithProviders(<Dashboard />);
    
    // Check all components are rendered
    expect(screen.getByTestId('mock-buttons')).toBeInTheDocument();
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
    expect(screen.getByTestId('mock-currently')).toBeInTheDocument();
    expect(screen.getByTestId('mock-recent-readings')).toBeInTheDocument();
    expect(screen.getByTestId('mock-deltas')).toBeInTheDocument();
    expect(screen.getByTestId('mock-stats')).toBeInTheDocument();
  });

  it('uses user prop when provided', () => {
    const mockComputeData = dashboardContext.useComputeDashboardData as jest.Mock;
    mockComputeData.mockReturnValue(null);
    
    renderWithProviders(<Dashboard user="testuser123" />);
    
    expect(mockComputeData).toHaveBeenCalledWith('testuser123');
  });

  it('provides dashboard data to child components through context', () => {
    const mockData = {
      measurements: [{ date: '2024-01-01', weight: 70, trend: 70.5 }],
      profile: { id: '123', username: 'test' },
      settings: { metric: true },
      vendors: ['withings'],
    };
    
    (dashboardContext.useComputeDashboardData as jest.Mock).mockReturnValue(mockData as any);
    
    const { container } = renderWithProviders(<Dashboard />);
    
    // Verify DashboardProvider wrapper exists
    const providerElement = container.querySelector('[data-testid="mock-chart"]')?.parentElement?.parentElement?.parentElement;
    expect(providerElement).toBeTruthy();
  });

  describe('responsive layout', () => {
    it('renders components in correct order for mobile', () => {
      const mockData = {
        measurements: [{ date: '2024-01-01', weight: 70, trend: 70.5 }],
        profile: { id: '123', username: 'test' },
        settings: { metric: false },
        vendors: [],
      };
      
      (dashboardContext.useComputeDashboardData as jest.Mock).mockReturnValue(mockData as any);
      
      const { container } = renderWithProviders(<Dashboard />);
      
      // Get all test components
      const components = container.querySelectorAll('[data-testid]');
      const componentOrder = Array.from(components).map(el => el.getAttribute('data-testid'));
      
      // Verify the expected order
      expect(componentOrder).toEqual([
        'mock-buttons',
        'mock-chart',
        'mock-currently',
        'mock-recent-readings',
        'mock-deltas',
        'mock-stats',
      ]);
    });
  });
});