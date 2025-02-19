import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { AppDispatch } from "@/store";
import { fetchCategories } from "@/features/articleSlice";
import { useDispatch } from "react-redux";

const ChangeCategoryDialog = ({
  categoryId,
  currentName,
}: {
  categoryId: string;
  currentName: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [error, setError] = useState("");

  const handleEditCategory = async () => {
    if (name.trim().length < 3) {
      setError("Category name must be at least 3 characters.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/categories/${categoryId}`,
        { data: { name } },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      console.log(response);
      toast("Category Updated");

      dispatch(fetchCategories());
      setOpen(false);
    } catch (e) {
      console.log(e);
      toast(e.response?.data?.error?.message || "Failed to update category.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <Button onClick={() => setOpen(true)}>Edit</Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Category</AlertDialogTitle>
          <AlertDialogDescription>
            <Input
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            onClick={() => setOpen(false)}
            className="bg-white"
          >
            Cancel
          </AlertDialogCancel>
          {/* Action Button */}
          <Button
            disabled={isLoading}
            onClick={() => {
              handleEditCategory();
            }}
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ChangeCategoryDialog;
