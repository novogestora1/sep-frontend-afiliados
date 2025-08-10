// src/components/common/CommonInputs.tsx
import React from "react";
import clsx from "clsx"; // Certifique-se de que o clsx está importado

interface CommonInputsProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type: string;
  placeholder: string;
  error?: string;
  // NOVO: Adicione a propriedade readOnly aqui
  readOnly?: boolean; // <-- Adicionado
}

const CommonInputs: React.FC<CommonInputsProps> = ({
  label,
  type,
  placeholder,
  error,
  readOnly, // <-- Desestruture a propriedade aqui também
  ...rest
}) => {
  return (
    <div
      className={clsx(
        "border relative rounded-lg w-full h-fit shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]",
        error ? "border-red-500" : "border-[#D0D5DD]",
        readOnly && "bg-gray-100 cursor-not-allowed" // <-- Opcional: Adicione estilos para readOnly
      )}
    >
      <label className="commonlabel">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={clsx(
          "w-full rounded-lg p-2 max-sm:text-sm sm:p-4 outline-none",
          readOnly && "cursor-not-allowed" // <-- Adicione cursor-not-allowed no input
        )}
        readOnly={readOnly} // <-- Passe a propriedade para o elemento input
        {...rest}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default CommonInputs;