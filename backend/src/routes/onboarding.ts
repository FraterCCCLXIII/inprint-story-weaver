import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Save onboarding data
router.post('/save', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const onboardingData = req.body;

    // Check if onboarding data already exists for this user
    const existingOnboarding = await prisma.onboarding.findUnique({
      where: { userId }
    });

    let result;
    if (existingOnboarding) {
      // Update existing onboarding data
      result = await prisma.onboarding.update({
        where: { userId },
        data: {
          writingExperience: onboardingData.writingExperience,
          bookPurpose: onboardingData.bookPurpose,
          targetAudience: onboardingData.targetAudience,
          bookLength: onboardingData.bookLength,
          contentSources: onboardingData.contentSources || [],
          customContentSource: onboardingData.customContentSource,
          timeline: onboardingData.timeline,
          successMetrics: onboardingData.successMetrics || [],
          customSuccessMetric: onboardingData.customSuccessMetric,
          isCompleted: onboardingData.isCompleted || false,
          completedAt: onboardingData.isCompleted ? new Date() : null,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new onboarding data
      result = await prisma.onboarding.create({
        data: {
          userId,
          writingExperience: onboardingData.writingExperience,
          bookPurpose: onboardingData.bookPurpose,
          targetAudience: onboardingData.targetAudience,
          bookLength: onboardingData.bookLength,
          contentSources: onboardingData.contentSources || [],
          customContentSource: onboardingData.customContentSource,
          timeline: onboardingData.timeline,
          successMetrics: onboardingData.successMetrics || [],
          customSuccessMetric: onboardingData.customSuccessMetric,
          isCompleted: onboardingData.isCompleted || false,
          completedAt: onboardingData.isCompleted ? new Date() : null
        }
      });
    }

    res.json({
      success: true,
      data: result,
      message: 'Onboarding data saved successfully'
    });
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save onboarding data'
    });
  }
});

// Get onboarding data for a user
router.get('/get', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const onboardingData = await prisma.onboarding.findUnique({
      where: { userId }
    });

    if (!onboardingData) {
      return res.json({
        success: true,
        data: null,
        message: 'No onboarding data found'
      });
    }

    res.json({
      success: true,
      data: onboardingData,
      message: 'Onboarding data retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving onboarding data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve onboarding data'
    });
  }
});

// Mark onboarding as completed
router.post('/complete', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const onboardingData = req.body;

    // Save or update onboarding data and mark as completed
    const result = await prisma.onboarding.upsert({
      where: { userId },
      update: {
        ...onboardingData,
        isCompleted: true,
        completedAt: new Date(),
        updatedAt: new Date()
      },
      create: {
        userId,
        ...onboardingData,
        isCompleted: true,
        completedAt: new Date()
      }
    });

    res.json({
      success: true,
      data: result,
      message: 'Onboarding completed successfully'
    });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete onboarding'
    });
  }
});

export default router;
