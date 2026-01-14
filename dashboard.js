/**
 * GR DASH - LÓGICA DE INTERFACE E GERENCIAMENTO
 * Seções: 
 * 1. Sidebar e Navegação (Abas)
 * 2. Controle do Modal (Registro e View)
 * 3. Formulário (Interação e Envio Unificado)
 * 4. Renderização (Criação de Cards no Cofre)
 */

document.addEventListener("DOMContentLoaded", () => {

    /* ================================================================
       1. SIDEBAR E NAVEGAÇÃO (ABAS)
       ================================================================ */
    const sidebar = document.getElementById("sidebar");
    const btnAlternar = document.getElementById("btn-alternar");
    const itensMenu = document.querySelectorAll(".item-menu");
    const secoes = document.querySelectorAll(".secao-conteudo");

    // Controle da Sidebar
    if (btnAlternar && sidebar) {
        btnAlternar.addEventListener("click", () => {
            sidebar.classList.toggle("aberta");
            localStorage.setItem("sidebar-aberta", sidebar.classList.contains("aberta"));
        });

        if (localStorage.getItem("sidebar-aberta") === "true") {
            sidebar.classList.add("aberta");
        }
    }

    // Lógica de Troca de Abas (Cofre, Lista, Lixeira)
    itensMenu.forEach((item) => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            
            // Remove ativo de todos e adiciona ao clicado
            itensMenu.forEach((i) => i.classList.remove("ativo"));
            this.classList.add("ativo");

            // Mostra a seção correspondente ao data-secao do link
            const secaoAlvo = this.getAttribute("data-secao");
            secoes.forEach(secao => {
                secao.style.display = (secao.id === `secao-${secaoAlvo}`) ? "block" : "none";
            });
        });
    });

    /* ================================================================
       2. CONTROLE DOS MODAIS (ABRIR / FECHAR)
       ================================================================ */
    const modalReg = document.getElementById("modal-registro");
    const modalView = document.getElementById("modal-view");
    const formRegistro = document.getElementById("form-novo-registro");
    
    // Botões de fechar e cancelar
    const fecharRegistro = () => {
        modalReg.classList.remove("modal-visivel");
        formRegistro.reset();
        document.getElementById("reg-categoria-nova").style.display = "none";
    };

    const fecharView = () => modalView.classList.remove("modal-visivel");

    // Eventos de Abertura e Fechamento (Registro)
    document.querySelector(".btn-adicionar")?.addEventListener("click", () => modalReg.classList.add("modal-visivel"));
    document.getElementById("btn-fechar")?.addEventListener("click", fecharRegistro);
    document.getElementById("btn-cancelar")?.addEventListener("click", fecharRegistro);

    // Eventos de Fechamento (View)
    document.getElementById("btn-fechar-view")?.addEventListener("click", fecharView);
    document.getElementById("btn-fechar-view-footer")?.addEventListener("click", fecharView);

    // Fechar ao clicar fora da caixa
    [modalReg, modalView].forEach(m => {
        m?.addEventListener("click", (e) => { if (e.target === m) m.classList.remove("modal-visivel"); });
    });

    /* ================================================================
       3. LÓGICA DO FORMULÁRIO (INTERAÇÃO E ENVIO)
       ================================================================ */
    const btnToggleSenha = document.getElementById('toggle-senha-fixa');
    const inputSenhaFixa = document.getElementById('reg-senha');
    const textareaNotas = document.getElementById('reg-notas');
    const selectCat = document.getElementById("reg-categoria-select");
    const inputNovaCat = document.getElementById("reg-categoria-nova");

    // 3.1 Alternar visibilidade da senha no formulário
    btnToggleSenha?.addEventListener('click', (e) => {
        e.preventDefault();
        const isPassword = inputSenhaFixa.type === 'password';
        inputSenhaFixa.type = isPassword ? 'text' : 'password';
        btnToggleSenha.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });

    // 3.2 Lógica de Nova Categoria
    selectCat?.addEventListener("change", () => {
        inputNovaCat.style.display = selectCat.value === "outra" ? "block" : "none";
    });

    // 3.3 Toolbar do Editor de Notas
    document.querySelectorAll('.btn-tool').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const char = btn.getAttribute('data-char');
            const start = textareaNotas.selectionStart;
            const end = textareaNotas.selectionEnd;
            textareaNotas.value = textareaNotas.value.substring(0, start) + char + textareaNotas.value.substring(end);
            textareaNotas.focus();
            textareaNotas.selectionStart = textareaNotas.selectionEnd = start + char.length;
        });
    });

    // 3.4 SUBMIT: Envio Unificado para o Cofre
    formRegistro?.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const servico = document.getElementById("reg-servico").value;
        const categoria = selectCat.value === "outra" ? inputNovaCat.value : selectCat.value;
        const senha = inputSenhaFixa.value;
        const notas = textareaNotas.value;

        // Cria o card único na aba Cofre
        criarCardUnificado(servico, categoria, senha, notas);
        fecharRegistro();
    });

    /* ================================================================
       4. RENDERIZAÇÃO (CRIAÇÃO DE CARDS)
       ================================================================ */
    function criarCardUnificado(servico, categoria, senha, notas) {
        const gridPrincipal = document.getElementById("grid-principal");
        const novoCard = document.createElement("div");
        novoCard.className = "card-senha";
        
        // Ícone: Escudo se houver senha, caso contrário, ícone de nota
        const iconeTag = senha.trim() !== "" ? "fas fa-shield-halved" : "fas fa-file-lines";

        novoCard.innerHTML = `
            <div class="card-topo">
                <div class="servico-icone"><i class="${iconeTag}"></i></div>
                <span class="tag-categoria">${categoria}</span>
            </div>
            <div class="card-info-central">
                <span class="servico-nome">${servico}</span>
                ${senha ? `<div class="preview-texto senha-focada">••••••••••••</div>` : ''}
                ${notas ? `<div class="preview-texto notas-sutil">${notas}</div>` : ''}
            </div>
            <div class="card-camada-acoes">
                <button class="btn-acao-card btn-copiar-trigger"><i class="fas fa-copy"></i> Copiar</button>
                <button class="btn-acao-card btn-deletar-trigger"><i class="fas fa-trash-alt"></i> Excluir</button>
            </div>
        `;

        // Evento Copiar (Prioridade para Senha)
        novoCard.querySelector(".btn-copiar-trigger").addEventListener("click", (e) => {
            e.stopPropagation();
            const valor = senha || notas;
            navigator.clipboard.writeText(valor).then(() => {
                const btn = e.target.closest(".btn-acao-card");
                const original = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copiado';
                setTimeout(() => btn.innerHTML = original, 2000);
            });
        });

        // Evento Deletar
        novoCard.querySelector(".btn-deletar-trigger").addEventListener("click", (e) => {
            e.stopPropagation();
            if (confirm(`Mover "${servico}" para a lixeira?`)) {
                novoCard.style.opacity = "0";
                setTimeout(() => novoCard.remove(), 300);
            }
        });

        // Evento Visualizar Detalhes
        novoCard.addEventListener("click", (e) => {
            if (!e.target.closest(".card-camada-acoes")) {
                exibirModalView(servico, categoria, senha, notas);
            }
        });

        gridPrincipal.prepend(novoCard);
    }

    function exibirModalView(servico, categoria, senha, notas) {
        document.getElementById("view-titulo").innerText = servico;
        document.getElementById("view-tag").innerText = categoria.toUpperCase();
        
        let conteudo = "";
        if (senha.trim() !== "") conteudo += `CHAVE/SENHA: ${senha}\n\n`;
        if (notas.trim() !== "") conteudo += `NOTAS:\n${notas}`;
        
        document.getElementById("view-valor").innerText = conteudo || "Sem detalhes.";
        
        // Configura o botão copiar do modal view
        document.getElementById("btn-copiar-modal").onclick = () => {
            navigator.clipboard.writeText(senha || notas);
            const icon = document.querySelector("#btn-copiar-modal i");
            icon.className = "fas fa-check";
            setTimeout(() => icon.className = "far fa-copy", 2000);
        };

        modalView.classList.add("modal-visivel");
    }

    
});