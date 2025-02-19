import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Articles from "./pages/Articles";
import Landing from "./pages/Landing";
import ArticleDetail from "./pages/ArticleDetail";
import Navbar from "./components/Navbar";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NewArticle from "./pages/NewArticle";
import EditArticle from "./pages/EditArticle";
import UnauthorizedRoute from "./hooks/useUnprotectedRoutes";
import ProtectedRoutes from "./hooks/useProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route element={<UnauthorizedRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/articles/:id/edit" element={<EditArticle />} />
          <Route path="/articles/create" element={<NewArticle />} />
        </Route>

        <Route path="/" element={<Articles />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
