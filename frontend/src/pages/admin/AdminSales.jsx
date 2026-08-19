import React, { useEffect, useState } from "react";
import API from "../../axios.js";

import {
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  Loader2,
  ArrowUpRight,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const AdminSales = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    sales: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await API.get("/api/v1/orders/sales", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data.success) {
          setData({
            totalUsers: response.data.totalUsers,
            totalProducts: response.data.totalProducts,
            totalOrders: response.data.totalOrders,
            totalSales: response.data.totalSales,
            sales: response.data.sales,
          });
        }
      } catch (err) {
        console.error("Error fetching admin sales data:", err);
        setError(err.response?.data?.message || "Failed to load sales data");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center bg-gray-950 text-white">
        <Loader2 className="mb-3 h-10 w-10 animate-spin text-blue-400" />

        <p className="font-medium text-gray-400">
          Sales data load ho raha hai...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="m-6 rounded-xl border border-red-900/50 bg-red-950/40 p-5 text-red-400">
        <p className="font-semibold">Error:</p>
        <p className="mt-1">{error}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Sales",
      value: `₹${Number(data.totalSales).toLocaleString()}`,
      icon: IndianRupee,
      description: "Overall revenue",
    },
    {
      title: "Total Orders",
      value: data.totalOrders,
      icon: ShoppingCart,
      description: "Orders received",
    },
    {
      title: "Total Products",
      value: data.totalProducts,
      icon: Package,
      description: "Products available",
    },
    {
      title: "Total Users",
      value: data.totalUsers,
      icon: Users,
      description: "Registered customers",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-3 sm:p-4 md:p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-5 sm:space-y-7">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Analytics
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Sales Dashboard
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Pichle 30 dino ka sales overview aur analytics
            </p>
          </div>

          <div className="self-start sm:self-auto flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Live Data
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {statCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/80 p-4 sm:p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-gray-700 hover:shadow-2xl"
              >
                {/* Glow */}
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all duration-500 group-hover:bg-blue-500/20" />

                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs sm:text-sm font-medium text-gray-500">
                      {card.title}
                    </p>

                    <h3 className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {card.value}
                    </h3>

                    <p className="mt-1 text-xs text-gray-600 line-clamp-1">
                      {card.description}
                    </p>
                  </div>

                  <div className="shrink-0 rounded-xl border border-gray-700 bg-gray-800 p-2.5 sm:p-3 transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500/40 group-hover:bg-blue-500/10">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 flex items-center gap-1 text-xs font-medium text-green-400">
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                  <span>Growing performance</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/80 shadow-2xl backdrop-blur-md">
          {/* Chart Header */}
          <div className="flex flex-col gap-3 border-b border-gray-800 p-4 sm:p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Sales Overview
                </h2>

                <p className="text-xs text-gray-500">
                  Revenue generated over the last 30 days
                </p>
              </div>
            </div>

            <div className="self-start sm:self-auto flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-950 px-2.5 py-1.5 text-xs text-gray-400">
              <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              <span className="font-medium">Last 30 Days</span>
            </div>
          </div>

          {/* Chart Body */}
          {data.sales.length > 0 ? (
            <div className="h-[280px] sm:h-[380px] w-full p-2 pt-6 sm:p-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.sales}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#3b82f6"
                        stopOpacity={0.45}
                      />
                      <stop
                        offset="50%"
                        stopColor="#6366f1"
                        stopOpacity={0.18}
                      />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>

                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <CartesianGrid
                    stroke="#1f2937"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    tick={{
                      fontSize: 10,
                      fill: "#6b7280",
                    }}
                    tickLine={false}
                    axisLine={false}
                    dy={8}
                  />

                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: "#6b7280",
                    }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                    width={50}
                  />

                  <Tooltip
                    cursor={{
                      stroke: "#3b82f6",
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                    }}
                    formatter={(value) => [
                      `₹${Number(value).toLocaleString()}`,
                      "Sales",
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      backgroundColor: "#030712",
                      border: "1px solid #374151",
                      borderRadius: "12px",
                      padding: "8px 12px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                    }}
                    labelStyle={{
                      color: "#9ca3af",
                      fontSize: "11px",
                      marginBottom: "4px",
                    }}
                    itemStyle={{
                      color: "#60a5fa",
                      fontWeight: "700",
                      fontSize: "12px",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#60a5fa"
                    strokeWidth={2.5}
                    fill="url(#salesGradient)"
                    fillOpacity={1}
                    activeDot={{
                      r: 6,
                      fill: "#60a5fa",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                    dot={false}
                    filter="url(#glow)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-64 sm:h-80 flex-col items-center justify-center p-4 text-center">
              <TrendingUp className="mb-3 h-8 w-8 sm:h-10 sm:w-10 text-gray-700" />
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Pichle 30 dino mein koi sales recorded nahi hain.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSales;
