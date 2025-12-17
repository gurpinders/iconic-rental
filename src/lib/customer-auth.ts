import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'customer-jwt-secret'
);

const CUSTOMER_TOKEN_NAME = 'customer-auth-token';

export interface CustomerTokenPayload {
  customerId: string;
  email: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Create JWT token
export async function createCustomerToken(
  payload: CustomerTokenPayload
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

// Verify JWT token
export async function verifyCustomerToken(
  token: string
): Promise<CustomerTokenPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as CustomerTokenPayload;
  } catch (error) {
    return null;
  }
}

// Set customer auth cookie
export async function setCustomerAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// Get current customer from cookie
export async function getCurrentCustomer(): Promise<CustomerTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_TOKEN_NAME);

  if (!token) {
    return null;
  }

  return verifyCustomerToken(token.value);
}

// Remove customer auth cookie
export async function removeCustomerAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_TOKEN_NAME);
}

// Generate random token for email verification
export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}