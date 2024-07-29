import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Typography,
  Button,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { FaBloggerB, FaUser } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Reveal from "./Reveal";

const Home = ({ username }) => {
  const isLogin = useSelector((state) => state.isLogin);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/api/v1/blog/all-blogs`);
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
    <div className=" bg-blend-hue bg-gray-100 font-body">
      {/* Hero Section */}
      <div className="relative  w-full text-gray-500 flex justify-center items-center py-40 ">
        <div className="relative z-10 text-center px-4 leading-[3rem]">
          <Reveal>
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="bg-gradient-to-r from-black via-lime-500  to-gray-200 bg-clip-text text-transparent mx-auto mt-24 text-3xl md:text-7xl font-extrabold "
            >
              Welcome to{" "}
              <span className=" bg-gradient-to-r from-black via-gray-700 to-green-500 bg-clip-text text-transparent font-extrabold md:text-8xl ">
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
                className="text-gray-800 text-sm mt-5 border-b border-green-400 rounded-md px-2"
              >
                Welcome to{" "}
                <span className=" font-bold bg-gradient-to-r from-orange-400 via-amber-100 to-orange-200 px-1 rounded-sm">
                  BlogBeacon
                </span>{" "}
                a platform designed with you in mind. Whether you&apos;re a
                seasoned writer or just starting, our app offers a seamless and
                engaging experience. With powerful content management tools, and
                robust community features, it&apos;s never been easier to share
                your stories and connect with readers.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className=" text-gray-800 text-sm mx-6 "
              >
                Plus, our built-in SEO tools and analytics help you grow your
                audience and understand your readers better. Join us today and
                take your blogging to the next level!
              </motion.p>
            </div>
          </Reveal>
        </div>
      </div>
      {!isLogin && (
        <div className="flex justify-center items-center text-xl gap-x-3 border-b border-green-400 rounded-md p-2 md:w-1/2 mx-auto mb-5 md:mb-12">
          Please <Button onClick={() => navigate("/login")}>Login</Button> to
          add posts
        </div>
      )}

      {/* Recent Blog Posts */}

      <div className=" bg-gradient-to-b from-blue-gray-100 to-black">
        {" "}
        <div className="py-16 md:py-36">
          <Reveal>
            <Typography
              variant="h2"
              className="text-center mb-8 text-gray-700 font-body rounded-md border-b-2  border-orange-800  p-1 w-fit mx-auto "
            >
              Recent Blog Posts
            </Typography>{" "}
          </Reveal>
          <div className="flex justify-center items-center flex-wrap gap-6">
            {blogs.map((blog) => (
              <Card
                key={blog._id}
                onClick={() => handleReadMore(blog._id)}
                fullWidth
                className="group w-full sm:w-96 hover:bg-gradient-to-tr from-gray-400 via-lime-200 to-orange-200 transition-all cursor-pointer "
              >
                <Reveal>
                  <CardHeader color="blue" className="relative h-56">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="transition-all hover:scale-x-110 overflow-hidden h-full w-full md:group-hover:scale-105"
                    />
                  </CardHeader>{" "}
                </Reveal>
                <Reveal>
                  <CardBody>
                    <div className="flex justify-between items-center">
                      <Typography
                        variant="h5"
                        className="mb-2 md:group-hover:font-extrabold"
                      >
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
                    <div className="flex justify-between items-center text-sm ">
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
                </Reveal>
              </Card>
            ))}
          </div>
        </div>
        {/* About Section */}
        <div className="py-24  text-gray-400">
          <div className="max-w-4xl mx-auto text-center px-4">
            <Reveal>
              <Typography
                variant="h2"
                className="mb-4 text-blue-gray-100  font-bold border-b-2 border-orange-900 rounded-md px-2 w-fit mx-auto"
              >
                About BlogBeacon
              </Typography>{" "}
            </Reveal>
            <Reveal>
              <Typography className="mb-8 text-blue-gray-300">
                BlogBeacon is your go-to source for the latest and greatest blog
                posts on a variety of topics. Whether you&apos;re interested in
                tech, lifestyle, travel, or more, we&apos;ve got you covered
                with insightful articles from passionate writers.
              </Typography>{" "}
            </Reveal>
          </div>
        </div>
      </div>
      <p className=" w-full text-center text-sm text-gray-100/70 md:text-base bg-mycolor backdrop-blur-md p-2 flex justify-center items-center">
        © Khalid | blog
        <FaBloggerB />
        eacon, 2024. All rights reserved.
      </p>
    </div>
  );
};

export default Home;
