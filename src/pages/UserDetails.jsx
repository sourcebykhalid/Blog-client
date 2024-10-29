import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Dialog,
  Input,
  Typography,
  DialogFooter,
} from "@material-tailwind/react";
import toast from "react-hot-toast";

const UserDetails = () => {
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [imageFile, setImageFile] = useState(null); // State for the uploaded image

  // Get user details
  const getUserDetail = async () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const userId = localStorage.getItem("userId");
    try {
      const { data } = await axios.get(
        `${apiUrl}/api/v1/user/current-user/${userId}`
      );
      if (data?.success) {
        setUser(data.userProfile);
        setInputs({
          username: data.userProfile.username,
          email: data.userProfile.email,
          image: data.userProfile.image,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching user details");
    }
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setImageFile(e.target.files[0]); // Capture the file
    } else {
      setInputs((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const formData = new FormData();
      formData.append("username", inputs.username);
      formData.append("email", inputs.email);
      if (imageFile) {
        formData.append("image", imageFile); // Append the image file if it exists
      }

      const { data } = await axios.put(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/v1/user/update-user/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file upload
          },
        }
      );

      if (data?.success) {
        toast.success("User updated successfully");
        navigate("/user-blogs");
        setOpen(false); // Close the dialog
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating user details");
    }
  };

  const handleOpen = () => {
    setOpen(!open); // Toggle dialog visibility
  };

  return (
    <div className="flex justify-center items-center flex-col w-full">
      <Dialog
        className="flex justify-center items-center"
        open={open}
        handler={handleOpen}
      >
        <form
          onSubmit={handleSubmit}
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Username
            </Typography>
            <Input
              size="lg"
              placeholder="Enter Blog Username"
              name="username"
              value={inputs.username}
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Email
            </Typography>
            <Input
              name="email"
              value={inputs.email}
              onChange={handleChange}
              label="Email"
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Image
            </Typography>
            <Input
              size="lg"
              type="file" // Keep as file input
              name="image"
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button type="submit" variant="gradient" color="green">
              <span>Update</span>
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default UserDetails;
