import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Avatar,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
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
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  return (
    <div className=" ">
      <List className=" grid grid-cols-2 md:grid-cols-3 bg-gradient-to-b from-black/20 via-gray-100 to-black/35 min-h-screen pt-24 mx-2 rounded-md ">
        {users.map((user) => (
          <ListItem
            key={user._id}
            id={user._id}
            className="flex flex-col md:flex-row justify-center items-start gap-x-2 text-lg text-gray-900 font-bold decoration-black"
          >
            <ListItemPrefix>
              <Avatar
                variant="circular"
                alt="candice"
                src={
                  user.image
                    ? `${apiUrl}/uploads/${user.image}`
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOApFCSVByzhZorHUAP-J851JAYyOPtI1jdg&s"
                }
              />
            </ListItemPrefix>
            <div>
              <Typography variant="h6" color="blue-gray" className=" font-bold">
                {user.username}
              </Typography>
              <Typography
                variant="small"
                color="gray"
                className=" text-gray-700 font-semibold"
              >
                {user.email}
              </Typography>
              <Typography
                variant="small"
                color="gray"
                className="text-gray-600 font-semibold"
              >
                {formatDate(user.createdAt)}
              </Typography>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default AllUsers;
