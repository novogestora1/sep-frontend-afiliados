// src/components/affiliate/AfiliadoForm.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import CommonInputs from "@/components/common/CommonInputs";
import { useRouter } from "next/navigation";
import axios from "axios";
import LoadingModal from "@/components/common/LoadingModal";

interface AffiliateFormProps {
  onValidityChange?: (isValid: boolean) => void;
}

const AffiliateForm: React.FC<AffiliateFormProps> = ({
  onValidityChange = () => {},
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields, isSubmitted },
    setError,
    watch,
    setValue,
    control,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      cpf: "",
      dateOfBirth: "",
      firstName: "",
      surname: "",
      email: "",
      phoneNumber: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const router = useRouter();
  const password = watch("password");
  const cpf = watch("cpf");
  // --- NOVO: Observa os campos que serão preenchidos automaticamente ---
  const firstNameValue = watch("firstName");
  const surnameValue = watch("surname");
  const dateOfBirthValue = watch("dateOfBirth");

  const [isLoading, setIsLoading] = useState(false);

  // --- Lógica para buscar dados do CPF ---
  useEffect(() => {
    const fetchCpfData = async () => {
      const rawCpf = cpf?.replace(/\D/g, "");
      if (rawCpf && rawCpf.length === 11) {
        try {
          const requestUrl = `/api/bff/cpf/${rawCpf}`;
          const response = await axios.get(requestUrl);
          const dataFromBFF = response.data;

          if (response.status === 200 && dataFromBFF.firstName) {
            setValue("firstName", dataFromBFF.firstName || "", { shouldValidate: true });
            setValue("surname", dataFromBFF.surname || "", { shouldValidate: true });
            setValue("dateOfBirth", dataFromBFF.dateOfBirth || "", { shouldValidate: true });
            setError("cpf", { type: "manual", message: undefined });
          } else {
            const errorMessage = dataFromBFF.message || "CPF não encontrado ou inválido.";
            console.warn("Nenhum dado encontrado para este CPF ou erro na resposta:", dataFromBFF);
            setValue("firstName", "", { shouldValidate: true });
            setValue("surname", "", { shouldValidate: true });
            setValue("dateOfBirth", "", { shouldValidate: true });
            setError("cpf", { type: "manual", message: errorMessage });
          }
        } catch (error: any) {
          console.error("Erro ao buscar dados do CPF:", error);
          if (error.response) {
            setError("cpf", { type: "manual", message: error.response.data.message || "Erro ao consultar CPF." });
          } else {
            setError("cpf", { type: "manual", message: "Erro de conexão ao consultar CPF." });
          }
          setValue("firstName", "", { shouldValidate: true });
          setValue("surname", "", { shouldValidate: true });
          setValue("dateOfBirth", "", { shouldValidate: true });
        }
      } else if (rawCpf && rawCpf.length < 11) {
        setError("cpf", { type: "manual", message: "CPF incompleto." });
        setValue("firstName", "", { shouldValidate: true });
        setValue("surname", "", { shouldValidate: true });
        setValue("dateOfBirth", "", { shouldValidate: true });
      } else {
        setError("cpf", { type: "manual", message: undefined });
        setValue("firstName", "", { shouldValidate: true });
        setValue("surname", "", { shouldValidate: true });
        setValue("dateOfBirth", "", { shouldValidate: true });
      }
    };

    const timeoutId = setTimeout(() => {
        fetchCpfData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [cpf, setValue, setError]);

  useEffect(() => {
    onValidityChange(isValid);
  }, [isValid, onValidityChange]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const cpfParaBackend = data.cpf;
      const celularParaBackend = (data.phoneNumber || "").replace(/\D/g, "");

      const payloadToBackend = {
        nome: data.firstName,
        sobrenome: data.surname,
        email: data.email,
        username: data.username,
        senha: data.password,
        cpf: cpfParaBackend,
        celular: celularParaBackend,
        data_nascimento: data.dateOfBirth,
      };

      // 🚨 CORREÇÃO AQUI: O caminho da requisição POST para o seu BFF
      const response = await axios.post("/api/bff/teste-cadastro", payloadToBackend);

      if (response.status === 200 || response.status === 201) {
        router.push("/afiliado/cadastro/confirmacao");
      } else {
        alert(`Cadastro falhou com status: ${response.status}. Mensagem: ${response.data.message || 'N/A'}`);
      }
    } catch (error: any) {
      console.error("Erro ao enviar formulário:", error);
      if (error.response) {
        alert(error.response.data.message || "Erro desconhecido do servidor.");
      } else if (error.request) {
        alert("Nenhuma resposta do servidor. Verifique sua conexão de rede.");
      } else {
        alert("Erro ao processar a requisição. Por favor, tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-3xl font-semibold text-black mt-6 mb-12 sm:mb-16 md:mb-20">
        Cadastro de afiliado
      </h1>

      <h2 className="text-[#344054] text-[22px] font-medium mt-6">
        Dados pessoais
      </h2>
      <div className="grid sm:grid-cols-2 mt-4 gap-5 md:gap-[34px]">
        <CommonInputs
          label="CPF"
          type="text"
          placeholder="000.000.000-00"
          {...register("cpf", {
            required: "CPF é obrigatório",
            pattern: {
              value: /^(\d{3}\.?\d{3}\.?\d{3}-?\d{2})$/,
              message: "Formato de CPF inválido. Use 000.000.000-00",
            },
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              let value = e.target.value.replace(/\D/g, "");
              if (value.length > 11) value = value.slice(0, 11);

              value = value.replace(/(\d{3})(\d)/, "$1.$2");
              value = value.replace(/(\d{3})(\d)/, "$1.$2");
              value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

              setValue("cpf", value, { shouldValidate: true });
            },
          })}
          error={errors.cpf?.message as string}
        />
        <CommonInputs
          label="Data de nascimento"
          type="text"
          placeholder="DD/MM/AAAA"
          maxLength={10}
          {...register("dateOfBirth", {
            required: "Data de nascimento é obrigatória",
            pattern: {
              value: /^\d{2}\/\d{2}\/\d{4}$/,
              message: "Formato inválido. Use DD/MM/AAAA",
            },
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              let value = e.target.value.replace(/\D/g, "");
              if (value.length > 8) value = value.slice(0, 8);

              if (value.length > 4) {
                value = `${value.slice(0, 2)}/${value.slice(
                  2,
                  4
                )}/${value.slice(4)}`;
              } else if (value.length > 2) {
                value = `${value.slice(0, 2)}/${value.slice(2)}`;
              }
              setValue("dateOfBirth", value, { shouldValidate: true });
            },
          })}
          error={(touchedFields.dateOfBirth || isSubmitted) ? errors.dateOfBirth?.message as string : undefined}
          readOnly={!!dateOfBirthValue} // <-- NOVO: Torna o campo readOnly se tiver valor
        />
        <CommonInputs
          label="Nome"
          type="text"
          placeholder="Seu nome"
          {...register("firstName", {
            required: "Nome é obrigatório",
            minLength: {
              value: 2,
              message: "Nome deve ter no mínimo 2 caracteres",
            },
            maxLength: {
              value: 100,
              message: "Nome deve ter no máximo 100 caracteres",
            },
          })}
          error={(touchedFields.firstName || isSubmitted) ? errors.firstName?.message as string : undefined}
          readOnly={!!firstNameValue} // <-- NOVO: Torna o campo readOnly se tiver valor
        />
        <CommonInputs
          label="Sobrenome"
          type="text"
          placeholder="Seu sobrenome"
          {...register("surname", {
            required: "Sobrenome é obrigatório",
            minLength: {
              value: 2,
              message: "Sobrenome deve ter no mínimo 2 caracteres",
            },
            maxLength: {
              value: 155,
              message: "Sobrenome deve ter no máximo 155 caracteres",
            },
          })}
          error={(touchedFields.surname || isSubmitted) ? errors.surname?.message as string : undefined}
          readOnly={!!surnameValue} // <-- NOVO: Torna o campo readOnly se tiver valor
        />
      </div>

      <h2 className="text-[#344054] text-[22px] font-medium mt-6">Contacts</h2>
      <div className="grid sm:grid-cols-2 mt-4 gap-5 md:gap-[34px]">
        <CommonInputs
          label="Email"
          type="email"
          placeholder="exemplo@dominio.com"
          {...register("email", {
            required: "Email é obrigatório",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Email inválido",
            },
          })}
          error={errors.email?.message as string}
        />
        <CommonInputs
          label="Celular"
          type="tel"
          placeholder="(XX) X XXXX-XXXX"
          {...register("phoneNumber", {
            required: "Celular é obrigatório",
            pattern: {
              value: /^\(?\d{2}\)?\s?\d{1,2}\s?\d{4}-?\d{4}$/,
              message: "Formato de celular inválido. Use (XX) X XXXX-XXXX",
            },
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              let value = e.target.value.replace(/\D/g, "");
              if (value.length > 11) value = value.slice(0, 11);

              if (value.length > 10) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3, 7)}-${value.slice(7, 11)}`;
              } else if (value.length > 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6, 10)}`;
              } else if (value.length > 2) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
              }
              setValue("phoneNumber", value, { shouldValidate: true });
            },
          })}
          error={errors.phoneNumber?.message as string}
        />
      </div>

      <h2 className="text-[#344054] text-[22px] font-medium mt-6">Username</h2>
      <div className="grid sm:grid-cols-2 mt-4 gap-5 md:gap-[34px]">
        <CommonInputs
          label="Username"
          type="text"
          placeholder="minha.conta"
          {...register("username", {
            required: "Username é obrigatório",
            pattern: {
              value: /^[a-z0-9._-]+$/,
              message: "Username deve conter apenas letras minúsculas, números, '.' e '-'. Sem espaços.",
            },
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = e.target.value.toLowerCase();
            }
          })}
          error={errors.username?.message as string}
        />
      </div>

      <h2 className="text-[#344054] text-[22px] font-medium mt-6">Senha</h2>
      <div className="grid sm:grid-cols-2 mt-4 gap-5 md:gap-[34px]">
        <CommonInputs
          label="Crie uma senha"
          type="password"
          placeholder="********"
          {...register("password", {
            required: "Senha é obrigatória",
            minLength: {
              value: 8,
              message: "Senha deve ter no mínimo 8 caracteres",
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;<>,.?/~`-])[A-Za-z\d!@#$%^&*()_+={}\[\]:;<>,.?/~`-]{8,}$/,
              message: "Senha: 8+ caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 especial.",
            },
          })}
          error={errors.password?.message as string}
        />
        <CommonInputs
          label="Confirme sua senha"
          type="password"
          placeholder="********"
          {...register("confirmPassword", {
            required: "Confirmação de senha é obrigatória",
            validate: (value) =>
              value === password || "As senhas não coincidem",
          })}
          error={errors.confirmPassword?.message as string}
        />
      </div>

      <div className="flex items-center justify-center mt-6">
        <input
          type="checkbox"
          className="mr-2"
          {...register("terms", { required: "Você deve aceitar os termos e condições" })}
        />
        <label className="text-sm text-gray-700">
          Aceito e concordo com os termos
        </label>
        {errors.terms && <p className="text-red-500 text-xs italic">{errors.terms.message as string}</p>}
      </div>

      <div className="mt-6 flex items-center justify-center">
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="bg-[#001D53] text-white w-full sm:w-auto px-6 py-2 rounded-md disabled:opacity-50"
        >
          Cadastrar
        </button>
      </div>

      {isLoading && <LoadingModal />}
    </form>
  );
};

export default AffiliateForm;
