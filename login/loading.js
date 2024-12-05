function showLoading() {
    // Verifica se já existe um elemento de loading na página para evitar duplicações
    if (!document.getElementById('loading-overlay')) {
        // Cria um novo elemento <div>
        const div = document.createElement("div");
        // Adiciona um identificador único ao <div>
        div.id = "loading-overlay";
        // Adiciona as classes "loading" e "centralize" ao <div> recém-criado
        div.classList.add("loading", "centralize");

        // Cria um novo elemento <label>
        const label = document.createElement("label");
        // Define o texto do <label> para "Carregando..."
        label.innerText = "Carregando...";

        // Adiciona o <label> como filho do <div>
        div.appendChild(label);

        // Adiciona o <div> ao final do corpo do documento (document.body)
        document.body.appendChild(div);
    }
}
