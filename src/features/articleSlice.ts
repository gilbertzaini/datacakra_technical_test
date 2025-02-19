import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Article, Category } from "@/interfaces/articles"; // Import types

const API_URL = import.meta.env.VITE_API_URL;

interface ArticlesState {
  articles: Article[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ArticlesState = {
  articles: [],
  categories: [],
  isLoading: false,
  error: null,
};

// Fetch Articles
export const fetchArticles = createAsyncThunk<
  Article[],
  void,
  { rejectValue: string }
>("articles/fetchArticles", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/articles?pagination[pageSize]=10000&populate=*`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch articles");
  }
});

// Fetch Categories
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("articles/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/api/categories`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "Failed to fetch categories"
    );
  }
});

// Slice
const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Articles
      .addCase(fetchArticles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchArticles.fulfilled,
        (state, action: PayloadAction<Article[]>) => {
          state.isLoading = false;
          state.articles = action.payload;
        }
      )
      .addCase(
        fetchArticles.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload || "An error occurred";
        }
      )

      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.isLoading = false;
          state.categories = action.payload;
        }
      )
      .addCase(
        fetchCategories.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload || "An error occurred";
        }
      );
  },
});

export default articlesSlice.reducer;
