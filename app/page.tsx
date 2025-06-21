"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  Users,
  Calendar,
  CreditCard,
  Vote,
  BookOpen,
  MapPin,
  Shield,
  ArrowRight,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Testimonial component
const Testimonial = ({
  quote,
  author,
  role,
}: {
  quote: string
  author: string
  role: string
}) => (
  <div className="flex flex-col justify-center h-full">
    <blockquote className="text-lg md:text-xl italic mb-4">&ldquo;{quote}&rdquo;</blockquote>
    <div className="font-semibold">{author}</div>
    <div className="text-sm text-muted-foreground">{role}</div>
  </div>
)

// Feature card component
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: any
  title: string
  description: string
  className?: string
}) => (
  <div
    className={cn(
      "group flex flex-col items-center text-center p-6 rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md",
      className,
    )}
  >
    <div className="mb-4 p-3 rounded-full bg-primary/10 text-primary">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
)

// Benefit column component
const BenefitColumn = ({
  icon: Icon,
  title,
  benefits,
  className,
}: {
  icon: any
  title: string
  benefits: string[]
  className?: string
}) => (
  <div
    className={cn(
      "flex flex-col items-center text-center p-6 rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md",
      className,
    )}
  >
    <div className="mb-4 p-3 rounded-full bg-primary/10 text-primary">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <ul className="space-y-2 text-left">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-start">
          <ChevronRight className="h-5 w-5 text-primary shrink-0 mr-2" />
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  </div>
)

// Testimonials data
const testimonials = [
  {
    quote:
      "Connectrix made it so easy to join clubs and stay updated on events! I love how I can access all my club resources in one place.",
    author: "Adams Geek",
    role: "Computer Science Student",
  },
  {
    quote:
      "Managing our club has never been smoother. The election system is a game-changer for ensuring transparent leadership transitions!",
    author: "Isma'il Danladi Misal",
    role: "Nacos President",
  },
  {
    quote:
      "Connectrix has transformed how we oversee club activities. The analytics and approval system save me hours of work each week.",
    author: "Dr. Hassana Y. Bello",
    role: "Dean of Student Affairs",
  },
]

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

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
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 z-10"></div>
            <img
              src="/studentBgi.jpeg"
              alt="University campus"
              className="w-full h-full object-cover opacity-50"
            />
          </div>

          <div className="container relative z-20">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-5xl">Welcome to Connectrix</h1>
                  <h2 className="text-2xl font-semibold text-primary">Your Digital Hub for Campus Club Management!</h2>
                  <p className="max-w-[600px] text-gray-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Streamline club activities, enhance engagement, and foster a vibrant campus community.
                  </p>
                </div>
                <div>
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="px-8 group transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                {/* Placeholder for hero image or animation */}
                <div className="rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src="/userphone.png"
                    alt="Connectrix dashboard preview"
                    className="w-2/4"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Benefits
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Tailored for Everyone</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Connectrix provides unique benefits for students, clubs, and administrators.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <BenefitColumn
                icon={Users}
                title="For Students"
                benefits={[
                  "Join clubs that match your interests",
                  "Participate in events and elections",
                  "Access resources like lecture materials",
                  "Navigate campus with ease",
                  "Stay updated with club announcements",
                ]}
                className="animate-slide-in-left"
              />

              <BenefitColumn
                icon={Calendar}
                title="For Clubs"
                benefits={[
                  "Manage memberships seamlessly",
                  "Organize and promote events",
                  "Conduct fair and transparent elections",
                  "Collect dues securely",
                  "Engage with members through announcements",
                ]}
                className="animate-slide-in-bottom"
              />

              <BenefitColumn
                icon={Shield}
                title="For Dean of Student Affairs"
                benefits={[
                  "Oversee all club activities",
                  "Approve new clubs and events",
                  "Access detailed reports and analytics",
                  "Ensure compliance with university policies",
                  "Communicate with club leaders efficiently",
                ]}
                className="animate-slide-in-right"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Powerful Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Discover the tools that make Connectrix the ultimate platform for university club management.
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={Users}
                title="Club Management"
                description="Create, join, and manage clubs with ease. Track memberships and activities in one place."
                className="animate-bounce-in"
              />

              <FeatureCard
                icon={CreditCard}
                title="Seamless Payments"
                description="Pay club dues securely with Paystack integration. Manage financial transactions effortlessly."
                className="animate-rotate-in"
              />

              <FeatureCard
                icon={Vote}
                title="Election System"
                description="Conduct fair and transparent club elections with our built-in voting system."
                className="animate-scale-in"
              />

              <FeatureCard
                icon={MapPin}
                title="Campus Navigation"
                description="Find your way around campus with the built-in router. Locate buildings, lecture halls, and facilities."
                className="animate-slide-in"
              />

              <FeatureCard
                icon={BookOpen}
                title="Resource Hub"
                description="Access lecture materials, study guides, and past questions in a centralized resource section."
                className="animate-flip-in"
              />

              <FeatureCard
                icon={Calendar}
                title="Event Management"
                description="Schedule, promote, and manage club events with attendance tracking and feedback collection."
                className="animate-bounce-in"
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Hear from students, club executives, and administrators who use Connectrix.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl">
              <div className="relative h-64 rounded-xl bg-card p-8 shadow-sm border overflow-hidden">
                <div className="flex items-center h-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 z-10 h-8 w-8 rounded-full bg-background/80 hover:bg-background"
                    onClick={prevTestimonial}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous</span>
                  </Button>

                  <div className="w-full overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                    >
                      {testimonials.map((testimonial, index) => (
                        <div key={index} className="min-w-full px-4">
                          <Testimonial quote={testimonial.quote} author={testimonial.author} role={testimonial.role} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 z-10 h-8 w-8 rounded-full bg-background/80 hover:bg-background"
                    onClick={nextTestimonial}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next</span>
                  </Button>
                </div>
              </div>

              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    className={`h-2 w-2 rounded-full p-0 ${index === currentTestimonial ? "bg-primary" : ""}`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative w-full py-12 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/10 z-0"></div>
          <div className="container relative z-10 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Campus Club Management?
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join Connectrix today and experience the future of student engagement.
                </p>
              </div>
              <div className="mt-6">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="px-8 group transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg animate-pulse"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
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

