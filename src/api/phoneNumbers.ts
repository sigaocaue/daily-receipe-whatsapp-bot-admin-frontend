import api from "./axios";
import type { PhoneNumber } from "@/types/phoneNumber";
import type { ApiResponse } from "@/types/message";

export async function listPhoneNumbers() {
  const { data } = await api.get<ApiResponse<PhoneNumber[]>>("/phone-numbers");
  return data.data;
}

export async function getPhoneNumberById(id: string) {
  const { data } = await api.get<ApiResponse<PhoneNumber>>(`/phone-numbers/${id}`);
  return data.data;
}

export async function createPhoneNumber(payload: { name: string; phone: string; active?: boolean }) {
  const { data } = await api.post<ApiResponse<PhoneNumber>>("/phone-numbers", payload);
  return data.data;
}

export async function updatePhoneNumber(id: string, payload: { name?: string; phone?: string; active?: boolean }) {
  const { data } = await api.put<ApiResponse<PhoneNumber>>(`/phone-numbers/${id}`, payload);
  return data.data;
}

export async function deletePhoneNumber(id: string) {
  await api.delete(`/phone-numbers/${id}`);
}
