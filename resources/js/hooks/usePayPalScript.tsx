import { useEffect, useState } from "react";
export function usePayPalScript(clientId: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!clientId) {
      setLoaded(false);
      return;
    }

    const existing = document.getElementById("paypal-sdk");
    if (existing) {
      const existingId = existing.getAttribute("data-client-id");
      if (existingId === clientId) {
        setLoaded(true);
        return;
      }
      existing.remove();
    }

    setLoaded(false);
    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
    script.setAttribute("data-client-id", clientId);
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => setLoaded(false);

    document.body.appendChild(script);
  }, [clientId]);

  return loaded;
}
