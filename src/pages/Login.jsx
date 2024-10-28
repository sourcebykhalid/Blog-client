import { Card, Input, Button, Typography } from "@material-tailwind/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/store"; // Import the auth actions
import { FaBloggerB } from "react-icons/fa";

const SimpleLoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Check if user is already logged in by checking the token in localStorage
    const token = localStorage.getItem("userToken");
    if (token) {
      dispatch(authActions.login(token)); // Update Redux state if token exists
      navigate("/"); // Redirect to home if already logged in
    }
  }, [dispatch, navigate]);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      const { data } = await axios.post(`${apiUrl}/api/v1/user/login`, {
        email: inputs.email,
        password: inputs.password,
      });

      if (data.success) {
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("userToken", data.token); // Save the token to localStorage
        dispatch(authActions.login(data.token)); // Dispatch login action with token
        toast.success("User Logged in Successfully");
        navigate("/"); // Redirect to home page
      } else {
        toast.error("Please enter correct credentials");
      }
    } catch (error) {
      toast.error("Please enter correct login credentials");
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center w-full h-screen pt-24 md:pt-20">
      <Card color="transparent" shadow={false}>
        <div className="flex justify-center items-center text-base md:text-xl rounded-md bottom-1 border-b-2 border-orange-600 cursor-pointer text-black font-extrabold ">
          <h2 className="font-extrabold bg-gradient-to-r from-black via-blue-700 to-orange-500 bg-clip-text text-transparent cursor-pointer">
            blog
          </h2>
          <FaBloggerB />
          eacon
        </div>
        <Typography
          className="flex justify-center items-center mt-3"
          variant="h4"
          color="blue-gray"
        >
          Sign In
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Nice to meet you! Enter your details to Sign In.
        </Typography>
        <form
          onSubmit={handleSubmit}
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Button type="submit" className="mt-6" fullWidth>
            Login
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Don’t have an account?{" "}
            <a
              onClick={() => navigate("/register")}
              className="font-medium text-gray-900 cursor-pointer"
            >
              Sign Up
            </a>
          </Typography>
        </form>
      </Card>
    </div>
  );
};

export default SimpleLoginForm;
