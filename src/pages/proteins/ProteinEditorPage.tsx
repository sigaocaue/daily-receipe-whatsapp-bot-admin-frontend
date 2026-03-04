import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listProteins, createProtein, updateProtein, getProteinById } from "@/api/proteins";
import type { Protein } from "@/types/protein";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  active: z.boolean(),
});

type FormData = z.infer<typeof schema>;

const EMPTY_VALUES: FormData = {
  name: "",
  active: true,
};

export default function ProteinEditorPage() {
  const navigate = useNavigate();
  const { proteinId } = useParams();
  const [initialLoading, setInitialLoading] = useState(true);
  const isEdit = useMemo(() => Boolean(proteinId), [proteinId]);

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

  const activeValue = watch("active");

  useEffect(() => {
    async function loadInitialData() {
      try {
        if (isEdit && proteinId) {
          const protein = await getProteinById(proteinId);
          reset({
            name: protein.name,
            active: protein.active,
          });
        } else {
          reset(EMPTY_VALUES);
        }
      } catch {
        toast.error("Não foi possível carregar os dados da proteína.");
        navigate("/proteins");
      } finally {
        setInitialLoading(false);
      }
    }

    void loadInitialData();
  }, [isEdit, navigate, proteinId, reset]);

  async function onSubmit(data: FormData) {
    try {
      if (isEdit && proteinId) {
        await updateProtein(proteinId, data);
        toast.success("Proteína atualizada!");
      } else {
        await createProtein(data);
        toast.success("Proteína criada!");
      }
      navigate("/proteins");
    } catch {
      // handled by interceptor
    }
  }

  if (initialLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => navigate("/proteins")} className="w-full sm:w-auto">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para proteínas
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Editar Proteína" : "Nova Proteína"}</CardTitle>
          <CardDescription>
            {isEdit ? "Atualize os dados da proteína." : "Preencha os dados para criar uma nova proteína."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => navigate("/proteins")} className="w-full sm:w-auto">
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

async function getProteinById(id: string): Promise<Protein> {
  const proteins = await listProteins();
  const protein = proteins.find((p) => p.id === id);
  if (!protein) {
    throw new Error("Proteína não encontrada");
  }
  return protein;
}
