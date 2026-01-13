/**
 * GR DASH - LÓGICA DE INTERFACE E GERENCIAMENTO
 * Seções: Sidebar, Modal, Campos Dinâmicos e Grid de Registros
 */

document.addEventListener("DOMContentLoaded", () => {
    /* ================================================================
       SEÇÃO 1: SIDEBAR E NAVEGAÇÃO
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
       SEÇÃO 2: CONTROLE DO MODAL E CATEGORIAS
       ================================================================ */
    const modal = document.getElementById("modal-registro");
    const btnAbrirModal = document.querySelector(".btn-adicionar");
    const btnFecharX = document.getElementById("btn-fechar");
    const btnCancelar = document.getElementById("btn-cancelar");
    const formRegistro = document.getElementById("form-novo-registro");
    const containerCampos = document.getElementById("lista-campos-dinamicos");

    const selectCat = document.getElementById("reg-categoria-select");
    const inputNovaCat = document.getElementById("reg-categoria-nova");

    if (btnAbrirModal) {
        btnAbrirModal.addEventListener("click", () => modal.classList.add("modal-visivel"));
    }

    const fecharModal = () => {
        modal.classList.remove("modal-visivel");
        formRegistro.reset();
        containerCampos.innerHTML = ""; 
        inputNovaCat.style.display = "none";
    };

    [btnFecharX, btnCancelar].forEach((btn) => {
        if (btn) btn.addEventListener("click", fecharModal);
    });

    selectCat.addEventListener("change", () => {
        inputNovaCat.style.display = selectCat.value === "outra" ? "block" : "none";
    });

    /* ================================================================
       SEÇÃO 3: GERENCIAMENTO DE CAMPOS DINÂMICOS (EDITOR DE NOTAS)
       ================================================================ */
    const btnAddNome = document.getElementById('add-campo-nome');
    const btnAddSenha = document.getElementById('add-campo-senha');

    // Função auxiliar para inserir caracteres no cursor
    const inserirNoTexto = (textarea, prefixo, sufixo = "") => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const texto = textarea.value;
        textarea.value = texto.substring(0, start) + prefixo + texto.substring(start, end) + sufixo + texto.substring(end);
        textarea.focus();
        textarea.dispatchEvent(new Event('input')); // Dispara o redimensionamento
    };

    const adicionarNovaCaixa = (tipo) => {
        const divId = "campo-" + Date.now();
        const novoCampo = document.createElement("div");
        novoCampo.classList.add("item-campo-dinamico");
        novoCampo.id = divId;

        const label = tipo === "senha" ? "Senha / Chave Secreta" : "Nome / Nota de Texto";
        const placeholder = tipo === "senha" ? "••••••••" : "Escreva algo organizado...";

        // HTML com Toolbar para Nome/Notas
        novoCampo.innerHTML = `
            <label style="font-size: 11px; color: var(--accent-color); font-weight: 700; margin-bottom: 8px; display: block;">
                ${label}
            </label>
            <button type="button" class="btn-remover-campo" onclick="removerCaixa('${divId}')">
                <i class="fas fa-times"></i>
            </button>
            
            ${tipo === 'nome' ? `
                <div class="toolbar-editor" style="display: flex; gap: 8px; margin-bottom: 5px; background: rgba(255,255,255,0.03); padding: 5px; border-radius: 6px;">
                    <button type="button" class="btn-tool" data-char="• " title="Lista"><i class="fas fa-list-ul"></i></button>
                    <button type="button" class="btn-tool" data-char="--------------------------\n" title="Linha"><i class="fas fa-minus"></i></button>
                    <button type="button" class="btn-tool" data-char="📌 " title="Pin">📌</button>
                    <button type="button" class="btn-tool" data-char="✅ " title="Check">✅</button>
                    <button type="button" class="btn-tool" data-char="⚠️ " title="Aviso">⚠️</button>
                </div>
            ` : ''}

            <div class="campo-senha-container" style="position: relative;">
                <textarea 
                    class="textarea-dinamico input-valor-dinamico" 
                    data-tipo="${tipo}" 
                    placeholder="${placeholder}" 
                    rows="1" 
                    required 
                    style="${tipo === 'senha' ? '-webkit-text-security: disc; padding-right: 40px;' : ''}"></textarea>
                
                ${tipo === 'senha' ? `
                    <button type="button" class="btn-ver-senha" style="position: absolute; right: 10px; top: 12px; background: none; border: none; color: var(--text-muted); cursor: pointer;">
                        <i class="fas fa-eye"></i>
                    </button>
                ` : ''}
            </div>
        `;

        containerCampos.appendChild(novoCampo);
        const textarea = novoCampo.querySelector("textarea");
        
        // Ativar botões da Toolbar
        if (tipo === 'nome') {
            novoCampo.querySelectorAll('.btn-tool').forEach(btn => {
                btn.addEventListener('click', () => inserirNoTexto(textarea, btn.dataset.char));
            });
        }

        // Auto-expansão
        textarea.addEventListener("input", function () {
            this.style.height = "auto";
            this.style.height = this.scrollHeight + "px";
        });

        // Lógica do Olho
        if (tipo === 'senha') {
            const btnOlho = novoCampo.querySelector(".btn-ver-senha");
            btnOlho.addEventListener("click", () => {
                const isHidden = textarea.style.webkitTextSecurity === "disc";
                textarea.style.webkitTextSecurity = isHidden ? "none" : "disc";
                btnOlho.innerHTML = isHidden ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
            });
        }

        textarea.focus();
    };

    if (btnAddNome) btnAddNome.addEventListener('click', () => adicionarNovaCaixa('nome'));
    if (btnAddSenha) btnAddSenha.addEventListener('click', () => adicionarNovaCaixa('senha'));

    window.removerCaixa = (id) => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.style.opacity = "0";
            elemento.style.transform = "scale(0.95)";
            setTimeout(() => elemento.remove(), 200);
        }
    };

    /* ================================================================
       SEÇÃO 4: PROCESSAMENTO E RENDERIZAÇÃO
       ================================================================ */
    const gridPrincipal = document.getElementById("grid-principal");

    formRegistro.addEventListener("submit", (e) => {
        e.preventDefault();
        const servico = document.getElementById("reg-servico").value;
        const categoriaFinal = selectCat.value === "outra" ? inputNovaCat.value : selectCat.value;
        const campos = document.querySelectorAll(".input-valor-dinamico");

        if (campos.length === 0) {
            alert("Adicione pelo menos um campo de Nome ou Senha.");
            return;
        }

        campos.forEach((campo) => {
            criarCardHTML(servico, categoriaFinal, campo.value, campo.dataset.tipo);
        });

        fecharModal();
    });

    function criarCardHTML(servico, categoria, valor, tipo) {
        const novoCard = document.createElement("div");
        novoCard.className = "card-senha";

        let icone = tipo === "senha" ? "fas fa-shield-halved" : "fas fa-user-tag";
        if (valor.length > 50) icone = "fas fa-file-lines";

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

        novoCard.addEventListener("click", (e) => {
            if (!e.target.closest(".card-camada-acoes")) {
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
        });

        novoCard.querySelector(".btn-copiar-trigger").addEventListener("click", (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(valor).then(() => {
                const btn = e.target.closest(".btn-acao-card");
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copiado';
                setTimeout(() => (btn.innerHTML = originalHTML), 2000);
            });
        });

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
       SEÇÃO 5: EVENTOS DO MODAL DE VIEW
       ================================================================ */
    const modalView = document.getElementById("modal-view");
    if (modalView) {
        const fechar = () => modalView.classList.remove("modal-visivel");
        const btnFecharView = document.getElementById("btn-fechar-view");
        const btnFecharViewFooter = document.getElementById("btn-fechar-view-footer");

        if (btnFecharView) btnFecharView.addEventListener("click", fechar);
        if (btnFecharViewFooter) btnFecharViewFooter.addEventListener("click", fechar);

        modalView.addEventListener("click", (e) => {
            if (e.target === modalView) fechar();
        });
    }
});