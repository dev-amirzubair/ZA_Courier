export type UserRole = "CUSTOMER" | "BUSINESS" | "DRIVER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  companyName?: string;
}

export interface StoredUser extends AuthUser {
  passwordHash: string;
  createdAt: string;
}

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
}

export const AUTH_COOKIE = "za_courier_session";
