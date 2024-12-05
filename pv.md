HOME TAB 🏠
Primary landing experience and overview
A. Hero Section
Background video/imagery
Main call-to-action
Quick access buttons
Community stats
B. Quick Actions
Personalized recommendations
Recently viewed
Saved items
Quick access to frequent features
C. Featured Content
Spotlight talents
Upcoming events preview
Latest opportunities
Success stories
D. Live Activities
Currently live events
Active workshops
Ongoing performances
Real-time updates
E. Community Highlights
Recent achievements
New members
Community milestones
Latest collaborations
DISCOVER TAB 🔍
Exploration and search functionality
A. Search & Filters
Advanced search bar
Category filters
Location-based search
Price range filters
Availability filters
B. Categories
Visual category cards
Category-specific stats
Trending categories
New additions
C. Talent Showcase
Featured professionals
New talents
Rising stars
Most booked
D. Opportunities
Job listings
Collaboration requests
Project opportunities
Learning opportunities
E. Educational Content
Tutorials
Industry insights
Success guides
Best practices
TRENDING TAB 🔥
Current popularity and trends
A. Hot Right Now
Trending talents
Viral content
Popular events
Hot opportunities
B. Trending Categories
Rising niches
Popular skills
In-demand services
Growing sectors
C. Community Trends
Most viewed profiles
Most booked services
Popular collaborations
Viral success stories
D. Market Insights
Industry trends
Price trends
Demand analysis
Success patterns
E. Trending Content
Popular posts
Viral videos
Featured works
Community highlights
EVENTS TAB 📅
Event discovery and management
A. Event Discovery
Featured events
Calendar view
Category-based browsing
Location-based events
B. Event Types
Performances
Workshops
Exhibitions
Networking events
Training sessions
Competitions
Community gatherings
C. Event Management
Ticket booking
RSVP system
Event reminders
Schedule planning
Event sharing
D. Event Features
Virtual events
Hybrid events
Live streaming
Recording access
Q&A sessions
E. Event Analytics
Attendance tracking
Engagement metrics
Feedback collection
Success measures


import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

async function signInWithGithub() {
    const {error} = await supabase.auth.signInWithOAuth({
    provider: 'github

    })

    if (error){
        console.error(error)
    }
}

async function signOut(){
    const {error} = await supabase.auth.signOut();

    if (error){
        console.error(error)
    }
}

export default function Home() {

    const [user, setUser] = useState();

    useEffect(() => {
        async function getSession(){
            const {data} = await supabase.auth.getSession();
            if (data?.session){
                setUser(data.session.user)
            } else {
                setUser(null)
            }
        }

        getSession()
    }, [])

    console.log({user})

    
    return (
        <div></div>
    )
}