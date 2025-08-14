import { prisma } from './prisma.js';

export class PostService {
  /**
   * Create a new post
   */
  static async createPost(authorClerkId, { title, content, published = false }) {
    try {
      // First, get the user by Clerk ID
      const user = await prisma.user.findUnique({
        where: { clerkId: authorClerkId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return await prisma.post.create({
        data: {
          title,
          content,
          published,
          authorId: user.id,
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              imageUrl: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  /**
   * Get all posts (published only by default)
   */
  static async getAllPosts(publishedOnly = true, skip = 0, take = 10) {
    try {
      const where = publishedOnly ? { published: true } : {};

      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                imageUrl: true,
              },
            },
          },
        }),
        prisma.post.count({ where }),
      ]);

      return { posts, total, hasMore: skip + take < total };
    } catch (error) {
      console.error('Error getting all posts:', error);
      throw error;
    }
  }

  /**
   * Get posts by user
   */
  static async getPostsByUser(authorClerkId, includeUnpublished = false) {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId: authorClerkId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const where = { authorId: user.id };
      if (!includeUnpublished) {
        where.published = true;
      }

      return await prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              imageUrl: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error getting posts by user:', error);
      throw error;
    }
  }

  /**
   * Get post by ID
   */
  static async getPostById(postId) {
    try {
      return await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              imageUrl: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error getting post by ID:', error);
      throw error;
    }
  }

  /**
   * Update post
   */
  static async updatePost(postId, authorClerkId, updateData) {
    try {
      // First verify the user owns this post
      const user = await prisma.user.findUnique({
        where: { clerkId: authorClerkId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const post = await prisma.post.findFirst({
        where: { id: postId, authorId: user.id },
      });

      if (!post) {
        throw new Error('Post not found or not authorized');
      }

      return await prisma.post.update({
        where: { id: postId },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              imageUrl: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  /**
   * Delete post
   */
  static async deletePost(postId, authorClerkId) {
    try {
      // First verify the user owns this post
      const user = await prisma.user.findUnique({
        where: { clerkId: authorClerkId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const post = await prisma.post.findFirst({
        where: { id: postId, authorId: user.id },
      });

      if (!post) {
        throw new Error('Post not found or not authorized');
      }

      return await prisma.post.delete({
        where: { id: postId },
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  /**
   * Search posts
   */
  static async searchPosts(query, publishedOnly = true) {
    try {
      const where = {
        AND: [
          publishedOnly ? { published: true } : {},
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      };

      return await prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              imageUrl: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }
}