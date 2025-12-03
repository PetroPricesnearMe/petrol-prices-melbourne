/**
 * Mock for sharp - prevents native binding errors in Jest tests
 * Sharp is used by Next.js for image optimization but isn't needed in tests
 */

/* global jest */

module.exports = jest.fn(() => ({
  resize: jest.fn().mockReturnThis(),
  jpeg: jest.fn().mockReturnThis(),
  png: jest.fn().mockReturnThis(),
  webp: jest.fn().mockReturnThis(),
  toBuffer: jest.fn().mockResolvedValue(Buffer.from('mock-image-data')),
  toFile: jest.fn().mockResolvedValue({}),
  metadata: jest.fn().mockResolvedValue({
    width: 100,
    height: 100,
    format: 'jpeg',
  }),
}));

