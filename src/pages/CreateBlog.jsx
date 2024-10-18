import React, { useState } from "react";
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
  const [imageFile, setImageFile] = useState(null); // New state for image file
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(!open);
    navigate("/");
  };

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
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const id = localStorage.getItem("userId");
      const formData = new FormData();
      formData.append("title", inputs.title);
      formData.append("description", inputs.description);
      formData.append("category", inputs.category);
      formData.append("image", imageFile); // Append the image file
      formData.append("user", id);

      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const { data } = await axios.post(
        `${apiUrl}/api/v1/blog/create-blog`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
        "An error occurred while creating the blog. Please try again later."
      );
    }
  };

  return (
    <div className="flex justify-center items-center flex-col w-full">
      <Dialog
        className="flex justify-center items-center bg-gray-200"
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
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Description
            </Typography>
            <Textarea
              name="description"
              value={inputs.description}
              onChange={handleChange}
              label="Tell your story"
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Category
            </Typography>
            <Select
              label="Select Category"
              value={inputs.category}
              onChange={handleCategoryChange}
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
            <Input type="file" name="image" onChange={handleFileChange} />
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
            <Button type="submit" variant="gradient" color="green">
              Publish
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default CreateBlog;
