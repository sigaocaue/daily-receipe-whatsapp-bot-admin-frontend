import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import ProteinsPage from "@/pages/proteins/ProteinsPage";
import ProteinEditorPage from "@/pages/proteins/ProteinEditorPage";
import RecipesPage from "@/pages/recipes/RecipesPage";
import RecipeEditorPage from "@/pages/recipes/RecipeEditorPage";
import RecipeDetailsPage from "@/pages/recipes/RecipeDetailsPage";
import PhoneNumbersPage from "@/pages/phoneNumbers/PhoneNumbersPage";
import PhoneNumberEditorPage from "@/pages/phoneNumbers/PhoneNumberEditorPage";
import MessagesPage from "@/pages/messages/MessagesPage";
import MessageLogsPage from "@/pages/messages/MessageLogsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
      <Route path="/proteins" element={<ProteinsPage />} />
      <Route path="/proteins/new" element={<ProteinEditorPage />} />
      <Route path="/proteins/:proteinId/edit" element={<ProteinEditorPage />} />
      <Route path="/recipes" element={<RecipesPage />} />
      <Route path="/recipes/new" element={<RecipeEditorPage />} />
      <Route path="/recipes/:recipeId" element={<RecipeDetailsPage />} />
      <Route path="/recipes/:recipeId/edit" element={<RecipeEditorPage />} />
      <Route path="/phone-numbers" element={<PhoneNumbersPage />} />
      <Route path="/phone-numbers/new" element={<PhoneNumberEditorPage />} />
      <Route path="/phone-numbers/:phoneNumberId/edit" element={<PhoneNumberEditorPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/logs" element={<MessageLogsPage />} />
      </Route>
    </Routes>
  );
}
