// utils/auth.ts

import { SignJWT, jwtVerify } from 'jose'

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not defined')
  return new TextEncoder().encode(secret)
}

// ✅ Used in API login to generate JWT
export async function signToken(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(getJwtSecret())
}

// ✅ Used in /api/auth/verify, middleware, etc.
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload
  } catch (err) {
    return null
  }
}

// ✅ Helper function to verify authentication in API routes
export async function verifyApiAuth(request: Request) {
  // Try to get token from cookies first
  const cookies = request.headers.get('cookie')
  let token = null
  
  if (cookies) {
    const tokenMatch = cookies.match(/connectrix-token=([^;]+)/)
    token = tokenMatch ? tokenMatch[1] : null
  }
  
  // Fallback to Authorization header
  if (!token) {
    const authHeader = request.headers.get('authorization')
    token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
  }
  
  if (!token) {
    return { authenticated: false, user: null, error: 'No authentication token provided' }
  }
  
  const payload = await verifyToken(token)
  if (!payload) {
    return { authenticated: false, user: null, error: 'Invalid or expired token' }
  }
  
  return { authenticated: true, user: payload, error: null }
}
