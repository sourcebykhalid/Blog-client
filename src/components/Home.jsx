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
import { FaBloggerB, FaUser, FaEye } from "react-icons/fa";
import { MdDateRange, MdCategory, MdTrendingUp } from "react-icons/md";
import { AiOutlineShareAlt, AiOutlineComment } from "react-icons/ai";
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

  // New Features Section component data
  const features = [
    {
      title: "Explore Diverse Categories",
      description:
        "Find content across various topics including tech, lifestyle, travel, and more, tailored to your interests.",
      icon: <MdCategory className="text-purple-400 text-5xl" />,
    },
    {
      title: "Trending Blogs",
      description:
        "Stay updated with what's popular and trending. Discover the most engaging posts in real-time.",
      icon: <MdTrendingUp className="text-blue-500 text-5xl" />,
    },
    {
      title: "Connect with Authors",
      description:
        "Interact with writers, follow their journey, and contribute to the community through meaningful discussions.",
      icon: <FaUser className="text-green-400 text-5xl" />,
    },
    {
      title: "Share Your Thoughts",
      description:
        "Comment, share, and engage with the community. Your voice matters in building a vibrant blogosphere.",
      icon: <AiOutlineComment className="text-pink-400 text-5xl" />,
    },
    {
      title: "Bookmark & Save",
      description:
        "Easily save your favorite articles and build your personalized reading list for future reference.",
      icon: <FaEye className="text-yellow-400 text-5xl" />,
    },
    {
      title: "Seamless Sharing",
      description:
        "Share inspiring content with friends and followers across social platforms with just a click.",
      icon: <AiOutlineShareAlt className="text-red-400 text-5xl" />,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-800 to-black min-h-screen text-white font-body">
      {/* Hero Section */}
      <div className="relative flex flex-col justify-center items-center gap-y-12 py-40">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold text-center bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-600 bg-clip-text text-transparent mx-auto leading-tight"
        >
          Welcome to <span className="text-white">BlogBeacon</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-lg md:text-xl text-center max-w-2xl mt-4 mx-6 p-2 bg-gray-900 rounded-lg shadow-lg flex flex-col items-center justify-center gap-3"
        >
          {/* Large icon */}
          Join a community of writers and readers. Explore engaging articles,
          share your thoughts, and elevate your blogging experience!
          <FaBloggerB className="text-9xl font-extrabold text-cyan-400" />
        </motion.p>
      </div>
      {!isLogin && (
        <div className="flex justify-center items-center text-xl gap-x-3 border-b border-green-400 rounded-md p-2 md:w-1/2 mx-auto mb-5 md:mb-12">
          Please <Button onClick={() => navigate("/login")}>Login</Button> to
          add posts
        </div>
      )}

      {/* Recent Blog Posts */}
      <div className="py-16 md:py-36">
        <Reveal>
          <Typography
            variant="h2"
            className="text-center mb-8 text-cyan-400 font-bold border-b-2 border-purple-500 p-1 w-fit mx-auto"
          >
            Recent Blog Posts
          </Typography>
        </Reveal>
        <div className="flex justify-center items-center flex-wrap gap-8">
          {blogs.map((blog) => (
            <Card
              key={blog._id}
              onClick={() => handleReadMore(blog._id)}
              fullWidth
              className="group w-full h-96 sm:w-96 hover:scale-105 transition-transform cursor-pointer shadow-lg bg-gray-900 border border-gray-700"
            >
              <Reveal>
                <CardHeader color="blue" className="relative h-56">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="object-cover h-full w-full rounded-t-lg transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                  />
                </CardHeader>
              </Reveal>
              <Reveal>
                <CardBody className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Typography variant="h5" className="font-bold">
                      {blog.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      className="text-sm bg-gradient-to-r from-blue-600 to-purple-500 p-1 rounded-md"
                    >
                      #{blog.category}
                    </Typography>
                  </div>
                  <Typography className="mb-4 text-gray-400">
                    {blog.description.slice(0, 90)}...
                  </Typography>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <FaUser />
                      <span>{blog.user.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
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

      {/* Features Section */}
      <div className="py-16 md:py-24 bg-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-center mb-10"
        >
          <Typography
            variant="h2"
            className="text-cyan-400 font-bold border-b-2 border-purple-500 p-2 w-fit mx-auto"
          >
            BlogBeacon Features
          </Typography>
        </motion.div>
        <div className="flex flex-wrap justify-center items-center gap-6 gap-y-10 px-4 pb-32">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group w-80 sm:w-1/3 p-4 bg-gray-800 border border-gray-700 shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <CardHeader
                variant="gradient"
                className="flex justify-center items-center bg-gray-800 rounded-md"
              >
                {feature.icon}
              </CardHeader>
              <CardBody className="text-center">
                <Typography
                  variant="h5"
                  className="font-semibold text-purple-400 group-hover:text-cyan-500 transition-colors duration-300"
                >
                  {feature.title}
                </Typography>
                <Typography className="text-gray-400 mt-2">
                  {feature.description}
                </Typography>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="w-full text-center text-sm text-gray-300 bg-gray-800 backdrop-blur-md p-2 flex justify-center items-center ">
        © Khalid | Blog <FaBloggerB /> eacon, 2024. All rights reserved.
      </p>
    </div>
  );
};

export default Home;
