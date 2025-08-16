import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Formik, FormikProvider } from 'formik';
import PatientSelection from '../index';

// Mock the API response
const mockPatientsResponse = {
  success: true,
  data: {
    data: [
      {
        uid: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        image: '/avatar1.jpg',
      },
      {
        uid: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '0987654321',
        image: '/avatar2.jpg',
      },
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 2,
      hasNextPage: false,
      totalPages: 1,
    },
  },
  message: 'Patients fetched successfully',
};

// Mock the API function
jest.mock('@/services/api/patient', () => ({
  getPatientsWithPagination: jest.fn(() => Promise.resolve(mockPatientsResponse)),
}));

// Mock the infinite query hook
jest.mock('@/services/patient', () => ({
  usePatientsInfiniteQuery: jest.fn(() => ({
    data: {
      pages: [mockPatientsResponse.data],
    },
    isLoading: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: jest.fn(),
    isError: false,
    error: null,
  })),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const formikProps = {
    initialValues: {
      appointment: {
        patient: undefined,
      },
      meta: {
        currentStep: 0,
      },
    },
    onSubmit: jest.fn(),
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Formik {...formikProps}>
        <FormikProvider value={formikProps as any}>{children}</FormikProvider>
      </Formik>
    </QueryClientProvider>
  );
};

describe('PatientSelection Infinite Query', () => {
  it('should render patient list with infinite query', async () => {
    render(
      <TestWrapper>
        <PatientSelection />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should show search input', () => {
    render(
      <TestWrapper>
        <PatientSelection />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Search by name, email, phone or UID')).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    // Mock loading state
    jest.mocked(require('@/services/patient').usePatientsInfiniteQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <PatientSelection />
      </TestWrapper>
    );

    // The component should show loading skeleton
    expect(screen.getByTestId('selection-skeleton')).toBeInTheDocument();
  });
});
