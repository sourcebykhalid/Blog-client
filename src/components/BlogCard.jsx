import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import toast from "react-hot-toast";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { MdDateRange, MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const CardDefault = ({
  title,
  description,
  category,
  username,
  image,
  time,
  id,
  isUser,
}) => {
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate(`/blog-details/${id}`);
  };
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `https://blog-backend-v95w.onrender.com/api/v1/blog/delete-blog/${id}`
      );
      if (data?.success) {
        toast.success("Blog deleted");
        navigate("/all-blogs");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleReadMore = () => {
    navigate(`/get-blog/${id}`);
  };
  return (
    <Card className="mt-6 w-full md:w-96   transition-all hover:shadow-green-500">
      <CardHeader color="" className="relative h-56">
        <div className="flex justify-between items-center px-3 bg-green-200">
          <div className="flex gap-x-2 justify-center items-center">
            <FaUser />
            <span className=" text-gray-900 text-sm font-bold ">
              {username}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <MdDateRange />
            <span>{formatDate(time)}</span>
          </div>
        </div>
        <img
          className="transition-all hover:scale-x-110 overflow-hidden w-full h-full  "
          src={image}
          alt="card-image"
        />
      </CardHeader>
      <CardBody>
        <div className="flex justify-between items-center ">
          <Typography
            variant="h5"
            color="blue-gray"
            className="mb-2 text-xl font-bold"
          >
            {title}
          </Typography>
          <Typography
            variant="h5"
            color="blue-gray"
            className="mb-2 text-sm bg-gradient-to-tr from-blue-600 to-orange-300 p-1 w-fit rounded-sm"
          >
            #{category}
          </Typography>
        </div>
        <Typography>{description.slice(0, 80)}</Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <div className="flex justify-between items-center gap-x-2">
          <Button onClick={handleReadMore} className=" transition-all">
            Read More
          </Button>
          {isUser && (
            <div className="flex justify-center items-center gap-x-4 cursor-pointer">
              <MdEdit
                onClick={handleEdit}
                className="text-2xl hover:text-blue-500 transition-all"
              />
              <MdDelete
                onClick={handleDelete}
                className="text-2xl hover:text-red-500 transition-all"
              />
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardDefault;
