import api from "./axios";
import type { MessageLog, SendMessageResponse, SendRecipeRequest, ApiResponse } from "@/types/message";

export async function sendMessages(payload?: SendRecipeRequest) {
  const { data } = await api.post<ApiResponse<SendMessageResponse>>("/messages/send", payload);
  return data.data;
}

export async function getMessageLogs() {
  const { data } = await api.get<ApiResponse<MessageLog[]>>("/messages/logs");
  return data.data;
}

export async function getMessageLogById(id: string) {
  const { data } = await api.get<ApiResponse<MessageLog>>(`/messages/logs/${id}`);
  return data.data;
}
