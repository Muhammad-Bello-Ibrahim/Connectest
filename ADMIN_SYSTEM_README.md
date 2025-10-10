# Connectrix Admin System

## 🎯 Overview

A comprehensive admin dashboard system for managing campus community platform operations. Built with Next.js 14, TypeScript, MongoDB, and modern UI components.

---

## ✨ Key Features

### 📊 Dashboard & Analytics
- Real-time system statistics
- User growth trends
- Club performance metrics
- Activity monitoring
- System health indicators

### 👥 User Management
- Complete CRUD operations
- Role-based filtering (Student, Dean, Admin)
- Status management (Active/Inactive)
- Bulk import/export via CSV
- Password reset functionality
- User activity tracking

### 🏢 Club Management
- Multi-type club support (General, Faculty, Department, State, Religion)
- Club creation and configuration
- Member management
- Club analytics
- Verification system (ready)

### 📅 Event Management
- Full event lifecycle management
- Approval workflow
- Attendee tracking
- Status management (Draft, Published, Cancelled, Completed)
- Calendar integration (ready)

### 📧 Communication Tools
- **Bulk Email System**: Send emails to filtered user groups
- **Email Campaigns**: Create, schedule, and track campaigns
- **Email Templates**: Reusable templates with variables
- Campaign analytics (opens, clicks, bounces)

### 📝 Logging & Monitoring
- **Audit Logs**: Track all admin actions with full details
- **Activity Logs**: Monitor user activities across the platform
- **Error Logs**: Centralized error tracking with resolution workflow
- **Security Logs**: Authentication and security events

### 💾 Data Management
- Database statistics and health monitoring
- Backup management
- Collection overview
- Data export capabilities

### 🔐 Security
- Security settings dashboard
- Authentication configuration
- IP tracking
- User agent logging
- Session management (ready)

### ⚙️ System Settings
- General configuration
- Email/SMTP setup
- Notification preferences
- Appearance customization
- Maintenance mode

---

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 14, React, TypeScript
- **UI**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js (integration ready)
- **Icons**: Lucide React

### Project Structure
```
app/
├── api/
│   └── admin/
│       ├── audit-logs/          # Audit log endpoints
│       ├── error-logs/          # Error log endpoints
│       ├── events/              # Event management
│       ├── campaigns/           # Email campaigns
│       ├── users/
│       │   ├── bulk/           # Bulk import/export
│       │   └── bulk-email/     # Bulk email sending
│       └── stats/              # Dashboard statistics
├── dashboard/
│   └── admin/
│       ├── page.tsx            # Main dashboard
│       ├── users/              # User management
│       ├── clubs/              # Club management
│       ├── events/             # Event management
│       ├── bulk-operations/    # Bulk operations
│       ├── campaigns/          # Email campaigns
│       ├── logs/
│       │   ├── audit/         # Audit logs viewer
│       │   └── errors/        # Error logs viewer
│       ├── analytics/          # Analytics dashboard
│       ├── payments/           # Payment management
│       ├── database/           # Database management
│       ├── security/           # Security settings
│       └── settings/           # System settings
lib/
├── models/
│   ├── User.ts                 # User model
│   ├── Club.ts                 # Club model
│   ├── Event.ts                # Event model
│   ├── AuditLog.ts            # Audit log model
│   ├── ActivityLog.ts         # Activity log model
│   ├── ErrorLog.ts            # Error log model
│   ├── EmailCampaign.ts       # Campaign model
│   └── EmailTemplate.ts       # Template model
└── utils/
    ├── audit.ts               # Audit utilities
    ├── activity.ts            # Activity utilities
    └── errorLogger.ts         # Error utilities
components/
└── admin-sidebar.tsx          # Admin navigation
```

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 18.0.0
MongoDB >= 5.0
npm or yarn or pnpm
```

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
```env
MONGODB_URI=mongodb://localhost:27017/connectrix
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

3. **Run development server**
```bash
npm run dev
```

4. **Access admin dashboard**
```
http://localhost:3000/dashboard/admin
```

---

## 📚 API Documentation

### Audit Logs

