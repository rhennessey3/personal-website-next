import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminDashboard from '@/app/admin/page';
import * as api from '@/lib/api';

// Mock the API functions
jest.mock('@/lib/api', () => ({
  getAdminCaseStudies: jest.fn(),
  getAdminBlogPosts: jest.fn(),
  getContactSubmissions: jest.fn(),
  getAdminProfile: jest.fn(),
  logout: jest.fn(),
}));

// Mock Cookies.get to return a token
jest.mock('js-cookie', () => ({
  get: jest.fn().mockReturnValue('mock-token'),
  remove: jest.fn(),
}));

// Mock localStorage.getItem to return user info
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn().mockReturnValue(JSON.stringify({ id: '1', email: 'admin@example.com', role: 'admin' })),
    removeItem: jest.fn(),
  },
});

describe('AdminDashboard', () => {
  beforeEach(() => {
    // Mock API responses
    (api.getAdminCaseStudies as jest.Mock).mockResolvedValue({
      data: [
        { id: '1', title: 'Case Study 1', published: true },
        { id: '2', title: 'Case Study 2', published: false },
      ],
      meta: { total: 2 }
    });
    
    (api.getAdminBlogPosts as jest.Mock).mockResolvedValue({
      data: [
        { id: '1', title: 'Blog Post 1', published: true },
        { id: '2', title: 'Blog Post 2', published: false },
      ],
      meta: { total: 2 }
    });
    
    (api.getContactSubmissions as jest.Mock).mockResolvedValue({
      data: [
        { id: '1', name: 'John Doe', email: 'john@example.com', read: false },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', read: true },
      ],
      meta: { total: 2 }
    });
    
    (api.getAdminProfile as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Admin User',
      updated_at: '2025-03-25T12:00:00Z'
    });
  });

  it('renders the admin dashboard', async () => {
    render(<AdminDashboard />);
    
    // Check for the heading
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    
    // Check for user info
    expect(screen.getByText(/Logged in as: admin@example.com/)).toBeInTheDocument();
    
    // Wait for data to load
    await screen.findByText('Case Studies');
    await screen.findByText('Blog Posts');
    await screen.findByText('Profile');
    await screen.findByText('Contact Submissions');
    
    // Check for logout button
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});