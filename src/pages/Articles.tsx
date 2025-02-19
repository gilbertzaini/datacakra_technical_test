import React, { useEffect } from "react";
import MainArticles from "@/components/MainArticles";
import TrendingArticles from "@/components/TrendingArticles";
import { fetchArticles, fetchCategories } from "@/features/articleSlice";

import { AppDispatch, persistor, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const Articles = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { articles, categories, error } = useSelector(
    (state: RootState) => state.articles
  );

  useEffect(() => {
    persistor.purge();
  }, []);

  useEffect(() => {
    if (!articles || articles.length === 0) {
      dispatch(fetchArticles());
    }
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, articles, categories]);

  useEffect(() => {
    if (error) toast(error);
  }, [error]);

  return (
    <div className="min-h-screen min-w-screen">
      <TrendingArticles />
      <MainArticles />

      <Toaster />
    </div>
  );
};

export default Articles;
