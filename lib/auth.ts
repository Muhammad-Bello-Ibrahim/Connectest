// utils/auth.ts

import { SignJWT, jwtVerify } from "jose"
import { NextRequest, NextResponse } from "next/server"

// JWT secret from environment variables
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const JWT_REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!)

// Token expiration times
export const ACCESS_TOKEN_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours (development)
export const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 days

/**
 * Sign an access token
 */
export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor((Date.now() + ACCESS_TOKEN_EXPIRY) / 1000))
    .sign(JWT_SECRET)
}

/**
 * Sign a refresh token
 */
export async function signRefreshToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor((Date.now() + REFRESH_TOKEN_EXPIRY) / 1000))
    .sign(JWT_REFRESH_SECRET)
}

/**
 * Verify an access token
 */
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    return null
  }
}

/**
 * Verify a refresh token
 */
export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET)
    return payload
  } catch (error) {
    return null
  }
}

/**
 * Generate both access and refresh tokens
 */
export async function generateTokens(payload: any) {
  const accessToken = await signToken(payload)
  const refreshToken = await signRefreshToken(payload)

  return { accessToken, refreshToken }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string) {
  try {
    const payload = await verifyRefreshToken(refreshToken)
    if (!payload) {
      throw new Error("Invalid refresh token")
    }

    // Generate new tokens with the same payload
    const newTokens = await generateTokens(payload)

    return {
      success: true,
      tokens: newTokens,
      user: payload
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to refresh token"
    }
  }
}

/**
 * Set authentication cookies in response
 */
export function setAuthCookies(response: NextResponse, accessToken: string, refreshToken: string) {
  // Set access token (short-lived, httpOnly)
  response.cookies.set("connectrix-token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ACCESS_TOKEN_EXPIRY / 1000, // Convert to seconds
  })

  // Set refresh token (long-lived, httpOnly)
  response.cookies.set("connectrix-refresh", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: REFRESH_TOKEN_EXPIRY / 1000, // Convert to seconds
  })
}

/**
 * Clear authentication cookies
 */
export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete("connectrix-token")
  response.cookies.delete("connectrix-refresh")
}

/**
 * Get authentication tokens from request
 */
export function getAuthTokens(request: NextRequest) {
  return {
    accessToken: request.cookies.get("connectrix-token")?.value,
    refreshToken: request.cookies.get("connectrix-refresh")?.value,
  }
}
