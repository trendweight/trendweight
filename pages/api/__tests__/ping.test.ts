import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';

// Mock Firebase admin before importing handler
jest.mock('../../../lib/data/firebase/admin', () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
  db: {
    collection: jest.fn(),
  },
}));

import handler from '../ping';

describe('/api/ping', () => {
  it('should return current date and 200 status', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const jsonData = JSON.parse(res._getData());
    expect(jsonData).toHaveProperty('now');
    expect(new Date(jsonData.now)).toBeInstanceOf(Date);
  });

  it('should work without authentication', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      headers: {
        // No authorization header
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
  });
});