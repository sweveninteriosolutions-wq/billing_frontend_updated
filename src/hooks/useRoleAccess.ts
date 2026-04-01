// src/hooks/useRoleAccess.ts
// ─────────────────────────────────────────────
// PHASE 8: Role-based UI control hook
// Returns permission flags based on current user role.
// ─────────────────────────────────────────────

import { useAuth } from '@/providers/AuthProvider';

export type UserRole = 'admin' | 'cashier' | 'sales' | 'inventory' | 'manager';

type Permissions = {
  // General CRUD
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;

  // Module-level
  canAccessAdmin: boolean;
  canAccessBilling: boolean;
  canAccessInventory: boolean;
  canAccessReports: boolean;

  // Specific actions
  canManageUsers: boolean;
  canManageDiscounts: boolean;
  canManageWarehouses: boolean;
  canManageProducts: boolean;
  canManageSuppliers: boolean;
  canManageGRN: boolean;
  canManageStockTransfer: boolean;
  canManagePurchaseOrders: boolean;
  canManageInvoices: boolean;
  canManagePayments: boolean;
  canManageQuotations: boolean;
  canManageCustomers: boolean;

  role: string;
  isAdmin: boolean;
};

const ROLE_PERMISSIONS: Record<string, Permissions> = {
  admin: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canAccessAdmin: true,
    canAccessBilling: true,
    canAccessInventory: true,
    canAccessReports: true,
    canManageUsers: true,
    canManageDiscounts: true,
    canManageWarehouses: true,
    canManageProducts: true,
    canManageSuppliers: true,
    canManageGRN: true,
    canManageStockTransfer: true,
    canManagePurchaseOrders: true,
    canManageInvoices: true,
    canManagePayments: true,
    canManageQuotations: true,
    canManageCustomers: true,
    role: 'admin',
    isAdmin: true,
  },
  sales: {
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canAccessAdmin: false,
    canAccessBilling: true,
    canAccessInventory: false,
    canAccessReports: false,
    canManageUsers: false,
    canManageDiscounts: false,
    canManageWarehouses: false,
    canManageProducts: false,
    canManageSuppliers: false,
    canManageGRN: false,
    canManageStockTransfer: false,
    canManagePurchaseOrders: false,
    canManageInvoices: false,
    canManagePayments: false,
    canManageQuotations: true,
    canManageCustomers: true,
    role: 'sales',
    isAdmin: false,
  },
  cashier: {
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canAccessAdmin: false,
    canAccessBilling: true,
    canAccessInventory: false,
    canAccessReports: false,
    canManageUsers: false,
    canManageDiscounts: false,
    canManageWarehouses: false,
    canManageProducts: false,
    canManageSuppliers: false,
    canManageGRN: false,
    canManageStockTransfer: false,
    canManagePurchaseOrders: false,
    canManageInvoices: true,
    canManagePayments: true,
    canManageQuotations: true,
    canManageCustomers: true,
    role: 'cashier',
    isAdmin: false,
  },
  inventory: {
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canAccessAdmin: false,
    canAccessBilling: false,
    canAccessInventory: true,
    canAccessReports: false,
    canManageUsers: false,
    canManageDiscounts: false,
    canManageWarehouses: false,
    canManageProducts: true,
    canManageSuppliers: true,
    canManageGRN: true,
    canManageStockTransfer: true,
    canManagePurchaseOrders: true,
    canManageInvoices: false,
    canManagePayments: false,
    canManageQuotations: false,
    canManageCustomers: false,
    role: 'inventory',
    isAdmin: false,
  },
  manager: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canAccessAdmin: false,
    canAccessBilling: true,
    canAccessInventory: true,
    canAccessReports: true,
    canManageUsers: false,
    canManageDiscounts: false,
    canManageWarehouses: false,
    canManageProducts: false,
    canManageSuppliers: false,
    canManageGRN: false,
    canManageStockTransfer: false,
    canManagePurchaseOrders: true,
    canManageInvoices: false,
    canManagePayments: false,
    canManageQuotations: false,
    canManageCustomers: false,
    role: 'manager',
    isAdmin: false,
  },
};

const NO_PERMISSIONS: Permissions = {
  canCreate: false,
  canEdit: false,
  canDelete: false,
  canAccessAdmin: false,
  canAccessBilling: false,
  canAccessInventory: false,
  canAccessReports: false,
  canManageUsers: false,
  canManageDiscounts: false,
  canManageWarehouses: false,
  canManageProducts: false,
  canManageSuppliers: false,
  canManageGRN: false,
  canManageStockTransfer: false,
  canManagePurchaseOrders: false,
  canManageInvoices: false,
  canManagePayments: false,
  canManageQuotations: false,
  canManageCustomers: false,
  role: '',
  isAdmin: false,
};

export function useRoleAccess(): Permissions {
  const { session } = useAuth();
  const role = session?.role ?? '';
  return ROLE_PERMISSIONS[role] ?? NO_PERMISSIONS;
}