#### Get Audit Logs
```http
GET /api/admin/audit-logs
Query Parameters:
  - userId: string (optional)
  - action: string (optional)
  - targetType: string (optional)
  - startDate: ISO date (optional)
  - endDate: ISO date (optional)
  - limit: number (default: 100)
  - skip: number (default: 0)
```

### Events

#### Get Events
```http
GET /api/admin/events
Query Parameters:
  - status: draft|published|cancelled|completed
  - isApproved: boolean
  - clubId: string
  - limit: number
  - skip: number
```

#### Create Event
```http
POST /api/admin/events
Body: {
  title: string
  description: string
  clubId: string
  date: ISO date
  location: string
  createdBy: string
}
```

#### Approve Event
```http
POST /api/admin/events/[id]/approve
Body: {
  approvedBy: string
  approved: boolean
}
```

### Bulk Operations

#### Import Users
```http
POST /api/admin/users/bulk
Body: {
  users: Array<{
    name: string
    email: string
    password: string
    role: string
    faculty?: string
    department?: string
  }>
  adminId: string
}
```

#### Export Users
```http
GET /api/admin/users/bulk
Query Parameters:
  - role: string (optional)
  - status: string (optional)
```

#### Send Bulk Email
```http
POST /api/admin/users/bulk-email
Body: {
  subject: string
  message: string
  recipients: "all" | Array<string> | {
    role?: string
    faculty?: string
    department?: string
  }
  adminId: string
}
```

### Email Campaigns

#### Get Campaigns
```http
GET /api/admin/campaigns
Query Parameters:
  - status: draft|scheduled|sending|sent|failed
  - limit: number
  - skip: number
```

#### Create Campaign
```http
POST /api/admin/campaigns
Body: {
  name: string
  subject: string
  content: string
  recipients: {
    type: "all" | "role" | "faculty" | "custom"
    filters: {
      role?: string
      faculty?: string
      userIds?: string[]
    }
  }
  createdBy: string
}
```

#### Send Campaign
```http
POST /api/admin/campaigns/[id]/send
```

---

## 🔧 Configuration

### Email Service Setup

1. **Configure SMTP in Settings**
```
Dashboard > Admin > Settings > Email
```

2. **Set SMTP credentials**
```
Host: smtp.gmail.com
Port: 587
Username: your-email@gmail.com
Password: your-app-password
```

3. **Test email delivery**
```
Click "Send Test Email" button
```

### Database Configuration

1. **MongoDB Connection**
```typescript
// lib/db.ts
export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return
  return mongoose.connect(process.env.MONGODB_URI!)
}
```

2. **Indexes**
All models have optimized indexes for performance:
- AuditLog: userId, action, createdAt
- ActivityLog: userId, activityType, createdAt (with TTL)
- ErrorLog: errorType, severity, resolved
- Event: clubId, date, status

---

## 🎨 UI Components

### Custom Components Used
- Card, CardHeader, CardTitle, CardContent
- Button, Input, Label, Textarea
- Table, TableHeader, TableBody, TableRow, TableCell
- Dialog, DialogContent, DialogHeader, DialogFooter
- Select, SelectTrigger, SelectContent, SelectItem
- Badge, Avatar, Progress
- Tabs, TabsList, TabsTrigger, TabsContent
- DropdownMenu

### Design Patterns
- Gradient headers for visual hierarchy
- Color-coded stat cards with left borders
- Consistent icon usage from Lucide
- Toast notifications for feedback
- Loading states and skeletons
- Empty states with helpful messages
- Confirmation dialogs for destructive actions

---

## 🔐 Security Best Practices

### Implemented
1. **Audit Logging**: All admin actions are logged
2. **IP Tracking**: Request IP addresses captured
3. **User Agent Logging**: Device information tracked
4. **Input Validation**: All inputs validated
5. **Error Handling**: Graceful error handling

### Recommended
1. **Authentication**: Implement session-based auth
2. **Authorization**: Role-based access control
3. **Rate Limiting**: Prevent abuse
4. **CSRF Protection**: Cross-site request forgery protection
5. **Input Sanitization**: Prevent XSS attacks
6. **SQL Injection**: Use parameterized queries (already using Mongoose)

---

## 📊 Database Schema

