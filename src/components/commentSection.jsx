import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Input } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const CommentSection = () => {
  const { id } = useParams(); // Blog ID
  const isLogin = useSelector((state) => state.isLogin);
  const userId = localStorage.getItem("userId");
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(
          `https://blog-backend-v95w.onrender.com/api/v1/comments/${id}`
        );
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

    try {
      const { data } = await axios.post(
        "https://blog-backend-v95w.onrender.com/api/v1/comments/add-comment",
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
      <h3 className="text-lg font-bold mb-2">Comments</h3>
      {comments.map((comment) => (
        <div key={comment._id} className="border p-2 mb-2 rounded-md">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{comment.user.username}</span>
            <span className="text-xs text-green-400">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>

          <p className=" text-blue-gray-600">{comment.content}</p>
        </div>
      ))}
      {isLogin && (
        <div className="mt-4">
          <div className="flex ">
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a comment"
              className="mb-2"
            />
          </div>
          <Button onClick={handleAddComment} className=" mb-2">
            Post Comment
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
