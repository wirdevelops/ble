'use client';

import { createBrowserClient } from "@supabase/ssr"
import { useState, useRef, useEffect } from 'react';
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { FaGithub } from 'react-icons/fa'
import Link from 'next/link'
import { motion } from 'framer-motion';
import { BiPlay, BiTrendingUp, BiCalendarEvent, BiGroup, BiRightArrowAlt, BiBriefcase, BiStore, BiHeart, BiMoney, BiSearch, BiDirections, BiCurrentLocation } from 'react-icons/bi';
import { FiAward, FiUsers } from 'react-icons/fi';
import { HiOutlineMail } from 'react-icons/hi';
import WelcomeModal from '@/components/WelcomeModal'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAuth, mockUser } from '@/contexts/AuthContext';
import LiveActivities from '@/components/LiveActivities';
import TalentCategories from '@/components/TalentCategories';
import SpotlightTalent from '@/components/SpotlightTalent';
import CallToAction from '@/components/CallToAction';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
)

async function signInWithGithub() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      scopes: 'read:user user:email'
    }
  })
  if (error) {
    console.error('Authentication error:', error.message)
  }
}

async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Sign out error:', error.message)
  }
}

export default function Home() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const { user: authUser, setUser: setAuthUser } = useAuth()
  
  // Page state
  const [pageState, setPageState] = useState({
    showWelcomeModal: false,
    videoPlaying: true,
    isLoading: true,
    isPiP: false,
    loadError: false,
    mapInstance: null,
    activeFilter: 'all',
    searchQuery: '',
    showSearch: false,
    directions: null,
    selectedLocation: null,
    features: [],
    stats: {
      activeTalents: { number: '10+', trend: 'Growing' },
      monthlyEvents: { number: '5+', trend: 'Active' },
      communityMembers: { number: '50+', trend: 'Thriving' }
    }
  })

  // Supabase auth state
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Handle Picture in Picture
  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
        setPageState(prev => ({ ...prev, isPiP: false }))
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture()
        setPageState(prev => ({ ...prev, isPiP: true }))
      }
    } catch (error) {
      console.error('PiP failed:', error)
    }
  }

  // Filter map markers
  const filterMarkers = (filter: string) => {
    setPageState(prev => ({ ...prev, activeFilter: filter }))
    const markers = document.querySelectorAll('.marker')
    markers.forEach(marker => {
      if (filter === 'all' || marker.classList.contains(filter)) {
        marker.style.display = 'block'
      } else {
        marker.style.display = 'none'
      }
    })
  }

  // Auth effect
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        setSupabaseUser(session?.user ?? null)
        
        if (session?.user) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Session error:', error)
      } finally {
        setAuthLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSupabaseUser(session?.user ?? null)
        if (event === 'SIGNED_IN') {
          router.push('/dashboard')
        }
        if (event === 'SIGNED_OUT') {
          router.push('/')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  // Map initialization effect
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapboxgl.accessToken) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [10.159, 5.959],
      zoom: 13,
      pitch: 45
    })

    setPageState(prev => ({ ...prev, mapInstance: map }))

    // Clean up on unmount
    return () => {
      map.remove()
    }
  }, []) // Empty dependency array means this effect runs once on mount

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const loginAsAON = () => {
    setAuthUser({ ...mockUser })
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] lg:h-[75vh] bg-gradient-to-br from-background via-primary/10 to-background overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background z-10" />
        
        {/* Video Controls */}
        <div className="absolute bottom-6 md:bottom-8 right-4 z-30 flex gap-2">
          <button
            onClick={() => setPageState(prev => ({ ...prev, videoPlaying: !prev.videoPlaying }))}
            className="p-2.5 md:p-3 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 transition-all duration-300"
            aria-label={pageState.videoPlaying ? 'Pause video' : 'Play video'}
          >
            <BiPlay className={`w-5 h-5 md:w-6 md:h-6 ${pageState.videoPlaying ? 'rotate-90' : ''} transition-transform`} />
          </button>
          <button
            onClick={togglePiP}
            className="p-2.5 md:p-3 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 transition-all duration-300"
            aria-label={pageState.isPiP ? 'Exit picture in picture' : 'Enter picture in picture'}
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z"/>
            </svg>
          </button>
        </div>

        {/* Loading Spinner */}
        {pageState.isLoading && !pageState.loadError && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50">
            <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Fallback Image for Video Error */}
        {pageState.loadError && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url(/images/hero-fallback.jpg)',
              opacity: 0.6 
            }}
          />
        )}

        {/* Background Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          preload="auto"
          poster="/images/hero-poster.jpg"
          onLoadStart={() => setPageState(prev => ({ ...prev, isLoading: true, loadError: false }))}
          onLoadedData={() => setPageState(prev => ({ ...prev, isLoading: false }))}
          onError={() => setPageState(prev => ({ ...prev, isLoading: false, loadError: true }))}
          className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01]"
          style={{ opacity: pageState.videoPlaying && !pageState.loadError ? 1 : 0 }}
        >
          <source src="/videos/hero/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-4 md:px-6 h-full">
          <div className="flex flex-col justify-start md:justify-center items-center h-full pt-[30vh] md:pt-0 pb-20 md:pb-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl space-y-6 md:space-y-8 w-full"
            >
              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Connect with Bamenda's Vibrant Community
              </h1>
              
              {/* Subheading */}
              <p className="text-base sm:text-lg md:text-xl text-text/80 mb-6 md:mb-8 max-w-[90%]">
                Discover local talents, explore events, and be part of something bigger. 
                Your gateway to opportunities in Bamenda's thriving ecosystem.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <Link 
                  href="/discover"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 sm:px-6 py-3.5 sm:py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all duration-300 group"
                >
                  <span className="relative z-10">Explore Opportunities</span>
                  <BiRightArrowAlt className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link 
                  href="/events"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 sm:px-6 py-3.5 sm:py-3 border border-primary/20 hover:border-primary/40 bg-background/50 backdrop-blur-sm rounded-lg font-medium transition-all duration-300 group"
                >
                  Browse Events
                  <BiCalendarEvent className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                </Link>
              </div>

              {/* Search Bar */}
              <div className="mt-8 w-full max-w-2xl">
                <Link href="/discover" className="relative block">
                  <input
                    type="text"
                    placeholder="Search for talents, events, or opportunities..."
                    className="w-full px-6 py-4 bg-surface/30 backdrop-blur-sm border border-border/50 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer"
                    readOnly
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary hover:bg-primary/90 rounded-lg transition-colors">
                    <BiSearch className="w-5 h-5 text-white" />
                  </button>
                </Link>
              </div>

              {/* Trending Hashtags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {['#BamendaArts', '#TechMeetup', '#LocalTalent', '#CommunityEvent'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/discover?q=${encodeURIComponent(tag)}`}
                    className="px-4 py-1.5 bg-surface/20 hover:bg-surface/40 backdrop-blur-sm rounded-full text-sm transition-all"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              {/* Stats with Improved Visual */}
              <div className="mt-8 md:mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl">
                {[
                  { 
                    number: pageState.stats.activeTalents.number, 
                    label: 'Active Talents', 
                    trend: pageState.stats.activeTalents.trend,
                    icon: FiAward, 
                    href: '/discover?filter=talents',
                    color: 'from-blue-500/20 to-purple-500/20'
                  },
                  { 
                    number: pageState.stats.monthlyEvents.number, 
                    label: 'Monthly Events', 
                    trend: pageState.stats.monthlyEvents.trend,
                    icon: BiCalendarEvent, 
                    href: '/discover?filter=events',
                    color: 'from-green-500/20 to-emerald-500/20'
                  },
                  { 
                    number: pageState.stats.communityMembers.number, 
                    label: 'Community Members', 
                    trend: pageState.stats.communityMembers.trend,
                    icon: BiGroup, 
                    href: '/discover?filter=members',
                    color: 'from-orange-500/20 to-red-500/20'
                  }
                ].map((stat, index) => (
                  <Link
                    key={stat.label}
                    href={stat.href}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`relative bg-surface/30 backdrop-blur-sm p-4 rounded-xl border border-border hover:border-primary/20 transition-all cursor-pointer overflow-hidden group`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      <div className="relative z-10">
                        <stat.icon className="w-6 h-6 text-primary mb-2" />
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.number}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-text/60">{stat.label}</div>
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            {stat.trend}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-text mb-2">Quick Access</h2>
            <p className="text-text/60">Find what you're looking for quickly</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(authUser ? [
              // Authenticated user quick actions
              {
                title: authUser.hasTalentProfile ? 'Update Profile' : 'Create Profile',
                description: authUser.hasTalentProfile 
                  ? 'Keep your talent profile up to date'
                  : 'Create your profile and showcase your skills',
                icon: FiAward,
                href: authUser.hasTalentProfile ? '/talent/edit' : '/talent/create',
                gradient: 'from-blue-500 to-cyan-500',
                badge: !authUser.hasTalentProfile ? 'Get Started' : undefined
              },
              {
                title: authUser.hasPostedEvent ? 'Manage Events' : 'Host Event',
                description: authUser.hasPostedEvent 
                  ? 'Manage your community events and RSVPs'
                  : 'Create and host your own community event',
                icon: BiCalendarEvent,
                href: authUser.hasPostedEvent ? '/events/manage' : '/events/create',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                title: authUser.isVolunteer ? 'My Volunteering' : 'Start Volunteering',
                description: authUser.isVolunteer
                  ? 'Track your volunteer activities and impact'
                  : 'Support local initiatives and make a difference',
                icon: BiHeart,
                href: authUser.isVolunteer ? '/volunteer/dashboard' : '/volunteer/start',
                gradient: 'from-red-500 to-pink-500'
              },
              {
                title: 'My Dashboard',
                description: 'View your activities, messages, and connections',
                icon: BiTrendingUp,
                href: '/dashboard',
                gradient: 'from-primary to-yellow-500',
                badge: authUser.hasTalentProfile ? undefined : 'New'
              }
            ] : [
              // Non-authenticated user quick actions
              {
                title: 'Showcase Talent',
                description: 'Create your profile and showcase your skills to the community',
                icon: FiAward,
                href: '/talent/create',
                gradient: 'from-blue-500 to-cyan-500',
                badge: 'Featured'
              },
              {
                title: 'Community Events',
                description: 'Discover and join free local events and meetups',
                icon: BiCalendarEvent,
                href: '/events',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Volunteer',
                description: 'Support local initiatives and make a difference',
                icon: BiHeart,
                href: '/volunteer',
                gradient: 'from-red-500 to-pink-500'
              },
              {
                title: 'Opportunities',
                description: 'Find collaborations, projects, and mentorship',
                icon: BiTrendingUp,
                href: '/opportunities',
                gradient: 'from-primary to-yellow-500'
              }
            ]).map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={item.href} className="group block h-full">
                  <div className="relative p-6 bg-surface hover:bg-surface/80 rounded-2xl border border-border transition-all duration-300 h-full hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.gradient} opacity-5 rounded-bl-full transition-opacity group-hover:opacity-10`} />
                    {item.badge && (
                      <span className="absolute top-4 right-4 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <item.icon className="w-8 h-8 mb-4 text-primary" />
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm text-text/60">{item.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-text mb-2">Featured Events</h2>
              <p className="text-text/60">Don't miss out on these amazing opportunities</p>
            </div>
            <Link
              href="/events"
              className="group flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              View All Events
              <BiRightArrowAlt className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                title: 'Reggae Festival',
                description: 'Join us for a night of reggae music and culture.',
                tag: 'Live',
                tagColor: 'bg-red-500',
                image: '/events/reggae-festival.jpg',
                slug: 'reggae-festival',
                action: 'Volunteer'
              },
              {
                id: 2,
                title: 'Tech Meetup',
                description: 'Connect with local tech enthusiasts and innovators.',
                tag: 'Trending',
                tagColor: 'bg-yellow-500',
                image: '/events/tech-meetup.jpg',
                slug: 'tech-meetup',
                action: 'Register'
              },
              {
                id: 3,
                title: 'Art Exhibition',
                description: 'Experience the finest local art in Bamenda.',
                tag: 'Featured',
                tagColor: 'bg-blue-500',
                image: '/events/art-exhibition.jpg',
                slug: 'art-exhibition',
                action: 'Get Tickets'
              }
            ].map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-surface rounded-xl overflow-hidden border border-border hover:border-primary/20 transition-colors"
              >
                <div className="aspect-video relative mb-4 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-4 left-4 z-20 px-3 py-1 ${event.tagColor} text-white text-sm rounded-full`}>
                    {event.tag}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-text/80 mb-4">{event.description}</p>
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/events/${event.slug}`}
                      className="group/link flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                    >
                      Learn More
                      <BiRightArrowAlt className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                    <button className="px-4 py-2 bg-surface hover:bg-surface/80 text-text rounded-full text-sm transition-colors border border-border hover:border-primary/20">
                      {event.action}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="py-12 px-4 bg-surface/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-8"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-text mb-2">Featured Opportunities</h2>
              <p className="text-text/60">Latest openings and opportunities</p>
            </div>
            <Link 
              href="/opportunities" 
              className="text-primary hover:text-primary/80 text-sm flex items-center gap-2"
            >
              View All
              <BiRightArrowAlt className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Tech Startup Job Fair',
                description: 'Connect with leading tech companies in Bamenda hiring for various positions.',
                icon: BiBriefcase,
                iconBg: 'bg-blue-500',
                tag: 'Jobs',
                tagColor: 'text-blue-500',
                accentColor: 'bg-blue-500',
                deadline: 'Ends in 5 days',
                href: '/events/tech-job-fair'
              },
              {
                title: 'Cultural Festival Vendors',
                description: 'Register as a vendor for the upcoming Bamenda Cultural Festival 2024.',
                icon: BiStore,
                iconBg: 'bg-primary',
                tag: 'Vendor',
                tagColor: 'text-primary',
                accentColor: 'bg-primary',
                deadline: 'Registration closes soon',
                href: '/events/cultural-festival'
              },
              {
                title: 'Community Clean-up Drive',
                description: 'Join us in making Bamenda cleaner and greener. Volunteers needed.',
                icon: BiHeart,
                iconBg: 'bg-red-500',
                tag: 'Volunteer',
                tagColor: 'text-red-500',
                accentColor: 'bg-red-500',
                deadline: 'This weekend',
                href: '/volunteer/clean-up-drive'
              }
            ].map((opp, index) => (
              <motion.div
                key={opp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-background rounded-2xl overflow-hidden border border-border hover:border-primary/20 transition-all duration-300"
              >
                <div className={`absolute top-0 left-0 w-full h-1 ${opp.accentColor}`} />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg ${opp.iconBg}`}>
                      <opp.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-sm font-medium ${opp.tagColor}`}>{opp.tag}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {opp.title}
                  </h3>
                  <p className="text-text/60 text-sm mb-4">{opp.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text/60">{opp.deadline}</span>
                    <Link
                      href={opp.href}
                      className="text-primary hover:text-primary/80 text-sm flex items-center gap-1"
                    >
                      Learn More
                      <BiRightArrowAlt className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Countdown */}
      <section className="py-8 bg-surface/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-background rounded-xl border border-border">
            <div>
              <h3 className="text-xl font-semibold mb-2">Next Big Event</h3>
              <p className="text-text/60">Bamenda Tech Conference 2024</p>
            </div>
            <div className="flex gap-4">
              {[
                { value: 15, label: 'Days' },
                { value: 8, label: 'Hours' },
                { value: 45, label: 'Minutes' }
              ].map((time) => (
                <div key={time.label} className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-primary">{time.value}</div>
                  <div className="text-sm text-text/60">{time.label}</div>
                </div>
              ))}
            </div>
            <Link
              href="/events/tech-conference"
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>

      {/* Live Activities Section */}
      <section className="py-12 bg-background/50 border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-text mb-2">Live Now</h2>
            <p className="text-text/60">Check out what's happening in Bamenda right now</p>
          </motion.div>
          <LiveActivities />
        </div>
      </section>

      {/* Community Map Section */}
      <section className="py-16 bg-surface/30">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text mb-2">Community Map</h2>
            <p className="text-text/60">Discover events and talents around Bamenda</p>
          </div>
          
          <div className="relative h-[500px] rounded-xl overflow-hidden border border-border">
            <div ref={mapContainerRef} className="absolute inset-0" />
            
            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <div className={`flex items-center gap-2 transition-all ${pageState.showSearch ? 'opacity-100' : 'opacity-0'}`}>
                <input
                  type="text"
                  value={pageState.searchQuery}
                  onChange={(e) => setPageState(prev => ({ ...prev, searchQuery: e.target.value }))}
                  placeholder="Search locations..."
                  className="px-3 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border focus:border-primary outline-none w-64"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button 
                onClick={() => setPageState(prev => ({ ...prev, showSearch: !prev.showSearch }))}
                className={`p-2 backdrop-blur-sm rounded-lg transition-all ${
                  pageState.showSearch ? 'bg-primary text-white' : 'bg-background/80 hover:bg-background'
                }`}
              >
                <BiSearch className="w-5 h-5" />
              </button>
              <button 
                onClick={() => filterMarkers('event')}
                className={`p-2 backdrop-blur-sm rounded-lg transition-all ${
                  pageState.activeFilter === 'event' ? 'bg-primary text-white' : 'bg-background/80 hover:bg-background'
                }`}
              >
                <BiCalendarEvent className="w-5 h-5" />
              </button>
              <button 
                onClick={() => filterMarkers('talent')}
                className={`p-2 backdrop-blur-sm rounded-lg transition-all ${
                  pageState.activeFilter === 'talent' ? 'bg-primary text-white' : 'bg-background/80 hover:bg-background'
                }`}
              >
                <FiUsers className="w-5 h-5" />
              </button>
              {pageState.selectedLocation && (
                <button 
                  onClick={() => {
                    // Clear route and selected location
                    if (pageState.mapInstance.getSource('route')) {
                      pageState.mapInstance.removeLayer('route');
                      pageState.mapInstance.removeSource('route');
                    }
                    setPageState(prev => ({ ...prev, selectedLocation: null, directions: null }))
                  }}
                  className="p-2 bg-red-500 text-white backdrop-blur-sm rounded-lg transition-all"
                >
                  <BiDirections className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 p-4 bg-background/80 backdrop-blur-sm rounded-lg">
              <h3 className="font-medium mb-2">Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm">Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <span className="text-sm">Talents</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Venues</span>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Locations */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'Commercial Avenue',
                type: 'Event Hub',
                activeEvents: 5,
                image: '/locations/commercial-avenue.jpg'
              },
              {
                name: 'Alliance Franco',
                type: 'Cultural Center',
                activeEvents: 3,
                image: '/locations/alliance-franco.jpg'
              },
              {
                name: 'Municipal Stadium',
                type: 'Sports Venue',
                activeEvents: 2,
                image: '/locations/stadium.jpg'
              }
            ].map((location) => (
              <div 
                key={location.name}
                className="group relative overflow-hidden rounded-lg cursor-pointer"
                onClick={() => {
                  // Add map navigation logic here
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img 
                  src={location.image} 
                  alt={location.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-white font-medium">{location.name}</h3>
                  <p className="text-white/80 text-sm">{location.type} • {location.activeEvents} events</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-text mb-2">Popular Categories</h2>
            <p className="text-text/60">Discover talents and opportunities in your favorite categories</p>
          </motion.div>
          <TalentCategories />
        </div>
      </section>

      {/* Spotlight Section */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-text mb-2">Talent Spotlight</h2>
            <p className="text-text/60">Meet the rising stars of Bamenda</p>
          </motion.div>
          <SpotlightTalent />
        </div>
      </section>

      {/* Call to Action */}
      <CallToAction />

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={pageState.showWelcomeModal}
        onClose={() => setPageState(prev => ({ ...prev, showWelcomeModal: false }))}
      />

      {/* Features Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-text mb-2">Everything You Need</h2>
            <p className="text-text/60">Find what you're looking for quickly</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pageState.features.map((feature, i) => {
              const Icon = getIconComponent(feature.icon);
              return (
                <motion.div
                  key={feature.id}
                  className="text-center p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 * (i + 1) }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-text/60">{feature.description}</p>
                  {feature.stats && (
                    <div className="mt-4 text-primary font-medium">
                      {Object.entries(feature.stats).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          {key}: {value}
                        </div>
                      ))}
                    </div>
                  )}
                  {feature.link && (
                    <Link 
                      href={feature.link}
                      className="inline-flex items-center mt-4 text-primary hover:text-primary/80"
                    >
                      Learn more
                      <BiRightArrowAlt className="ml-1" />
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Test Authentication Button */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        <button
          onClick={loginAsAON}
          className="px-4 py-2 bg-surface/80 backdrop-blur-sm hover:bg-surface border border-border rounded-lg text-sm font-medium shadow-lg flex items-center gap-2 group"
        >
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=aon" 
            alt="AON" 
            className="w-4 h-4 rounded-full"
          />
          Login as AON
          <span className="text-xs text-text/60 group-hover:text-text/80">
            (Quick Test)
          </span>
        </button>
        {authUser && (
          <button
            onClick={() => setAuthUser(null)}
            className="px-4 py-2 bg-surface/80 backdrop-blur-sm hover:bg-surface border border-border rounded-lg text-sm font-medium shadow-lg flex items-center gap-2 group"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Logout
          </button>
        )}
      </div>

      {/* GitHub Authentication */}
      <div className="fixed bottom-4 left-4 z-50 flex gap-2">
        {supabaseUser ? (
          <button
            onClick={async () => {
              await signOut()
              setSupabaseUser(null)
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium shadow-lg flex items-center gap-2 group"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={signInWithGithub}
            className="px-4 py-2 bg-[#24292F] text-white rounded-lg text-sm font-medium shadow-lg flex items-center gap-2 group"
          >
            <FaGithub className="w-4 h-4" />
            Sign in with GitHub
          </button>
        )}
      </div>
    </div>
  );
}