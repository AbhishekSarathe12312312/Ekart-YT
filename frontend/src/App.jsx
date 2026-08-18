import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import VerifyEmail from "./pages/VerifyEmail";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import AdminSales from "./pages/admin/AdminSales";
import AddProduct from "./pages/admin/AddProduct";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import ShowUserOrders from "./pages/admin/ShowUserOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import UserInfo from "./pages/admin/UserInfo";
import ProtectedRoute from "./components/ProtectedRoute";
import SingleProduct from "./pages/SingleProduct";
import AddressForm from "./pages/AddressForm";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrder from "./pages/MyOrder";
import Features from "./components/Features";
import ForgotPassword from "./pages/ForgotPassword";

const App = () => {
  return (
    <div className="bg-gray-800">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
            </>
          }
        />

        <Route path="/signup" element={<Signup />} />
        <Route
          path="/login"
          element={
            <>
              <Navbar /> <Login />
            </>
          }
        />
        <Route
          path="/forget-password"
          element={
            <>
              <ForgotPassword />
            </>
          }
        />
        <Route path="/verify" element={<Verify />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route
          path="/products"
          element={
            <>
              <Navbar />
              <Products />
              <Footer />
            </>
          }
        />
        <Route
          path="/products/:id"
          element={
            <>
              <Navbar />
              <SingleProduct />
            </>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Navbar />
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myorder"
          element={
            <ProtectedRoute>
              <Navbar />
              <MyOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Navbar />
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/address"
          element={
            <ProtectedRoute>
              <Navbar />
              <AddressForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
        {/* Dashboard Parent Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Child Route */}
          <Route path="sales" element={<AdminSales />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<AdminProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users/orders/:userId" element={<ShowUserOrders />} />
          <Route path="users/:id" element={<UserInfo />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
