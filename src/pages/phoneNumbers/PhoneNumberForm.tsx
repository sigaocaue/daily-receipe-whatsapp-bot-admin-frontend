import { useEffect, useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface PhoneNumberFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: PhoneNumber | null;
  onSubmit: (data: FormData) => Promise<void>;
}

export default function PhoneNumberForm({ open, onOpenChange, phoneNumber, onSubmit }: PhoneNumberFormProps) {
  const [selectedCountryCode, setSelectedCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [localPhone, setLocalPhone] = useState("");
  const [hasTypedPhone, setHasTypedPhone] = useState(false);

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
    defaultValues: { name: "", phone: "", active: true },
  });

  const activeValue = watch("active");
  const selectedCountry: CountryOption =
    COUNTRIES.find((country) => country.code === selectedCountryCode) ?? DEFAULT_COUNTRY;

  useEffect(() => {
    if (!open) {
      reset({ name: "", phone: "", active: true });
      setSelectedCountryCode(DEFAULT_COUNTRY.code);
      setLocalPhone("");
      setHasTypedPhone(false);
      clearErrors();
      return;
    }

    const phoneValue = phoneNumber?.phone ?? "";
    const countryMatch: CountryOption =
      COUNTRIES
        .slice()
        .sort((a, b) => b.dialCode.length - a.dialCode.length)
        .find((country) => phoneValue.startsWith(country.dialCode)) ??
      DEFAULT_COUNTRY;

    const localDigits = phoneValue.startsWith(countryMatch.dialCode)
      ? phoneValue.slice(countryMatch.dialCode.length).replace(/\D/g, "")
      : phoneValue.replace(/\D/g, "");

    if (phoneNumber) {
      reset({ name: phoneNumber.name, phone: phoneNumber.phone, active: phoneNumber.active });
    } else {
      reset({ name: "", phone: "", active: true });
    }

    setSelectedCountryCode(countryMatch.code);
    setLocalPhone(localDigits);
    setHasTypedPhone(localDigits.length > 0);
  }, [clearErrors, open, phoneNumber, reset]);

  useEffect(() => {
    const phoneInE164 = `${selectedCountry.dialCode}${localPhone.replace(/\D/g, "")}`;
    setValue("phone", phoneInE164);
  }, [localPhone, selectedCountry, setValue]);

  async function handleFormSubmit(data: FormData) {
    await onSubmit(data);
    onOpenChange(false);
  }

  function handleDialogOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full">
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
            <Label htmlFor="phoneLocal">Telefone</Label>
            <div className="flex gap-2 flex-col sm:flex-row">
              <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode}>
                <SelectTrigger className="w-full sm:w-[120px] shrink-0">
                  <SelectValue placeholder="Selecione o país" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.flag} {country.dialCode}
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>
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
