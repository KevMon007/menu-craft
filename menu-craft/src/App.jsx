import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Products from "./pages/products/Products";
import Categories from "./pages/categories/Categories";
import Menu from './pages/Menu';

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
        </Route>
        <Route path="/menu/:slug" element={<Menu />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;