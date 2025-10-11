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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">Connectrix</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              {isAuthenticated() ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user?.name || 'User'}
                  </span>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Register</Button>
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

          <div className="w-full relative z-10 px-4 sm:px-6 md:px-8 py-20">
            <div className="w-full">
              {/* Hero Content */}
              <div className="text-center space-y-8 animate-fade-in">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Your Campus's #1 Club Platform</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
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
                <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  The ultimate platform for campus club management, student engagement, and community building
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link href="/register">
                    <Button size="lg" className="px-10 py-7 text-lg font-semibold shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300 group">
                      Start For Free
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="#demo">
                    <Button size="lg" variant="outline" className="px-10 py-7 text-lg font-semibold hover:bg-primary/5 transition-all duration-300">
                      Watch Demo
                    </Button>
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Free Forever</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>No Credit Card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Setup in 2 Minutes</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
                  <div className="space-y-2">
                    <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">50+</div>
                    <div className="text-sm text-muted-foreground">Active Clubs</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">1K+</div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-primary">100+</div>
                    <div className="text-sm text-muted-foreground">Events</div>
                  </div>
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="mt-20 animate-scale-in px-4 sm:px-8 md:px-16 lg:px-32">
                <div className="relative w-full max-w-6xl mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
                  <div className="relative rounded-2xl overflow-hidden border-4 border-primary/20 shadow-2xl hover-lift">
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
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Features Section - Redesigned */}
        <section className="py-24 md:py-32 relative overflow-hidden w-full">
          <div className="w-full px-4 sm:px-6 md:px-8">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Powerful Features</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Everything You Need,<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                  All In One Place
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Built for students, clubs, and administrators to collaborate seamlessly
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
              {/* Feature 1 */}
              <div className="group relative p-8 rounded-2xl border bg-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Club Management</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Create, join, and manage clubs effortlessly. Track memberships, activities, and engagement all in one dashboard.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative p-8 rounded-2xl border bg-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold">Event Management</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Schedule, promote, and manage events with RSVP tracking, reminders, and post-event feedback collection.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative p-8 rounded-2xl border bg-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-7 h-7 text-pink-600" />
                  </div>
                  <h3 className="text-2xl font-bold">Analytics & Insights</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get detailed reports on club performance, member engagement, and event attendance with visual dashboards.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group relative p-8 rounded-2xl border bg-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold">Secure Elections</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Conduct transparent club elections with built-in voting system, real-time results, and audit trails.
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="group relative p-8 rounded-2xl border bg-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Globe className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold">Social Feed</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Stay connected with a campus-wide social feed featuring posts, announcements, and updates from all clubs.
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="group relative p-8 rounded-2xl border bg-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold">Member Engagement</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Foster community with discussion forums, polls, resource sharing, and direct messaging between members.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Redesigned */}
        <section className="py-24 md:py-32 bg-muted/30 w-full">
          <div className="w-full px-4 sm:px-6 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm font-semibold text-primary">Loved by Students & Clubs</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                What Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Community</span> Says
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 w-full">
              {/* Testimonial 1 */}
              <div className="group p-8 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "Connectrix made it so easy to join clubs and stay updated on events! I love how I can access all my club resources in one place."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                    AG
                  </div>
                  <div>
                    <div className="font-semibold">Adams Geek</div>
                    <div className="text-sm text-muted-foreground">Computer Science Student</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="group p-8 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "Managing our club has never been smoother. The election system is a game-changer for ensuring transparent leadership transitions!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                    IM
                  </div>
                  <div>
                    <div className="font-semibold">Isma'il Danladi</div>
                    <div className="text-sm text-muted-foreground">NACOS President</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="group p-8 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "Connectrix has transformed how we oversee club activities. The analytics and approval system save me hours of work each week."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-600 to-orange-600 flex items-center justify-center text-white font-bold">
                    HB
                  </div>
                  <div>
                    <div className="font-semibold">Dr. Hassana Y. Bello</div>
                    <div className="text-sm text-muted-foreground">Dean of Student Affairs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80 z-0"></div>
          <div className="absolute inset-0 bg-[url('/studentBgi.jpeg')] opacity-10 bg-cover bg-center"></div>
          {/* Animated circles */}
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-soft" style={{animationDelay: '1s'}}></div>
          
          <div className="container relative z-10 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-8 text-center animate-fade-in">
              <div className="space-y-6 max-w-3xl">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white">
                  Ready to Transform Campus Club Management?
                </h2>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                  Join Connectrix today and experience the future of student engagement. Get started in minutes.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="px-10 py-6 text-lg shadow-2xl hover:scale-105 transition-all duration-300">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="px-10 py-6 text-lg border-white text-white hover:bg-white/10 transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
              </div>
              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-white/80">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Setup in minutes</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Connectrix</h3>
              <p className="text-sm text-muted-foreground">Empowering Campus Communities</p>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-primary">
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
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
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
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
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
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
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
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-2 shrink-0" />
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
                    className="h-5 w-5 text-primary mr-2 shrink-0"
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
                    className="h-5 w-5 text-primary mr-2 shrink-0"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <span className="text-muted-foreground">info@connectrix.edu.ng</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Connectrix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

