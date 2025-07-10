/**
 * Test file to verify cookie-based authentication functionality
 */

import { getCookie, hasCookie, hasAuthToken } from '../lib/cookies'

// Simple test runner for cookie functionality
function runCookieTests() {
  console.log('🧪 Running cookie authentication tests...')
  
  // Test 1: Basic cookie parsing
  console.log('\n📋 Test 1: Basic cookie parsing')
  
  // Mock document.cookie temporarily
  const originalCookie = (typeof document !== 'undefined') ? document.cookie : ''
  
  if (typeof document !== 'undefined') {
    // Set test cookies
    document.cookie = 'connectrix-token=test-token-123; path=/'
    document.cookie = 'other-cookie=other-value; path=/'
    
    const token = getCookie('connectrix-token')
    const other = getCookie('other-cookie')
    const missing = getCookie('non-existent')
    
    console.log(`✅ getCookie('connectrix-token'): ${token}`)
    console.log(`✅ getCookie('other-cookie'): ${other}`)
    console.log(`✅ getCookie('non-existent'): ${missing}`)
    
    // Test hasCookie
    console.log(`✅ hasCookie('connectrix-token'): ${hasCookie('connectrix-token')}`)
    console.log(`✅ hasCookie('non-existent'): ${hasCookie('non-existent')}`)
    
    // Test hasAuthToken
    console.log(`✅ hasAuthToken(): ${hasAuthToken()}`)
  } else {
    console.log('⚠️  Running in server environment, cookie tests skipped')
  }
  
  console.log('\n✨ Cookie tests completed!')
}

// Auto-run tests when in browser
if (typeof window !== 'undefined') {
  runCookieTests()
}

export default runCookieTests