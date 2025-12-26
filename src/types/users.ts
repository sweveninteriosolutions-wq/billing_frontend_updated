export type UserRole = 'admin' | 'sales' | 'inventory';

/**
 * =========================
 * USER LIST ITEM ( /users )
 * =========================
 */
export interface UserListItem {
  id: number;
  username: string;
  role: UserRole;
  is_active: boolean;
  is_online: boolean;
  last_login?: string;
  version: number;
}

/**
 * =========================
 * USER DETAIL ( /users/{id} )
 * =========================
 */
export interface UserDetail extends UserListItem {
  created_at: string;
  updated_at?: string;
  created_by_admin_id?: number;
}

/**
 * =========================
 * CREATE / UPDATE PAYLOADS
 * =========================
 */
export interface UserCreatePayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface UserUpdatePayload {
  email?: string;
  password?: string;
  role?: UserRole;
  is_active?: boolean;
  version: number;
}

/**
 * =========================
 * VERSION PAYLOAD
 * =========================
 */
export interface VersionOnlyPayload {
  version: number;
}
