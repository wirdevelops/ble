import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanDatabase() {
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ')

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
  } catch (error) {
    console.log('Error cleaning database:', error)
  }
}

async function main() {
  console.log('Start seeding...')
  
  try {
    // Clean the database first
    await cleanDatabase()
    console.log('Database cleaned')

    // Create categories first
    console.log('Creating categories...')
    const technology = await prisma.category.create({
      data: {
        name: 'Technology',
        description: 'Tech events and discussions',
        slug: 'technology',
        image: 'https://example.com/tech.jpg'
      }
    })

    const business = await prisma.category.create({
      data: {
        name: 'Business',
        description: 'Business and entrepreneurship',
        slug: 'business',
        image: 'https://example.com/business.jpg'
      }
    })

    console.log('Categories created:', { technology: technology.id, business: business.id })

    // Create users
    console.log('Creating users...')
    const aon = await prisma.user.create({
      data: {
        name: 'AON',
        email: 'aon@ble.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aon',
        role: 'admin',
        bio: 'Community Leader and Tech Innovator',
        location: 'Bamenda',
        skills: ['Community Building', 'Technology', 'Innovation'],
        socialLinks: {
          twitter: 'aondev',
          linkedin: 'aondev'
        },
        active: true
      }
    });

    console.log('AON user created:', { aon: aon.id });

    // Create talent profile for AON
    const aonTalent = await prisma.talentProfile.create({
      data: {
        userId: aon.id,
        title: 'Community Leader & Developer',
        description: 'Building the future of Bamenda\'s tech ecosystem',
        categories: {
          connect: [{ id: technology.id }]
        },
        skills: ['Community Building', 'Web Development', 'Project Management'],
        availability: 'Available for community projects',
        portfolio: {
          projects: [
            {
              title: 'BLE Platform',
              description: 'A community platform for Bamenda',
              link: 'https://ble.com'
            }
          ]
        }
      }
    });

    console.log('AON talent profile created:', { aonTalent: aonTalent.id });

    const john = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        image: 'https://example.com/john.jpg',
        role: 'admin',
        bio: 'Community admin and tech enthusiast',
        location: 'Bamenda',
        skills: ['JavaScript', 'React', 'Node.js'],
        socialLinks: {
          twitter: 'johndoe',
          linkedin: 'johndoe'
        }
      }
    })

    const jane = await prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        image: 'https://example.com/jane.jpg',
        role: 'user',
        bio: 'Event organizer and community builder',
        location: 'Bamenda',
        skills: ['Event Planning', 'Marketing'],
        socialLinks: {
          twitter: 'janesmith',
          linkedin: 'janesmith'
        }
      }
    })

    console.log('Users created:', { john: john.id, jane: jane.id, aon: aon.id })

    // Create posts
    console.log('Creating posts...')
    const post1 = await prisma.post.create({
      data: {
        title: 'Welcome to Bamenda Tech Community',
        content: 'Join us in building a vibrant tech ecosystem in Bamenda!',
        published: true,
        authorId: john.id,
        categoryId: technology.id
      }
    })

    const post2 = await prisma.post.create({
      data: {
        title: 'Upcoming Business Opportunities',
        content: 'Discover new business opportunities in our community.',
        published: true,
        authorId: jane.id,
        categoryId: business.id
      }
    })

    console.log('Posts created:', { post1: post1.id, post2: post2.id })

    // Create features
    console.log('Creating features...')
    const features = await Promise.all([
      prisma.feature.create({
        data: {
          title: 'Local Events',
          description: 'Discover and join exciting events happening in your community',
          icon: 'BiCalendarEvent',
          order: 1,
          stats: {
            activeEvents: 25,
            upcomingEvents: 15
          }
        }
      }),
      prisma.feature.create({
        data: {
          title: 'Business Network',
          description: 'Connect with local businesses and entrepreneurs',
          icon: 'BiBriefcase',
          order: 2,
          stats: {
            businesses: 150,
            connections: 500
          }
        }
      }),
      prisma.feature.create({
        data: {
          title: 'Community Marketplace',
          description: 'Buy and sell within your local community',
          icon: 'BiStore',
          order: 3,
          stats: {
            activeListings: 200,
            categories: 20
          }
        }
      })
    ])

    console.log('Features created:', features.map(f => f.id))

    // Create events
    console.log('Creating events...')
    const event1 = await prisma.event.create({
      data: {
        title: 'Tech Meetup 2024',
        description: 'Annual technology meetup in Bamenda',
        location: 'Bamenda Conference Center',
        startDate: new Date('2024-03-15T10:00:00Z'),
        endDate: new Date('2024-03-15T17:00:00Z'),
        capacity: 100,
        price: 0,
        categoryId: technology.id,
        organizerId: john.id
      }
    })

    console.log('Events created:', { event1: event1.id })

    // Create comments
    console.log('Creating comments...')
    await prisma.comment.create({
      data: {
        content: 'Great initiative!',
        postId: post1.id,
        userId: jane.id
      }
    })

    // Create event attendees
    console.log('Creating event attendees...')
    await prisma.eventAttendee.create({
      data: {
        eventId: event1.id,
        userId: jane.id,
        status: 'registered'
      }
    })

    console.log('Seeding finished')
  } catch (error) {
    console.error('Error during seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
