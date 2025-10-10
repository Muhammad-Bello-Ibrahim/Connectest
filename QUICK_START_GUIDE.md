# Admin Features Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- MongoDB database running
- Node.js environment configured
- Admin user account created

---

## 📋 Available Admin Features

### 1. Dashboard (`/dashboard/admin`)
- Overview statistics
- System alerts
- Recent activities
- Quick actions

### 2. User Management (`/dashboard/admin/users`)
- View all users
- Filter by role, status
- Edit user details
- Activate/deactivate accounts
- Delete users
- Reset passwords

### 3. Club Management (`/dashboard/admin/clubs`)
- View all clubs
- Create new clubs
- Filter by type
- Manage club details
- View club members

### 4. Event Management (`/dashboard/admin/events`)
- View all events
- Approve/reject events
- Create events
- Filter by status
- Track attendees

### 5. Bulk Operations (`/dashboard/admin/bulk-operations`)
- **Import Users**: Upload CSV file to add multiple users
- **Export Users**: Download user data as CSV
- **Bulk Email**: Send emails to filtered user groups

### 6. Email Campaigns (`/dashboard/admin/campaigns`)
- Create email campaigns
- Target specific user groups
- Track campaign statistics
- Schedule campaigns

### 7. Audit Logs (`/dashboard/admin/logs/audit`)
- View all admin actions
- Filter by action type
- Search logs
- Export logs

### 8. Error Logs (`/dashboard/admin/logs/errors`)
- View system errors
- Filter by severity
- Resolve errors
- Track error statistics

### 9. Analytics (`/dashboard/admin/analytics`)
- User growth trends
- Top performing clubs
- Activity overview
- System metrics

### 10. Payments (`/dashboard/admin/payments`)
- View transactions
- Payment statistics
- Gateway configuration

### 11. Database (`/dashboard/admin/database`)
- Database statistics
- Collections overview
- Backup management
- System health

### 12. Security (`/dashboard/admin/security`)
- Security settings
- Authentication configuration
- Security logs
- Quick actions

### 13. Settings (`/dashboard/admin/settings`)
- General settings
- Email configuration
- Notification preferences
- Appearance settings
- Maintenance mode

---

## 📝 Common Tasks

### How to Import Users

1. Navigate to **Bulk Operations** (`/dashboard/admin/bulk-operations`)
2. Click on **Import Users** tab
3. Prepare CSV file with columns:
   ```
   name,email,password,role,faculty,department
   ```
4. Click upload area or drag & drop CSV file
5. Review import results
6. Check success/failure counts

### How to Create an Email Campaign

1. Go to **Campaigns** (`/dashboard/admin/campaigns`)
2. Click **New Campaign**
3. Fill in:
   - Campaign name
   - Recipients (all, by role, by faculty)
   - Email subject
   - Email content
4. Click **Create Campaign**
5. Click **Send** when ready

### How to Approve an Event

1. Navigate to **Events** (`/dashboard/admin/events`)
2. Filter by "Pending Approval"
3. Click actions menu (⋮) on event
4. Select **Approve Event**
5. Confirm approval

### How to View Audit Logs

1. Go to **Audit Logs** (`/dashboard/admin/logs/audit`)
2. Use filters:
   - Action type
   - Target type
   - Date range
3. Search by email or action
4. Click on log for details

### How to Resolve an Error

1. Navigate to **Error Logs** (`/dashboard/admin/logs/errors`)
2. Filter by severity or status
3. Click **Resolve** on error
4. Add resolution notes
5. Mark as resolved

---

## 🔧 CSV Import Format

### User Import Template

```csv
name,email,password,role,faculty,department,state,religion
John Doe,john@example.com,password123,student,Science,Computer Science,Lagos,Christianity
Jane Smith,jane@example.com,password123,student,Arts,English,Abuja,Islam
```

### Required Fields
- `name` - Full name
- `email` - Valid email address
- `password` - User password
- `role` - student, dean, or admin

### Optional Fields
- `faculty` - Faculty name
- `department` - Department name
- `state` - State of origin
- `religion` - Religion

---

## 📊 Understanding Statistics

### Dashboard Stats
- **Total Users**: All registered users
- **Total Clubs**: All clubs in system
- **Active Events**: Upcoming approved events
- **Pending Approvals**: Events awaiting approval

### User Management Stats
- **Total Users**: All users
- **Students**: Users with student role
- **Deans**: Users with dean role
- **Admins**: Users with admin role
- **Active**: Users with active status
- **Inactive**: Users with inactive status

### Event Stats
- **Total Events**: All events
- **Pending Approval**: Events awaiting approval
- **Approved**: Approved events
- **Upcoming**: Future approved events

### Campaign Stats
- **Total Campaigns**: All campaigns
- **Draft**: Campaigns not sent
- **Sent**: Campaigns already sent
- **Total Recipients**: Sum of all recipients

---

## 🎯 Best Practices

### Audit Logging
- Review audit logs regularly
- Monitor suspicious activities
- Export logs for compliance

### User Management
- Use bulk import for large user lists
- Verify data before import
- Keep user data up to date

### Event Management
- Review events promptly
- Communicate approval decisions
- Monitor event attendance

### Email Campaigns
- Test with small group first
- Use clear subject lines
- Track campaign performance

### Error Management
- Resolve critical errors immediately
- Document resolution steps
- Monitor error trends

---

## 🔐 Security Tips

1. **Regular Monitoring**
   - Check audit logs daily
   - Review error logs
   - Monitor user activities

2. **Access Control**
   - Limit admin access
   - Use strong passwords
   - Enable 2FA (when available)

3. **Data Protection**
   - Regular backups
   - Secure sensitive data
   - Follow privacy policies

4. **System Maintenance**
   - Keep software updated
   - Monitor system health
   - Regular security audits

---

## 🆘 Troubleshooting

### Import Fails
- Check CSV format
- Verify required fields
- Check for duplicate emails
- Review error messages

### Email Not Sending
- Verify SMTP settings
- Check email service status
- Review recipient filters
- Check spam folders

### Events Not Showing
- Check approval status
- Verify date filters
- Check club association
- Review event status

### Logs Not Loading
- Check database connection
- Verify date range
- Clear filters
- Refresh page

---

## 📞 Support

### Documentation
- `IMPLEMENTATION_SUMMARY.md` - Feature overview
- `ADMIN_FEATURES_PROGRESS.md` - Development progress

### Getting Help
1. Check documentation
2. Review error logs
3. Contact system administrator
4. Submit bug report

---

## 🔄 Regular Maintenance Tasks

### Daily
- [ ] Review audit logs
- [ ] Check error logs
- [ ] Monitor system health
- [ ] Approve pending events

### Weekly
- [ ] Export user data backup
- [ ] Review campaign performance
- [ ] Check database statistics
- [ ] Update system settings

### Monthly
- [ ] Generate analytics reports
- [ ] Review security logs
- [ ] Clean up old logs
- [ ] System performance review

---

## 📈 Keyboard Shortcuts (Future)

- `Ctrl/Cmd + K` - Global search
- `Ctrl/Cmd + N` - New item
- `Ctrl/Cmd + S` - Save
- `Esc` - Close dialog

---

## 🎨 UI Tips

### Navigation
- Use sidebar for main sections
- Breadcrumbs show current location
- Search bars for quick filtering

### Tables
- Click column headers to sort
- Use filters to narrow results
- Pagination at bottom

### Dialogs
- Click outside to close
- ESC key to cancel
- Tab to navigate fields

---

Last Updated: 2025-10-10
Version: 1.0.0
