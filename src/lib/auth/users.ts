import bcrypt from "bcryptjs";
import type { AuthUser, StoredUser, UserRole } from "@/types/auth";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

const globalForUsers = globalThis as unknown as {
  zaUsers?: StoredUser[];
};

function seedUsers(): StoredUser[] {
  const passwordHash = bcrypt.hashSync("password123", 10);

  return [
    {
      id: "user_customer_1",
      email: "customer@zacourier.com.au",
      name: "Alex Customer",
      role: "CUSTOMER",
      phone: "0400 111 222",
      passwordHash,
      createdAt: new Date().toISOString(),
    },
    {
      id: "user_business_1",
      email: "business@zacourier.com.au",
      name: "Jordan Business",
      role: "BUSINESS",
      companyName: "Meridian Retail",
      phone: "0400 333 444",
      passwordHash,
      createdAt: new Date().toISOString(),
    },
    {
      id: "user_driver_1",
      email: "driver@zacourier.com.au",
      name: "Sam Driver",
      role: "DRIVER",
      phone: "0400 555 666",
      passwordHash,
      createdAt: new Date().toISOString(),
    },
    {
      id: "user_admin_1",
      email: "admin@zacourier.com.au",
      name: "Taylor Admin",
      role: "ADMIN",
      passwordHash,
      createdAt: new Date().toISOString(),
    },
  ];
}

function getUsers(): StoredUser[] {
  if (!globalForUsers.zaUsers) {
    globalForUsers.zaUsers = seedUsers();
  }
  return globalForUsers.zaUsers;
}

export function toPublicUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
    companyName: user.companyName,
  };
}

export async function findUserByEmail(
  email: string,
): Promise<StoredUser | null> {
  const normalized = email.trim().toLowerCase();
  return getUsers().find((user) => user.email === normalized) ?? null;
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  return getUsers().find((user) => user.id === id) ?? null;
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  return toPublicUser(user);
}

export async function registerUser(input: {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  phone?: string;
  companyName?: string;
}): Promise<AuthUser> {
  const email = input.email.trim().toLowerCase();
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("EMAIL_TAKEN");
  }

  if (input.password.length < 8) {
    throw new Error("WEAK_PASSWORD");
  }

  const role: UserRole =
    input.role === "BUSINESS" ? "BUSINESS" : "CUSTOMER";

  const user: StoredUser = {
    id: `user_${Date.now()}`,
    email,
    name: input.name.trim(),
    role,
    phone: input.phone?.trim(),
    companyName: input.companyName?.trim(),
    passwordHash: await hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };

  getUsers().push(user);
  return toPublicUser(user);
}

export function listUsers(): AuthUser[] {
  return getUsers().map(toPublicUser);
}
