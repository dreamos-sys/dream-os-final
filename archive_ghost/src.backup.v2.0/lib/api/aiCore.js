export async function sendToLocalAI(query) {
  const response = await fetch("http://localhost:8080/completion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `<|user|>\n${query}<|end|>\n<|assistant|>`,
      n_predict: 256
    })
  });
  if (!response.ok) throw new Error("Offline");
  const data = await response.json();
  return data.content;
}
