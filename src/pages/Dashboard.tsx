import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Beef, BookOpen, Phone, MessageSquare, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { listProteins } from "@/api/proteins";
import { listRecipes, generateRecipe } from "@/api/recipes";
import { listPhoneNumbers } from "@/api/phoneNumbers";
import { getMessageLogs, sendMessages } from "@/api/messages";
import type { MessageLog } from "@/types/message";

export default function Dashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ proteins: 0, recipes: 0, phones: 0, messages: 0 });
  const [recentLogs, setRecentLogs] = useState<MessageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [proteins, recipes, phones, logs] = await Promise.all([
          listProteins(),
          listRecipes(),
          listPhoneNumbers(),
          getMessageLogs(),
        ]);
        setCounts({
          proteins: proteins.length,
          recipes: recipes.length,
          phones: phones.length,
          messages: logs.length,
        });
        setRecentLogs(logs.slice(0, 5));
      } catch {
        // errors handled by interceptor
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const recipe = await generateRecipe();
      toast.success(`Receita "${recipe.title}" gerada com sucesso!`);
      setCounts((c) => ({ ...c, recipes: c.recipes + 1 }));
    } catch {
      // handled by interceptor
    } finally {
      setGenerating(false);
    }
  }

  async function handleSend() {
    setSending(true);
    try {
      const result = await sendMessages();
      const successCount = result.results.filter((r) => r.status === "sent").length;
      toast.success(`${successCount} mensagem(ns) enviada(s)!`);
      navigate("/messages/logs");
    } catch {
      // handled by interceptor
    } finally {
      setSending(false);
    }
  }

  const summaryCards = [
    { title: "Proteínas", value: counts.proteins, icon: Beef, color: "text-orange-500" },
    { title: "Receitas", value: counts.recipes, icon: BookOpen, color: "text-green-500" },
    { title: "Números de telefones cadastrados", value: counts.phones, icon: Phone, color: "text-blue-500" },
    { title: "Mensagens", value: counts.messages, icon: MessageSquare, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{card.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <Button onClick={handleGenerate} disabled={generating} className="w-full sm:w-auto">
          <Sparkles className="mr-2 h-4 w-4" />
          {generating ? "Gerando..." : "Gerar nova receita"}
        </Button>
        <Button variant="secondary" onClick={handleSend} disabled={sending} className="w-full sm:w-auto">
          <Send className="mr-2 h-4 w-4" />
          {sending ? "Enviando..." : "Enviar receita do dia"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Últimos envios</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum envio registrado.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Conteúdo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(log.sent_at).toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.status === "sent" ? "default" : "destructive"}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{log.message_content}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
