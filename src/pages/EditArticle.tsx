import axios from "axios";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useNavigate, useParams } from "react-router-dom";
import { articleSchema } from "@/schema/articleSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "@/features/articleSlice";
import { Article } from "@/interfaces/articles";
import { Textarea } from "@/components/ui/textarea";

import EditCategoryButton from "@/components/EditCategoryButton";
import DeleteCategoryButton from "@/components/deleteCategoryButton";
import AddCategoryButton from "@/components/AddCategoryButton";

const EditArticle = () => {
  const { id } = useParams<string>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { articles, categories } = useSelector(
    (state: RootState) => state.articles
  );

  const article: Article | undefined = articles?.find(
    (item) => item.documentId === id
  );

  const editForm = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title,
      description: article?.description,
      cover_image_url: article?.cover_image_url,
      category: article?.category?.id || 0,
    },
    mode: "onSubmit",
  });

  const {
    formState: { isSubmitting },
  } = editForm;

  const handleEdit = async (values: z.infer<typeof articleSchema>) => {
    try {
      console.log(values);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/articles/${id}`,
        {
          data: { ...values },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      console.log(response);

      toast("Article Edited");
      dispatch(fetchArticles());
      navigate("/");
    } catch (e) {
      console.log(e);
      toast(
        e.response?.data?.error?.message || "Edit failed. Please try again."
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/articles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      console.log(response);
      dispatch(fetchArticles());
      navigate("/");
    } catch (e) {
      console.log(e);
      toast(
        e.response?.data?.error?.message || "Edit failed. Please try again."
      );
    }
  };

  return (
    <Form {...editForm}>
      <form
        onSubmit={editForm.handleSubmit(handleEdit)}
        className="space-y-8 w-2/3 lg:w-1/3 h-screen m-auto pt-[12vh]"
      >
        <h1 className="font-semibold text-2xl">Edit Article</h1>

        {/* Title */}
        <FormField
          control={editForm.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={editForm.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description"
                  className="resize"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Image URL */}
        <FormField
          control={editForm.control}
          name="cover_image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={editForm.control}
          name="category"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Category</FormLabel>
              <div className="flex items-center gap-3">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((item) => (
                      <div className="flex justify-between items-center w-full gap-2">
                        <SelectItem value={String(item.id)}>
                          {item.name}
                        </SelectItem>

                        <div className="flex items-center gap-2">
                          <EditCategoryButton
                            categoryId={item.documentId}
                            initialName={item.name}
                          />

                          <DeleteCategoryButton categoryId={item.documentId} />
                        </div>
                      </div>
                    ))}
                  </SelectContent>
                </Select>

                <AddCategoryButton />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4 justify-start">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>{" "}
          <Button
            onClick={() => handleDelete(id)}
            className="bg-red-500 hover:bg-red-600 text-sm"
            type="button"
          >
            Delete
          </Button>
        </div>
      </form>

      <Toaster />
    </Form>
  );
};

export default EditArticle;
