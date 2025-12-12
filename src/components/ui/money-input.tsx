"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface MoneyInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  placeholder?: string;
}

export function MoneyInput({ value, onChange, className, placeholder }: MoneyInputProps) {
  // Formata número para string R$
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 2,
    }).format(val);
  };

  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    setDisplayValue(formatCurrency(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove tudo que não é dígito
    const rawValue = e.target.value.replace(/\D/g, "");
    
    // Converte para número (divide por 100 para considerar centavos)
    const numberValue = Number(rawValue) / 100;
    
    onChange(numberValue);
  };

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      className={className}
      placeholder={placeholder}
    />
  );
}