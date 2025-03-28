import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AdminContactPage from '@/app/admin/contact/page';
import * as api from '@/lib/api';

// Mock the API functions
jest.mock('@/lib/api', () => ({
  getContactSubmissions: jest.fn(),
  markContactAsRead: jest.fn(),
  deleteContactSubmission: jest.fn(),
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
}));

// Mock window.confirm
global.confirm = jest.fn().mockImplementation(() => true);

describe('AdminContactPage', () => {
  beforeEach(() => {
    // Mock API responses
    (api.getContactSubmissions as jest.Mock).mockResolvedValue({
      data: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Hello, I would like to discuss a project.',
          read: false,
          created_at: '2025-03-20T12:00:00Z',
          updated_at: '2025-03-20T12:00:00Z',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          message: 'I have a question about your services.',
          read: true,
          created_at: '2025-03-19T10:00:00Z',
          updated_at: '2025-03-19T10:00:00Z',
        },
      ],
      meta: {
        total: 2,
        page: 1,
        limit: 50,
        totalPages: 1,
      },
    });

    (api.markContactAsRead as jest.Mock).mockResolvedValue({
      id: '1',
      read: true,
    });

    (api.deleteContactSubmission as jest.Mock).mockResolvedValue({
      success: true,
    });
  });

  it('renders the contact submissions page', async () => {
    render(<AdminContactPage />);
    
    // Initially shows loading state
    expect(screen.getByText('Loading contact submissions...')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Contact Submissions')).toBeInTheDocument();
    });
    
    // Check for contact submissions
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Hello, I would like to discuss a project.')).toBeInTheDocument();
    
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('I have a question about your services.')).toBeInTheDocument();
    
    // Check for unread badge
    expect(screen.getByText('New')).toBeInTheDocument();
    
    // Check for action buttons
    expect(screen.getByText('Mark as Read')).toBeInTheDocument();
    expect(screen.getAllByText('Delete').length).toBe(2);
  });

  it('handles marking a submission as read', async () => {
    render(<AdminContactPage />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Contact Submissions')).toBeInTheDocument();
    });
    
    // Click the "Mark as Read" button
    fireEvent.click(screen.getByText('Mark as Read'));
    
    // Verify the API was called
    expect(api.markContactAsRead).toHaveBeenCalledWith('1');
  });

  it('handles deleting a submission', async () => {
    render(<AdminContactPage />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Contact Submissions')).toBeInTheDocument();
    });
    
    // Click the first "Delete" button
    fireEvent.click(screen.getAllByText('Delete')[0]);
    
    // Verify the confirmation dialog was shown
    expect(global.confirm).toHaveBeenCalled();
    
    // Verify the API was called
    expect(api.deleteContactSubmission).toHaveBeenCalledWith('1');
  });
});