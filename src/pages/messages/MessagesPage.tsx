import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, List } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { sendMessages } from "@/api/messages";
import { listRecipes } from "@/api/recipes";
import { listPhoneNumbers } from "@/api/phoneNumbers";
import type { SendMessageResponse, SendRecipeRequest } from "@/types/message";
import type { Recipe } from "@/types/recipe";
import type { PhoneNumber } from "@/types/phoneNumber";

type SendMode = "random" | "existing" | "custom";

export default function MessagesPage() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SendMessageResponse | null>(null);

  const [mode, setMode] = useState<SendMode>("random");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState("");

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saveRecipe, setSaveRecipe] = useState(false);

  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [selectedPhoneIds, setSelectedPhoneIds] = useState<string[]>([]);

  useEffect(() => {
    listPhoneNumbers()
      .then((nums) => setPhoneNumbers(nums))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mode === "existing" && recipes.length === 0) {
      listRecipes().then(setRecipes).catch(() => {});
    }
  }, [mode, recipes.length]);

  const activePhoneNumbers = phoneNumbers.filter((p) => p.active);
  const allSelected = activePhoneNumbers.length > 0 && selectedPhoneIds.length === activePhoneNumbers.length;

  function togglePhone(id: string) {
    setSelectedPhoneIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedPhoneIds([]);
    } else {
      setSelectedPhoneIds(activePhoneNumbers.map((p) => p.id));
    }
  }

  function buildPayload(): SendRecipeRequest | undefined {
    const phoneIds =
      selectedPhoneIds.length > 0 && !allSelected
        ? selectedPhoneIds
        : undefined;

    if (mode === "existing") {
      return { recipe_id: selectedRecipeId, phone_number_ids: phoneIds };
    }
    if (mode === "custom") {
      return {
        title,
        ingredients,
        instructions,
        image_url: imageUrl || undefined,
        save_recipe: saveRecipe,
        phone_number_ids: phoneIds,
      };
    }
    return phoneIds ? { phone_number_ids: phoneIds } : undefined;
  }

  async function handleSend() {
    if (mode === "existing" && !selectedRecipeId) {
      toast.error("Selecione uma receita.");
      return;
    }
    if (mode === "custom" && (!title || !ingredients || !instructions)) {
      toast.error("Preencha título, ingredientes e instruções.");
      return;
    }

    setSending(true);
    try {
      const data = await sendMessages(buildPayload());
      const normalized: SendMessageResponse = {
        results: Array.isArray(data?.results) ? data.results : [],
      };
      setResult(normalized);
      const successCount = normalized.results.filter((r) => r.status === "sent").length;
      toast.success(`${successCount} mensagem(ns) enviada(s)!`);
    } catch {
      // handled by interceptor
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Enviar receita</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Modo de envio</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as SendMode)}>
              <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">Aleatória</SelectItem>
                <SelectItem value="existing">Receita existente</SelectItem>
                <SelectItem value="custom">Receita personalizada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode === "existing" && (
            <div className="space-y-2">
              <Label>Receita</Label>
              <Select value={selectedRecipeId} onValueChange={setSelectedRecipeId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma receita" />
                </SelectTrigger>
                <SelectContent>
                  {recipes.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {mode === "custom" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nome da receita" />
              </div>
              <div className="space-y-2">
                <Label>Ingredientes</Label>
                <Textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="Lista de ingredientes" rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Instruções</Label>
                <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Modo de preparo" rows={4} />
              </div>
              <div className="space-y-2">
                <Label>URL da imagem (opcional)</Label>
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={saveRecipe} onCheckedChange={setSaveRecipe} id="save-recipe" />
                <Label htmlFor="save-recipe">Salvar no banco</Label>
              </div>
            </div>
          )}

          {activePhoneNumbers.length > 0 && (
            <div className="space-y-3">
              <Label>Destinatários</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                />
                <Label htmlFor="select-all" className="text-sm font-normal cursor-pointer">
                  Selecionar todos
                </Label>
              </div>
              <Separator />
              <div className="space-y-2">
                {activePhoneNumbers.map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`phone-${p.id}`}
                      checked={selectedPhoneIds.includes(p.id)}
                      onCheckedChange={() => togglePhone(p.id)}
                    />
                    <Label htmlFor={`phone-${p.id}`} className="text-sm font-normal cursor-pointer">
                      {p.name} — {p.phone}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedPhoneIds.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Nenhum selecionado — será enviado para todos os números ativos.
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:gap-3">
            <Button onClick={handleSend} disabled={sending} className="w-full sm:w-auto">
              <Send className="mr-2 h-4 w-4" />
              {sending ? "Enviando..." : "Enviar receita do dia agora"}
            </Button>
            <Button variant="outline" onClick={() => navigate("/messages/logs")} className="w-full sm:w-auto">
              <List className="mr-2 h-4 w-4" />
              Ver logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resultado do envio</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Telefone ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SID</TableHead>
                  <TableHead>Erro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.results.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs">{r.phone_number_id}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === "sent" ? "default" : "destructive"}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{r.twilio_message_sid || "—"}</TableCell>
                    <TableCell className="text-sm text-destructive">{r.error || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
