import { useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { Protein } from "@/types/protein";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  active: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface ProteinFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  protein: Protein | null;
  onSubmit: (data: FormData) => Promise<void>;
}

export default function ProteinForm({ open, onOpenChange, protein, onSubmit }: ProteinFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", active: true },
  });

  const activeValue = watch("active");

  useEffect(() => {
    if (protein) {
      reset({ name: protein.name, active: protein.active });
    } else {
      reset({ name: "", active: true });
    }
  }, [protein, reset]);

  async function handleFormSubmit(data: FormData) {
    await onSubmit(data);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{protein ? "Editar Proteína" : "Nova Proteína"}</DialogTitle>
          <DialogDescription>
            {protein ? "Atualize os dados da proteína." : "Preencha os dados para criar uma nova proteína."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name")} placeholder="Ex: Frango" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="active"
              checked={activeValue}
              onCheckedChange={(checked) => setValue("active", checked)}
            />
            <Label htmlFor="active">Ativo</Label>
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
