import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import userLogo from "../../assets/user.jpg";
import { setUser } from "../../redux/userSlice";

const UserInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  // Params fallback: route chahe /:id ho ya /:userId, dono handle honge
  const userId = params.id || params.userId;

  // Initial state defined as empty string values to prevent input control warnings
  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    role: "user",
    profilePic: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generic handler for input fields including radio buttons
  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  // Safe file preview handling
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Fetch user details from API
  const getUserDetails = async () => {
    try {
      const res = await axios.get(
        `https://ekart-yt.onrender.com/api/v1/user/get-user/${userId}`,
      );
      if (res.data.success) {
        setUpdateUser(res.data.user);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details");
    }
  };

  useEffect(() => {
    if (userId) {
      getUserDetails();
    }
  }, [userId]);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const accessToken = localStorage.getItem("accessToken");

    try {
      const formData = new FormData();
      formData.append("firstName", updateUser?.firstName || "");
      formData.append("lastName", updateUser?.lastName || "");
      formData.append("email", updateUser?.email || "");
      formData.append("phoneNo", updateUser?.phoneNo || "");
      formData.append("address", updateUser?.address || "");
      formData.append("city", updateUser?.city || "");
      formData.append("zipCode", updateUser?.zipCode || "");
      formData.append("role", updateUser?.role || "user");

      if (file) {
        formData.append("file", file); // Multer handling
      }

      const res = await axios.put(
        `https://ekart-yt.onrender.com/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message || "Profile updated successfully!");
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto my-8 max-w-xl max-h-fit rounded-2xl border border-gray-800 bg-gray-900 p-5 text-white shadow-xl">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-5 flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-400 transition hover:text-white"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>

      {/* Header */}
      <div className="mb-6 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Update Profile</h1>

        <p className="mt-1 text-sm text-gray-400">
          Manage your profile details and settings
        </p>
      </div>

      {/* Profile Picture Section */}
      <div className="mb-8 flex flex-col items-center">
        <img
          className="h-28 w-28 rounded-full border-4 border-gray-700 bg-gray-800 object-cover shadow-lg"
          src={preview || updateUser?.profilePic || userLogo}
          alt="Profile"
        />

        <label
          htmlFor="profile-picture"
          className="mt-3 cursor-pointer rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white"
        >
          Change Picture
          <input
            id="profile-picture"
            onChange={handleFileChange}
            type="file"
            accept="image/*"
            className="hidden"
          />
        </label>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="mb-1 block text-sm font-medium text-gray-200"
          >
            First Name
          </label>

          <input
            id="firstName"
            type="text"
            name="firstName"
            value={updateUser?.firstName || ""}
            onChange={handleChange}
            placeholder="John"
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
          />
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="mb-1 block text-sm font-medium text-gray-200"
          >
            Last Name
          </label>

          <input
            id="lastName"
            type="text"
            name="lastName"
            value={updateUser?.lastName || ""}
            onChange={handleChange}
            placeholder="Doe"
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-200"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            name="email"
            value={updateUser?.email || ""}
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-500 outline-none"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phoneNo"
            className="mb-1 block text-sm font-medium text-gray-200"
          >
            Phone Number
          </label>

          <input
            id="phoneNo"
            type="text"
            name="phoneNo"
            value={updateUser?.phoneNo || ""}
            onChange={handleChange}
            placeholder="Enter your contact number"
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
          />
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="mb-1 block text-sm font-medium text-gray-200"
          >
            Address
          </label>

          <input
            id="address"
            type="text"
            name="address"
            value={updateUser?.address || ""}
            onChange={handleChange}
            placeholder="Enter your address"
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
          />
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="mb-1 block text-sm font-medium text-gray-200"
          >
            City
          </label>

          <input
            id="city"
            type="text"
            name="city"
            value={updateUser?.city || ""}
            onChange={handleChange}
            placeholder="Enter your city"
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
          />
        </div>

        {/* Zip Code */}
        <div>
          <label
            htmlFor="zipCode"
            className="mb-1 block text-sm font-medium text-gray-200"
          >
            Zip Code
          </label>

          <input
            id="zipCode"
            type="text"
            name="zipCode"
            value={updateUser?.zipCode || ""}
            onChange={handleChange}
            placeholder="Enter your zip code"
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
          />
        </div>

        {/* Role */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-200">
            Role
          </label>

          <div className="flex items-center gap-6">
            {/* User */}
            <label
              htmlFor="user"
              className="flex cursor-pointer items-center gap-2 text-gray-300"
            >
              <input
                type="radio"
                id="user"
                name="role"
                value="user"
                checked={updateUser?.role === "user"}
                onChange={handleChange}
                className="h-4 w-4 accent-white"
              />
              User
            </label>

            {/* Admin */}
            <label
              htmlFor="admin"
              className="flex cursor-pointer items-center gap-2 text-gray-300"
            >
              <input
                type="radio"
                id="admin"
                name="role"
                value="admin"
                checked={updateUser?.role === "admin"}
                onChange={handleChange}
                className="h-4 w-4 accent-white"
              />
              Admin
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-xl bg-white py-3 font-bold text-black shadow-sm transition hover:bg-gray-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UserInfo;
