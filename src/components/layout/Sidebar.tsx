'use client';

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Receipt,
  CreditCard,
  Package,
  ArrowLeftRight,
  ClipboardList,
  Truck,
  AlertCircle,
  BarChart3,
  Users,
  Tag,
  ChevronDown,
  DollarSign,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';
import { Sheet, SheetContent } from '@/components/ui/sheet';

/* =========================
   TYPES
========================= */
interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

/* =========================
   NAV CONFIG
========================= */
const navSections: NavSection[] = [
  {
    title: 'Core',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        roles: ['admin', 'cashier', 'sales', 'inventory'],
      },
      {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
        roles: ['admin'],
      },
      {
        title: 'User Activity',
        href: '/admin/activity',
        icon: Tag,
        roles: ['admin'],
      },
      {
        title: 'Discount Rules',
        href: '/admin/discount',
        icon: DollarSign,
        roles: ['admin'],
      },
      {
        title: 'Reports',
        href: '/reports',
        icon: BarChart3,
        roles: ['admin'],
      },
    ],
  },

  {
    title: 'Billing',
    items: [
      {
        title: 'Customers',
        href: '/billing/customers',
        icon: Users,
        roles: ['admin', 'cashier'],
      },
      {
        title: 'Quotations',
        href: '/billing/quotations',
        icon: FileText,
        roles: ['admin', 'sales', 'cashier'],
      },
      {
        title: 'Invoices',
        href: '/billing/invoices',
        icon: Receipt,
        roles: ['admin', 'cashier'],
      },
      {
        title: 'Payments',
        href: '/billing/payments',
        icon: CreditCard,
        roles: ['admin', 'cashier'],
      },
    ],
  },

  {
    title: 'Inventory',
    items: [
      {
        title: 'Products',
        href: '/inventory/products',
        icon: Package,
        roles: ['admin', 'inventory', 'sales'],
      },
      {
        title: 'Inventory Balances',
        href: '/inventory/productbalances',
        icon: ShoppingCart,
        roles: ['admin', 'inventory', 'sales'],
      },
      {
        title: 'GRN',
        href: '/inventory/grn',
        icon: ClipboardList,
        roles: ['admin', 'inventory'],
      },
      {
        title: 'Stock Transfer',
        href: '/inventory/stock-transfer',
        icon: ArrowLeftRight,
        roles: ['admin', 'inventory'],
      },
      {
        title: 'Suppliers',
        href: '/inventory/suppliers',
        icon: Truck,
        roles: ['admin', 'inventory'],
      },
      {
        title: 'Complaints',
        href: '/inventory/complaints',
        icon: AlertCircle,
        roles: ['admin', 'inventory', 'sales'],
      },
    ],
  },

  
];

/* =========================
   SIDEBAR COMPONENT
========================= */
export const Sidebar = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { session } = useAuth();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Core: true,
    Billing: true,
    Inventory: true,
    Reports: true,
    Admin: true,
  });

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const sidebarContent = (
    <div className="flex h-full flex-col p-4 space-y-4">
      {navSections.map((section) => {
        const visibleItems = section.items.filter((item) =>
          item.roles.includes(session?.role ?? '')
        );

        if (visibleItems.length === 0) return null;

        return (
          <div key={section.title}>
            {/* Section Header */}
            <button
              type="button"
              onClick={() => toggleSection(section.title)}
              className="flex w-full items-center justify-between px-2 py-1 text-xs font-semibold uppercase text-muted-foreground"
            >
              {section.title}
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  openSections[section.title] && 'rotate-180'
                )}
              />
            </button>

            {/* Section Items */}
            {openSections[section.title] && (
              <div className="mt-2 space-y-1">
                {visibleItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => onOpenChange(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow'
                          : 'text-muted-foreground hover:text-foreground'
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
     {/* Mobile Sidebar */}
<Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent
    side="left"
    className="w-64 p-0 bg-card overflow-y-auto"
  >
    {sidebarContent}
  </SheetContent>
</Sheet>

{/* Desktop Sidebar */}
<aside className="hidden md:block w-64 border-r bg-card overflow-y-auto">
  {sidebarContent}
</aside>

    </>
  );
};
