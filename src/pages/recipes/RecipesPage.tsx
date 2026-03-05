import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Sparkles, Eye, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { listRecipes, deleteRecipe, generateRecipe, scrapeRecipe } from "@/api/recipes";
import { listProteins } from "@/api/proteins";
import type { Recipe } from "@/types/recipe";
import type { Protein } from "@/types/protein";

function RecipeOriginBadge({ recipe }: { recipe: Recipe }) {
  if (recipe.ai_generated) {
    return <Badge variant="default">IA</Badge>;
  }
  if (recipe.source_site === "tudogostoso") {
    return <Badge variant="outline" className="border-orange-400 text-orange-600">TudoGostoso</Badge>;
  }
  return <Badge variant="secondary">Manual</Badge>;
}

export default function RecipesPage() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [proteins, setProteins] = useState<Protein[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Recipe | null>(null);
  const [generating, setGenerating] = useState(false);

  const [scrapeDialogOpen, setScrapeDialogOpen] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [scrapeUrlError, setScrapeUrlError] = useState("");

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

  function handleView(recipe: Recipe) {
    navigate(`/recipes/${recipe.id}`);
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

  function openScrapeDialog() {
    setScrapeUrl("");
    setScrapeUrlError("");
    setScrapeDialogOpen(true);
  }

  function validateScrapeUrl(url: string): boolean {
    if (!url.trim()) return true;
    if (!url.startsWith("https://www.tudogostoso.com.br/")) {
      setScrapeUrlError("A URL deve começar com https://www.tudogostoso.com.br/");
      return false;
    }
    setScrapeUrlError("");
    return true;
  }

  async function handleScrape(url?: string) {
    if (url !== undefined && !validateScrapeUrl(url)) return;
    setScraping(true);
    try {
      const recipe = await scrapeRecipe(url?.trim() || undefined);
      toast.success(`Receita "${recipe.title}" importada do TudoGostoso!`);
      setScrapeDialogOpen(false);
      await load();
    } catch {
      // handled by interceptor
    } finally {
      setScraping(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Receitas</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" onClick={openScrapeDialog} className="w-full sm:w-auto">
            <Globe className="mr-2 h-4 w-4" />
            Importar do TudoGostoso
          </Button>
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
              <TableHead>Origem</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-32">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhuma receita cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              recipes.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell>{proteinNames(r.protein_ids) || "—"}</TableCell>
                  <TableCell>
                    <RecipeOriginBadge recipe={r} />
                  </TableCell>
                  <TableCell>{new Date(r.created_at).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleView(r)}>
                        <Eye className="h-4 w-4" />
                      </Button>
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

      {/* Delete confirmation dialog */}
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

      {/* Scrape TudoGostoso dialog */}
      <Dialog open={scrapeDialogOpen} onOpenChange={(open) => !scraping && setScrapeDialogOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar do TudoGostoso</DialogTitle>
            <DialogDescription>
              Importe uma receita aleatória ou cole a URL de uma receita específica do TudoGostoso.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              disabled={scraping}
              onClick={() => handleScrape()}
            >
              {scraping ? "Importando..." : "Importar receita aleatória"}
            </Button>

            <div className="relative flex items-center">
              <div className="flex-grow border-t" />
              <span className="mx-3 text-xs text-muted-foreground">ou</span>
              <div className="flex-grow border-t" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scrape-url">URL da receita</Label>
              <Input
                id="scrape-url"
                placeholder="https://www.tudogostoso.com.br/receita/..."
                value={scrapeUrl}
                onChange={(e) => {
                  setScrapeUrl(e.target.value);
                  setScrapeUrlError("");
                }}
                disabled={scraping}
              />
              {scrapeUrlError && (
                <p className="text-sm text-destructive">{scrapeUrlError}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              disabled={scraping || !scrapeUrl.trim()}
              onClick={() => handleScrape(scrapeUrl)}
            >
              {scraping ? "Importando..." : "Importar por URL"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
