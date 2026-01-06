import { PrismaClient } from '@prisma/client';
import { expect, test, describe, beforeAll, afterAll } from '@jest/globals';

const prisma = new PrismaClient();

describe('UserPlant Unit Tests', () => {
    let testUser;
    let testPlantBase;
    let createdPlantId;

    beforeAll(async () => {
        await prisma.$connect();

        // 1. Setup: Create a User
        testUser = await prisma.user.create({
            data: {
                username: `plantLover_${Date.now()}`,
                password: 'password123',
                fullname: 'Plant Lover',
                role: 'USER'
            }
        });

        // 2. Setup: Create a PlantBase
        testPlantBase = await prisma.plantBase.create({
            data: {
                name: 'Sansevieria',
                latinName: 'Sansevieria Trifasciata',
                water_frequency: 14,
                imageUrl: 'http://example.com/sansevieria.jpg',
                isVerifed: true
            }
        });
    });

    afterAll(async () => {
        // Cleanup
        try {
            if (createdPlantId) {
                // Try catch in case it was already deleted by the delete test
                try {
                    await prisma.userPlant.delete({ where: { id: createdPlantId } });
                } catch (e) { }
            }

            if (testUser) {
                // Ensure all plants for this user are gone before deleting user (cascading cleanup)
                await prisma.userPlant.deleteMany({ where: { userId: testUser.id } });
                await prisma.user.delete({ where: { id: testUser.id } });
            }

            if (testPlantBase) {
                await prisma.plantBase.delete({ where: { id: testPlantBase.id } });
            }
        } catch (error) {
            console.error("Cleanup error:", error);
        }
        await prisma.$disconnect();
    });

    test('Create: Should successfully create a userPlant', async () => {
        const newPlant = await prisma.userPlant.create({
            data: {
                name: 'My Snake Plant',
                imageUrl: 'http://example.com/mypic.jpg',
                water_frequency: 14,
                sunlight: 'Low to Bright Indirect',
                soilType: 'Well-draining',
                userId: testUser.id,
                plantBaseId: testPlantBase.id
            }
        });

        expect(newPlant).toHaveProperty('id');
        expect(newPlant.name).toBe('My Snake Plant');
        expect(newPlant.userId).toBe(testUser.id);

        createdPlantId = newPlant.id;
    });

    test('Read: Should find userPlantById and include relations', async () => {
        expect(createdPlantId).toBeDefined();

        const foundPlant = await prisma.userPlant.findUnique({
            where: { id: createdPlantId },
            include: {
                user: true,
                base: true
            }
        });

        expect(foundPlant).toBeDefined();
        expect(foundPlant.user.username).toBe(testUser.username);
        expect(foundPlant.base.latinName).toBe('Sansevieria Trifasciata');
    });

    test('Update: Should update userPlant details', async () => {
        expect(createdPlantId).toBeDefined();

        const updatedPlant = await prisma.userPlant.update({
            where: { id: createdPlantId },
            data: {
                name: 'My Beloved Snake Plant',
                // notes: 'Growing new leaves!', // notes is not in userPlant model
                water_frequency: 10
            }
        });

        expect(updatedPlant.name).toBe('My Beloved Snake Plant');
        expect(updatedPlant.water_frequency).toBe(10);
    });

    test('Create Progress: Should add progress to the userPlant', async () => {
        // Since we are here, let's test relation with plantProgress too
        const progress = await prisma.plantProgress.create({
            data: {
                userPlantId: createdPlantId,
                imageUrl: 'http://example.com/progress.jpg',
                notes: 'New leaf spotted!',
                progressType: 'new_leaf'
            }
        });

        expect(progress).toHaveProperty('id');
        expect(progress.userPlantId).toBe(createdPlantId);
    });

    test('Delete: Should delete the userPlant', async () => {
        // First delete related progress tokens because we don't have cascade delete set up in Prisma for MongoDB implicitly like SQL sometimes
        await prisma.plantProgress.deleteMany({
            where: { userPlantId: createdPlantId }
        });

        const deletedPlant = await prisma.userPlant.delete({
            where: { id: createdPlantId }
        });

        expect(deletedPlant.id).toBe(createdPlantId);

        // Verify it's gone
        const check = await prisma.userPlant.findUnique({
            where: { id: createdPlantId }
        });
        expect(check).toBeNull();

        createdPlantId = null; // Mark as deleted for cleanup
    });
});
