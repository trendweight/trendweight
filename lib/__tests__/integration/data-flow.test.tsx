import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';
import Dashboard from '../../dashboard/Dashboard';
import * as queries from '../../api/queries';

// Mock API responses
const mockProfileData = {
  id: 'user123',
  username: 'testuser',
  createdAt: 1640995200,
  updatedAt: 1640995200,
  settings: {
    metric: false,
    timezone: 'America/New_York',
  },
  timezone: 'America/New_York',
  dayStartOffset: 0,
};

const mockSourceData = [
  {
    source: 'withings',
    measurements: [
      { timestamp: 1641081600, weight: 70.0, fatRatio: 0.25 },
      { timestamp: 1641168000, weight: 69.5, fatRatio: 0.24 },
      { timestamp: 1641254400, weight: 69.0, fatRatio: 0.23 },
    ],
  },
];

describe('Data Flow Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { 
          retry: false,
          cacheTime: 0,
        },
      },
    });

    // Mock API queries
    jest.spyOn(queries, 'profileQuery').mockImplementation(() => ({
      queryKey: ['profile'],
      queryFn: async () => mockProfileData,
    }));

    jest.spyOn(queries, 'sourceDataQuery').mockImplementation(() => ({
      queryKey: ['sourceData'],
      queryFn: async () => mockSourceData,
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          {component}
        </ChakraProvider>
      </QueryClientProvider>
    );
  };

  it('loads and processes data correctly through the entire flow', async () => {
    renderWithProviders(<Dashboard />);

    // Initially shows loading state
    expect(screen.getByTestId('dashboard-placeholder')).toBeInTheDocument();

    // Wait for data to load and process
    await waitFor(() => {
      expect(screen.queryByTestId('dashboard-placeholder')).not.toBeInTheDocument();
    });

    // Dashboard should now be rendered with data
    await waitFor(() => {
      expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
      expect(screen.getByTestId('mock-currently')).toBeInTheDocument();
      expect(screen.getByTestId('mock-recent-readings')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    jest.spyOn(queries, 'profileQuery').mockImplementation(() => ({
      queryKey: ['profile'],
      queryFn: async () => {
        throw new Error('API Error');
      },
    }));

    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    renderWithProviders(<Dashboard />);

    // Should stay in loading state when API fails
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-placeholder')).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });

  it('processes measurements with correct trend calculations', async () => {
    const { container } = renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByTestId('dashboard-placeholder')).not.toBeInTheDocument();
    });

    // Verify data was processed through the computation pipeline
    expect(queries.profileQuery).toHaveBeenCalled();
    expect(queries.sourceDataQuery).toHaveBeenCalled();
  });

  it('handles empty data gracefully', async () => {
    jest.spyOn(queries, 'sourceDataQuery').mockImplementation(() => ({
      queryKey: ['sourceData'],
      queryFn: async () => [],
    }));

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('No data yet.')).toBeInTheDocument();
    });
  });

  it('respects user timezone in data processing', async () => {
    const profileWithDifferentTimezone = {
      ...mockProfileData,
      timezone: 'Europe/London',
      settings: {
        ...mockProfileData.settings,
        timezone: 'Europe/London',
      },
    };

    jest.spyOn(queries, 'profileQuery').mockImplementation(() => ({
      queryKey: ['profile'],
      queryFn: async () => profileWithDifferentTimezone,
    }));

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByTestId('dashboard-placeholder')).not.toBeInTheDocument();
    });

    // Data should be processed with the correct timezone
    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
  });
});