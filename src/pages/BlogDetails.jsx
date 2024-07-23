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
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});

  const { id } = useParams();

  //get blog details
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
          image: data.blog.image,
        });
      }
    } catch (error) {
      console.error(error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      const { data } = await axios.put(
        `${apiUrl}/api/v1/blog/update-blog/${id}`,
        {
          title: inputs.title,
          description: inputs.description,
          category: inputs.category,
          image: inputs.image,
          user: localStorage.getItem("userId"),
        }
      );
      if (data?.success) {
        toast.success("Blog updated successfully");
        navigate("/user-blogs");
        setOpen(false); // Close the dialog
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpen = () => {
    setOpen(!open);
    navigate("/all-blogs");
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
              Image URL
            </Typography>
            <Input
              size="lg"
              placeholder="Enter Image URL"
              name="image"
              value={inputs.image}
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
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
