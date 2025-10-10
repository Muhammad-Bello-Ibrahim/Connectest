# Integration Checklist

## 🔧 Integrating Logging into Existing API Routes

### Step 1: Import Utilities

Add these imports to your existing API routes:

```typescript
import { createAuditLog, getClientIp } from "@/lib/utils/audit"
import { logActivity } from "@/lib/utils/activity"
import { logError } from "@/lib/utils/errorLogger"
```

---

## 📝 User API Routes Integration

### `/api/users/route.ts` (Create User)

```typescript
export async function POST(req: Request) {
  try {
    // ... existing user creation code ...
    const user = await User.create(userData)

    // ADD THIS: Log audit
    await createAuditLog({
      userId: session.user.id, // or admin ID
      userEmail: session.user.email,
      action: "user_created",
      targetType: "user",
      targetId: user._id.toString(),
      details: { name: user.name, email: user.email, role: user.role },
      ipAddress: getClientIp(req),
      userAgent: req.headers.get("user-agent") || undefined,
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    // ADD THIS: Log error
    await logError({
      errorType: "api_error",
      severity: "high",
      message: error.message,
      stack: error.stack,
      endpoint: req.url,
      method: "POST",
    })
    
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### `/api/users/[id]/route.ts` (Update User)

```typescript
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    // ... existing update code ...
    const user = await User.findByIdAndUpdate(params.id, updates, { new: true })

    // ADD THIS: Log audit
    await createAuditLog({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "user_updated",
      targetType: "user",
      targetId: params.id,
      details: { changes: updates },
      ipAddress: getClientIp(req),
      userAgent: req.headers.get("user-agent") || undefined,
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    await logError({
      errorType: "api_error",
      severity: "medium",
      message: error.message,
      endpoint: req.url,
      method: "PATCH",
    })
    
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### `/api/users/[id]/route.ts` (Delete User)

```typescript
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await User.findByIdAndDelete(params.id)

    // ADD THIS: Log audit
    await createAuditLog({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "user_deleted",
      targetType: "user",
      targetId: params.id,
      details: { name: user.name, email: user.email },
      ipAddress: getClientIp(req),
      userAgent: req.headers.get("user-agent") || undefined,
    })

    return NextResponse.json({ message: "User deleted" })
  } catch (error: any) {
    await logError({
      errorType: "api_error",
      severity: "high",
      message: error.message,
      endpoint: req.url,
      method: "DELETE",
    })
    
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

## 🏢 Club API Routes Integration

### `/api/clubs/route.ts` (Create Club)

```typescript
export async function POST(req: Request) {
  try {
    const club = await Club.create(clubData)

    // ADD THIS: Log audit
    await createAuditLog({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "club_created",
      targetType: "club",
      targetId: club._id.toString(),
      details: { name: club.name, type: club.type },
      ipAddress: getClientIp(req),
      userAgent: req.headers.get("user-agent") || undefined,
    })

    return NextResponse.json({ club })
  } catch (error: any) {
    await logError({
      errorType: "api_error",
      severity: "medium",
      message: error.message,
      endpoint: req.url,
      method: "POST",
    })
    
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### `/api/clubs/[id]/route.ts` (Update Club)

```typescript
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const club = await Club.findByIdAndUpdate(params.id, updates, { new: true })

    // ADD THIS: Log audit
    await createAuditLog({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "club_updated",
      targetType: "club",
      targetId: params.id,
      details: { changes: updates },
      ipAddress: getClientIp(req),
      userAgent: req.headers.get("user-agent") || undefined,
    })

    return NextResponse.json({ club })
  } catch (error: any) {
    await logError({
      errorType: "api_error",
      severity: "medium",
      message: error.message,
      endpoint: req.url,
      method: "PATCH",
    })
    
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

## 🔐 Authentication Routes Integration

### `/api/auth/login` or Login Handler

```typescript
// After successful login
await logActivity({
  userId: user._id.toString(),
  activityType: "login",
  description: "User logged in",
  ipAddress: getClientIp(req),
  userAgent: req.headers.get("user-agent") || undefined,
  device: parseUserAgent(req.headers.get("user-agent") || ""),
})

await createAuditLog({
  userId: user._id.toString(),
  userEmail: user.email,
  action: "login",
  targetType: "user",
  targetId: user._id.toString(),
  ipAddress: getClientIp(req),
  userAgent: req.headers.get("user-agent") || undefined,
  status: "success",
})
```

### `/api/auth/logout` or Logout Handler

```typescript
await logActivity({
  userId: session.user.id,
  activityType: "logout",
  description: "User logged out",
  ipAddress: getClientIp(req),
  userAgent: req.headers.get("user-agent") || undefined,
})

await createAuditLog({
  userId: session.user.id,
  userEmail: session.user.email,
  action: "logout",
  targetType: "user",
  targetId: session.user.id,
  ipAddress: getClientIp(req),
  userAgent: req.headers.get("user-agent") || undefined,
})
```

### Password Reset

```typescript
await createAuditLog({
  userId: user._id.toString(),
  userEmail: user.email,
  action: "password_reset",
  targetType: "user",
  targetId: user._id.toString(),
  ipAddress: getClientIp(req),
  userAgent: req.headers.get("user-agent") || undefined,
})
```

---

## 📱 User Activity Logging

### Post Creation

```typescript
await logActivity({
  userId: session.user.id,
  activityType: "post_created",
  description: `Created post: ${post.title}`,
  metadata: { postId: post._id, title: post.title },
  ipAddress: getClientIp(req),
  userAgent: req.headers.get("user-agent") || undefined,
})
```

### Club Join

```typescript
await logActivity({
  userId: session.user.id,
  activityType: "club_joined",
  description: `Joined club: ${club.name}`,
  metadata: { clubId: club._id, clubName: club.name },
  ipAddress: getClientIp(req),
  userAgent: req.headers.get("user-agent") || undefined,
})
```

### Event Registration

```typescript
await logActivity({
  userId: session.user.id,
  activityType: "event_attended",
  description: `Registered for event: ${event.title}`,
  metadata: { eventId: event._id, eventTitle: event.title },
  ipAddress: getClientIp(req),
  userAgent: req.headers.get("user-agent") || undefined,
})
```

---

## 🚨 Error Logging Examples

### API Errors

```typescript
try {
  // Your code
} catch (error: any) {
  await logError({
    errorType: "api_error",
    severity: "high",
    message: error.message,
    stack: error.stack,
    endpoint: req.url,
    method: req.method,
    userId: session?.user?.id,
    ipAddress: getClientIp(req),
    userAgent: req.headers.get("user-agent") || undefined,
  })
}
```

### Database Errors

```typescript
try {
  await User.create(userData)
} catch (error: any) {
  await logError({
    errorType: "database_error",
    severity: "critical",
    message: error.message,
    stack: error.stack,
    endpoint: req.url,
    method: req.method,
  })
}
```

### Validation Errors

```typescript
if (!email || !password) {
  await logError({
    errorType: "validation_error",
    severity: "low",
    message: "Missing required fields",
    endpoint: req.url,
    method: req.method,
    requestBody: { email: !!email, password: !!password },
  })
  
  return NextResponse.json({ error: "Missing fields" }, { status: 400 })
}
```

---

## ✅ Integration Checklist

### User Routes
- [ ] `/api/users` POST - Create user
- [ ] `/api/users/[id]` PATCH - Update user
- [ ] `/api/users/[id]` DELETE - Delete user
- [ ] `/api/users/[id]/activate` - Activate user
- [ ] `/api/users/[id]/deactivate` - Deactivate user

### Club Routes
- [ ] `/api/clubs` POST - Create club
- [ ] `/api/clubs/[id]` PATCH - Update club
- [ ] `/api/clubs/[id]` DELETE - Delete club
- [ ] `/api/clubs/[id]/members` POST - Add member
- [ ] `/api/clubs/[id]/members` DELETE - Remove member

### Authentication Routes
- [ ] Login handler - Log login activity
- [ ] Logout handler - Log logout activity
- [ ] Password reset - Log password changes
- [ ] Registration - Log new user creation

### Activity Logging
- [ ] Post creation
- [ ] Comment creation
- [ ] Club join/leave
- [ ] Event registration
- [ ] Profile updates

### Error Logging
- [ ] All API error handlers
- [ ] Database connection errors
- [ ] Validation errors
- [ ] Authentication errors

---

## 🔍 Testing Integration

### Test Audit Logs

1. Perform an action (e.g., create user)
2. Go to `/dashboard/admin/logs/audit`
3. Verify log appears with correct details
4. Check IP address and user agent are captured

### Test Activity Logs

1. Perform user activity (e.g., login)
2. Query activity logs via API or database
3. Verify activity is logged with metadata

### Test Error Logs

1. Trigger an error (e.g., invalid data)
2. Go to `/dashboard/admin/logs/errors`
3. Verify error appears with stack trace
4. Test error resolution workflow

---

## 📊 Monitoring Setup

### Daily Tasks
1. Check error logs for critical errors
2. Review audit logs for suspicious activity
3. Monitor activity patterns

### Weekly Tasks
1. Export audit logs for compliance
2. Review error trends
3. Clean up resolved errors

### Monthly Tasks
1. Generate activity reports
2. Analyze user behavior
3. System health review

---

## 🎯 Best Practices

### Do's
✅ Log all admin actions
✅ Log authentication events
✅ Log data modifications
✅ Include IP and user agent
✅ Use appropriate severity levels
✅ Add meaningful details

### Don'ts
❌ Log sensitive data (passwords, tokens)
❌ Log excessive details
❌ Skip error logging
❌ Ignore failed logs
❌ Log in synchronous blocking way

---

## 🔄 Migration Script (Optional)

If you need to add logging to many routes at once, consider creating a middleware:

```typescript
// middleware/logging.ts
export async function withLogging(
  handler: Function,
  options: { action: string; targetType: string }
) {
  return async (req: Request, context: any) => {
    try {
      const result = await handler(req, context)
      
      // Log success
      await createAuditLog({
        userId: context.session?.user?.id || "system",
        userEmail: context.session?.user?.email || "system",
        action: options.action,
        targetType: options.targetType,
        ipAddress: getClientIp(req),
        userAgent: req.headers.get("user-agent") || undefined,
        status: "success",
      })
      
      return result
    } catch (error: any) {
      // Log error
      await logError({
        errorType: "api_error",
        severity: "high",
        message: error.message,
        stack: error.stack,
        endpoint: req.url,
        method: req.method,
      })
      
      throw error
    }
  }
}
```

---

## 📝 Notes

- Logging is non-blocking and won't affect performance
- Failed logs are caught and logged to console
- TTL indexes auto-cleanup old activity logs
- Audit logs are permanent for compliance
- Error logs can be resolved and archived

---

**Last Updated**: 2025-10-10  
**Version**: 1.0.0
