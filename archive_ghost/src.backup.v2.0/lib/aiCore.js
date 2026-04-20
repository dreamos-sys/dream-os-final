export const aiAgent = {
  mode: 'hybrid',
  async initLocal() {
    console.log("Initializing 256KB Nano AI (WASM)...");
    return "Local Qwen WASM Ready";
  },
  async ask(prompt) {
    return "[HYBRID-AI] Processing: " + prompt;
  }
};
