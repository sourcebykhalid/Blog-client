import { useEffect, useState, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../redux/store";
import toast from "react-hot-toast";
import { IconButton, MobileNav } from "@material-tailwind/react";
import { FaBloggerB, FaHome, FaPen, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";

function Header() {
  const isLogin = useSelector((state) => state.isLogin);
  const userId = useSelector((state) => state.userId);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [image, setImage] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const [blogs, setBlogs] = useState([]);
  const [openNav, setOpenNav] = useState(false);
  const [user, setUser] = useState({});
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/api/v1/blog/all-blogs`);
        if (data?.success) setBlogs(data.blogs);
      } catch (error) {
        toast.error("An error occurred while fetching blogs");
      }
    };
    fetchBlogs();
  }, [apiUrl]);

  useEffect(() => {
    if (userId) {
      const getUserDetail = async () => {
        try {
          const { data } = await axios.get(
            `${apiUrl}/api/v1/user/current-user/${userId}`
          );
          if (data?.success) {
            setUser(data.userProfile);
            setImage(`${apiUrl}/uploads/${data.userProfile.image}`);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
      getUserDetail();
    }
  }, [userId, apiUrl]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => setOpenNav(false), [location]);

  const handleLogout = () => {
    dispatch(authActions.logout());
    toast.success("Logout successfully");
  };

  const navList = useMemo(
    () => (
      <ul className="flex flex-col md:flex-row justify-center items-center gap-x-4">
        {isLogin ? (
          <>
            <div className="flex flex-col md:flex-row justify-center items-center gap-x-4 md:mr-24 gap-y-6 md:gap-y-0">
              <NavLink to="/" key="home">
                <li className="transition-all hover:scale-105 cursor-pointer flex justify-center items-center gap-x-1 border-b border-orange-400 rounded-md px-1">
                  Home <FaHome />
                </li>
              </NavLink>
              <NavLink to="/all-blogs" key="all-blogs">
                <li className="transition-all hover:scale-105 cursor-pointer flex justify-center items-center gap-x-1 border-b border-orange-400 rounded-md px-1">
                  Latest Articles
                </li>
              </NavLink>
              <NavLink to="/user-blogs" key="user-blogs">
                <li className="transition-all hover:scale-105 cursor-pointer flex justify-center items-center gap-x-1 border-b border-orange-400 rounded-md px-1">
                  My Blogs
                </li>
              </NavLink>
              <NavLink to="/create-blog" key="create-blog">
                <li className="hover:scale-105 cursor-pointer flex justify-center items-center gap-x-1 border-b border-orange-400 rounded-md px-1">
                  Write <FaPen />
                </li>
              </NavLink>
              <NavLink to="/all-users" key="all-users">
                <li className="hover:scale-105 cursor-pointer flex justify-center items-center gap-x-1 border-b border-orange-400 rounded-md px-1">
                  Authors
                </li>
              </NavLink>
            </div>
            <NavLink to="/login" key="logout" onClick={handleLogout}>
              <li className="flex justify-center items-center gap-x-1 transition-all hover:scale-110 font-semibold mt-12 md:mt-0 border-b-2 border-red-400 rounded-md px-1 text-red-400">
                Logout <FaSignOutAlt />
              </li>
            </NavLink>
            <NavLink to={`/current-user/${userId}`} key="user-profile">
              <li className="hover:text-gray-300 cursor-pointer text-black p-2 rounded-full transition-all hover:scale-105">
                <img
                  src={imageLoaded ? image : "https://via.placeholder.com/32"}
                  alt={user.username || "User"}
                  className="w-8 h-8 rounded-full"
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImage("https://via.placeholder.com/32")}
                />
                {!imageLoaded && <span className="text-sm">Loading...</span>}
              </li>
            </NavLink>
          </>
        ) : (
          <div className="flex flex-col md:flex-row justify-center items-center gap-y-3 gap-x-2">
            <NavLink to="/login" key="login">
              <li className="px-3 py-1 bg-green-500 text-gray-200  transition-all hover:-skew-x-2 hover:border-b-4 hover:border-r-4 hover:border-black">
                Login
              </li>
            </NavLink>
            <NavLink to="/register" key="register">
              <li className="bg-orange-600 px-3 py-1 text-black rounded-sm border border-orange-600 transition-all hover:scale-105 hover:-skew-x-2 hover:border-b-4 hover:border-r-4 hover:border-black">
                Get Started Free
              </li>
            </NavLink>
          </div>
        )}
      </ul>
    ),
    [isLogin, user, userId, image, imageLoaded]
  );

  return (
    <div className="z-30 w-full flex flex-wrap sm:justify-between items-center backdrop-blur-md backdrop-contrast-100 fixed text-blue-gray-400 text-sm font-semibold px-4 py-5 md:gap-y-0 gap-x-4 font-body">
      <div className="flex justify-center items-center text-base md:text-xl rounded-md bottom-1 px-1 cursor-pointer border-b-2 border-orange-500 ">
        <h2 className="flex gap-x-1 font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-600 bg-clip-text text-transparent cursor-pointer">
          <NavLink
            className="flex w-fit flex-row justify-center items-center"
            to="/"
          >
            blog
            <FaBloggerB className="text-black" />
            eacon
          </NavLink>
        </h2>
      </div>
      <nav className="hidden md:block">{navList}</nav>
      <IconButton
        variant="text"
        className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
        ripple={false}
        onClick={() => setOpenNav(!openNav)}
      >
        {openNav ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        )}
      </IconButton>
      <MobileNav open={openNav} className="overflow-scroll z-50">
        {navList}
      </MobileNav>
    </div>
  );
}

export default Header;
