import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { listPhoneNumbers, createPhoneNumber, updatePhoneNumber, deletePhoneNumber } from "@/api/phoneNumbers";
import type { PhoneNumber } from "@/types/phoneNumber";
import PhoneNumberForm from "./PhoneNumberForm";

type CountryDisplay = {
  code: string;
  flag: string;
  dialCode: string;
};

const COUNTRY_DISPLAY: CountryDisplay[] = [
  { code: "BR", flag: "🇧🇷", dialCode: "+55" },
  { code: "AR", flag: "🇦🇷", dialCode: "+54" },
  { code: "CL", flag: "🇨🇱", dialCode: "+56" },
  { code: "CO", flag: "🇨🇴", dialCode: "+57" },
  { code: "ES", flag: "🇪🇸", dialCode: "+34" },
  { code: "MX", flag: "🇲🇽", dialCode: "+52" },
  { code: "PT", flag: "🇵🇹", dialCode: "+351" },
  { code: "US", flag: "🇺🇸", dialCode: "+1" },
];

function formatPhoneForTable(phone: string) {
  const normalized = phone.trim();
  const country =
    COUNTRY_DISPLAY
      .slice()
      .sort((a, b) => b.dialCode.length - a.dialCode.length)
      .find((item) => normalized.startsWith(item.dialCode)) ?? null;

  const dialCode = country?.dialCode ?? "+";
  const digitsWithoutDdi = normalized.startsWith(dialCode)
    ? normalized.slice(dialCode.length).replace(/\D/g, "")
    : normalized.replace(/\D/g, "");

  const ddd = digitsWithoutDdi.slice(0, 2);
  const localNumber = digitsWithoutDdi.slice(2);

  return `${country?.flag ?? "🌐"} ${dialCode} ${ddd}${localNumber ? ` ${localNumber}` : ""}`.trim();
}

export default function PhoneNumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PhoneNumber | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PhoneNumber | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await listPhoneNumbers();
      setPhoneNumbers(data);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function handleNew() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(pn: PhoneNumber) {
    setEditing(pn);
    setFormOpen(true);
  }

  async function handleFormSubmit(data: { name: string; phone: string; active: boolean }) {
    if (editing) {
      await updatePhoneNumber(editing.id, data);
      toast.success("Número atualizado!");
    } else {
      await createPhoneNumber(data);
      toast.success("Número criado!");
    }
    await load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deletePhoneNumber(deleteTarget.id);
      toast.success("Número removido!");
      await load();
    } catch {
      // handled by interceptor
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Números de Telefone</h2>
        <Button onClick={handleNew} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Novo Número
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {phoneNumbers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum número cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              phoneNumbers.map((pn) => (
                <TableRow key={pn.id}>
                  <TableCell className="font-medium">{pn.name}</TableCell>
                  <TableCell>{formatPhoneForTable(pn.phone)}</TableCell>
                  <TableCell>
                    <Badge variant={pn.active ? "default" : "secondary"}>
                      {pn.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(pn.created_at).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(pn)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(pn)}>
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

      <PhoneNumberForm
        open={formOpen}
        onOpenChange={setFormOpen}
        phoneNumber={editing}
        onSubmit={handleFormSubmit}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja remover o número de &quot;{deleteTarget?.name}&quot;? Esta ação não pode ser desfeita.
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
