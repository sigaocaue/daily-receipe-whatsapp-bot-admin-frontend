import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getRecipeById } from "@/api/recipes";
import { listProteins } from "@/api/proteins";
import type { Recipe } from "@/types/recipe";
import type { Protein } from "@/types/protein";

export default function RecipeDetailsPage() {
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [proteins, setProteins] = useState<Protein[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetails() {
      if (!recipeId) {
        navigate("/recipes");
        return;
      }

      try {
        const [recipeData, proteinsData] = await Promise.all([getRecipeById(recipeId), listProteins()]);
        setRecipe(recipeData);
        setProteins(proteinsData);
      } catch {
        toast.error("Não foi possível carregar os detalhes da receita.");
        navigate("/recipes");
      } finally {
        setLoading(false);
      }
    }

    void loadDetails();
  }, [navigate, recipeId]);

  function getProteinNames(ids: string[]) {
    return ids.map((id) => proteins.find((protein) => protein.id === id)?.name || id).join(", ");
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-[520px] w-full" />
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => navigate("/recipes")} className="w-full sm:w-auto">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para receitas
      </Button>

      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>{recipe.title}</CardTitle>
            <Badge variant={recipe.ai_generated ? "default" : "secondary"}>
              {recipe.ai_generated ? "Gerada por IA" : "Manual"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Proteínas</h3>
            <p>{recipe.protein_ids.length > 0 ? getProteinNames(recipe.protein_ids) : "—"}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Ingredientes</h3>
            <p className="whitespace-pre-wrap leading-relaxed">{recipe.ingredients || "—"}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Instruções</h3>
            <p className="whitespace-pre-wrap leading-relaxed">{recipe.instructions || "—"}</p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Site de origem</h3>
              <p>{recipe.source_site || "—"}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Criado em</h3>
              <p>{new Date(recipe.created_at).toLocaleString("pt-BR")}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Atualizado em</h3>
              <p>{new Date(recipe.updated_at).toLocaleString("pt-BR")}</p>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">URL da fonte</h3>
            {recipe.source_url ? (
              <a
                href={recipe.source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Abrir fonte <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <p>—</p>
            )}
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Imagem da receita</h3>
            {recipe.image_url ? (
              <img
                src={recipe.image_url}
                alt={`Imagem da receita ${recipe.title}`}
                className="w-full max-w-2xl rounded-md border object-cover"
                loading="lazy"
              />
            ) : (
              <p>—</p>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
