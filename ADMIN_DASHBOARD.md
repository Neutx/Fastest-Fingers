# Admin Dashboard

## Overview
The KREO Fastest Fingers admin dashboard provides comprehensive analytics and user management capabilities for the typing test application.

## Access
- **URL**: `/admin`
- **Authentication**: Only accessible to the admin user with id pass:
    id: keyboardlessadmin@kreo.com and password : KeyboardRizzmaster@2025
    

. Can be changable. Contact me (Sannidhya)
- **Security**: Non-admin users are automatically redirected to the homepage

## Features

### 📊 Statistics Cards
The dashboard displays key metrics in an easy-to-read card format:

1. **Total Users** - Total number of registered users
2. **Clicked Hive 65 Button** - Users who clicked the button
3. **Completed Tests** - Users who finished the typing test
4. **Average WPM** - Average words per minute across all completed tests
5. **Today's Signups** - New users registered today

### 📋 User Data Table
Comprehensive table showing all user information:

**Columns:**
- User (Profile picture, name, email)
- Email Verified status
- Location (Country, City)
- Test Status (Completed/Pending)
- WPM (Words per minute)
- Accuracy percentage
- Best Score
- Join date
- Actions (View details)

**Features:**
- ✅ Search functionality (name, email, country)
- ✅ Pagination (10 users per page)
- ✅ User selection (individual or select all)
- ✅ Detailed user modal with complete information

### 📤 Export Functionality
- Export all users or selected users to CSV format
- Includes all collected data:
  - Basic info (name, email, verification status)
  - Location data (IP, city, region, country, ISP, timezone)
  - Test results (WPM, accuracy, score)
  - Device information (platform, language, screen resolution, user agent)
  - Marketing data (UTM parameters, referrer)
  - Timestamps (created, last login, test completion)

### 🔍 User Detail Modal
Clicking the eye icon opens a detailed view showing:
- **Basic Information**: Name, email, UID, verification status
- **Location**: Country, city, IP address, ISP
- **Test Results**: WPM, accuracy, score (if completed)
- **Device Information**: Platform, language, screen resolution, user agent
- **Marketing Data**: UTM parameters and referrer information

## Data Collected
The system automatically collects comprehensive user data:

### User Profile
- Google account information (name, email, photo, verification status)
- Unique user ID (UID)

### Location & Network
- IP address and geolocation (via ipapi.co)
- City, region, country
- Timezone and ISP information

### Device & Browser
- User agent string
- Platform and language
- Screen resolution
- Browser timezone

### Marketing Attribution
- UTM parameters (source, medium, campaign, term, content)
- Referrer URL
- Entry point tracking

### Test Performance
- Words per minute (WPM)
- Accuracy percentage
- Calculated score
- Test completion status
- Timestamps for test completion

## Security Features
- **Admin-only access** with hardcoded UID verification
- **Firebase security rules** restrict admin data access
- **Automatic redirection** for unauthorized users
- **Obfuscated admin endpoint** (not discoverable through normal navigation)

## Technical Implementation
- **Frontend**: React with TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth with Google Sign-in
- **Styling**: Tailwind CSS with custom KREO branding
- **Export**: Client-side CSV generation and download

## Usage Instructions
1. Sign in with the admin Google account
2. Navigate to `/admin`
3. View statistics and user data
4. Use search to find specific users
5. Select users for bulk export
6. Click export button to download CSV
7. Click eye icon to view detailed user information

## File Structure
```
src/
├── app/admin/page.tsx              # Main admin page
├── components/admin/
│   ├── admin-dashboard.tsx         # Main dashboard component
│   ├── stats-cards.tsx            # Statistics cards
│   ├── simple-users-table.tsx     # User data table
│   └── export-button.tsx          # CSV export functionality
├── types/admin.ts                  # TypeScript interfaces
└── lib/firebase.ts                # Firebase configuration
```

## Future Enhancements
- Real-time data updates
- Advanced filtering and sorting
- User management actions (disable/enable accounts)
- Performance analytics and trends
- Email notification system
- Bulk user operations