/**
 * GR DASH - LÓGICA DE INTERFACE E GERENCIAMENTO
 * Seções: 
 * 1. Sidebar e Navegação
 * 2. Controle do Modal
 * 3. Formulário (Senha, Editor de Notas e Envio Unificado)
 * 4. Grid de Registros (Cards Unificados)
 * 5. Visualização de Detalhes (View)
 */

document.addEventListener("DOMContentLoaded", () => {

    /* ================================================================
       1. SIDEBAR E NAVEGAÇÃO
       ================================================================ */
    const sidebar = document.getElementById("sidebar");
    const btnAlternar = document.getElementById("btn-alternar");
    const itensMenu = document.querySelectorAll(".item-menu");

    if (btnAlternar && sidebar) {
        btnAlternar.addEventListener("click", () => {
            sidebar.classList.toggle("aberta");
            localStorage.setItem("sidebar-aberta", sidebar.classList.contains("aberta"));
        });

        if (localStorage.getItem("sidebar-aberta") === "true") {
            sidebar.classList.add("aberta");
        }
    }

    itensMenu.forEach((item) => {
        item.addEventListener("click", function () {
            itensMenu.forEach((i) => i.classList.remove("ativo"));
            this.classList.add("ativo");
        });
    });

    /* ================================================================
       2. CONTROLE DO MODAL (ABRIR/FECHAR)
       ================================================================ */
    const modal = document.getElementById("modal-registro");
    const btnAbrirModal = document.querySelector(".btn-adicionar");
    const btnFecharX = document.getElementById("btn-fechar");
    const btnCancelar = document.getElementById("btn-cancelar");
    const formRegistro = document.getElementById("form-novo-registro");

    const selectCat = document.getElementById("reg-categoria-select");
    const inputNovaCat = document.getElementById("reg-categoria-nova");

    const abrirModal = () => modal.classList.add("modal-visivel");
    
    const fecharModal = () => {
        modal.classList.remove("modal-visivel");
        formRegistro.reset();
        if (inputNovaCat) inputNovaCat.style.display = "none";
    };

    if (btnAbrirModal) btnAbrirModal.addEventListener("click", abrirModal);

    [btnFecharX, btnCancelar].forEach((btn) => {
        if (btn) btn.addEventListener("click", fecharModal);
    });

    if (selectCat) {
        selectCat.addEventListener("change", () => {
            inputNovaCat.style.display = selectCat.value === "outra" ? "block" : "none";
        });
    }

    /* ================================================================
       3. LÓGICA DO FORMULÁRIO (SENHA, NOTAS E ENVIO UNIFICADO)
       ================================================================ */
    const btnToggleSenha = document.getElementById('toggle-senha-fixa');
    const inputSenhaFixa = document.getElementById('reg-senha');
    const textareaNotas = document.getElementById('reg-notas');
    const toolbarNotas = document.getElementById('toolbar-notas-fixa');

    // 3.1 Alternar visibilidade da senha
    if (btnToggleSenha && inputSenhaFixa) {
        btnToggleSenha.addEventListener('click', (e) => {
            e.preventDefault();
            const isPassword = inputSenhaFixa.type === 'password';
            inputSenhaFixa.type = isPassword ? 'text' : 'password';
            btnToggleSenha.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
        });
    }

    // 3.2 Editor de Notas (Emoji/Linhas)
    if (toolbarNotas && textareaNotas) {
        toolbarNotas.querySelectorAll('.btn-tool').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const char = btn.getAttribute('data-char');
                const start = textareaNotas.selectionStart;
                const end = textareaNotas.selectionEnd;
                const textoOriginal = textareaNotas.value;

                textareaNotas.value = textoOriginal.substring(0, start) + char + textoOriginal.substring(end);
                textareaNotas.focus();
                textareaNotas.selectionStart = textareaNotas.selectionEnd = start + char.length;
            });
        });
    }

    // 3.3 SUBMIT: Agora cria APENAS UM card com todas as informações
    if (formRegistro) {
        formRegistro.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const servico = document.getElementById("reg-servico").value;
            const categoria = selectCat.value === "outra" ? inputNovaCat.value : selectCat.value;
            const senha = inputSenhaFixa.value; // Não é mais obrigatória
            const notas = textareaNotas.value;

            // Envia tudo para uma única função de criação
            criarCardHTML(servico, categoria, senha, notas);

            fecharModal();
        });
    }

    /* ================================================================
       4. RENDERIZAÇÃO DO CARD UNIFICADO
       ================================================================ */
    const gridPrincipal = document.getElementById("grid-principal");

    function criarCardHTML(servico, categoria, senha, notas) {
        const novoCard = document.createElement("div");
        novoCard.className = "card-senha";

        // Ícone: Prioriza escudo se houver senha, caso contrário ícone de texto
        let icone = senha.trim() !== "" ? "fas fa-shield-halved" : "fas fa-file-lines";

        novoCard.innerHTML = `
            <div class="card-topo">
                <div class="servico-icone"><i class="${icone}"></i></div>
                <span class="tag-categoria">${categoria}</span>
            </div>
            <div class="card-info-central">
                <span class="servico-nome">${servico}</span>
                ${senha.trim() !== "" ? `<div class="preview-texto" style="color:var(--accent-color)">••••••••••••</div>` : ""}
                ${notas.trim() !== "" ? `<div class="preview-texto notas-preview">${notas}</div>` : ""}
            </div>
            <div class="card-camada-acoes">
                <button class="btn-acao-card btn-copiar-trigger"><i class="fas fa-copy"></i> Copiar</button>
                <button class="btn-acao-card btn-deletar-trigger"><i class="fas fa-trash-alt"></i> Excluir</button>
            </div>
        `;

        // Lógica de Copiar: Prioriza a senha, se não houver, copia as notas
        novoCard.querySelector(".btn-copiar-trigger").addEventListener("click", (e) => {
            e.stopPropagation();
            const valorCopiar = senha.trim() !== "" ? senha : notas;
            
            navigator.clipboard.writeText(valorCopiar).then(() => {
                const btn = e.target.closest(".btn-acao-card");
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copiado';
                setTimeout(() => (btn.innerHTML = originalHTML), 2000);
            });
        });

        // Clique no card para ver detalhes
        novoCard.addEventListener("click", (e) => {
            if (!e.target.closest(".card-camada-acoes")) {
                exibirModalView(servico, categoria, senha, notas);
            }
        });

        // Deletar
        novoCard.querySelector(".btn-deletar-trigger").addEventListener("click", (e) => {
            e.stopPropagation();
            if (confirm(`Excluir o registro "${servico}"?`)) {
                novoCard.style.opacity = "0";
                novoCard.style.transform = "scale(0.9)";
                setTimeout(() => novoCard.remove(), 300);
            }
        });

        gridPrincipal.prepend(novoCard);
    }

    /* ================================================================
       5. MODAL DE VISUALIZAÇÃO (VIEW)
       ================================================================ */
    function exibirModalView(servico, categoria, senha, notas) {
        const modalView = document.getElementById("modal-view");
        if (!modalView) return;

        document.getElementById("view-titulo").innerText = servico;
        document.getElementById("view-tag").innerText = categoria.toUpperCase();
        
        // Formata o conteúdo para exibição no Modal de View
        let infoExibir = "";
        if (senha.trim() !== "") infoExibir += `CHAVE/SENHA: ${senha}\n\n`;
        if (notas.trim() !== "") infoExibir += `NOTAS:\n${notas}`;
        if (infoExibir === "") infoExibir = "Sem detalhes adicionais.";

        document.getElementById("view-valor").innerText = infoExibir;

        const btnCopiarModal = document.getElementById("btn-copiar-modal");
        btnCopiarModal.onclick = (e) => {
            e.preventDefault();
            const valorCopiar = senha.trim() !== "" ? senha : notas;
            navigator.clipboard.writeText(valorCopiar);
            const icon = btnCopiarModal.querySelector("i");
            icon.className = "fas fa-check";
            setTimeout(() => (icon.className = "far fa-copy"), 2000);
        };

        modalView.classList.add("modal-visivel");
    }

    // Fechar Modal View
    const modalView = document.getElementById("modal-view");
    if (modalView) {
        const fecharV = () => modalView.classList.remove("modal-visivel");
        document.getElementById("btn-fechar-view")?.addEventListener("click", fecharV);
        document.getElementById("btn-fechar-view-footer")?.addEventListener("click", fecharV);
        modalView.addEventListener("click", (e) => { if (e.target === modalView) fecharV(); });
    }
});