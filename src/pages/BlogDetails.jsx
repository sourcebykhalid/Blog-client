import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import toast from "react-hot-toast";

const BlogDetails = () => {
  const [blog, setBlog] = useState({});
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const { id } = useParams();

  // Get blog details
  const getBlogDetail = async () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      const { data } = await axios.get(`${apiUrl}/api/v1/blog/get-blog/${id}`);
      if (data?.success) {
        setBlog(data.blog);
        setInputs({
          title: data.blog.title,
          description: data.blog.description,
          category: data.blog.category,
          image: data.blog.image, // Store the existing image URL
        });
        setOpen(true); // Open dialog only after successful fetch
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch blog details.");
    }
  };

  useEffect(() => {
    getBlogDetail();
  }, [id]);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
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
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("description", inputs.description);
    formData.append("category", inputs.category);
    formData.append("user", localStorage.getItem("userId"));
    if (imageFile) formData.append("image", imageFile);

    try {
      const { data } = await axios.put(
        `${apiUrl}/api/v1/blog/update-blog/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.success) {
        toast.success("Blog updated successfully");
        setInputs({}); // Reset inputs after successful update
        navigate("/user-blogs");
        setOpen(false);
      } else {
        toast.error(data.message || "Failed to update the blog.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("An error occurred while updating the blog.");
    }
  };

  const handleOpen = () => {
    setOpen(!open);
    if (!open) {
      navigate("/all-blogs");
    }
  };

  return (
    <div className="flex justify-center items-center flex-col w-full">
      <Dialog
        className="flex justify-center items-center"
        open={open}
        handler={handleOpen}
      >
        <form
          onSubmit={handleSubmit}
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Title
            </Typography>
            <Input
              size="lg"
              placeholder="Enter Blog Title"
              name="title"
              value={inputs.title}
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Description
            </Typography>
            <Textarea
              name="description"
              value={inputs.description}
              onChange={handleChange}
              label="Description"
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
              <Option value="health">Health</Option>
              <Option value="lifestyle">Lifestyle</Option>
              <Option value="finance">Finance</Option>
              <Option value="education">Education</Option>
            </Select>
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Upload Image
            </Typography>
            <Input type="file" name="image" onCha nge={handleFileChange} />
          </div>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button type="submit" variant="gradient" color="green">
              <span>Update</span>
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};

export default BlogDetails;
