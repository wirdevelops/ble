import prisma from '@/lib/prisma';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
  link?: string | null;
  stats?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getActiveFeatures(): Promise<Feature[]> {
  return await prisma.feature.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      order: 'asc',
    },
  });
}

export async function createFeature(data: Omit<Feature, 'id' | 'createdAt' | 'updatedAt'>) {
  return await prisma.feature.create({
    data,
  });
}

export async function updateFeature(id: string, data: Partial<Feature>) {
  return await prisma.feature.update({
    where: { id },
    data,
  });
}

export async function deleteFeature(id: string) {
  return await prisma.feature.delete({
    where: { id },
  });
}

export async function getFeatureStats() {
  // Example of getting real stats for features
  const [eventCount, userCount, businessCount] = await Promise.all([
    prisma.event.count(),
    prisma.user.count(),
    prisma.user.count({
      where: {
        role: 'business',
      },
    }),
  ]);

  return {
    events: eventCount,
    users: userCount,
    businesses: businessCount,
  };
}
