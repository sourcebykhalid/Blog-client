import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});

  //get blog details
  const getUserDetail = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const { data } = await axios.get(
        `https://blog-backend-v95w.onrender.com/api/v1/user/current-user/${userId}`
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
    }
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const { data } = await axios.put(
        `https://blog-backend-v95w.onrender.com/api/v1/user/update-user/${userId}`,
        {
          username: inputs.username,
          email: inputs.email,
          image: inputs.image,
          user: localStorage.getItem("userId"),
        }
      );
      if (data?.success) {
        toast.success("User updated successfully");
        navigate("/user-blogs");
        setOpen(false); // Close the dialog
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpen = () => {
    setOpen(!open);
    navigate("/current-user/:id");
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
              placeholder="Enter Image Url"
              name="image"
              value={inputs.image}
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
