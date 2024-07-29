import React from "react";
import Header from "./components/Header.jsx";
import { Routes, Route } from "react-router-dom";
import Blogs from "./pages/Blogs.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import UserBlogs from "./pages/UserBlogs.jsx";
import CreateBlog from "./pages/CreateBlog.jsx";
import BlogDetails from "./pages/BlogDetails.jsx";
import Home from "./components/Home.jsx";
import { Toaster } from "react-hot-toast";
import GetBlog from "./pages/GetBlog.jsx";
import Profile from "./pages/Profile.jsx";
import UserDetails from "./pages/UserDetails.jsx";
import AllUsers from "./pages/AllUsers.jsx";
import Khalid from "./components/Add.jsx";
function App() {
  return (
    <>
      <Header />
      <Toaster />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/khalid" element={<Khalid />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/all-blogs" element={<Blogs />} />
        <Route path="/user-blogs" element={<UserBlogs />} />
        <Route path="/blog-details/:id" element={<BlogDetails />} />
        <Route path="/get-blog/:id" element={<GetBlog />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/current-user/:id" element={<Profile />} />
        <Route path="/update-user/:id" element={<UserDetails />} />
        <Route path="/all-users" element={<AllUsers />} />
      </Routes>
    </>
  );
}

export default App;
