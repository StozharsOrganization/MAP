import { cookies } from 'next/headers';
import crypto from 'crypto';

export const SESSION_COOKIE_NAME = 'map_admin_session';

export type AdminRole = 'admin' | 'editor' | 'coordinator';

export interface AdminSessionUser {
  username: string;
  name: string;
  role: AdminRole;
}

export interface AdminAccount {
  password: string;
  name: string;
  role: AdminRole;
  description: string;
}

// Predefined accounts with role-based access control (RBAC)
export const ACCOUNTS: Record<string, AdminAccount> = {
  admin: {
    password: process.env.ADMIN_PASSWORD || 'map_admin_2026!',
    name: 'Головний адміністратор',
    role: 'admin',
    description: 'Повний доступ до всіх розділів, налаштувань та фінансів',
  },
  map_admin: {
    password: process.env.ADMIN_PASSWORD || 'map_admin_2026!',
    name: 'Головний адміністратор MAP',
    role: 'admin',
    description: 'Повний доступ до всіх розділів, налаштувань та фінансів',
  },
  editor: {
    password: process.env.EDITOR_PASSWORD || 'editor_2026!',
    name: 'Редактор контенту',
    role: 'editor',
    description: 'Створення та редагування новин, проєктів та команди',
  },
  coordinator: {
    password: process.env.COORDINATOR_PASSWORD || 'coord_2026!',
    name: 'Координатор програм',
    role: 'coordinator',
    description: 'Робота із заявками волонтерів та вхідними зверненнями',
  },
};

function getSecretKey(): string {
  return process.env.SESSION_SECRET || 'map-ngo-super-secret-key-2026-secure-rbac';
}

/**
 * Verify username & password credentials and return user object if valid
 */
export function verifyCredentials(username: string, password: string): AdminSessionUser | null {
  if (!username || !password) return null;
  const cleanUsername = username.trim().toLowerCase();
  const account = ACCOUNTS[cleanUsername];
  if (!account) return null;

  try {
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(password),
      Buffer.from(account.password)
    );
    if (isMatch) {
      return {
        username: cleanUsername,
        name: account.name,
        role: account.role,
      };
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Generate a cryptographically secure HMAC-signed session token containing user details
 */
export function generateSessionToken(user: AdminSessionUser): string {
  const secret = getSecretKey();
  const payload = {
    u: user.username,
    n: user.name,
    r: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadStr)
    .digest('base64url');

  return `${payloadStr}.${signature}`;
}

/**
 * Verify incoming signed token and return the user session
 */
export function verifyToken(token: string): AdminSessionUser | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadStr, signature] = parts;
  const secret = getSecretKey();

  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(payloadStr)
    .digest('base64url');

  try {
    const isSigValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSig)
    );
    if (!isSigValid) return null;

    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) return null; // Expired

    return {
      username: payload.u,
      name: payload.n,
      role: payload.r as AdminRole,
    };
  } catch {
    return null;
  }
}

/**
 * Get current session user on server side
 */
export async function getAdminSession(): Promise<AdminSessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) return null;
    return verifyToken(sessionCookie.value);
  } catch (err) {
    console.error('getAdminSession error:', err);
    return null;
  }
}

/**
 * Check admin session on server side, optionally checking allowed roles
 */
export async function verifyAdminSession(allowedRoles?: AdminRole[]): Promise<boolean> {
  const user = await getAdminSession();
  if (!user) return false;
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(user.role);
}

/**
 * Set session cookie
 */
export async function setAdminSessionCookie(user: AdminSessionUser): Promise<void> {
  const cookieStore = await cookies();
  const token = generateSessionToken(user);
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear session cookie
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
