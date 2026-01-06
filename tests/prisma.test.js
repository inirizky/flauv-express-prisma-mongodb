import { PrismaClient } from '@prisma/client';
import { expect, test, describe, beforeAll, afterAll } from '@jest/globals';

const prisma = new PrismaClient();

describe('Prisma MongoDB Unit Tests', () => {

  let userId;
  let plantBaseId;

  beforeAll(async () => {
    // Connect to database
    await prisma.$connect();
  });

  afterAll(async () => {
    // Cleanup
    // Note: In a real test db you might truncated tables, but here we clean up what we created.
    // Order matters for relational constraints if any (MongoDB is less strict but Prisma enforces relations if caught)
    try {
        if (userId) {
            // Delete user plants first
            await prisma.userPlant.deleteMany({ where: { userId: userId } });
            await prisma.user.delete({ where: { id: userId } });
        }
        if (plantBaseId) {
            await prisma.plantBase.delete({ where: { id: plantBaseId } });
        }
    } catch (e) {
        console.error("Cleanup failed:", e);
    }
    await prisma.$disconnect();
  });

  test('should create a new user', async () => {
    const newUser = await prisma.user.create({
      data: {
        username: 'testuser_' + Date.now(),
        password: 'password123',
        fullname: 'Test User',
        role: 'USER',
      },
    });
    expect(newUser).toHaveProperty('id');
    expect(typeof newUser.id).toBe('string'); // MongoDB ObjectIDs are strings in Prisma
    expect(newUser.username).toContain('testuser_');
    userId = newUser.id;
    console.log('Created User ID:', userId);
  });

  test('should create a plant base', async () => {
    const newBase = await prisma.plantBase.create({
      data: {
        name: 'Test Plant Base',
        latinName: 'Testus Plantus',
        water_frequency: 7,
        imageUrl: 'http://example.com/plant.jpg',
      },
    });
    expect(newBase).toHaveProperty('id');
    expect(typeof newBase.id).toBe('string');
    plantBaseId = newBase.id;
    console.log('Created PlantBase ID:', plantBaseId);
  });

  test('should create a user plant linked to user and base', async () => {
    expect(userId).toBeDefined();
    expect(plantBaseId).toBeDefined();

    const newPlant = await prisma.userPlant.create({
        data: {
            name: 'My Test Plant',
            imageUrl: 'http://example.com/myplant.jpg',
            water_frequency: 3,
            userId: userId,
            plantBaseId: plantBaseId
        }
    });

    expect(newPlant).toHaveProperty('id');
    expect(newPlant.userId).toBe(userId);
    expect(newPlant.plantBaseId).toBe(plantBaseId);
    console.log('Created UserPlant ID:', newPlant.id);
  });

  test('should verify relations', async () => {
      const userWithPlants = await prisma.user.findUnique({
          where: { id: userId },
          include: { userPlant: true }
      });
      expect(userWithPlants).toBeDefined();
      expect(userWithPlants.userPlant.length).toBeGreaterThan(0);
      expect(userWithPlants.userPlant[0].plantBaseId).toBe(plantBaseId);
  });

});
