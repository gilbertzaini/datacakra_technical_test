import axios from "axios";
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
import { useNavigate } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";

import EditCategoryButton from "@/components/EditCategoryButton";
import AddCategoryButton from "@/components/AddCategoryButton";
import DeleteCategoryButton from "@/components/DeleteCategoryButton";

const NewArticle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { categories } = useSelector((state: RootState) => state.articles);

  const newForm = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      description: "",
      cover_image_url: "",
      category: 0,
    },
    mode: "onSubmit",
  });

  const {
    formState: { isSubmitting },
  } = newForm;

  const handleCreate = async (values: z.infer<typeof articleSchema>) => {
    try {
      console.log(values);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/articles`,
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

      toast("Article Created");
      dispatch(fetchArticles());
      navigate("/");
    } catch (e) {
      console.log(e);
      toast(
        e.response?.data?.error?.message || "Create failed. Please try again."
      );
    }
  };

  return (
    <Form {...newForm}>
      <form
        onSubmit={newForm.handleSubmit(handleCreate)}
        className="space-y-8 w-2/3 lg:w-1/3 h-screen m-auto pt-[12vh]"
      >
        <h1 className="font-semibold text-2xl">Create New Article</h1>

        {/* Title */}
        <FormField
          control={newForm.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={newForm.control}
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
          control={newForm.control}
          name="cover_image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Image URL" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={newForm.control}
          name="category"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Category</FormLabel>
              <div className="flex items-center gap-3">
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories &&
                      categories?.map((item) => (
                        <div className="flex justify-between items-center w-full gap-2">
                          <SelectItem value={String(item.id)}>
                            {item.name}
                          </SelectItem>

                          <div className="flex items-center gap-2">
                            <EditCategoryButton
                              categoryId={item.documentId}
                              currentName={item.name}
                            />

                            <DeleteCategoryButton
                              categoryId={item.documentId}
                            />
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
            {isSubmitting ? "Creating..." : "Create"}
          </Button>{" "}
        </div>
      </form>

      <Toaster />
    </Form>
  );
};

export default NewArticle;
