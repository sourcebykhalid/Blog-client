import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  Input,
  Typography,
  DialogFooter,
  Textarea,
  Select,
  Option,
} from "@material-tailwind/react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateBlog = () => {
  const [open, setOpen] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(!open);
    if (open) {
      navigate("/"); // Navigate only if opening the dialog
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) {
      toast.error("User authentication required. Please log in.");
      navigate("/login");
    } else {
      setUserId(id);
    }
  }, [navigate]);

  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value) => {
    setInputs((prevState) => ({
      ...prevState,
      category: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Basic validation for image files
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      toast.error("Please upload a valid image file.");
      setImageFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !inputs.title ||
      !inputs.description ||
      !inputs.category ||
      !imageFile
    ) {
      toast.error("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("description", inputs.description);
    formData.append("category", inputs.category);
    formData.append("image", imageFile);
    formData.append("user", userId);

    setLoading(true); // Set loading to true

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const { data } = await axios.post(
        `${apiUrl}/api/v1/blog/create-blog`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data?.success) {
        toast.success("Blog created successfully");
        setOpen(false);
        navigate("/user-blogs");
      } else {
        toast.error("Failed to create blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error(
        "An error occurred while creating the blog. Please try again."
      );
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex justify-center items-center flex-col w-full">
      <Dialog
        className="flex justify-center items-center bg-blue-gray-100"
        open={open}
        handler={handleOpen}
      >
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Title
            </Typography>
            <Input
              size="lg"
              placeholder="Enter Blog title"
              name="title"
              value={inputs.title}
              onChange={handleChange}
              label="Title here"
              required // Add required attribute
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Description
            </Typography>
            <Textarea
              name="description"
              value={inputs.description}
              onChange={handleChange}
              label="Tell your story"
              required // Add required attribute
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Category
            </Typography>
            <Select
              label="Select Category"
              value={inputs.category}
              onChange={handleCategoryChange}
              required // Add required attribute
            >
              <Option value="tech">Technology</Option>
              <Option value="lifestyle">Lifestyle</Option>
              <Option value="finance">Finance</Option>
              <Option value="education">Education</Option>
              <Option value="weather">Weather</Option>
            </Select>
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Upload Image
            </Typography>
            <Input
              className=" cursor-pointer"
              type="file"
              name="image"
              onChange={handleFileChange}
              required
            />{" "}
            {/* Add required */}
          </div>

          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1"
            >
              Cancel
            </Button>
            <Button
              className="bg-green-500 text-gray-200  transition-all hover:-skew-x-2 hover:border-b-4 hover:border-r-4 hover:border-black rounded"
              type="submit"
              variant="gradient"
              color="green"
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish"} {/* Loading feedback */}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default CreateBlog;
