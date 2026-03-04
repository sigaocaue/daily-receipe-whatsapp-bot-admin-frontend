import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listProteins } from "@/api/proteins";
import { createRecipe, getRecipeById, updateRecipe } from "@/api/recipes";
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

const EMPTY_VALUES: FormData = {
  title: "",
  ingredients: "",
  instructions: "",
  source_url: "",
  image_url: "",
  source_site: "",
  ai_generated: false,
  protein_ids: [],
};

export default function RecipeEditorPage() {
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const [proteins, setProteins] = useState<Protein[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const isEdit = useMemo(() => Boolean(recipeId), [recipeId]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  });

  const aiGenerated = watch("ai_generated");
  const selectedProteins = watch("protein_ids");

  useEffect(() => {
    async function loadInitialData() {
      try {
        const proteinsData = await listProteins();
        setProteins(proteinsData);

        if (isEdit && recipeId) {
          const recipe = await getRecipeById(recipeId);
          reset(fromRecipe(recipe));
        } else {
          reset(EMPTY_VALUES);
        }
      } catch {
        toast.error("Não foi possível carregar os dados da receita.");
        navigate("/recipes");
      } finally {
        setInitialLoading(false);
      }
    }

    void loadInitialData();
  }, [isEdit, navigate, recipeId, reset]);

  function toggleProtein(id: string) {
    const current = selectedProteins;
    if (current.includes(id)) {
      setValue("protein_ids", current.filter((proteinId) => proteinId !== id));
      return;
    }
    setValue("protein_ids", [...current, id]);
  }

  async function onSubmit(data: FormData) {
    const payload = {
      ...data,
      source_url: data.source_url || null,
      image_url: data.image_url || null,
      source_site: data.source_site || null,
    };

    if (isEdit && recipeId) {
      await updateRecipe(recipeId, payload);
      toast.success("Receita atualizada!");
    } else {
      await createRecipe(payload);
      toast.success("Receita criada!");
    }

    navigate("/recipes");
  }

  if (initialLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-[520px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => navigate("/recipes")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para receitas
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Editar Receita" : "Nova Receita"}</CardTitle>
          <CardDescription>
            {isEdit ? "Atualize os dados da receita." : "Preencha os dados para criar uma nova receita."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <Textarea id="instructions" rows={6} {...register("instructions")} />
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
                {proteins.map((protein) => (
                  <Button
                    key={protein.id}
                    type="button"
                    size="sm"
                    variant={selectedProteins.includes(protein.id) ? "default" : "outline"}
                    onClick={() => toggleProtein(protein.id)}
                  >
                    {protein.name}
                  </Button>
                ))}
                {proteins.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhuma proteína cadastrada.</p>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => navigate("/recipes")} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function fromRecipe(recipe: Recipe): FormData {
  return {
    title: recipe.title,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    source_url: recipe.source_url || "",
    image_url: recipe.image_url || "",
    source_site: recipe.source_site || "",
    ai_generated: recipe.ai_generated,
    protein_ids: recipe.protein_ids,
  };
}
