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
import type { PhoneNumber } from "@/types/phoneNumber";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(/^\+\d{10,15}$/, "Formato E.164 inválido (ex: +5511999998888)"),
  active: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface PhoneNumberFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: PhoneNumber | null;
  onSubmit: (data: FormData) => Promise<void>;
}

export default function PhoneNumberForm({ open, onOpenChange, phoneNumber, onSubmit }: PhoneNumberFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", active: true },
  });

  const activeValue = watch("active");

  useEffect(() => {
    if (phoneNumber) {
      reset({ name: phoneNumber.name, phone: phoneNumber.phone, active: phoneNumber.active });
    } else {
      reset({ name: "", phone: "", active: true });
    }
  }, [phoneNumber, reset]);

  async function handleFormSubmit(data: FormData) {
    await onSubmit(data);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{phoneNumber ? "Editar Número" : "Novo Número"}</DialogTitle>
          <DialogDescription>
            {phoneNumber ? "Atualize os dados do número." : "Preencha os dados para adicionar um número."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name")} placeholder="Ex: João" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone (E.164)</Label>
            <Input id="phone" {...register("phone")} placeholder="+5511999998888" />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
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
