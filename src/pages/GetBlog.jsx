import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Typography } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { FaEdit, FaUser } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import CommentSection from "../components/commentSection"; // Import the CommentSection component
import Reveal from "../components/Reveal";

const GetBlog = () => {
  const isLogin = useSelector((state) => state.isLogin);
  const userId = localStorage.getItem("userId");
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/blog-details/${id}`);
  };

  const handleDelete = async () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      const { data } = await axios.delete(
        `${apiUrl}/api/v1/blog/delete-blog/${id}`
      );
      if (data?.success) {
        toast.success("Blog deleted");
        navigate("/all-blogs");
      }
    } catch (error) {
      toast.error("Error deleting blog");
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      try {
        const { data } = await axios.get(
          `${apiUrl}/api/v1/blog/get-blog/${id}`
        );
        if (data?.success) {
          setBlog(data.blog);
        } else {
          toast.error("Error fetching blog details");
        }
      } catch (error) {
        toast.error("Error fetching blog details");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-screen">
        No blog found
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-start pt-24 gap-x-6 bg-gradient-to-b from-gray-50 to-gray-200">
      <Reveal>
        <div className="flex flex-col justify-between py-3 md:py-5 items-center w-full md:w-5/6 h-full border-b border-green-400 rounded-md shadow-lg bg-white p-4">
          <Typography className="text-xs md:text-sm text-gray-600">
            {formatDate(blog.createdAt)}
          </Typography>

          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="md:w-5/6 h-[18rem] md:h-[32rem] bg-cover rounded-md mb-4 shadow-lg"
            />
          )}
          <Typography
            variant="h5"
            className="text-sm text-blue-500 font-semibold"
          >
            #{blog.category}
          </Typography>
          <Typography
            variant="h6"
            className="flex gap-x-2 justify-center items-center font-bold text-gray-800 text-sm md:text-lg"
          >
            <FaUser className="text-blue-600" />
            {blog.user?.username}
          </Typography>
        </div>
      </Reveal>
      <Reveal>
        <div className="flex flex-col md:w-full px-3 md:px-0 mt-5 md:mt-0">
          <div className="flex justify-between items-center mb-4">
            <Typography
              variant="h2"
              className="text-lg md:text-2xl text-gray-800 font-bold border-b border-green-400 rounded-md px-2"
            >
              {blog.title}
            </Typography>
            {userId === blog.user?._id && isLogin ? (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  onClick={handleEdit}
                  className="flex items-center hover:text-blue-500 transition-all p-2 md:p-3 rounded-md bg-blue-100 shadow-md"
                >
                  <FaEdit className="mr-1" /> Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  className="flex items-center hover:text-red-500 transition-all p-2 md:p-3 rounded-md bg-red-100 shadow-md"
                >
                  <MdDelete className="mr-1" /> Delete
                </Button>
              </div>
            ) : null}
          </div>
          <Typography className="text-gray-700 mb-4">
            {blog.description}
          </Typography>
          <CommentSection />
        </div>
      </Reveal>
    </div>
  );
};

export default GetBlog;
