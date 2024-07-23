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
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/blog/delete-blog/${id}`
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
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/blog/get-blog/${id}`
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
    return <div>Loading...</div>;
  }

  if (!blog) {
    return <div>No blog found</div>;
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start pt-24 gap-x-3">
      <Reveal>
        <div className="flex flex-col  justify-center py-1 md:py-2 items-center w-full md:w-5/6 h-full ml-7">
          <Typography className="text-sm">
            {formatDate(blog.createdAt)}
          </Typography>

          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className=" md:w-5/6 h-[18rem] md:h-[32rem] p-3 bg-cover rounded-md mb-4"
            />
          )}
          <Typography variant="h2" className="text-sm text-blue-500">
            #{blog.category}
          </Typography>
          <Typography variant="h6">
            <div className="flex gap-x-2 justify-center items-center font-bold text-gray-800 text-lg md:text-xl">
              <FaUser />
              {blog.user?.username}
            </div>
          </Typography>
        </div>
      </Reveal>
      <Reveal>
        <div className="flex flex-col md:w-full px-3 md:px-0">
          <div className="flex justify-between items-center md:mx-10">
            <Typography
              variant="h2"
              className="text-lg md:text-2xl text-gray-800 font-bold"
            >
              {blog.title}
            </Typography>
            <div>
              {userId === blog.user?._id && isLogin ? (
                <div className="flex justify-center items-center space-x-1">
                  <Button
                    onClick={handleEdit}
                    className="hover:text-blue-500 transition-all"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="hover:text-red-500 transition-all"
                  >
                    <MdDelete />
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
          <Typography>{blog.description}</Typography>
          <CommentSection /> {/* Add the CommentSection component here */}
        </div>
      </Reveal>
    </div>
  );
};

export default GetBlog;
