import axios from "axios";
import { toast } from "sonner";
import { AppDispatch } from "@/store";
import { fetchCategories } from "@/features/articleSlice";
import { useDispatch } from "react-redux";

interface DeleteCategoryButtonProps {
  categoryId: string;
}

const DeleteCategoryButton: React.FC<DeleteCategoryButtonProps> = ({
  categoryId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const deleteCategory = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      console.log(response);
      toast("Category Deleted");
      dispatch(fetchCategories());
    } catch (e) {
      console.log(e);
      toast(e.response?.data?.error?.message || "Failed to delete category.");
    }
  };

  return (
    <button
      className="bg-[#f5f5f5] p-1 text-sm rounded aspect-square flex items-center"
      onClick={deleteCategory}
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
          stroke="red"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
        />
      </svg>
    </button>
  );
};

export default DeleteCategoryButton;
