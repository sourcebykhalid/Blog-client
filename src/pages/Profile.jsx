// Profile.js
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { LoaderIcon } from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { Button, Dialog } from "@material-tailwind/react";
import { authActions } from "../redux/store";
import { useQuery } from "react-query";

// Profile Skeleton Loader
const ProfileSkeleton = () => (
  <div className="flex flex-col items-center justify-center animate-pulse">
    <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
    <div className="mt-3 h-4 w-32 bg-gray-300"></div>
    <div className="mt-2 h-4 w-24 bg-gray-300"></div>
    <div className="mt-4 h-8 w-8 bg-gray-300 rounded-full"></div>
  </div>
);

// Fetch Profile Function
const fetchUserProfile = async (userId) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { data } = await axios.get(
    `${apiUrl}/api/v1/user/current-user/${userId}`
  );
  console.log(data); // Check if data.userProfile.image is populated correctly
  return data;
};

function Profile() {
  const userId = useSelector((state) => state.userId); // Get userId from Redux state
  const isLogin = useSelector((state) => state.isLogin); // Check if the user is logged in
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect if user is not logged in
  useEffect(() => {
    if (!isLogin || !userId) {
      toast.error("You must be logged in to view the profile.");
      dispatch(authActions.logout());
      navigate("/login");
    }
  }, [isLogin, userId, dispatch, navigate]);

  // Use React Query for fetching user profile
  const { data, error, isLoading } = useQuery(
    ["userProfile", userId],
    () => fetchUserProfile(userId),
    {
      enabled: !!userId, // Only run query if userId exists
      staleTime: 60000, // cache data for 1 minute
      cacheTime: 1000000, // keep data in cache for a long time
      refetchOnWindowFocus: false,
      onError: () => {
        toast.error("Failed to fetch user");
        dispatch(authActions.logout());
        navigate("/login");
      },
    }
  );

  // Handle Edit Profile Navigation
  const handleEdit = () => navigate(`/update-user/${userId}`);

  // Show Skeleton Loader or Error Message
  if (isLoading) return <ProfileSkeleton />;
  if (error)
    return <p className="text-red-500 text-center">Failed to load profile</p>;

  // Profile Data from Query
  const user = data?.userProfile;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  return (
    <Dialog
      open={true}
      handler={() => navigate("/")}
      className="flex flex-col items-center justify-center text-xl font-semibold bg-gray-300 md:w-2/4 h-96 md:h-screen mx-auto rounded-md shadow-md shadow-orange-400"
    >
      <img
        src={
          user?.image ? `${apiUrl}/uploads/${user.image}` : "default_avatar_url"
        }
        alt="Profile"
        className="w-20 h-20 rounded-full hover:scale-110 transition-all"
      />

      <h2 className="font-bold text-green-500">{user?.username}</h2>
      <p>{user?.email}</p>
      <p>Total Posts: {user?.blogs?.length}</p>
      <Button className="text-3xl hover:text-blue-500 transition-all cursor-pointer">
        <MdEdit onClick={handleEdit} />
      </Button>
    </Dialog>
  );
}

export default Profile;
