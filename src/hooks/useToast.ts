import { useState } from "react";

type ToastType = "success" | "error" | "info";

export function useToast() {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("info");

  function showToast(newMessage: string, newType: ToastType = "info") {
    setMessage(newMessage);
    setType(newType);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  function clearToast() {
    setMessage("");
  }

  return {
    message,
    type,
    showToast,
    clearToast,
  };
}