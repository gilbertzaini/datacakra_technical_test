import { Skeleton } from "./ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const TrendingArticles = () => {
  const navigate = useNavigate();

  const { articles, isLoading } = useSelector(
    (state: RootState) => state.articles
  );

  return (
    <div className="flex flex-col h-[50vh] w-screen mt-[10vh]">
      <h1 className="py-2 font-bold text-3xl px-5 lg:px-15 drop-shadow-sm">
        {/* What's Being Discussed Lately */}
        Popular
      </h1>

      <div className="h-full w-full flex flex-nowrap gap-3 items-center py-3 overflow-x-auto no-scrollbar">
        {isLoading && (
          <>
            <Skeleton className="h-full w-[65%] flex-shrink-0 relative rounded-2xl flex items-end shadow-md ms-5 lg:ms-15" />
            <Skeleton className="h-full w-[65%] flex-shrink-0 relative rounded-2xl flex items-end shadow-md" />
          </>
        )}
        {!isLoading &&
          [...articles]
            .sort((a, b) => {
              return b.comments.length - a.comments.length;
            })
            .slice(0, 5)
            .map((item, idx) => (
              <button
                onClick={() => navigate(`/articles/${item.documentId}`)}
                key={idx}
                className={`h-full w-[65%] flex-shrink-0 relative rounded-2xl flex items-end shadow-md ${
                  idx === 4 ? "me-5 lg:me-15" : idx === 0 ? "ms-5 lg:ms-15" : ""
                }`}
              >
                {/* bg */}
                <img
                  className="absolute h-full w-full object-cover rounded-2xl"
                  src={item.cover_image_url}
                />
                <div
                  className="absolute z-10 h-full w-full rounded-2xl
                  bg-linear-to-b from-slate-500/50 from-10% via-slate-600/60 via-50% to-slate-950/90 to-90%"
                />

                {/* text */}
                <h3 className="relative z-20 text-slate-50 p-3 lg:p-6 text-5xl text-start">
                  {item.title}
                </h3>
              </button>
            ))}
      </div>
    </div>
  );
};

export default TrendingArticles;
