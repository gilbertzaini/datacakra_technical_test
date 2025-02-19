import { useEffect, useState } from "react";
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
const EditCategoryButton = ({
  categoryId,
  currentName,
}: {
  categoryId: string;
  currentName: any;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName || "");
  const [error, setError] = useState("");

  // Sync name state when the dialog opens
  useEffect(() => {
    console.log(currentName);

    if (open) {
      setName(currentName);
    }
  }, [currentName, open]);

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
      <button
        className="bg-[#f5f5f5] p-1 text-sm rounded aspect-square flex items-center"
        onClick={() => {
          setOpen(true);
        }}
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
          />
        </svg>
      </button>
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
          <Button disabled={isLoading} onClick={handleEditCategory}>
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditCategoryButton;
