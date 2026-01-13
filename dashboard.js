/**
 * GR DASH - LÓGICA DE INTERFACE E GERENCIAMENTO
 * Seções: 1. Sidebar, 2. Modal Controle, 3. Formulário Fixo, 4. Renderização Grid
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

    // Lógica de "Nova Categoria"
    if (selectCat) {
        selectCat.addEventListener("change", () => {
            inputNovaCat.style.display = selectCat.value === "outra" ? "block" : "none";
        });
    }

    /* ================================================================
       3. LÓGICA DO FORMULÁRIO (SENHA E NOTAS)
       ================================================================ */
    const btnToggleSenha = document.getElementById('toggle-senha-fixa');
    const inputSenhaFixa = document.getElementById('reg-senha');

    // Alternar visibilidade da senha
    if (btnToggleSenha && inputSenhaFixa) {
        btnToggleSenha.addEventListener('click', () => {
            const isPassword = inputSenhaFixa.type === 'password';
            inputSenhaFixa.type = isPassword ? 'text' : 'password';
            btnToggleSenha.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
        });
    }

    // Processar envio do formulário
    if (formRegistro) {
        formRegistro.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const servico = document.getElementById("reg-servico").value;
            const categoria = selectCat.value === "outra" ? inputNovaCat.value : selectCat.value;
            const senha = inputSenhaFixa.value;
            const notas = document.getElementById("reg-notas").value;

            // 1. Cria o card da Senha
            criarCardHTML(servico, categoria, senha, "senha");
            
            // 2. Cria o card de Notas (opcional, se houver texto)
            if (notas.trim() !== "") {
                criarCardHTML(servico, categoria, notas, "nome");
            }

            fecharModal();
        });
    }

    /* ================================================================
       4. RENDERIZAÇÃO E AÇÕES DO GRID
       ================================================================ */
    const gridPrincipal = document.getElementById("grid-principal");

    function criarCardHTML(servico, categoria, valor, tipo) {
        const novoCard = document.createElement("div");
        novoCard.className = "card-senha";

        // Define ícone baseado no tipo ou tamanho do texto
        let icone = tipo === "senha" ? "fas fa-shield-halved" : "fas fa-file-lines";

        novoCard.innerHTML = `
            <div class="card-topo">
                <div class="servico-icone"><i class="${icone}"></i></div>
                <span class="tag-categoria">${categoria}</span>
            </div>
            <div class="card-info-central">
                <span class="servico-nome">${servico}</span>
                <div class="preview-texto">${tipo === "senha" ? "••••••••••••" : valor}</div>
            </div>
            <div class="card-camada-acoes">
                <button class="btn-acao-card btn-copiar-trigger"><i class="fas fa-copy"></i> Copiar</button>
                <button class="btn-acao-card btn-deletar-trigger"><i class="fas fa-trash-alt"></i> Excluir</button>
            </div>
        `;

        // Evento de Visualizar Detalhes
        novoCard.addEventListener("click", (e) => {
            if (!e.target.closest(".card-camada-acoes")) {
                exibirModalView(servico, categoria, valor);
            }
        });

        // Evento de Copiar
        novoCard.querySelector(".btn-copiar-trigger").addEventListener("click", (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(valor).then(() => {
                const btn = e.target.closest(".btn-acao-card");
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copiado';
                setTimeout(() => (btn.innerHTML = originalHTML), 2000);
            });
        });

        // Evento de Deletar
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
    function exibirModalView(servico, categoria, valor) {
        const modalView = document.getElementById("modal-view");
        if (!modalView) return;

        document.getElementById("view-titulo").innerText = servico;
        document.getElementById("view-tag").innerText = categoria.toUpperCase();
        document.getElementById("view-valor").innerText = valor;

        const btnCopiarModal = document.getElementById("btn-copiar-modal");
        btnCopiarModal.onclick = () => {
            navigator.clipboard.writeText(valor);
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