import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaBloggerB } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SimpleRegistrationForm = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    image: null, // Change to handle file
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setInputs((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.files[0], // Set file object
      }));
    } else {
      setInputs((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // Create FormData object
    const formData = new FormData();
    formData.append("username", inputs.name);
    formData.append("email", inputs.email);
    formData.append("password", inputs.password);
    if (inputs.image) {
      formData.append("image", inputs.image); // Append the file
    }

    try {
      const { data } = await axios.post(
        `${apiUrl}/api/v1/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      if (data.success) {
        toast.success("User Registered Successfully");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error during registration");
    }
  };

  return (
    <div className="flex justify-center pt-16 ">
      <Card color="transparent" shadow={false}>
        <div className="flex justify-center items-center text-base md:text-xl rounded-md bottom-1 border-b-2 border-orange-600 cursor-pointer text-black font-extrabold ">
          <h2 className="font-extrabold bg-gradient-to-r from-black via-blue-700 to-orange-500 bg-clip-text text-transparent  cursor-pointer">
            blog
          </h2>
          <FaBloggerB />
          eacon
        </div>
        <Typography
          className="flex justify-center items-center mt-1"
          variant="h4"
          color="blue-gray"
        >
          Sign Up
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Nice to meet you! Enter your details to register.
        </Typography>
        <form
          onSubmit={handleSubmit}
          className="mt-2 mb-2 w-80 max-w-screen-lg sm:w-96"
        >
          <div className="mb-1 flex flex-col gap-2">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Name
            </Typography>
            <Input
              size="lg"
              placeholder="Name"
              name="name"
              value={inputs.name}
              onChange={handleChange}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Email
            </Typography>
            <Input
              size="lg"
              name="email"
              placeholder="name@mail.com"
              value={inputs.email}
              onChange={handleChange}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Image
            </Typography>
            <Input
              size="lg"
              type="file" // Change to file input
              name="image"
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
              name="password"
              size="lg"
              placeholder="********"
              value={inputs.password}
              onChange={handleChange}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Checkbox
            required
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center font-normal"
              >
                I agree to the
                <a
                  href="#"
                  className="font-medium transition-colors hover:text-gray-900"
                >
                  &nbsp;Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button type="submit" className="mt-6" fullWidth>
            Sign Up
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <a
              onClick={() => navigate("/login")}
              className="font-medium text-gray-900 cursor-pointer"
            >
              Sign In
            </a>
          </Typography>
        </form>
      </Card>
    </div>
  );
};

export default SimpleRegistrationForm;
