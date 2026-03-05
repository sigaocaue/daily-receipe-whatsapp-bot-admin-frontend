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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPhoneNumber, updatePhoneNumber, getPhoneNumberById } from "@/api/phoneNumbers";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(/^\+\d{10,15}$/, "Formato E.164 inválido (ex: +5511999998888)"),
  active: z.boolean(),
});

type FormData = z.infer<typeof schema>;

type CountryOption = {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
};

const COUNTRIES: CountryOption[] = [
  { code: "BR", name: "Brasil", flag: "🇧🇷", dialCode: "+55" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", dialCode: "+54" },
  { code: "CL", name: "Chile", flag: "🇨🇱", dialCode: "+56" },
  { code: "CO", name: "Colômbia", flag: "🇨🇴", dialCode: "+57" },
  { code: "ES", name: "Espanha", flag: "🇪🇸", dialCode: "+34" },
  { code: "MX", name: "México", flag: "🇲🇽", dialCode: "+52" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", dialCode: "+351" },
  { code: "US", name: "Estados Unidos", flag: "🇺🇸", dialCode: "+1" },
];

const DEFAULT_COUNTRY_CODE = "BR";
const DEFAULT_COUNTRY: CountryOption = COUNTRIES.find((country) => country.code === DEFAULT_COUNTRY_CODE) ?? {
  code: "BR",
  name: "Brasil",
  flag: "🇧🇷",
  dialCode: "+55",
};

function formatNationalPhone(digits: string) {
  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)} ${digits.slice(2)}`;
}

const EMPTY_VALUES: FormData = {
  name: "",
  phone: "",
  active: true,
};

export default function PhoneNumberEditorPage() {
  const navigate = useNavigate();
  const { phoneNumberId } = useParams();
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedCountryCode, setSelectedCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [localPhone, setLocalPhone] = useState("");
  const [hasTypedPhone, setHasTypedPhone] = useState(false);
  const isEdit = useMemo(() => Boolean(phoneNumberId), [phoneNumberId]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  });

  const activeValue = watch("active");
  const selectedCountry: CountryOption =
    COUNTRIES.find((country) => country.code === selectedCountryCode) ?? DEFAULT_COUNTRY;

  useEffect(() => {
    async function loadInitialData() {
      try {
        if (isEdit && phoneNumberId) {
          const phoneNumber = await getPhoneNumberById(phoneNumberId);
          const phoneValue = phoneNumber.phone ?? "";
          const countryMatch: CountryOption =
            COUNTRIES
              .slice()
              .sort((a, b) => b.dialCode.length - a.dialCode.length)
              .find((country) => phoneValue.startsWith(country.dialCode)) ??
            DEFAULT_COUNTRY;

          const localDigits = phoneValue.startsWith(countryMatch.dialCode)
            ? phoneValue.slice(countryMatch.dialCode.length).replace(/\D/g, "")
            : phoneValue.replace(/\D/g, "");

          reset({ name: phoneNumber.name, phone: phoneNumber.phone, active: phoneNumber.active });
          setSelectedCountryCode(countryMatch.code);
          setLocalPhone(localDigits);
          setHasTypedPhone(localDigits.length > 0);
        } else {
          reset(EMPTY_VALUES);
          setSelectedCountryCode(DEFAULT_COUNTRY.code);
          setLocalPhone("");
          setHasTypedPhone(false);
        }
      } catch {
        toast.error("Não foi possível carregar os dados do número.");
        navigate("/phone-numbers");
      } finally {
        setInitialLoading(false);
      }
    }

    void loadInitialData();
  }, [isEdit, navigate, phoneNumberId, reset]);

  useEffect(() => {
    const phoneInE164 = `${selectedCountry.dialCode}${localPhone.replace(/\D/g, "")}`;
    setValue("phone", phoneInE164);
  }, [localPhone, selectedCountry, setValue]);

  async function onSubmit(data: FormData) {
    try {
      if (isEdit && phoneNumberId) {
        await updatePhoneNumber(phoneNumberId, data);
        toast.success("Número atualizado!");
      } else {
        await createPhoneNumber(data);
        toast.success("Número criado!");
      }
      navigate("/phone-numbers");
    } catch {
      // handled by interceptor
    }
  }

  if (initialLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => navigate("/phone-numbers")} className="w-full sm:w-auto">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para números
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Editar Número" : "Novo Número"}</CardTitle>
          <CardDescription>
            {isEdit ? "Atualize os dados do número." : "Preencha os dados para adicionar um número."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...register("name")} placeholder="Ex: João" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneLocal">Telefone</Label>
              <div className="flex gap-2 flex-col sm:flex-row">
                <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode}>
                  <SelectTrigger className="w-full sm:w-[180px] shrink-0">
                    <SelectValue placeholder="Selecione o país" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phoneLocal"
                  value={formatNationalPhone(localPhone)}
                  onChange={(event) => {
                    const digitsOnly = event.target.value.replace(/\D/g, "");
                    if (digitsOnly.length > 0) {
                      setHasTypedPhone(true);
                    }
                    setLocalPhone(digitsOnly);
                  }}
                  onBlur={() => {
                    if (hasTypedPhone) {
                      void trigger("phone");
                      return;
                    }
                    clearErrors("phone");
                  }}
                  placeholder="99 999999999"
                  inputMode="numeric"
                  autoComplete="tel-national"
                />
              </div>
              <input type="hidden" {...register("phone")} />
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

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => navigate("/phone-numbers")} className="w-full sm:w-auto">
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


