import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper function to format numbers in an encouraging way
function formatStatistic(count: number, type: 'talents' | 'events' | 'members'): number {
  // If count is 0, return a base minimum number
  if (count === 0) {
    switch (type) {
      case 'talents':
        return 10; // Start with at least 10 talents
      case 'events':
        return 5;  // Start with at least 5 events
      case 'members':
        return 50; // Start with at least 50 members
      default:
        return count;
    }
  }

  // If count is very low, add a small boost
  if (count < 5) {
    switch (type) {
      case 'talents':
        return count + 8;
      case 'events':
        return count + 4;
      case 'members':
        return count + 45;
      default:
        return count;
    }
  }

  // For higher numbers, round up to nearest encouraging number
  if (count < 100) {
    return Math.ceil(count / 5) * 5;
  }

  return count;
}

export async function GET() {
  try {
    // Get active talents (users with talent profiles)
    const rawActiveTalents = await prisma.user.count({
      where: {
        talentProfile: {
          isNot: null
        },
        active: true
      }
    });

    // Get monthly events (events in the current month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const rawMonthlyEvents = await prisma.event.count({
      where: {
        startDate: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    // Get total community members
    const rawCommunityMembers = await prisma.user.count({
      where: {
        active: true
      }
    });

    // Format the numbers in an encouraging way
    const activeTalents = formatStatistic(rawActiveTalents, 'talents');
    const monthlyEvents = formatStatistic(rawMonthlyEvents, 'events');
    const communityMembers = formatStatistic(rawCommunityMembers, 'members');

    return NextResponse.json({
      activeTalents,
      monthlyEvents,
      communityMembers
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
