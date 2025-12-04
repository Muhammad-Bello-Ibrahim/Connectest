"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import {
  Users,
  Calendar,
  Zap,
  Shield,
  ArrowRight,
  User,
  Sparkles,
  TrendingUp,
  Globe,
  Heart,
  Star,
  CheckCircle2,
  Menu,
  X,
  MapPin,
  Mail,
  Phone,
} from "lucide-react"

export default function Home() {
  const { user, isAuthenticated } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 sm:h-16 items-center px-4 sm:px-6">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2 group">
              <span className="font-bold text-xl sm:text-2xl text-primary transition-colors group-hover:text-primary/80">Connectrix</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
            <nav className="flex items-center space-x-1 sm:space-x-2">
              {isAuthenticated() ? (
                <>
                  <span className="hidden sm:inline text-sm text-muted-foreground">
                    Welcome, {user?.name || 'User'}
                  </span>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="px-2 sm:px-3">
                      <User className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="px-2 sm:px-3">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="px-3 sm:px-4">Register</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Completely Redesigned */}
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
              <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-soft"></div>
              <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-soft" style={{animationDelay: '2s'}}></div>
              <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-soft" style={{animationDelay: '4s'}}></div>
            </div>
          </div>

          <div className="w-full relative z-10 px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
            <div className="w-full">
              {/* Hero Content */}
              <div className="text-center space-y-6 sm:space-y-8 animate-fade-in">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  <span className="text-xs sm:text-sm font-semibold text-primary">Your Campus's #1 Club Platform</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.1]">
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-purple-600">
                    Connect.
                  </span>
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-primary">
                    Engage.
                  </span>
                  <span className="block text-foreground">
                    Thrive.
                  </span>
                </h1>

                {/* Subheading */}
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
                  The ultimate platform for campus club management, student engagement, and community building
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto px-6 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 group">
                      Start For Free
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="#demo" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold hover:bg-primary/5 transition-all duration-300">
                      Watch Demo
                    </Button>
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span>Free Forever</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span>No Credit Card</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span>Setup in 2 Minutes</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-2xl mx-auto pt-8 sm:pt-12">
                  <div className="space-y-1 sm:space-y-2">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">50+</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Active Clubs</div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">1K+</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Students</div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-primary">100+</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Events</div>
                  </div>
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="mt-12 sm:mt-16 md:mt-20 animate-scale-in px-2 sm:px-4 md:px-8 lg:px-16">
                <div className="relative w-full max-w-6xl mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl"></div>
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-primary/20 shadow-xl sm:shadow-2xl hover-lift">
                    <img
                      src="/userphone.png"
                      alt="Connectrix Dashboard"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden sm:flex">
            <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Features Section - Redesigned */}
        <section id="features" className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden w-full">
          <div className="w-full px-4 sm:px-6 md:px-8">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm font-semibold text-primary">Powerful Features</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold px-2">
                Everything You Need,<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                  All In One Place
                </span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-4">
                Built for students, clubs, and administrators to collaborate seamlessly
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full">
              {/* Feature 1 */}
              <div className="group relative p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative space-y-3 sm:space-y-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Club Management</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Create, join, and manage clubs effortlessly. Track memberships, activities, and engagement all in one dashboard.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative space-y-3 sm:space-y-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-purple-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Event Management</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Schedule, promote, and manage events with RSVP tracking, reminders, and post-event feedback collection.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative space-y-3 sm:space-y-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-pink-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Analytics & Insights</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Get detailed reports on club performance, member engagement, and event attendance with visual dashboards.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group relative p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative space-y-3 sm:space-y-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Secure Elections</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Conduct transparent club elections with built-in voting system, real-time results, and audit trails.
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="group relative p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative space-y-3 sm:space-y-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Social Feed</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Stay connected with a campus-wide social feed featuring posts, announcements, and updates from all clubs.
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="group relative p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative space-y-3 sm:space-y-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-orange-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Member Engagement</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Foster community with discussion forums, polls, resource sharing, and direct messaging between members.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Redesigned */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-muted/30 w-full">
          <div className="w-full px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary fill-primary" />
                <span className="text-xs sm:text-sm font-semibold text-primary">Loved by Students & Clubs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold px-2">
                What Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Community</span> Says
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full">
              {/* Testimonial 1 */}
              <div className="group p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border bg-card hover:shadow-lg transition-all duration-300">
                <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                  "Connectrix made it so easy to join clubs and stay updated on events! I love how I can access all my club resources in one place."
                </p>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    AG
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">Adams Geek</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Computer Science Student</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="group p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border bg-card hover:shadow-lg transition-all duration-300">
                <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                  "Managing our club has never been smoother. The election system is a game-changer for ensuring transparent leadership transitions!"
                </p>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    IM
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">Isma'il Danladi</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">NACOS President</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="group p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border bg-card hover:shadow-lg transition-all duration-300">
                <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                  "Connectrix has transformed how we oversee club activities. The analytics and approval system save me hours of work each week."
                </p>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-600 to-orange-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    HB
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">Dr. Hassana Y. Bello</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Dean of Student Affairs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative w-full py-12 sm:py-16 md:py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80 z-0"></div>
          <div className="absolute inset-0 bg-[url('/studentBgi.jpeg')] opacity-10 bg-cover bg-center"></div>
          {/* Animated circles */}
          <div className="absolute top-10 left-10 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-white/10 rounded-full blur-2xl sm:blur-3xl animate-pulse-soft"></div>
          <div className="absolute bottom-10 right-10 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-white/5 rounded-full blur-2xl sm:blur-3xl animate-pulse-soft" style={{animationDelay: '1s'}}></div>
          
          <div className="container relative z-10 px-4 sm:px-6 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8 text-center animate-fade-in">
              <div className="space-y-4 sm:space-y-6 max-w-3xl">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white px-2">
                  Ready to Transform Campus Club Management?
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed px-4">
                  Join Connectrix today and experience the future of student engagement. Get started in minutes.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 w-full sm:w-auto px-4 sm:px-0">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 sm:px-10 py-5 sm:py-6 text-base sm:text-lg shadow-xl hover:scale-[1.02] transition-all duration-300">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 sm:px-10 py-5 sm:py-6 text-base sm:text-lg border-white text-white hover:bg-white/10 transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
              </div>
              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 text-white/80 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Setup in minutes</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 sm:py-10 md:py-12 lg:py-16 bg-background">
        <div className="container px-4 sm:px-6 md:px-8">
          <div className="grid gap-6 sm:gap-8 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-2 sm:col-span-1 space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-primary">Connectrix</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Empowering Campus Communities</p>
              <div className="flex space-x-3 sm:space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-bold">Quick Links</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-bold">Resources</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1 space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-bold">Contact</h3>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li className="flex items-start">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-1.5 sm:mr-2 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">University Campus, Gombe State University, Nigeria</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-1.5 sm:mr-2 shrink-0 mt-0.5"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span className="text-muted-foreground">+234 903 250 9094</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-1.5 sm:mr-2 shrink-0 mt-0.5"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <span className="text-muted-foreground break-all">info@connectrix.edu.ng</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 sm:mt-10 md:mt-12 border-t pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
            <p>© 2025 Connectrix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

