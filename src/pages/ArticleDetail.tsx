import { Skeleton } from "@/components/ui/skeleton";
import { Article } from "@/interfaces/articles";
import { AppDispatch, RootState } from "@/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { fetchArticles } from "@/features/articleSlice";
import useCheckLoggedIn from "@/hooks/useCheckLoggedIn";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

const ArticleDetail = () => {
  const { id } = useParams<string>();
  const [article, setArticle] = useState<Article | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [comment, setComment] = useState<string>("");
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoggedIn = useCheckLoggedIn();

  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const { articles, error } = useSelector((state: RootState) => state.articles);

  useEffect(() => {
    if (error) toast(error);
  }, [error]);

  const findArticle = () => {
    const art: Article | undefined = articles.find(
      (item) => item.documentId === id
    );

    setArticle(art);
  };

  useEffect(() => {
    setIsLoading(true);

    if (articles.length > 0) {
      findArticle();
      setIsLoading(false);
    } else {
      dispatch(fetchArticles());
      findArticle();
      setIsLoading(false);
    }
  }, []);

  const handlePostComment = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/comments`,
        {
          data: {
            content: comment,
            article: article?.id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      dispatch(fetchArticles());
      toast("Comment Posted!");
      findArticle();
    } catch (e) {
      console.log(e);
      toast(
        e.response?.data?.error?.message || "Post failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* image section */}
      <div className="h-screen w-screen relative flex items-end justify-start">
        {/* bg image */}
        {isLoading ? (
          <Skeleton className="absolute h-full w-full object-cover brightness-50" />
        ) : (
          <img
            className="absolute h-full w-full object-cover brightness-50"
            src={
              article?.cover_image_url ||
              "https://asti.dost.gov.ph/pedro/img/no-image.png"
            }
            alt={article?.title || ""}
          />
        )}

        {/* article title */}
        <div className="relative h-full w-screen flex flex-col justify-end text-white p-5 lg:p-10">
          <h1 className="text-7xl text-wrap break-all lg:text-9xl mb-2 w-8/10 lg:w-9/10 h-fit-content">
            {article?.title}
          </h1>
          <h3 className="text-xl lg:text-3xl">
            {article?.category?.name || "Article"} ·{" "}
            {new Date(article?.publishedAt).toLocaleString(
              "en-us",
              dateOptions
            )}
          </h3>
        </div>

        {/* edit button */}
        {isLoggedIn && (
          <button
            className="h-[5vh] w-[5vh] lg:h-[10vh] lg:w-[10vh] absolute bottom-6 right-5 hover:bg-slate-50/20 duration-300 ease p-2 rounded-xl"
            onClick={() => navigate(`/articles/${id}/edit`)}
          >
            <svg
              fill="none"
              height="auto"
              stroke="white"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
      </div>

      {/* content section */}
      <div className="min-h-[70vh] max-h-fit-content w-screen relative px-5 lg:px-15 py-10 lg:py-20 text-xl">
        {article?.description}
      </div>

      {/* comment section */}
      <div className="h-fit-content w-screen px-5 lg:px-15 py-10">
        <h3 className="font-bold text-3xl py-2 drop-shadow-sm">Comments</h3>

        {/* add comment */}
        <div className="h-full w-full lg:px-10">
          <div className="relative flex h-full w-full bg-white rounded-2xl shadow items-center">
            <img
              className="w-[10vh] aspect-square h-[10vh] object-cover p-2 rounded-2xl"
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt="User"
            />

            <div className="w-[92%] flex items-center justify-between gap-5 pe-5">
              <Textarea
                className="w-full min-h-[10vh] resize my-3 text-sm lg:text-md"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="New Comment"
              />
              <button
                className="text-sm pb-1"
                onClick={() => handlePostComment()}
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* comment list */}
        <div className="min-h-fit-content max-h-[75vh] flex flex-col gap-3 relative overflow-auto no-scrollbar pb-12 pt-5 lg:px-10">
          {article?.comments?.map((item, idx) => (
            <div
              key={idx}
              className="relative flex min-h-[10vh] max-h-fit-content w-full bg-white rounded-2xl shadow"
            >
              <img
                className="w-[10vh] aspect-square h-full object-cover p-2 rounded-2xl"
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                alt="User"
              />

              <div className="w-6/10 h-fit-content my-auto py-1 text-sm lg:text-md">
                {item.content}
              </div>
              <div className="absolute bottom-0 right-0 pe-3 pb-0.5">
                <span className="text-xs text-slate-500">
                  {new Date(item.publishedAt).toLocaleDateString("en-US")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default ArticleDetail;
