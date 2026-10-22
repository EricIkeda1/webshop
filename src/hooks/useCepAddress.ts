import { useCallback, useEffect, useRef, useState } from "react";
import type { AddressFields } from "../types/address";
import {
  formatCep,
  lookupAddress,
  normalizeCep,
  PostalLookupError,
} from "../services/addressApi";
const EMPTY: AddressFields = {
  street: "",
  neighborhood: "",
  city: "",
  state: "",
};
const KEYS = ["street", "neighborhood", "city", "state"] as const;
export function useCepAddress(initialCep = "") {
  const [cep, setCep] = useState(formatCep(initialCep));
  const [address, setAddress] = useState<AddressFields>({ ...EMPTY });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState(
    "Digite os 8 dígitos do CEP para preencher o endereço.",
  );
  const currentRequest = useRef<AbortController | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const revisions = useRef<Record<keyof AddressFields, number>>({
    street: 0,
    neighborhood: 0,
    city: 0,
    state: 0,
  });
  const digits = normalizeCep(cep);
  const search = useCallback(async () => {
    clearTimeout(timer.current);
    currentRequest.current?.abort();
    if (digits.length !== 8) {
      setStatus("error");
      setMessage("Informe um CEP com 8 dígitos.");
      return;
    }
    const controller = new AbortController();
    currentRequest.current = controller;
    const before = { ...revisions.current };
    setStatus("loading");
    setMessage("Buscando endereço…");
    try {
      const result = await lookupAddress(digits, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setAddress((current) => {
        const next = { ...current };
        // Never overwrite edits made by the visitor while the request was pending.
        KEYS.forEach((key) => {
          if (revisions.current[key] === before[key]) next[key] = result[key];
        });
        return next;
      });
      setStatus("success");
      setMessage(
        result.street
          ? "Endereço encontrado. Confira os campos e informe o número."
          : "Cidade e estado encontrados. Complete o logradouro e o bairro manualmente.",
      );
    } catch (error) {
      if (controller.signal.aborted) return;
      setStatus("error");
      setMessage(
        error instanceof PostalLookupError
          ? error.message
          : "Não foi possível consultar o CEP. Preencha o endereço manualmente.",
      );
    }
  }, [digits]);
  useEffect(() => {
    if (digits.length === 8)
      timer.current = setTimeout(() => {
        void search();
      }, 400);
    return () => {
      clearTimeout(timer.current);
      currentRequest.current?.abort();
    };
  }, [digits, search]);
  function updateCep(value: string) {
    const next = formatCep(value);
    if (normalizeCep(next) !== digits) {
      currentRequest.current?.abort();
      clearTimeout(timer.current);
      setAddress({ ...EMPTY });
      setStatus("idle");
      setMessage("Digite os 8 dígitos do CEP para preencher o endereço.");
      KEYS.forEach((key) => {
        revisions.current[key]++;
      });
    }
    setCep(next);
  }
  function updateField(key: keyof AddressFields, value: string) {
    revisions.current[key]++;
    setAddress((current) => ({ ...current, [key]: value }));
  }
  return { cep, address, status, message, updateCep, updateField, search };
}
