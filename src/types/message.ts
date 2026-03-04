export interface SendRecipeRequest {
  recipe_id?: string;
  title?: string;
  ingredients?: string;
  instructions?: string;
  image_url?: string;
  save_recipe?: boolean;
  phone_number_ids?: string[];
}

export interface MessageLog {
  id: string;
  recipe_id: string | null;
  phone_number_id: string;
  message_content: string;
  status: string;
  twilio_message_sid: string | null;
  error_message: string | null;
  sent_at: string;
}

export interface SendMessageResponse {
  results: {
    phone_number_id: string;
    status: string;
    twilio_message_sid?: string;
    error?: string;
  }[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}
