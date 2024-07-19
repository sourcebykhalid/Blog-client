import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Typography,
  Button,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { FaUser } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Reveal from "./Reveal";

const Home = ({ username }) => {
  const isLogin = useSelector((state) => state.isLogin);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/blog/all-blogs`
        );
        if (data?.success) {
          const sortedBlogs = data.blogs.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setBlogs(sortedBlogs.slice(0, 3));

          // Display the first 3 blogs
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

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

  const handleReadMore = (id) => {
    navigate(`/get-blog/${id}`);
  };

  return (
    <div className=" bg-gray-400">
      {/* Hero Section */}
      <div className="relative  w-full text-gray-500 flex justify-center items-center py-40 ">
        <div className="relative z-10 text-center px-4 leading-[3rem]">
          <Reveal>
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="bg-gradient-to-r from-black via-lime-500  to-gray-200 bg-clip-text text-transparent mx-auto mt-24 text-3xl md:text-7xl font-bold "
            >
              Welcome to{" "}
              <span className=" bg-gradient-to-r from-slate-700 via-blue-700 to-orange-500 bg-clip-text text-transparent font-extrabold ">
                blogBeacon
              </span>
            </motion.h1>
          </Reveal>
          <Reveal>
            <div className="flex flex-col justify-center items-center md:w-2/3 mx-3 md:mx-auto gap-y-3">
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className=" text-gray-900 text-sm mt-5"
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste
                ullam nisi debitis officiis hic ratione atque. Fuga quis
                veritatis nulla aperiam possimus at quam praesentium velit porro
                dolores Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Iste ullam nisi debitis officiis hic ratione atqula aperiam
                possimus at quam praesentium velit porro dolores
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className=" text-gray-900 text-sm mx-6"
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste
                ullam nisi debitis officiis hic ratione atque. Fuga quis
                veritatis nulla aperiam possimus at quam praesentium velit porro
                dolores Lorem ipsum dolor sit amet con officiis hic ratione
                atque. Fuga quis veritatis nulla aperiam possimus at quam
                praesentium velit porro dolores
              </motion.p>
            </div>
          </Reveal>
        </div>
      </div>
      {!isLogin && (
        <div className="flex justify-center items-center text-xl gap-x-3 bg-gray-400 font-semibold px-4 py-2 md:w-1/2 mx-auto shadow-md shadow-green-200">
          Please <Button onClick={() => navigate("/login")}>Login</Button> to
          add posts
        </div>
      )}

      {/* Recent Blog Posts */}

      <div className=" bg-gradient-to-b from-blue-gray-100 to-orange-900">
        <Reveal>
          {" "}
          <div className="py-16 md:py-36">
            <Typography variant="h2" className="text-center mb-8">
              Recent Blog Posts
            </Typography>
            <div className="flex justify-center items-center flex-wrap gap-6">
              {blogs.map((blog) => (
                <Card
                  key={blog._id}
                  onClick={() => handleReadMore(blog._id)}
                  fullWidth
                  className="w-full sm:w-96 hover:bg-gradient-to-tr from-gray-400 via-lime-200 to-orange-200 transition-all cursor-pointer"
                >
                  <CardHeader color="blue" className="relative h-56">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="transition-all hover:scale-x-110 overflow-hidden h-full w-full"
                    />
                  </CardHeader>
                  <CardBody>
                    <div className="flex justify-between items-center">
                      <Typography variant="h5" className="mb-2">
                        {blog.title}
                      </Typography>
                      <Typography
                        variant="h5"
                        className="mb-2 text-sm bg-gradient-to-tr from-blue-600 to-orange-300 p-1 w-fit rounded-sm"
                      >
                        #{blog.category}
                      </Typography>
                    </div>
                    <Typography className="mb-4">
                      {blog.description.slice(0, 90)}...
                    </Typography>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <FaUser />
                        <span>{blog.user.username}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <MdDateRange />
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </Reveal>

        {/* About Section */}
        <Reveal>
          <div className="py-24  text-gray-400">
            <div className="max-w-4xl mx-auto text-center px-4">
              <Typography variant="h2" className="mb-4 text-black font-bold">
                About BlogBeacon
              </Typography>
              <Typography className="mb-8 text-black">
                BlogBeacon is your go-to source for the latest and greatest blog
                posts on a variety of topics. Whether you&apos;re interested in
                tech, lifestyle, travel, or more, we&apos;ve got you covered
                with insightful articles from passionate writers.
              </Typography>
            </div>
          </div>
        </Reveal>
      </div>
      <p className=" w-full text-center text-sm text-blue-gray-400 md:text-base bg-green-400 p-2">
        © Khalid | blogBeacon, 2024. All rights reserved.
      </p>
    </div>
  );
};

export default Home;
