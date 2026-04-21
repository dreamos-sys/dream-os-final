// Dream OS v2.1.1 - AI Bridge Engine
const API_KEY = process.env.OLLAMA_API_KEY;

async function sendChat(message, onStream) {
    const response = await fetch("https://ollama.com/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-oss:120b",
            messages: [{ role: "user", content: message }],
            stream: true
        })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        try {
            // Parsing per baris JSON dari Ollama
            const json = JSON.parse(chunk);
            if (json.message && json.message.content) {
                onStream(json.message.content);
            }
        } catch (e) {
            // Abaikan kalau chunk belum lengkap
        }
    }
}

// Contoh Penggunaan:
// sendChat("Halo 120B!", (text) => process.stdout.write(text));

module.exports = { sendChat };
