import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import ProteinsPage from "@/pages/proteins/ProteinsPage";
import RecipesPage from "@/pages/recipes/RecipesPage";
import RecipeEditorPage from "@/pages/recipes/RecipeEditorPage";
import PhoneNumbersPage from "@/pages/phoneNumbers/PhoneNumbersPage";
import MessagesPage from "@/pages/messages/MessagesPage";
import MessageLogsPage from "@/pages/messages/MessageLogsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/proteins" element={<ProteinsPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/new" element={<RecipeEditorPage />} />
        <Route path="/recipes/:recipeId/edit" element={<RecipeEditorPage />} />
        <Route path="/phone-numbers" element={<PhoneNumbersPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/logs" element={<MessageLogsPage />} />
      </Route>
    </Routes>
  );
}
