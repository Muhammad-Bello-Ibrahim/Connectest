# 🎓 Connectrix

> A comprehensive university club management and social platform designed to connect students, clubs, and academic departments seamlessly.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## 📖 Overview

Connectrix is an all-in-one platform that revolutionizes how students, clubs, and university administrators interact. Built specifically for university environments, it provides a centralized hub for club management, social networking, event coordination, and campus navigation.

### Key Features

- **🏛️ Club Management**: Create, join, and manage clubs with ease. Track memberships and activities in one place.
- **💳 Seamless Payments**: Pay club dues securely with Paystack integration. Manage financial transactions effortlessly.
- **🗳️ Election System**: Conduct fair and transparent club elections with our built-in voting system.
- **🗺️ Campus Navigation**: Find your way around campus with the built-in router. Locate buildings, lecture halls, and facilities.
- **📚 Resource Hub**: Access lecture materials, study guides, and past questions in a centralized resource section.
- **📅 Event Management**: Schedule, promote, and manage club events with attendance tracking and feedback collection.
- **📱 Social Newsfeed**: Real-time post creation, sharing, and engagement with the university community.
- **🔔 Notifications**: Stay updated with real-time alerts for events, club activities, and announcements.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local instance or MongoDB Atlas account)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Muhammad-Bello-Ibrahim/Connectest.git
   cd Connectest
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory and add the following:

   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key
   
   # Email (optional for password reset)
   EMAIL_USER=your_email@example.com
   EMAIL_PASSWORD=your_email_password
   
   # Payment (optional for payment features)
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

### Building for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component library
- **React Hook Form** - Form management with Zod validation
- **Lucide Icons** - Modern icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** with **Mongoose** - Document database
- **JWT (Jose)** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email services

### Security Features
- CSRF protection
- XSS prevention
- SQL injection protection
- Rate limiting
- Input validation and sanitization
- Secure cookie handling

## 👥 User Roles

### Student
- Join and manage club memberships
- Participate in events and elections
- Access campus resources and navigation
- Engage with the social newsfeed
- Manage personal profile

### Admin
- Comprehensive user and club management
- System analytics and reporting
- Content moderation
- Role management

### Dean
- Faculty-level oversight
- Academic club supervision
- Event coordination
- Student engagement tracking

## 📂 Project Structure

```
Connectest/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
├── lib/                   # Utility functions and models
│   ├── models/           # Database models
│   └── utils.ts          # Helper functions
├── public/               # Static assets
├── scripts/              # Utility scripts
├── middleware.ts         # Next.js middleware for auth
└── package.json          # Project dependencies
```

## 🤝 Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to this project.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact & Support

- **GitHub Issues**: For bug reports and feature requests, please use the [Issues](https://github.com/Muhammad-Bello-Ibrahim/Connectest/issues) page
- **Email**: connectrix@gsu.edu.ng
- **Location**: Gombe State University, Nigeria

## 🙏 Acknowledgments

- Built for Gombe State University community
- Special thanks to all contributors and testers
- Inspired by the need for better campus connectivity

## 📸 Screenshots

_Coming soon! Screenshots of the platform will be added here._

---

**Made with ❤️ by the Connectrix Team**