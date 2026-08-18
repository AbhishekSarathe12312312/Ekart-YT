import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import userLogo from "../assets/user.jpg";
import { toast } from "react-toastify";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import MyOrder from "./MyOrder";

const Profile = () => {
  const { user } = useSelector((store) => store.user);
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.userId;
  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    profilePic: user?.profilePic || "",
    role: user?.role || "",
  });

  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile),
    }); // preview only
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    try {
      // use formData for text + file
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("role", updateUser.role);

      if (file) {
        formData.append("file", file); // image file for backend multer
      }
      const res = await axios.put(
        `http://localhost:8000/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="relative mx-auto max-w-xl max-h-fit mb-8 mt-8  rounded-2xl border bg-gray-900 p-5 text-white shadow-xl">
      {/* Profile Header & View Orders Button */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Profile</h1>

          <p className="text-sm text-gray-400">
            Manage your profile details and settings
          </p>
        </div>

        {/* View Orders Button */}
        <button
          type="button"
          onClick={() => navigate("/myorder")}
          className="rounded-lg cursor-pointer bg-white px-4 py-2 text-sm font-bold text-black shadow-sm transition hover:bg-gray-200 active:scale-95"
        >
          View Orders
        </button>
      </div>

      {/* Heading */}
      <h2 className="mb-3 text-xl font-bold text-white">Update Profile</h2>

      {/* Profile Picture */}
      <div className="mb-8 flex flex-col items-center">
        <img
          className="h-28 w-28 rounded-full border-4 border-gray-700 bg-gray-800 object-cover shadow-lg"
          src={updateUser?.profilePic || userLogo}
          alt="Profile"
        />

        <label
          htmlFor="profile-picture"
          className="mt-2 cursor-pointer rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white"
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
            value={updateUser.firstName}
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
            value={updateUser.lastName}
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
            value={updateUser.email}
            onChange={handleChange}
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
            value={updateUser.phoneNo}
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
            value={updateUser.address}
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
            value={updateUser.city}
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
            value={updateUser.zipCode}
            onChange={handleChange}
            placeholder="Enter your zip code"
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-xl bg-white py-3 font-bold text-black shadow-sm transition hover:bg-gray-200 active:scale-[0.98]"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
