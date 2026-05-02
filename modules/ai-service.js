const aiService = {
    async query(prompt) {
        return { success: true, response: "Nemo 120B Connected, Bi idznillah", source: "nemo-120b" };
    }
};
window.aiService = aiService;
