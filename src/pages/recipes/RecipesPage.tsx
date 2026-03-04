import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { listRecipes, deleteRecipe, generateRecipe } from "@/api/recipes";
import { listProteins } from "@/api/proteins";
import type { Recipe } from "@/types/recipe";
import type { Protein } from "@/types/protein";

export default function RecipesPage() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [proteins, setProteins] = useState<Protein[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Recipe | null>(null);
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    try {
      const [recipesData, proteinsData] = await Promise.all([listRecipes(), listProteins()]);
      setRecipes(recipesData);
      setProteins(proteinsData);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function proteinNames(ids: string[]) {
    return ids
      .map((id) => proteins.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  }

  function handleNew() {
    navigate("/recipes/new");
  }

  function handleEdit(recipe: Recipe) {
    navigate(`/recipes/${recipe.id}/edit`);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteRecipe(deleteTarget.id);
      toast.success("Receita removida!");
      await load();
    } catch {
      // handled by interceptor
    } finally {
      setDeleteTarget(null);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const recipe = await generateRecipe();
      toast.success(`Receita "${recipe.title}" gerada!`);
      await load();
    } catch {
      // handled by interceptor
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Receitas</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" onClick={handleGenerate} disabled={generating} className="w-full sm:w-auto">
            <Sparkles className="mr-2 h-4 w-4" />
            {generating ? "Gerando..." : "Gerar via IA"}
          </Button>
          <Button onClick={handleNew} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Nova Receita
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Proteínas</TableHead>
              <TableHead>Fonte</TableHead>
              <TableHead>IA</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhuma receita cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              recipes.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell>{proteinNames(r.protein_ids) || "—"}</TableCell>
                  <TableCell>{r.source_site || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={r.ai_generated ? "default" : "secondary"}>
                      {r.ai_generated ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(r.created_at).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(r)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(r)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja remover a receita &quot;{deleteTarget?.title}&quot;? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
