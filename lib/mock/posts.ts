// Mock posts data for development/testing

export const mockPosts = [
  {
    _id: "mock-1",
    title: "Welcome to Connectrix! 🎉",
    content: "Hey everyone! I'm excited to be part of this amazing campus community. Looking forward to connecting with fellow students and joining some cool clubs. What clubs would you recommend for someone interested in tech and innovation?",
    author: {
      _id: "user-1",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    club: null,
    tags: ["introduction", "tech"],
    likes: ["user-2", "user-3", "user-4"],
    comments: [],
    shares: 2,
    isPinned: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    likeCount: 3,
    commentCount: 5
  },
  {
    _id: "mock-2",
    title: "Tech Club Meeting This Friday! 💻",
    content: "Don't miss our weekly meetup this Friday at 4 PM in the Computer Lab. We'll be discussing AI and Machine Learning trends, plus we have a special guest speaker from a top tech company! Free pizza and drinks for all attendees. See you there!",
    author: {
      _id: "user-2",
      name: "Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
    },
    club: {
      _id: "club-1",
      name: "Tech Innovation Club",
      abbreviation: "TIC"
    },
    tags: ["event", "tech", "AI"],
    likes: ["user-1", "user-3", "user-5", "user-6", "user-7"],
    comments: [],
    shares: 8,
    isPinned: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    likeCount: 5,
    commentCount: 12
  },
  {
    _id: "mock-3",
    title: "Study Group for Final Exams",
    content: "Hey guys! I'm organizing a study group for the upcoming final exams. We'll meet at the library every evening from 6-9 PM. All subjects welcome! Let's help each other succeed. Drop a comment if you're interested!",
    author: {
      _id: "user-3",
      name: "Aisha Mohammed",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha"
    },
    club: null,
    tags: ["study", "exams", "collaboration"],
    likes: ["user-1", "user-2", "user-4", "user-8"],
    comments: [],
    shares: 3,
    isPinned: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    likeCount: 4,
    commentCount: 8
  },
  {
    _id: "mock-4",
    title: "Football Match - Engineering vs Sciences! ⚽",
    content: "The most anticipated match of the semester is happening this Saturday at 3 PM on the main field! Engineering Faculty vs Sciences Faculty. Come support your team! There will be food stalls and entertainment. Entry is free for all students!",
    author: {
      _id: "user-4",
      name: "David Okafor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
    },
    club: {
      _id: "club-2",
      name: "Sports Recreation Club",
      abbreviation: "SRC"
    },
    tags: ["sports", "event", "football"],
    likes: ["user-1", "user-2", "user-3", "user-5", "user-6", "user-9", "user-10"],
    comments: [],
    shares: 15,
    isPinned: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    likeCount: 7,
    commentCount: 23
  },
  {
    _id: "mock-5",
    title: "Lost and Found - Blue Backpack",
    content: "Found a blue backpack near the cafeteria yesterday. It has some textbooks and a laptop inside. If it's yours, please DM me with a description of the contents to claim it. Let's help reunite someone with their belongings!",
    author: {
      _id: "user-5",
      name: "Emma Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
    },
    club: null,
    tags: ["lost-and-found", "help"],
    likes: ["user-2", "user-6"],
    comments: [],
    shares: 5,
    isPinned: false,
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    likeCount: 2,
    commentCount: 4
  },
  {
    _id: "mock-6",
    title: "Photography Workshop This Weekend! 📸",
    content: "Calling all photography enthusiasts! We're hosting a hands-on photography workshop this Sunday from 10 AM to 4 PM. Learn about composition, lighting, and editing from professional photographers. Bring your cameras or smartphones. Limited spots available - register now!",
    author: {
      _id: "user-6",
      name: "James Anderson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James"
    },
    club: {
      _id: "club-3",
      name: "Photography Club",
      abbreviation: "PC"
    },
    tags: ["workshop", "photography", "creative"],
    likes: ["user-1", "user-3", "user-7", "user-8"],
    comments: [],
    shares: 6,
    isPinned: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    likeCount: 4,
    commentCount: 9
  },
  {
    _id: "mock-7",
    title: "Need Roommate for Off-Campus Apartment",
    content: "Looking for a responsible roommate to share a 2-bedroom apartment near campus. Rent is affordable and the place is fully furnished. Must be clean, respectful, and okay with occasional study sessions. Available from next month. Serious inquiries only!",
    author: {
      _id: "user-7",
      name: "Fatima Hassan",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima"
    },
    club: null,
    tags: ["housing", "roommate"],
    likes: ["user-5", "user-9"],
    comments: [],
    shares: 4,
    isPinned: false,
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), // 1.25 days ago
    likeCount: 2,
    commentCount: 6
  },
  {
    _id: "mock-8",
    title: "Debate Competition - Register Now! 🎤",
    content: "The annual inter-faculty debate competition is back! This year's theme: 'Technology and Society'. Prizes for winners include cash awards and certificates. Registration deadline is next Friday. Show off your critical thinking and public speaking skills!",
    author: {
      _id: "user-8",
      name: "Daniel Brown",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel"
    },
    club: {
      _id: "club-4",
      name: "Debate Society",
      abbreviation: "DS"
    },
    tags: ["competition", "debate", "event"],
    likes: ["user-2", "user-4", "user-6", "user-10"],
    comments: [],
    shares: 7,
    isPinned: false,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
    likeCount: 4,
    commentCount: 11
  },
  {
    _id: "mock-9",
    title: "Free Tutoring Sessions Available!",
    content: "Struggling with Math or Physics? I'm offering free tutoring sessions every Tuesday and Thursday from 5-7 PM at the library. I scored A+ in both subjects last semester and I'm happy to help fellow students. No payment required, just bring your questions and willingness to learn!",
    author: {
      _id: "user-9",
      name: "Olivia Martinez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia"
    },
    club: null,
    tags: ["tutoring", "education", "help"],
    likes: ["user-1", "user-3", "user-5", "user-7", "user-8"],
    comments: [],
    shares: 9,
    isPinned: false,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    likeCount: 5,
    commentCount: 15
  },
  {
    _id: "mock-10",
    title: "Cultural Night - Celebrating Diversity! 🌍",
    content: "Join us for an amazing Cultural Night next month! Experience food, music, dance, and traditions from around the world. All students are invited to participate and showcase their culture. Let's celebrate what makes our campus community unique and diverse!",
    author: {
      _id: "user-10",
      name: "Ahmed Ibrahim",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed"
    },
    club: {
      _id: "club-5",
      name: "International Students Association",
      abbreviation: "ISA"
    },
    tags: ["cultural", "event", "diversity"],
    likes: ["user-1", "user-2", "user-3", "user-4", "user-6", "user-7"],
    comments: [],
    shares: 12,
    isPinned: false,
    createdAt: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(), // 2.5 days ago
    likeCount: 6,
    commentCount: 18
  }
]

// Function to get mock posts with optional filtering
export function getMockPosts(options?: {
  limit?: number
  clubOnly?: boolean
  generalOnly?: boolean
}) {
  let posts = [...mockPosts]

  if (options?.clubOnly) {
    posts = posts.filter(post => post.club !== null)
  }

  if (options?.generalOnly) {
    posts = posts.filter(post => post.club === null)
  }

  if (options?.limit) {
    posts = posts.slice(0, options.limit)
  }

  return posts
}
