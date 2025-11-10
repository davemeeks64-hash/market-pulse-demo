const fetchStock = async (symbol: string) => {
  try {
    const res = await fetch(API_URL + symbol);
    const json = await res.json();
    const q = json["Global Quote"];
    if (!q) return null;
    return {
      price: parseFloat(q["05. price"]),
      change: parseFloat(q["09. change"]),
      changePct: parseFloat(q["10. change percent"]),
      history: Array.from({ length: 20 }, (_, i) => ({
        time: i,
        price: parseFloat(q["05. price"]) * (1 + (Math.random() - 0.5) * 0.03)
      }))
    };
  } catch { return null; }
};