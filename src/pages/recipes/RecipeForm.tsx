import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { listProteins } from "@/api/proteins";
import type { Protein } from "@/types/protein";
import type { Recipe } from "@/types/recipe";

const schema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  ingredients: z.string().min(1, "Ingredientes são obrigatórios"),
  instructions: z.string().min(1, "Instruções são obrigatórias"),
  source_url: z.string().url("URL inválida").or(z.literal("")).nullable(),
  image_url: z.string().url("URL inválida").or(z.literal("")).nullable(),
  source_site: z.string().nullable(),
  ai_generated: z.boolean(),
  protein_ids: z.array(z.string()),
});

type FormData = z.infer<typeof schema>;

interface RecipeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe | null;
  onSubmit: (data: FormData) => Promise<void>;
}

export default function RecipeForm({ open, onOpenChange, recipe, onSubmit }: RecipeFormProps) {
  const [proteins, setProteins] = useState<Protein[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      ingredients: "",
      instructions: "",
      source_url: "",
      image_url: "",
      source_site: "",
      ai_generated: false,
      protein_ids: [],
    },
  });

  const aiGenerated = watch("ai_generated");
  const selectedProteins = watch("protein_ids");

  useEffect(() => {
    listProteins().then(setProteins).catch(() => {});
  }, []);

  useEffect(() => {
    if (recipe) {
      reset({
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        source_url: recipe.source_url || "",
        image_url: recipe.image_url || "",
        source_site: recipe.source_site || "",
        ai_generated: recipe.ai_generated,
        protein_ids: recipe.protein_ids,
      });
    } else {
      reset({
        title: "",
        ingredients: "",
        instructions: "",
        source_url: "",
        image_url: "",
        source_site: "",
        ai_generated: false,
        protein_ids: [],
      });
    }
  }, [recipe, reset]);

  function toggleProtein(id: string) {
    const current = selectedProteins;
    if (current.includes(id)) {
      setValue("protein_ids", current.filter((p) => p !== id));
    } else {
      setValue("protein_ids", [...current, id]);
    }
  }

  async function handleFormSubmit(data: FormData) {
    const payload = {
      ...data,
      source_url: data.source_url || null,
      image_url: data.image_url || null,
      source_site: data.source_site || null,
    };
    await onSubmit(payload);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{recipe ? "Editar Receita" : "Nova Receita"}</DialogTitle>
          <DialogDescription>
            {recipe ? "Atualize os dados da receita." : "Preencha os dados para criar uma nova receita."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredientes</Label>
            <Textarea id="ingredients" rows={4} {...register("ingredients")} />
            {errors.ingredients && <p className="text-sm text-destructive">{errors.ingredients.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instruções</Label>
            <Textarea id="instructions" rows={5} {...register("instructions")} />
            {errors.instructions && <p className="text-sm text-destructive">{errors.instructions.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="source_url">URL da Fonte</Label>
              <Input id="source_url" {...register("source_url")} placeholder="https://..." />
              {errors.source_url && <p className="text-sm text-destructive">{errors.source_url.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">URL da Imagem</Label>
              <Input id="image_url" {...register("image_url")} placeholder="https://..." />
              {errors.image_url && <p className="text-sm text-destructive">{errors.image_url.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source_site">Site de Origem</Label>
            <Input id="source_site" {...register("source_site")} placeholder="Ex: TudoGostoso" />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="ai_generated"
              checked={aiGenerated}
              onCheckedChange={(checked) => setValue("ai_generated", checked)}
            />
            <Label htmlFor="ai_generated">Gerada por IA</Label>
          </div>

          <div className="space-y-2">
            <Label>Proteínas</Label>
            <div className="flex flex-wrap gap-2">
              {proteins.map((p) => (
                <Button
                  key={p.id}
                  type="button"
                  size="sm"
                  variant={selectedProteins.includes(p.id) ? "default" : "outline"}
                  onClick={() => toggleProtein(p.id)}
                >
                  {p.name}
                </Button>
              ))}
              {proteins.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma proteína cadastrada.</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
