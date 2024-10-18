import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Input } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";

const CommentSection = () => {
  const { id } = useParams(); // Blog ID
  const isLogin = useSelector((state) => state.isLogin);
  const userId = localStorage.getItem("userId");
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      try {
        const { data } = await axios.get(`${apiUrl}/api/v1/comments/${id}`);
        if (data?.success) {
          setComments(data.comments);
        }
      } catch (error) {
        toast.error("Error fetching comments");
      }
    };

    fetchComments();
  }, [id]);

  const handleAddComment = async () => {
    if (!content.trim()) return;
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      const { data } = await axios.post(
        `${apiUrl}/api/v1/comments/add-comment`,
        { content, userId, blogId: id }
      );
      if (data?.success) {
        setComments([...comments, data.comment]);
        setContent("");
        toast.success("Comment added");
      }
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  return (
    <div className="mt-4 w-full md:w-2/3">
      <h3 className="text-lg font-bold mb-2 border-b border-green-400 rounded-md px-2 w-fit">
        Comments
      </h3>
      {comments.map((comment) => (
        <div key={comment._id} className="border p-2 mb-2 rounded-md">
          <div className="flex flex-col justify-between items-start my-4">
            <span className="font-semibold">{comment.user.username}</span>
            <span className="text-xs text-green-300">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className=" text-blue-gray-600">{comment.content}</p>
        </div>
      ))}
      {isLogin && (
        <div className="mt-4">
          <div
            className="flex flex-col justify-center items-start gap-y-1
           "
          >
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a comment"
              className="mb-2"
            />

            <Button onClick={handleAddComment} className=" mb-2">
              Post Comment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
