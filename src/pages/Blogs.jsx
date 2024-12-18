/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import { useSelector } from "react-redux";
import toast, { LoaderIcon } from "react-hot-toast";
import Reveal from "../components/Reveal";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const isLogin = useSelector((state) => state.isLogin);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const getAllBlogs = async () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      const { data } = await axios.get(`${apiUrl}/api/v1/blog/all-blogs`);
      if (data?.success) {
        const sortedBlogs = data.blogs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBlogs(sortedBlogs);
        setLoading(false);
      } else {
        toast.error("Failed to fetch blogs");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("An error occurred while fetching blogs");
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBlogs();
    // Example query, adjust as needed
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const filteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter((blog) => blog.category === selectedCategory);
  const currentBlogs = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <p>
        <LoaderIcon className=" mx-auto mt-3  w-8 h-8 rounded-full" />
      </p>
    );
  }

  return (
    <>
      {isLogin && (
        <div className="flex flex-col items-center bg-gradient-to-br from-lime-400 via-green-200 to-deep-orange-400">
          <CategoryTabs
            selectedCategory={selectedCategory}
            handleCategoryChange={handleCategoryChange}
          />
          <Reveal>
            <div className="grid gap-x-2 gap-y-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:px-10 mt-4 px-2">
              {currentBlogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  id={blog._id}
                  isUser={localStorage.getItem("userId") === blog.user?._id}
                  title={blog.title}
                  description={blog.description}
                  category={blog.category}
                  image={blog.image}
                  username={blog.user.username}
                  time={blog.createdAt}
                />
              ))}
            </div>
          </Reveal>
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={filteredBlogs.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      )}
    </>
  );
}

const CategoryTabs = ({ selectedCategory, handleCategoryChange }) => {
  const categories = [
    "All",
    "tech",
    "lifestyle",
    "sports",
    "weather",
    "education",
  ]; // Add your categories here

  return (
    <div className="pt-24 w-full flex justify-center">
      <div className="flex space-x-4 border-b border-gray-300">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`py-2 px-[.2] md:px-4 font-semibold text-sm md:text-base ${
              selectedCategory === category
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 hover:text-blue-500 "
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];
  
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex justify-center gap-x-2 mt-4 text-blue-gray-400">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${
              currentPage === number ? "text-blue-500" : ""
            }`}
          >
            <button
              onClick={() => paginate(number)}
              className="  px-3 py-1  border relative "
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Blogs;
