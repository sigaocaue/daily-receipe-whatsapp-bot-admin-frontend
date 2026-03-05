import api from "./axios";
import type { Recipe } from "@/types/recipe";
import type { ApiResponse } from "@/types/message";

export async function listRecipes() {
  const { data } = await api.get<ApiResponse<Recipe[]>>("/recipes");
  return data.data;
}

export async function getRecipeById(id: string) {
  const { data } = await api.get<ApiResponse<Recipe>>(`/recipes/${id}`);
  return data.data;
}

export async function createRecipe(payload: Omit<Recipe, "id" | "created_at" | "updated_at">) {
  const { data } = await api.post<ApiResponse<Recipe>>("/recipes", payload);
  return data.data;
}

export async function updateRecipe(id: string, payload: Partial<Omit<Recipe, "id" | "created_at" | "updated_at">>) {
  const { data } = await api.put<ApiResponse<Recipe>>(`/recipes/${id}`, payload);
  return data.data;
}

export async function deleteRecipe(id: string) {
  await api.delete(`/recipes/${id}`);
}

export async function generateRecipe() {
  const { data } = await api.post<ApiResponse<Recipe>>("/recipes/generate");
  return data.data;
}

export async function scrapeRecipe(url?: string) {
  const { data } = await api.post<ApiResponse<Recipe>>("/recipes/scrape", {
    url: url || null,
  });
  return data.data;
}
