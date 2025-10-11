import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFoundPage: React.FC = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="text-center space-y-6 animate-fade-in">
            {/* 404 Icon */}
            <div className="relative">
                <div className="text-9xl font-bold text-primary/10 select-none">404</div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg 
                        className="w-24 h-24 text-primary animate-bounce-subtle" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                    </svg>
                </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Page Not Found</h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Sorry, the page you are looking for doesn't exist or has been moved.
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Link href="/">
                    <Button size="lg" className="w-full sm:w-auto">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go Home
                    </Button>
                </Link>
                <Link href="/dashboard">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Dashboard
                    </Button>
                </Link>
            </div>

            {/* Help Text */}
            <p className="text-sm text-muted-foreground pt-8">
                If you believe this is an error, please{" "}
                <Link href="/contact" className="text-primary hover:underline">
                    contact support
                </Link>
            </p>
        </div>
    </div>
);

export default NotFoundPage;