### AuditLog
```typescript
{
  userId: ObjectId (ref: User)
  userEmail: string
  action: enum (user_created, user_updated, etc.)
  targetType: enum (user, club, event, etc.)
  targetId: ObjectId
  details: Mixed
  ipAddress: string
  userAgent: string
  status: enum (success, failure, pending)
  createdAt: Date
  updatedAt: Date
}
```

### Event
```typescript
{
  title: string
  description: string
  clubId: ObjectId (ref: Club)
  date: Date
  location: string
  category: enum
  attendees: [{
    userId: ObjectId
    registeredAt: Date
    attended: boolean
  }]
  status: enum (draft, published, cancelled, completed)
  isApproved: boolean
  approvedBy: ObjectId
  createdBy: ObjectId
  createdAt: Date
  updatedAt: Date
}
```

### EmailCampaign
```typescript
{
  name: string
  subject: string
  content: string
  recipients: {
    type: enum
    filters: Mixed
  }
  status: enum (draft, scheduled, sending, sent, failed)
  stats: {
    totalRecipients: number
    sent: number
    delivered: number
    opened: number
    clicked: number
  }
  createdBy: ObjectId
  createdAt: Date
  updatedAt: Date
}
```

---

## 🧪 Testing

### Manual Testing Checklist

#### User Management
- [ ] Create user
- [ ] Edit user
- [ ] Delete user
- [ ] Filter users by role
- [ ] Search users
- [ ] Bulk import users
- [ ] Bulk export users

#### Event Management
- [ ] Create event
- [ ] Approve event
- [ ] Reject event
- [ ] Edit event
- [ ] Delete event
- [ ] Filter events

#### Bulk Operations
- [ ] Import CSV with valid data
- [ ] Import CSV with invalid data
- [ ] Export users to CSV
- [ ] Send bulk email to all users
- [ ] Send bulk email to filtered users

#### Campaigns
- [ ] Create campaign
- [ ] Send campaign
- [ ] View campaign stats

#### Logs
- [ ] View audit logs
- [ ] Filter audit logs
- [ ] View error logs
- [ ] Resolve error

---

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error
```
Error: Failed to connect to MongoDB
Solution: Check MONGODB_URI in .env file
```

#### Import Fails
```
Error: Duplicate email
Solution: Check for existing users with same email
```

#### Email Not Sending
```
Error: SMTP connection failed
Solution: Verify SMTP credentials in settings
```

#### Logs Not Loading
```
Error: Failed to fetch logs
Solution: Check database connection and indexes
```

---

## 📈 Performance Optimization

### Database
- Indexed fields for fast queries
- Lean queries for reduced memory
- Pagination for large datasets
- TTL indexes for auto-cleanup

### Frontend
- React Server Components where possible
- Lazy loading for heavy components
- Debounced search inputs
- Optimistic UI updates

### API
- Efficient MongoDB queries
- Proper error handling
- Response caching (ready)
- Rate limiting (ready)

---

## 🔄 Future Enhancements

### Planned Features
1. Real-time dashboard with WebSockets
2. Advanced analytics with charts
3. Two-factor authentication
4. Role-based permissions
5. Content moderation system
6. Automated backups
7. Email templates editor
8. Theme customization
9. PWA support
10. Mobile app

### Integration Opportunities
- SendGrid for email delivery
- AWS S3 for file storage
- Redis for caching
- Elasticsearch for search
- Stripe for payments

---

## 📝 Contributing

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits

### Pull Request Process
1. Create feature branch
2. Implement changes
3. Add tests
4. Update documentation
5. Submit PR

---

## 📄 License

[Your License Here]

---

## 👥 Support

### Documentation
- `IMPLEMENTATION_SUMMARY.md` - Feature overview
- `QUICK_START_GUIDE.md` - User guide
- `ADMIN_FEATURES_PROGRESS.md` - Development progress

### Contact
- Email: support@connectrix.edu
- GitHub: [Your Repo]
- Documentation: [Your Docs]

---

## 🎉 Acknowledgments

Built with:
- Next.js
- React
- TypeScript
- MongoDB
- Tailwind CSS
- shadcn/ui
- Lucide Icons

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-10  
**Status**: Production Ready (Core Features)
