// utils/auth.ts

import { SignJWT, jwtVerify } from 'jose'

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not defined')
  return new TextEncoder().encode(secret)
}

// ✅ Used in API login to generate JWT
export async function signToken(payload: any) {
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
