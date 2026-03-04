import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMessageLogs } from "@/api/messages";
import type { MessageLog } from "@/types/message";

export default function MessageLogsPage() {
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    try {
      const data = await getMessageLogs();
      setLogs(data);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = statusFilter === "all" ? logs : logs.filter((l) => l.status === statusFilter);

  const statuses = [...new Set(logs.map((l) => l.status))];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Logs de Mensagens</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filtrar status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>SID Twilio</TableHead>
              <TableHead>Conteúdo</TableHead>
              <TableHead>Erro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum log encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(log.sent_at).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={log.status === "sent" ? "default" : "destructive"}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{log.twilio_message_sid || "—"}</TableCell>
                  <TableCell className="max-w-xs truncate">{log.message_content}</TableCell>
                  <TableCell className="text-sm text-destructive">{log.error_message || "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
