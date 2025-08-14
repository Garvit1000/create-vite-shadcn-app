import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample users
  const sampleUsers = [
    {
      clerkId: 'user_sample_1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
    },
    {
      clerkId: 'user_sample_2',
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      username: 'janesmith',
    },
  ];

  const users = [];
  for (const userData of sampleUsers) {
    const user = await prisma.user.upsert({
      where: { clerkId: userData.clerkId },
      update: {},
      create: userData,
    });
    users.push(user);
    console.log(`✅ Created user: ${user.email}`);
  }

  // Create sample posts
  const samplePosts = [
    {
      title: 'Welcome to the Platform',
      content: 'This is your first post! You can edit or delete this post, or create new ones.',
      published: true,
      authorId: users[0].id,
    },
    {
      title: 'Getting Started Guide',
      content: 'Here are some tips to help you get started with this platform...',
      published: true,
      authorId: users[0].id,
    },
    {
      title: 'Draft Post',
      content: 'This is a draft post that is not published yet.',
      published: false,
      authorId: users[1].id,
    },
  ];

  for (const postData of samplePosts) {
    const post = await prisma.post.create({
      data: postData,
    });
    console.log(`✅ Created post: ${post.title}`);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });