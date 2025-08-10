// src/components/common/CommonDropdown.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { DropdownIcon } from "./Icons";

export type DropdownOption = {
  id: string | number; // ID pode ser string ou number
  name: string;
  value: string;
};

interface CommonDropdownProps {
  options: DropdownOption[] | undefined;
  name: string;
  onChange?: (value: string) => void;
  value?: string | null; // Recebe o valor 'value' da opção selecionada (ex: "Pessoa Jurídica", "SP")
  disabled?: boolean;
}

const CommonDropdown: React.FC<CommonDropdownProps> = ({
  options,
  name,
  onChange,
  value, // Valor externo, que vem do Controller/watch do react-hook-form
  disabled = false,
}) => {
  // Encontra a opção atualmente selecionada baseado no 'value' externo
  // Se o 'value' for nulo/indefinido ou não corresponder a uma opção, selectedOption será null
  const currentSelectedOption = options?.find(option => option.value === value) || null;

  // Use um estado interno apenas para gerenciar o valor da Listbox, que é um objeto DropdownOption
  // Inicializa com a opção correspondente ao 'value' externo, ou null
  const [selectedInternalOption, setSelectedInternalOption] = useState<DropdownOption | null>(currentSelectedOption);

  // Sincroniza o estado interno com o valor externo.
  // Isso garante que se o 'value' externo mudar, o dropdown visualmente se atualize.
  useEffect(() => {
    setSelectedInternalOption(currentSelectedOption);
  }, [currentSelectedOption]);


  const handleChange = (option: DropdownOption) => {
    setSelectedInternalOption(option); // Atualiza o estado interno
    if (onChange) {
      onChange(option.value); // Notifica o componente pai com o 'value' da opção
    }
  };

  // Se não há opções, desabilita e mostra uma mensagem genérica no placeholder
  const placeholderText = options && options.length > 0 ? `Select ${name}` : `Nenhuma opção disponível`;

  return (
    <div className="border relative rounded-lg border-[#2E263D]/20 w-full">
      <p className="commonlabel">{name}</p>
      <Listbox value={selectedInternalOption} onChange={handleChange} disabled={disabled}>
        <ListboxButton
          className={clsx(
            "relative flex cursor-pointer items-center outline-none justify-between gap-1 w-full rounded-lg max-sm:text-sm p-2 sm:p-4 text-left text-sm",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {selectedInternalOption ? (
            <span>{selectedInternalOption.name}</span>
          ) : (
            <span className="text-[#2E263D]/70">{placeholderText}</span>
          )}
          <DropdownIcon />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          className={clsx(
            "w-(--button-width) mt-2 mb-3 rounded-md border border-gray-300 bg-white p-1 z-50 text-black focus:outline-none",
            "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 max-h-[200px] overflow-y-auto scrollbar_hide"
          )}
        >
          {options && options.length > 0 ? (
            options.map((option) => (
              <ListboxOption
                key={String(option.id)} // Garante que a key seja string
                value={option}
                className={({ selected }) =>
                  clsx(
                    "relative flex items-center gap-3 px-4 py-3 cursor-pointer",
                    selected && "bg-white" // Mantenha o estilo de selecionado consistente
                  )
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={clsx(
                        "min-w-4 h-4 rounded-full border flex items-center justify-center",
                        selected && "border-[4px] border-[#0E2B57]"
                      )}
                    />
                    <p
                      className={clsx(
                        "text-sm text-[#433C50]",
                        selected && "font-medium"
                      )}
                    >
                      {option.name}
                    </p>
                  </>
                )}
              </ListboxOption>
            ))
          ) : (
            // Mensagem quando não há opções, exibida dentro do painel
            <ListboxOption
              disabled
              value={null}
              className="relative flex items-center gap-3 px-4 py-3 text-gray-500 cursor-not-allowed"
            >
              Nenhuma opção disponível
            </ListboxOption>
          )}
        </ListboxOptions>
      </Listbox>
    </div>
  );
};

export default CommonDropdown;