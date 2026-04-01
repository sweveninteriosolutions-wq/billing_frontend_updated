import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

// Public pages
import Landing from "@/modules/Landing";
import Login from "@/modules/Login";
import NotFound from "@/modules/NotFound";

// Dashboard
import Dashboard from "@/modules/dashboard/pages/index";
import AdminDashboard from "@/modules/dashboard/pages/AdminDashboard";
import CashierDashboard from "@/modules/dashboard/pages/CashierDashboard";
import SalesDashboard from "@/modules/dashboard/pages/SalesDashboard";
import InventoryDashboard from "@/modules/dashboard/pages/InventoryDashboard";
import ManagerDashboard from "@/modules/dashboard/pages/ManagerDashboard";

// Admin
import Users from "@/modules/admin/pages/UsersPage";
import UserActivityPage from "@/modules/admin/pages/UserActivityPage";
import DiscountsPage from "@/modules/admin/pages/DiscountsPage";

// Billing
import CustomersPage from "@/modules/billing/pages/CustomersPage";
import QuotationsPage from "@/modules/billing/pages/QuotationsPage";
import InvoicesPage from "@/modules/billing/pages/InvoicesPage";
import PaymentsPage from "@/modules/billing/pages/PaymentsPage";
import LoyaltyTokensPage from "@/modules/billing/pages/LoyaltyTokensPage";

// Inventory
import SuppliersPage from "@/modules/inventory/pages/SuppliersPage";
import ProductsPage from "@/modules/inventory/pages/ProductsPage";
import InventoryBalancesPage from "@/modules/inventory/pages/InventoryBalancesPage";
import StockTransfersPage from "@/modules/inventory/pages/StockTransferPage";
import GRNPage from "@/modules/inventory/pages/GRNPage";
import PurchaseOrdersPage from "@/modules/inventory/pages/PurchaseOrdersPage";
import ComplaintsPage from "@/modules/inventory/pages/ComplaintsPage";
import InventoryMovementsPage from "@/modules/inventory/pages/InventoryMovementsPage";

// Reports
import SalesReportPage from "@/modules/reports/pages/SalesReportPage";

// Settings / Warehouses
import WarehousesPage from "@/modules/settings/pages/WarehousesPage";

const App = () => {
  return (
    <Routes>
      {/* Public */}
      {/* <Route path="/" element={<Landing />} /> */}
      <Route path="/" element={<Login />} />
      <Route path="*" element={<NotFound />} />

      <Route element={<MainLayout />}>
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/cashier" element={<CashierDashboard />} />
        <Route path="/dashboard/sales" element={<SalesDashboard />} />
        <Route path="/dashboard/inventory" element={<InventoryDashboard />} />
        <Route path="/dashboard/manager" element={<ManagerDashboard />} />

        {/* Admin */}
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/activity" element={<UserActivityPage />} />
        <Route path="/admin/discount" element={<DiscountsPage />} />

        {/* Billing */}
        <Route path="/billing/customers" element={<CustomersPage />} />
        <Route path="/billing/quotations" element={<QuotationsPage />} />
        <Route path="/billing/invoices" element={<InvoicesPage />} />
        <Route path="/billing/payments" element={<PaymentsPage />} />
        <Route path="/billing/loyalty-tokens" element={<LoyaltyTokensPage />} />

        {/* Inventory */}
        <Route path="/inventory/suppliers" element={<SuppliersPage />} />
        <Route path="/inventory/products" element={<ProductsPage />} />
        <Route path="/inventory/productbalances" element={<InventoryBalancesPage />} />
        <Route path="/inventory/stock-transfer" element={<StockTransfersPage />} />
        <Route path="/inventory/grn" element={<GRNPage />} />
        <Route path="/inventory/purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="/inventory/complaints" element={<ComplaintsPage />} />
        <Route path="/inventory/movements" element={<InventoryMovementsPage />} />

        {/* Reports */}
        <Route path="/reports" element={<SalesReportPage />} />

        {/* Settings */}
        <Route path="/settings/warehouses" element={<WarehousesPage />} />
      </Route>
    </Routes>
  );
};

export default App;
