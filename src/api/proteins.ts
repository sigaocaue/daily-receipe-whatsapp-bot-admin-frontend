import api from "./axios";
import type { Protein } from "@/types/protein";
import type { ApiResponse } from "@/types/message";

export async function listProteins() {
  const { data } = await api.get<ApiResponse<Protein[]>>("/proteins");
  return data.data;
}

export async function getProteinById(id: string) {
  const { data } = await api.get<ApiResponse<Protein>>(`/proteins/${id}`);
  return data.data;
}

export async function createProtein(payload: { name: string; active?: boolean }) {
  const { data } = await api.post<ApiResponse<Protein>>("/proteins", payload);
  return data.data;
}

export async function updateProtein(id: string, payload: { name?: string; active?: boolean }) {
  const { data } = await api.put<ApiResponse<Protein>>(`/proteins/${id}`, payload);
  return data.data;
}

export async function deleteProtein(id: string) {
  await api.delete(`/proteins/${id}`);
}
