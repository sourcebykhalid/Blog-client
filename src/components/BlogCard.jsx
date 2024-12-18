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
  openEditModal, // Receive function from parent
}) => {
  const navigate = useNavigate();
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
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      const { data } = await axios.delete(
        `${apiUrl}/api/v1/blog/delete-blog/${id}`
      );
      if (data?.success) {
        toast.success("Blog deleted");
        navigate("/all-blogs");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {
    navigate(`/blog-details/${id}`);
  };

  return (
    <Card className="mt-6 w-full md:w-96 transition-all hover:border-b-2 hover:border-deep-orange-400 cursor-pointer">
      <CardHeader color="" className="relative h-56">
        <div className="flex justify-between items-center px-3 bg-green-200">
          <div className="flex gap-x-2 justify-center items-center">
            <FaUser />
            <span className="text-gray-900 text-sm font-bold">{username}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <MdDateRange />
            <span>{formatDate(time)}</span>
          </div>
        </div>
        <img
          className="transition-all hover:scale-x-110 overflow-hidden w-full h-full"
          src={image}
          alt="card-image"
        />
      </CardHeader>
      <CardBody>
        <div className="flex justify-between items-center">
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
          <Button className=" p-2" onClick={() => navigate(`/get-blog/${id}`)}>
            Read more
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardDefault;
