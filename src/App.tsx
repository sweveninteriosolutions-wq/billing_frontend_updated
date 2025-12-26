import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

// Public pages
import Landing from "@/modules/Landing";
import Login from "@/modules/Login";
import NotFound from "@/modules/NotFound";

import Dashboard from "@/modules/dashboard/pages/index";
import AdminDashboard from "@/modules/dashboard/pages/AdminDashboard";
import CashierDashboard from "@/modules/dashboard/pages/CashierDashboard";
import SalesDashboard from "@/modules/dashboard/pages/SalesDashboard";
import InventoryDashboard from "@/modules/dashboard/pages/InventoryDashboard";

import Users from "@/modules/admin/pages/UsersPage";
import UserActivityPage from "@/modules/admin/pages/UserActivityPage";
import DiscountsPage from "@/modules/admin/pages/DiscountsPage";

import CustomersPage from "@/modules/billing/pages/CustomersPage"

import SuppliersPage from "./modules/inventory/pages/SuppliersPage";
import ProductsPage from "./modules/inventory/pages/ProductsPage"
import InventoryBalancesPage from "./modules/inventory/pages/InventoryBalancesPage";
import StockTransfersPage from "./modules/inventory/pages/StockTransferPage";
import GRNPage from "./modules/inventory/pages/GRNPage";


const App = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Landing />} /> */}
      <Route path="/" element={<Login />} />
      <Route path="*" element={<NotFound />} />

      <Route element={<MainLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/admin" element={<AdminDashboard />} />
      <Route path="/dashboard/cashier" element={<CashierDashboard />} />
      <Route path="/dashboard/sales" element={<SalesDashboard />} />
      <Route path="/dashboard/inventory" element={<InventoryDashboard />} />

      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/activity" element={<UserActivityPage />} />
      <Route path="/admin/discount" element={<DiscountsPage />} />
      
      <Route path="/billing/customers" element={<CustomersPage />} />

      <Route path="/inventory/suppliers" element={<SuppliersPage />} />
      <Route path="/inventory/products" element={<ProductsPage />} />
      <Route path="/inventory/productbalances" element={<InventoryBalancesPage />} />
      <Route path="/inventory/stock-transfer" element={<StockTransfersPage />} />
      <Route path="/inventory/grn" element={<GRNPage />} />
      
      




      



      </Route>
    </Routes>
  );
};

export default App;
