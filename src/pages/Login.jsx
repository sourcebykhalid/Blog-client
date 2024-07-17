import { Card, Input, Button, Typography } from "@material-tailwind/react";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authActions } from "../redux/store";
import { useDispatch } from "react-redux";
const SimpleLoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://blog-backend-v95w.onrender.com/api/v1/user/login",
        {
          email: inputs.email,
          password: inputs.password,
        }
      );

      if (data.success) {
        localStorage.setItem("userId", data?.user._id);
        dispatch(authActions.login());
        toast.success("User Logged in Successfully");
        navigate("/");
      } else {
        toast.error("Please enter correct credentials");
      }
    } catch (error) {
      toast.error("Please enter correct login credentials");
    }
  };

  return (
    <div className="flex justify-center   w-full h-screen md:pt-20 ">
      <Card color="transparent" shadow={false}>
        <Typography
          className=" flex justify-center bg-yellow-300 border-2 border-gray-400 rounded-md font-bold"
          variant="h3"
          color="blue-gray"
        >
          BlogBeacon
        </Typography>
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
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
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
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>

          <Button type="submit" className="mt-6" fullWidth>
            Login
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Dont have an account?{" "}
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
