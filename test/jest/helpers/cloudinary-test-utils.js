/**
 * Cloudinary Test Utilities
 * Helper functions for testing Cloudinary integration
 */

export const createMockCloudinaryUploadResponse = (overrides = {}) => {
  return {
    public_id: 'HoseaCodes/test-image',
    version: 1234567890,
    signature: 'abc123def456',
    width: 800,
    height: 600,
    format: 'jpg',
    resource_type: 'image',
    created_at: '2024-01-01T00:00:00Z',
    tags: [],
    bytes: 102400,
    type: 'upload',
    etag: 'abc123def456',
    placeholder: false,
    url: 'http://res.cloudinary.com/test/image/upload/v1234567890/HoseaCodes/test-image.jpg',
    secure_url: 'https://res.cloudinary.com/test/image/upload/v1234567890/HoseaCodes/test-image.jpg',
    folder: 'HoseaCodes',
    original_filename: 'test-image',
    ...overrides
  };
};

export const createMockCloudinarySearchResponse = (overrides = {}) => {
  return {
    total_count: 10,
    time: 125,
    resources: [
      {
        public_id: 'HoseaCodes/image1',
        format: 'jpg',
        version: 1234567890,
        resource_type: 'image',
        type: 'upload',
        created_at: '2024-01-01T00:00:00Z',
        uploaded_at: '2024-01-01T00:00:00Z',
        bytes: 102400,
        width: 800,
        height: 600,
        secure_url: 'https://res.cloudinary.com/test/image/upload/v1234567890/HoseaCodes/image1.jpg'
      },
      {
        public_id: 'HoseaCodes/image2',
        format: 'png',
        version: 1234567891,
        resource_type: 'image',
        type: 'upload',
        created_at: '2024-01-02T00:00:00Z',
        uploaded_at: '2024-01-02T00:00:00Z',
        bytes: 204800,
        width: 1024,
        height: 768,
        secure_url: 'https://res.cloudinary.com/test/image/upload/v1234567891/HoseaCodes/image2.png'
      }
    ],
    next_cursor: 'next-cursor-token',
    ...overrides
  };
};

export const createMockCloudinaryUsageResponse = (overrides = {}) => {
  return {
    media_count: 150,
    media_limit: 1000,
    media_usage: 0.15,
    transformations_count: 500,
    transformations_limit: 100000,
    transformations_usage: 0.005,
    bytes_stored: 5000000,
    bytes_stored_limit: 104857600,
    bytes_stored_usage: 0.048,
    bandwidth_used: 10000000,
    bandwidth_limit: 104857600,
    bandwidth_usage: 0.095,
    requests: 50000,
    requests_limit: 1000000,
    requests_usage: 0.05,
    resources: [
      {
        resources_by_type: {
          image: 150,
          video: 0,
          raw: 0
        },
        storage_bytes_by_resource_type: {
          image: 5000000,
          video: 0,
          raw: 0
        }
      }
    ],
    last_reset: '2024-01-01T00:00:00Z',
    ...overrides
  };
};

export const createMockCloudinaryDestroyResponse = (overrides = {}) => {
  return {
    result: 'ok',
    ...overrides
  };
};

export const createMockCloudinaryExplicitResponse = (overrides = {}) => {
  return {
    public_id: 'HoseaCodes/test-image',
    version: 1234567890,
    signature: 'abc123def456',
    width: 800,
    height: 600,
    format: 'jpg',
    resource_type: 'image',
    created_at: '2024-01-01T00:00:00Z',
    type: 'upload',
    bytes: 102400,
    url: 'http://res.cloudinary.com/test/image/upload/v1234567890/HoseaCodes/test-image.jpg',
    secure_url: 'https://res.cloudinary.com/test/image/upload/v1234567890/HoseaCodes/test-image.jpg',
    context: {
      alt_text: 'Test image description'
    },
    ...overrides
  };
};

export const createMockRequest = (overrides = {}) => {
  return {
    query: {},
    body: {},
    params: {},
    headers: {
      'content-type': 'application/json'
    },
    files: {},
    ...overrides
  };
};

export const createMockResponse = (overrides = {}) => {
  const response = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    ...overrides
  };

  return response;
};

export const createMockFile = (overrides = {}) => {
  return {
    name: 'test-image.jpg',
    size: 2 * 1024 * 1024,
    mimetype: 'image/jpeg',
    tempFilePath: '/tmp/test-image.jpg',
    ...overrides
  };
};

export const mockCloudinaryUploader = (mockImplementations = {}) => {
  return {
    upload: jest.fn().mockImplementation(
      mockImplementations.upload || ((path, options, callback) => {
        callback(null, createMockCloudinaryUploadResponse());
      })
    ),
    destroy: jest.fn().mockImplementation(
      mockImplementations.destroy || ((publicId, callback) => {
        callback(null, createMockCloudinaryDestroyResponse());
      })
    ),
    explicit: jest.fn().mockImplementation(
      mockImplementations.explicit || ((publicId, options) => {
        return Promise.resolve(createMockCloudinaryExplicitResponse());
      })
    ),
    ...mockImplementations
  };
};

export const mockCloudinarySearch = (mockImplementations = {}) => {
  return {
    expression: jest.fn().mockReturnThis(),
    sort_by: jest.fn().mockReturnThis(),
    max_results: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(
      mockImplementations.execute || createMockCloudinarySearchResponse()
    ),
    ...mockImplementations
  };
};

export const mockCloudinaryApi = (mockImplementations = {}) => {
  return {
    usage: jest.fn().mockResolvedValue(
      mockImplementations.usage || createMockCloudinaryUsageResponse()
    ),
    ...mockImplementations
  };
};

export const setupCloudinaryMock = (mockImplementations = {}) => {
  return {
    v2: {
      uploader: mockCloudinaryUploader(mockImplementations.uploader),
      search: jest.fn().mockReturnValue(
        mockCloudinarySearch(mockImplementations.search)
      ),
      api: mockCloudinaryApi(mockImplementations.api),
      ...mockImplementations.v2
    },
    config: jest.fn().mockReturnValue({
      cloud_name: 'test-cloud',
      api_key: 'test-key',
      api_secret: 'test-secret',
      ...mockImplementations.config
    }),
    url: jest.fn().mockImplementation((publicId, options) => {
      return `https://res.cloudinary.com/test/image/upload/v123/${publicId}`;
    })
  };
};

export const createFileUploadRequest = (fileOptions = {}, bodyOptions = {}) => {
  return createMockRequest({
    files: {
      file: createMockFile(fileOptions)
    },
    body: {
      folder: 'HoseaCodes',
      ...bodyOptions
    },
    headers: {
      'content-type': 'multipart/form-data'
    }
  });
};

export const createMediaLibraryRequest = (folder = null) => {
  return createMockRequest({
    query: folder ? { folder } : {}
  });
};

export const createSearchMediaRequest = (query) => {
  return createMockRequest({
    query: { query }
  });
};

export const createDeleteMediaRequest = (publicId) => {
  return createMockRequest({
    body: { public_id: publicId }
  });
};

export const createUpdateMetadataRequest = (publicId, context) => {
  return createMockRequest({
    body: { public_id: publicId, context }
  });
};
