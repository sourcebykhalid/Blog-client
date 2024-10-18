import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { FaUser } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function AgroApi() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(
      `https://newsdata.io/api/1/latest?apikey=pub_51210f77b212fb5879492571bec86ebc02f75&q=pizza`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.results) {
          setArticles(res.results);
          console.log("Fetched articles:", articles);

          setLoading(false);
        } else {
          setError("Failed to fetch articles");
          setLoading(false);
        }
      })
      .catch((error) => {
        setError("Error fetching data: " + error.message);
        setLoading(false);
      });
  }, []);

  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return dateString
      ? new Date(dateString).toLocaleString("en-US", options)
      : "Unknown Date";
  };

  const handleReadMore = (url) => {
    window.open(url, "_blank");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-[7rem]">
      {articles.map((article, index) => (
        <Card
          key={index}
          className="mt-6 w-full transition-all hover:border-b-2 hover:border-deep-orange-400 cursor-pointer"
        >
          <CardHeader color="" className="relative h-56">
            <div className="flex justify-between items-center px-3 bg-green-200">
              <div className="flex gap-x-2 justify-center items-center">
                <FaUser />
                <span className="text-gray-900 text-sm font-bold">
                  {article.creator || "Unknown Author"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <MdDateRange />
                <span>{formatDate(article.pubDate)}</span>
              </div>
            </div>
            <img
              className="transition-all hover:scale-x-110 overflow-hidden w-full h-full"
              src={article.image_url || "https://via.placeholder.com/150"}
              alt={article.title}
            />
          </CardHeader>
          <CardBody>
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-2 text-xl font-bold"
            >
              {article.title}
            </Typography>

            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-2 text-sm bg-gradient-to-tr from-blue-600 to-orange-300 p-1 w-fit rounded-sm"
            >
              #{article.category}
            </Typography>
            <Typography>
              {article.description
                ? article.description.slice(0, 120) + "..."
                : "No description available."}
            </Typography>

            <Button
              color="deep-orange"
              onClick={() => handleReadMore(article.link)}
              className="mt-4"
            >
              Read More
            </Button>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default AgroApi;
