import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaBloggerB } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SimpleRegistrationForm = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setInputs((prevState) => ({
        ...prevState,
        [name]: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    if (!inputs.name || !inputs.email || !inputs.password) {
      return toast.error("All fields are required!");
    }

    if (!validateEmail(inputs.email)) {
      return toast.error("Please enter a valid email address!");
    }

    const formData = new FormData();
    formData.append("username", inputs.name);
    formData.append("email", inputs.email);
    formData.append("password", inputs.password);
    if (inputs.image) {
      formData.append("image", inputs.image);
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${apiUrl}/api/v1/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("User Registered Successfully");
        navigate("/login");
        setInputs({ name: "", email: "", password: "", image: null });
        setImagePreview(null);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-16">
      <Card color="transparent" shadow={false}>
        <div className="flex justify-center items-center text-base md:text-xl rounded-md bottom-1 border-b-2 border-orange-600 cursor-pointer text-black font-extrabold">
          <h2 className="font-extrabold bg-gradient-to-r from-black via-blue-700 to-orange-500 bg-clip-text text-transparent cursor-pointer">
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
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
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
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Image
            </Typography>
            <Input
              size="lg"
              type="file"
              name="image"
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-24 h-24 object-cover"
              />
            )}
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
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
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
          <Button type="submit" className="mt-6" fullWidth disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
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
