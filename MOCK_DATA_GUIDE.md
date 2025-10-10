# Mock Data Guide

## 📝 Overview

Mock data has been added to the newsfeed to help with development and testing. The feed will automatically use mock posts when the API is unavailable or returns an error.

---

## 🎯 Mock Posts Features

### 10 Pre-populated Posts
The mock data includes 10 diverse posts covering:
- Welcome/Introduction posts
- Club event announcements
- Study groups
- Sports events
- Lost and found
- Workshops
- Housing/roommate searches
- Competitions
- Tutoring offers
- Cultural events

### Post Variety
- **5 General Posts**: Not associated with any club
- **5 Club Posts**: Associated with different clubs (TIC, SRC, PC, DS, ISA)
- Various engagement levels (likes, comments, shares)
- Different timestamps (2 hours to 2.5 days ago)
- Realistic content and interactions

---

## 🔧 How It Works

### Automatic Fallback
The newsfeed automatically uses mock data when:
1. The `/api/posts` endpoint fails
2. Network errors occur
3. API returns non-OK status

### Code Implementation
```typescript
// In app/dashboard/newsfeed/page.tsx
import { getMockPosts } from "@/lib/mock/posts"

const fetchPosts = async () => {
  try {
    const res = await fetch(`/api/posts?${params}`)
    
    if (res.ok) {
      const data = await res.json()
      setPosts(data.posts || [])
    } else {
      // Fallback to mock data
      setPosts(getMockPosts())
    }
  } catch (error) {
    // Fallback to mock data on error
    setPosts(getMockPosts())
  }
}
```

---

## 📦 Mock Data Structure

### Location
`lib/mock/posts.ts`

### Post Structure
```typescript
{
  _id: string              // Unique identifier
  title: string            // Post title
  content: string          // Post content
  author: {
    _id: string
    name: string
    avatar: string         // Dicebear avatar URL
  }
  club?: {                 // Optional club association
    _id: string
    name: string
    abbreviation: string
  }
  tags: string[]           // Post tags
  likes: string[]          // Array of user IDs
  comments: any[]          // Comments array
  shares: number           // Share count
  isPinned: boolean        // Pinned status
  createdAt: string        // ISO timestamp
  likeCount: number        // Total likes
  commentCount: number     // Total comments
}
```

### Helper Function
```typescript
getMockPosts(options?: {
  limit?: number          // Limit number of posts
  clubOnly?: boolean      // Only club posts
  generalOnly?: boolean   // Only general posts
})
```

---

## 🎨 Mock Post Examples

### 1. Welcome Post
- **Author**: Sarah Johnson
- **Type**: General
- **Engagement**: 3 likes, 5 comments
- **Time**: 2 hours ago

### 2. Tech Club Event
- **Author**: Michael Chen
- **Club**: Tech Innovation Club (TIC)
- **Type**: Event announcement
- **Engagement**: 5 likes, 12 comments, 8 shares
- **Pinned**: Yes

### 3. Study Group
- **Author**: Aisha Mohammed
- **Type**: General
- **Engagement**: 4 likes, 8 comments

### 4. Sports Match
- **Author**: David Okafor
- **Club**: Sports Recreation Club (SRC)
- **Type**: Event
- **Engagement**: 7 likes, 23 comments, 15 shares

### 5. Lost & Found
- **Author**: Emma Williams
- **Type**: General
- **Engagement**: 2 likes, 4 comments

---

## 🔄 Using Mock Data in Other Components

### Import the Function
```typescript
import { getMockPosts } from "@/lib/mock/posts"
```

### Get All Posts
```typescript
const allPosts = getMockPosts()
```

### Get Limited Posts
```typescript
const recentPosts = getMockPosts({ limit: 5 })
```

### Get Only Club Posts
```typescript
const clubPosts = getMockPosts({ clubOnly: true })
```

### Get Only General Posts
```typescript
const generalPosts = getMockPosts({ generalOnly: true })
```

---

## 🎭 Avatar Generation

Mock posts use **Dicebear Avatars** for consistent, unique user avatars:
```
https://api.dicebear.com/7.x/avataaars/svg?seed={name}
```

This generates a unique avatar based on the user's name.

---

## 🧪 Testing Scenarios

### Test with Mock Data
1. Disable your backend API
2. Refresh the newsfeed page
3. Mock posts will automatically load
4. Test all interactions (like, comment, share)

### Test with Real Data
1. Enable your backend API
2. Ensure `/api/posts` endpoint works
3. Real posts will load
4. Mock data won't be used

---

## 📝 Customizing Mock Data

### Add New Posts
Edit `lib/mock/posts.ts` and add to the `mockPosts` array:

```typescript
{
  _id: "mock-11",
  title: "Your New Post Title",
  content: "Your post content here...",
  author: {
    _id: "user-11",
    name: "Your Name",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=YourName"
  },
  club: null, // or add club object
  tags: ["tag1", "tag2"],
  likes: [],
  comments: [],
  shares: 0,
  isPinned: false,
  createdAt: new Date().toISOString(),
  likeCount: 0,
  commentCount: 0
}
```

### Modify Existing Posts
Simply edit the post objects in the `mockPosts` array.

### Change Avatar Style
Replace `avataaars` with other Dicebear styles:
- `adventurer`
- `big-smile`
- `bottts`
- `fun-emoji`
- `personas`
- More at: https://www.dicebear.com/styles

---

## 🚀 Production Considerations

### Remove Mock Data
Before production, you may want to:

1. **Remove the fallback** (optional):
```typescript
if (res.ok) {
  const data = await res.json()
  setPosts(data.posts || [])
} else {
  // Show error instead of mock data
  toast({
    variant: "destructive",
    title: "Error",
    description: "Failed to load posts"
  })
}
```

2. **Keep the fallback** for better UX:
- Users see content even if API fails
- Better perceived performance
- Graceful degradation

### Environment-Based Loading
```typescript
const USE_MOCK_DATA = process.env.NODE_ENV === 'development'

if (!res.ok) {
  if (USE_MOCK_DATA) {
    setPosts(getMockPosts())
  } else {
    toast({ title: "Error", description: "Failed to load posts" })
  }
}
```

---

## ✅ Benefits of Mock Data

1. **Development**: Work without backend
2. **Testing**: Consistent test data
3. **Demos**: Always have content to show
4. **Offline**: App works without connection
5. **Performance**: Instant loading
6. **Debugging**: Known data state

---

## 📊 Mock Data Statistics

- **Total Posts**: 10
- **General Posts**: 5
- **Club Posts**: 5
- **Unique Clubs**: 5 (TIC, SRC, PC, DS, ISA)
- **Unique Authors**: 10
- **Total Likes**: 42
- **Total Comments**: 111
- **Total Shares**: 71
- **Pinned Posts**: 1

---

## 🎯 Next Steps

1. ✅ Mock data is now active in newsfeed
2. Test the newsfeed with and without backend
3. Customize mock posts as needed
4. Add mock data to other components (clubs, events, etc.)
5. Consider environment-based loading for production

---

**Status**: ✅ Active  
**Location**: `lib/mock/posts.ts`  
**Usage**: Automatic fallback in newsfeed  
**Customizable**: Yes  

---

Last Updated: 2025-10-10
