/**
 * GR DASH - LÓGICA DE INTERFACE E GERENCIAMENTO
 * Seções:
 * 1. Sidebar e Navegação (Abas)
 * 2. Controle do Modal (Registro e View)
 * 3. Formulário (Interação e Envio Unificado)
 * 4. Renderização e Persistência (Cards e LocalStorage)
 * 5. Funções de Apoio ao Banco de Dados
 */

document.addEventListener("DOMContentLoaded", () => {

    /* ================================================================
       1. SIDEBAR E NAVEGAÇÃO (ABAS)
       ================================================================ */
    const sidebar = document.getElementById("sidebar");
    const btnAlternar = document.getElementById("btn-alternar");
    const itensMenu = document.querySelectorAll(".item-menu");
    const secoes = document.querySelectorAll(".secao-conteudo");

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
        item.addEventListener("click", function (e) {
            e.preventDefault();
            itensMenu.forEach((i) => i.classList.remove("ativo"));
            this.classList.add("ativo");

            const secaoAlvo = this.getAttribute("data-secao");
            secoes.forEach((secao) => {
                secao.style.display = secao.id === `secao-${secaoAlvo}` ? "block" : "none";
            });
        });
    });

    /* ================================================================
       2. CONTROLE DOS MODAIS (ABRIR / FECHAR)
       ================================================================ */
    const modalReg = document.getElementById("modal-registro");
    const modalView = document.getElementById("modal-view");
    const formRegistro = document.getElementById("form-novo-registro");

    const fecharRegistro = () => {
        modalReg.classList.remove("modal-visivel");
        formRegistro.reset();
        document.getElementById("reg-categoria-nova").style.display = "none";
    };

    const fecharView = () => modalView.classList.remove("modal-visivel");

    document.querySelector(".btn-adicionar")?.addEventListener("click", () => modalReg.classList.add("modal-visivel"));
    document.getElementById("btn-fechar")?.addEventListener("click", fecharRegistro);
    document.getElementById("btn-cancelar")?.addEventListener("click", fecharRegistro);
    document.getElementById("btn-fechar-view")?.addEventListener("click", fecharView);
    document.getElementById("btn-fechar-view-footer")?.addEventListener("click", fecharView);

    [modalReg, modalView].forEach((m) => {
        m?.addEventListener("click", (e) => {
            if (e.target === m) m.classList.remove("modal-visivel");
        });
    });

    /* ================================================================
       3. LÓGICA DO FORMULÁRIO (INTERAÇÃO E ENVIO)
       ================================================================ */
    const btnToggleSenha = document.getElementById("toggle-senha-fixa");
    const inputSenhaFixa = document.getElementById("reg-senha");
    const textareaNotas = document.getElementById("reg-notas");
    const selectCat = document.getElementById("reg-categoria-select");
    const inputNovaCat = document.getElementById("reg-categoria-nova");

    btnToggleSenha?.addEventListener("click", (e) => {
        e.preventDefault();
        const isPassword = inputSenhaFixa.type === "password";
        inputSenhaFixa.type = isPassword ? "text" : "password";
        btnToggleSenha.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });

    selectCat?.addEventListener("change", () => {
        inputNovaCat.style.display = selectCat.value === "outra" ? "block" : "none";
    });

    document.querySelectorAll(".btn-tool").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const char = btn.getAttribute("data-char");
            const start = textareaNotas.selectionStart;
            const end = textareaNotas.selectionEnd;
            textareaNotas.value = textareaNotas.value.substring(0, start) + char + textareaNotas.value.substring(end);
            textareaNotas.focus();
            textareaNotas.selectionStart = textareaNotas.selectionEnd = start + char.length;
        });
    });

    formRegistro?.addEventListener("submit", (e) => {
        e.preventDefault();
        const servico = document.getElementById("reg-servico").value;
        const categoria = selectCat.value === "outra" ? inputNovaCat.value : selectCat.value;
        const senha = inputSenhaFixa.value;
        const notas = textareaNotas.value;

        criarCardUnificado(servico, categoria, senha, notas);
        fecharRegistro();
    });

    /* ================================================================
       4. RENDERIZAÇÃO E PERSISTÊNCIA (CARDS E LOCALSTORAGE)
       ================================================================ */
    function criarCardUnificado(servico, categoria, senha, notas, deveSalvar = true) {
        const gridPrincipal = document.getElementById("grid-principal");
        if (!gridPrincipal) return;

        const novoCard = document.createElement("div");
        novoCard.className = "card-senha";

        // Lógica de Ícones Dinâmicos
        const temSenha = senha && senha.trim() !== "";
        const temNota = notas && notas.trim() !== "";
        let iconeClass = temSenha ? "fas fa-lock" : "fas fa-sticky-note";
        let statusTipo = temSenha ? "status-senha" : "status-nota";
        if (temSenha && temNota) { iconeClass = "fas fa-vault"; statusTipo = "status-misto"; }

        novoCard.innerHTML = `
            <div class="card-topo">
                <div class="servico-icone ${statusTipo}"><i class="${iconeClass}"></i></div>
                <span class="tag-categoria">${categoria}</span>
            </div>
            <div class="card-info-central">
                <span class="servico-nome">${servico}</span>
                ${temSenha ? `<div class="senha-focada">••••••••</div>` : `<div class="preview-texto notas-sutil">${notas}</div>`}
            </div>
            <div class="card-camada-acoes">
                <button class="btn-acao-card btn-copiar-trigger" title="Copiar"><i class="fas fa-copy"></i></button>
                <button class="btn-acao-card btn-importar-trigger" title="Mover para Lista"><i class="fas fa-arrow-right-to-bracket"></i></button>
                <button class="btn-acao-card btn-deletar-trigger" title="Excluir"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;

        // Eventos dos botões do card
        novoCard.querySelector(".btn-copiar-trigger").addEventListener("click", (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(senha || notas);
            const icon = e.currentTarget.querySelector("i");
            icon.className = "fas fa-check";
            setTimeout(() => icon.className = "fas fa-copy", 1000);
        });

        novoCard.querySelector(".btn-importar-trigger").addEventListener("click", (e) => {
            e.stopPropagation();
            moverParaLista(servico, novoCard);
        });

        novoCard.querySelector(".btn-deletar-trigger").addEventListener("click", (e) => {
            e.stopPropagation();
            if (confirm(`Excluir "${servico}" permanentemente?`)) {
                removerDados(servico);
                novoCard.remove();
            }
        });

        novoCard.addEventListener("click", (e) => {
            if (!e.target.closest(".card-camada-acoes")) {
                exibirModalView(servico, categoria, senha, notas);
            }
        });

        if (deveSalvar) {
            salvarDados({ servico, categoria, senha, notas, local: 'cofre' });
        }

        gridPrincipal.prepend(novoCard);
    }

    /* ================================================================
       5. FUNÇÕES DE APOIO AO BANCO DE DADOS (LOCALSTORAGE)
       ================================================================ */
    function salvarDados(objeto) {
        const dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
        dados.push(objeto);
        localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
    }

    function carregarDadosIniciais() {
        const dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
        dados.forEach(item => {
            if (item.local === 'cofre') {
                criarCardUnificado(item.servico, item.categoria, item.senha, item.notas, false);
            }
        });
    }

    function removerDados(nome) {
        let dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
        dados = dados.filter(item => item.servico !== nome);
        localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
    }

    function moverParaLista(nome, cardElemento) {
        let dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
        const index = dados.findIndex(item => item.servico === nome);
        
        if (index !== -1) {
            dados[index].local = 'lista';
            localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
            
            cardElemento.style.transform = "translateX(100px)";
            cardElemento.style.opacity = "0";
            setTimeout(() => {
                cardElemento.remove();
                alert(`"${nome}" movido para a seção Lista!`);
            }, 300);
        }
    }

    function exibirModalView(servico, categoria, senha, notas) {
        document.getElementById("view-titulo").innerText = servico;
        document.getElementById("view-tag").innerText = categoria.toUpperCase();
        
        let conteudo = "";
        if (senha.trim() !== "") conteudo += `CHAVE/SENHA: ${senha}\n\n`;
        if (notas.trim() !== "") conteudo += `NOTAS:\n${notas}`;
        
        document.getElementById("view-valor").innerText = conteudo || "Sem detalhes.";
        document.getElementById("modal-view").classList.add("modal-visivel");
        
        document.getElementById("btn-copiar-modal").onclick = () => {
            navigator.clipboard.writeText(senha || notas);
            const icon = document.querySelector("#btn-copiar-modal i");
            icon.className = "fas fa-check";
            setTimeout(() => icon.className = "far fa-copy", 1000);
        };
    }

    // Carregar dados salvos ao iniciar
    carregarDadosIniciais();

});