export interface Recipe {
  id: string;
  title: string;
  ingredients: string;
  instructions: string;
  source_url: string | null;
  image_url: string | null;
  source_site: string | null;
  ai_generated: boolean;
  protein_ids: string[];
  created_at: string;
  updated_at: string;
}
