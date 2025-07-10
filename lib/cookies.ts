/**
 * Cookie utility functions for client-side cookie management
 */

/**
 * Get a cookie value by name on the client side
 * @param name - The cookie name
 * @returns The cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    // Server-side, return null
    return null
  }

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue || null
  }
  
  return null
}

/**
 * Check if a specific cookie exists
 * @param name - The cookie name
 * @returns true if the cookie exists, false otherwise
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null
}

/**
 * Check if the user has a valid authentication token cookie
 * @returns true if the auth token cookie exists, false otherwise
 */
export function hasAuthToken(): boolean {
  return hasCookie('connectrix-token')
}