import { useEffect, useState } from "react";
export function usePayPalScript(clientId: string) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById("paypal-sdk")) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
    script.async = true;
    script.onload = () => setLoaded(true);

    document.body.appendChild(script);
  }, [clientId]);

  return loaded;
}