import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import handler from '../settings';
import { auth } from '../../../lib/data/firebase/admin';
import { db } from '../../../lib/data/firebase/admin';

// Mock Firebase admin
jest.mock('../../../lib/data/firebase/admin', () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
      })),
    })),
  },
}));

describe('/api/settings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('requires authentication', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    const data = JSON.parse(res._getData());
    expect(data.error.code).toBe('auth/missing-token');
  });

  it('returns user settings when authenticated', async () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      settings: {
        metric: true,
        timezone: 'America/New_York',
      },
    };

    // Mock auth verification
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'user123' });
    
    // Mock database response
    const mockGet = jest.fn().mockResolvedValue({
      data: () => mockUser,
    });
    const mockDoc = jest.fn().mockReturnValue({ get: mockGet });
    const mockCollection = jest.fn().mockReturnValue({ doc: mockDoc });
    (db.collection as jest.Mock).mockImplementation(mockCollection);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      headers: {
        authorization: 'Bearer valid-token',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.user).toEqual(mockUser);
    expect(data.timestamp).toBeTruthy();
    
    // Verify Firebase calls
    expect(auth.verifyIdToken).toHaveBeenCalledWith('valid-token');
    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockDoc).toHaveBeenCalledWith('user123');
    expect(mockGet).toHaveBeenCalled();
  });

  it('handles database errors gracefully', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'user123' });
    
    // Mock database error
    const mockGet = jest.fn().mockRejectedValue(new Error('Database connection failed'));
    const mockDoc = jest.fn().mockReturnValue({ get: mockGet });
    const mockCollection = jest.fn().mockReturnValue({ doc: mockDoc });
    (db.collection as jest.Mock).mockImplementation(mockCollection);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      headers: {
        authorization: 'Bearer valid-token',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
  });

  it('handles missing user data', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'user123' });
    
    // Mock empty database response
    const mockGet = jest.fn().mockResolvedValue({
      data: () => undefined,
    });
    const mockDoc = jest.fn().mockReturnValue({ get: mockGet });
    const mockCollection = jest.fn().mockReturnValue({ doc: mockDoc });
    (db.collection as jest.Mock).mockImplementation(mockCollection);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      headers: {
        authorization: 'Bearer valid-token',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.user).toBeUndefined();
    expect(data.timestamp).toBeTruthy();
  });
});