import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProfileEditPage from '@/app/admin/profile/page';
import * as api from '@/lib/api';

// Mock the API functions
jest.mock('@/lib/api', () => ({
  getAdminProfile: jest.fn(),
  updateProfile: jest.fn(),
  uploadImage: jest.fn(),
}));

// Mock Cookies.get to return a token
jest.mock('js-cookie', () => ({
  get: jest.fn().mockReturnValue('mock-token'),
}));

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({}),
}));

describe('ProfileEditPage', () => {
  beforeEach(() => {
    // Mock API responses
    (api.getAdminProfile as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'John Doe',
      title: 'Product Manager',
      bio: 'Experienced product manager with 10+ years of experience',
      image_url: 'https://example.com/image.jpg',
      work_experiences: [
        {
          id: '1',
          profile_id: '1',
          title: 'Senior Product Manager',
          company: 'Acme Inc',
          period: '2020 - Present',
          description: 'Leading product initiatives',
          order: 0,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ],
      education: [
        {
          id: '1',
          profile_id: '1',
          degree: 'MBA',
          institution: 'Harvard University',
          year: '2015',
          order: 0,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ],
      skills: [
        {
          id: '1',
          profile_id: '1',
          category: 'Technical Skills',
          items: ['JavaScript', 'TypeScript', 'React'],
          order: 0,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ],
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    });

    (api.updateProfile as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'John Doe Updated',
    });

    (api.uploadImage as jest.Mock).mockResolvedValue('https://example.com/new-image.jpg');
  });

  it('renders the profile edit page', async () => {
    render(<ProfileEditPage />);
    
    // Initially shows loading state
    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
    
    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });
    
    // Check for basic information section
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Bio')).toBeInTheDocument();
    
    // Check for work experience section
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Senior Product Manager')).toBeInTheDocument();
    });
    
    // Check for education section
    expect(screen.getByText('Education')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Harvard University')).toBeInTheDocument();
    });
    
    // Check for skills section
    expect(screen.getByText('Skills')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Technical Skills')).toBeInTheDocument();
    });
    
    // Check for save button
    expect(screen.getByText('Save Profile')).toBeInTheDocument();
  });
});