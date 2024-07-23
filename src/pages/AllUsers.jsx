import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BlogCard from "../components/BlogCard";
import { FaUser } from "react-icons/fa";
function AllUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUserProfile = async () => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      try {
        const { data } = await axios.get(`${apiUrl}/api/v1/user/all-users`);

        if (data?.success) {
          setUsers(data.users);
        } else {
          toast.error("Failed to fetch user");
        }
      } catch (error) {
        toast.error("An error occurred while fetching user");
        console.error("Error fetching user:", error);
      }
    };

    fetchUserProfile();
  }, []);
  return (
    <div>
      <ul className=" grid grid-cols-2 md:grid-cols-4 gap-3 bg-gradient-to-b from-orange-600 via-gray-100 to-orange-600 min-h-screen">
        {users.map((user) => (
          <li
            key={user._id}
            id={user._id}
            className="flex justify-center items-center gap-x-2 text-lg text-gray-900 font-bold decoration-black"
          >
            <img src={user.image} alt="" className=" w-8 h-8 rounded-full" />
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllUsers;
