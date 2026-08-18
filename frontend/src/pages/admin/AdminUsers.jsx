import { Edit, Eye, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import UserLogo from "../../assets/user.jpg";
import { useNavigate } from "react-router-dom";
import API from "../../axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await API.get(
        "/api/v1/user/all-user",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <div className="mx-auto min-h-screen bg-gray-950 text-white">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          User Management
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          View and manage registered users in your system.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mt-6 w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="w-full rounded-xl border border-gray-700 bg-gray-900 py-2 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
        />
      </div>

      {/* Users Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user, index) => {
          return (
            <div
              key={index}
              className="flex flex-col justify-between rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg transition hover:border-gray-700 hover:shadow-xl"
            >
              {/* User Profile Info */}
              <div className="flex items-center gap-4">
                <img
                  src={user?.profilePic || UserLogo}
                  alt={`${user?.firstName || "User"} profile`}
                  className="h-14 w-14 rounded-full border border-gray-700 bg-gray-800 object-cover"
                />

                <div className="overflow-hidden">
                  <h2 className="truncate font-semibold text-white">
                    {user?.firstName} {user?.lastName}
                  </h2>

                  <p className="mt-0.5 truncate text-xs text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-800 pt-4">
                {/* Edit */}
                <button
                  onClick={() => navigate(`/dashboard/users/${user?._id}`)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white"
                >
                  <Edit className="h-3.5 w-3.5 text-gray-400" />
                  Edit
                </button>

                {/* Show Order */}
                <button
                  onClick={() =>
                    navigate(`/dashboard/users/orders/${user?._id}`)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-black shadow-sm transition hover:bg-gray-200"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Show Order
                </button>
              </div>
            </div>
          );
        })}

        {/* No Users */}
        {filteredUsers.length === 0 && (
          <div className="col-span-full rounded-2xl border border-gray-800 bg-gray-900 py-12 text-center">
            <p className="text-gray-500">No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
