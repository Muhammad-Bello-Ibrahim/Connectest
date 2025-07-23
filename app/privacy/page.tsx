import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy & Terms of Service</h1>
      <p className="mb-4">Your privacy and data security are important to us. This page explains how we collect, use, and protect your information on Connectest.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Data Collection</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>We collect only the information necessary to provide our services (e.g., name, student ID, email, profile details).</li>
        <li>We do not sell or share your personal data with third parties except as required by law or to provide core platform features.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. Data Usage</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Your data is used to match you with clubs, personalize your experience, and enable platform features.</li>
        <li>We may use anonymized, aggregated data for analytics and platform improvement.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. Security</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Passwords are encrypted and never stored in plain text.</li>
        <li>We use industry-standard security practices to protect your data.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. Your Rights</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>You can update or delete your profile at any time.</li>
        <li>Contact support for any data-related requests or concerns.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">5. Consent</h2>
      <p className="mb-4">By creating an account, you agree to our Privacy Policy and Terms of Service. You must accept these terms during registration to use Connectest.</p>
      <p className="text-sm text-gray-500 mt-8">Last updated: July 2025</p>
    </div>
  );
}
