import { prisma } from './prisma.js';

export class UserService {
  /**
   * Create or update user from Clerk webhook/signin
   */
  static async upsertUser(clerkUser) {
    try {
      const userData = {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        username: clerkUser.username,
        imageUrl: clerkUser.imageUrl,
      };

      const user = await prisma.user.upsert({
        where: { clerkId: clerkUser.id },
        update: userData,
        create: userData,
      });

      return user;
    } catch (error) {
      console.error('Error upserting user:', error);
      throw error;
    }
  }

  /**
   * Get user by Clerk ID
   */
  static async getUserByClerkId(clerkId) {
    try {
      return await prisma.user.findUnique({
        where: { clerkId },
        include: { posts: true },
      });
    } catch (error) {
      console.error('Error getting user by Clerk ID:', error);
      throw error;
    }
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email) {
    try {
      return await prisma.user.findUnique({
        where: { email },
        include: { posts: true },
      });
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateUser(clerkId, updateData) {
    try {
      return await prisma.user.update({
        where: { clerkId },
        data: updateData,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user (soft delete - you might want to keep data)
   */
  static async deleteUser(clerkId) {
    try {
      return await prisma.user.delete({
        where: { clerkId },
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  /**
   * Get all users (admin function)
   */
  static async getAllUsers(skip = 0, take = 10) {
    try {
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: { _count: { select: { posts: true } } },
        }),
        prisma.user.count(),
      ]);

      return { users, total, hasMore: skip + take < total };
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  /**
   * Get user stats
   */
  static async getUserStats(clerkId) {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      if (!user) return null;

      return {
        totalPosts: user._count.posts,
        memberSince: user.createdAt,
        lastUpdated: user.updatedAt,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }
}