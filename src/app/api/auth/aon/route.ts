import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Find AON user with their talent profile
    const aon = await prisma.user.findFirst({
      where: {
        email: 'aon@ble.com',
      },
      include: {
        talentProfile: true,
      },
    });

    if (!aon) {
      return NextResponse.json(
        { error: 'AON user not found' },
        { status: 404 }
      );
    }

    // Format user data for the client
    const userData = {
      id: aon.id,
      name: aon.name,
      email: aon.email,
      image: aon.image,
      role: aon.role,
      hasTalentProfile: !!aon.talentProfile,
      hasPostedEvent: false, // You can add a check for this if needed
      isVolunteer: false,   // You can add a check for this if needed
      bio: aon.bio,
      location: aon.location,
      skills: aon.skills as string[],
      socialLinks: aon.socialLinks as { twitter?: string; linkedin?: string; }
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error logging in as AON:', error);
    return NextResponse.json(
      { error: 'Failed to login as AON' },
      { status: 500 }
    );
  }
}
