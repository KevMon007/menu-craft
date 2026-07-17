import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Products = lazy(() => import("./pages/products/Products"));
const Categories = lazy(() => import("./pages/categories/Categories"));
const Menu = lazy(() => import("./pages/menu/Menu"));
const PublicMenu = lazy(() => import("./pages/public-menu/PublicMenu"));

import PrivateRoute from './components/PrivateRoute';
import AdminLayout from "./layouts/AdminLayout";
import { useAuth } from './context/AuthContext';

function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
                            <div className="flex items-center justify-center h-screen">
                                Cargando...
                            </div>
                        }>
        <Routes>
          <Route path="/" element={<PublicRoute><Navigate to="/login" replace /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/public-menu" element={<PublicMenu />} />
          </Route>
          <Route path="/menu/:slug" element={<Menu />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;