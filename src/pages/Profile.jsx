// Profile.js
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { LoaderIcon } from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { Button, Dialog } from "@material-tailwind/react";
import { authActions } from "../redux/store";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.userId); // Get userId from Redux state
  const isLogin = useSelector((state) => state.isLogin); // Check if the user is logged in
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpen = () => navigate("/");

  const handleEdit = () => navigate(`/update-user/${userId}`);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isLogin || !userId) {
        toast.error("You must be logged in to view the profile.");
        dispatch(authActions.logout()); // Clear Redux auth state
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const { data } = await axios.get(
          `${apiUrl}/api/v1/user/current-user/${userId}`
        );

        if (data?.success) {
          setUser(data.userProfile);
        } else {
          toast.error("Failed to fetch user");
        }
      } catch (error) {
        toast.error("An error occurred while fetching user");
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isLogin, userId, dispatch, navigate]);

  if (loading) {
    return <LoaderIcon className="mx-auto mt-3 w-8 h-8 rounded-full" />;
  }

  return (
    <Dialog
      open={true}
      handler={handleOpen}
      className="flex flex-col items-center justify-center text-xl font-semibold bg-gray-300 md:w-2/4 h-96 md:h-screen mx-auto rounded-md shadow-md shadow-orange-400"
    >
      <img
        src={user?.image || "default_avatar_url"}
        alt="Profile"
        className="w-20 h-20 rounded-full hover:scale-110 transition-all"
      />
      <h2 className="font-bold text-green-500">{user?.username}</h2>
      <p>{user?.email}</p>
      <p>Total Posts: {user?.blogs?.length}</p>
      <Button className="text-3xl hover:text-blue-500 transition-all cursor-pointer ">
        <MdEdit onClick={handleEdit} />
      </Button>
    </Dialog>
  );
}

export default Profile;
