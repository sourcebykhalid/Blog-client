import axios from "axios";
import React, { useState, useEffect } from "react";
import BlogCard from "../components/BlogCard";
import { MdCancel } from "react-icons/md";
function UserBlogs() {
  const [blogs, setBlogs] = useState([]);
  const getUserBlogs = async () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      const id = localStorage.getItem("userId");
      const { data } = await axios.get(`${apiUrl}/api/v1/blog/user-blog/${id}`);
      if (data?.success) {
        setBlogs(data?.userBlog.blogs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserBlogs();
  }, []);
  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-lime-400 via-green-200 to-deep-orange-400  ">
      <div className="grid gap-x-2 gap-y-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-2 md:px-9 ">
        {blogs && blogs.length > 0 ? (
          blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog._id}
              isUser={true}
              title={blog.title}
              description={blog.description}
              category={blog.category}
              image={blog.image}
              username={blog.user.username}
              time={blog.createdAt}
            />
          ))
        ) : (
          <div className=" bg-gray-400 flex justify-center items-center mx-auto w-full h-screen font-bold text-lg p-4 sm:ml-[100%]">
            <span className=" flex justify-center items-center gap-x-3">
              No posts created <MdCancel />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserBlogs;
