// Frontend API service to communicate with backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request failed: ${endpoint}`, error);
    throw error;
  }
}

export const api = {
  // Health check
  health: () => apiRequest('/health'),

  // User API
  user: {
    // Get user by Clerk ID
    getByClerkId: (clerkId) => apiRequest(`/users/${clerkId}`),
    
    // Create or update user
    upsert: (userData) => apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    
    // Get user statistics
    getStats: (clerkId) => apiRequest(`/users/${clerkId}/stats`),
  },

  // Posts API
  posts: {
    // Get all posts with pagination
    getAll: (options = {}) => {
      const { published = true, skip = 0, take = 10 } = options;
      const params = new URLSearchParams({
        published: published.toString(),
        skip: skip.toString(),
        take: take.toString(),
      });
      return apiRequest(`/posts?${params}`);
    },

    // Get post by ID
    getById: (id) => apiRequest(`/posts/${id}`),

    // Get posts by user
    getByUser: (clerkId, includeUnpublished = false) => {
      const params = new URLSearchParams({
        includeUnpublished: includeUnpublished.toString(),
      });
      return apiRequest(`/users/${clerkId}/posts?${params}`);
    },

    // Create new post
    create: (postData) => apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),

    // Update post
    update: (id, updateData) => apiRequest(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    }),

    // Delete post
    delete: (id, authorClerkId) => apiRequest(`/posts/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ authorClerkId }),
    }),

    // Search posts
    search: (query, published = true) => {
      const params = new URLSearchParams({
        q: query,
        published: published.toString(),
      });
      return apiRequest(`/posts/search?${params}`);
    },
  },
};

// Export individual services for convenience
export const userApi = api.user;
export const postsApi = api.posts;

// Export API base URL for reference
export { API_BASE };