import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { LoaderIcon } from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { Button, Dialog } from "@material-tailwind/react";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(!open);
    navigate("/");
  };
  const handleEdit = () => {
    navigate(`/update-user/${id}`);
  };
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
      try {
        setLoading(true); // Start loading

        const { data } = await axios.get(
          `https://blog-backend-v95w.onrender.com/api/v1/user/current-user/${userId}`
        );

        if (data?.success) {
          setUser(data.userProfile);
        } else {
          toast.error("Failed to fetch user");
        }
      } catch (error) {
        toast.error("An error occurred while fetching user");
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUserProfile();
  }, [id]); // Empty dependency array ensures useEffect runs only once

  if (loading) {
    return (
      <p>
        <LoaderIcon className="mx-auto mt-3 w-8 h-8 rounded-full" />
      </p>
    );
  }

  return (
    <>
      {user && (
        <Dialog
          open={open}
          handler={handleOpen}
          className="flex flex-col items-center justify-center text-xl font-semibold bg-gray-300  md:w-2/4 h-96 md:h-screen  mx-auto rounded-md shadow-md shadow-orange-400"
        >
          <img
            src={user.image}
            alt=""
            className=" w-20 h-20 rounded-full hover:scale-110 transition-all"
          />
          <h2 className=" font-bold text-green-500">{user.username}</h2>
          <p>{user.email}</p>
          <p>Total Posts: {user.blogs.length}</p>
          <Button className="text-3xl hover:text-blue-500 transition-all cursor-pointer ">
            <MdEdit onClick={handleEdit} />
          </Button>
          {/* Display additional user data as needed */}
        </Dialog>
      )}
    </>
  );
}

export default Profile;
