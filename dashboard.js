/**
 * GR DASH - LÓGICA DE INTERFACE E GERENCIAMENTO
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
    if (localStorage.getItem("sidebar-aberta") === "true") sidebar.classList.add("aberta");
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
       2. CONTROLE DOS MODAIS
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
    m?.addEventListener("click", (e) => { if (e.target === m) m.classList.remove("modal-visivel"); });
  });

  /* ================================================================
       3. LÓGICA DO FORMULÁRIO E AÇÕES
       ================================================================ */
  const inputSenhaFixa = document.getElementById("reg-senha");
  const textareaNotas = document.getElementById("reg-notas");
  const selectCat = document.getElementById("reg-categoria-select");
  const inputNovaCat = document.getElementById("reg-categoria-nova");

  document.getElementById("toggle-senha-fixa")?.addEventListener("click", (e) => {
    e.preventDefault();
    const isPassword = inputSenhaFixa.type === "password";
    inputSenhaFixa.type = isPassword ? "text" : "password";
    e.currentTarget.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
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
    const novoItem = {
      id: Date.now(), // ID ÚNICO PARA EVITAR BUG DE NOMES IGUAIS
      servico: document.getElementById("reg-servico").value,
      categoria: selectCat.value === "outra" ? inputNovaCat.value : selectCat.value,
      senha: inputSenhaFixa.value,
      notas: textareaNotas.value,
      local: "cofre"
    };
    salvarDadosNoBanco(novoItem);
    carregarDadosIniciais();
    fecharRegistro();
  });

  document.getElementById("btn-esvaziar-lixeira")?.addEventListener("click", () => {
    let dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
    if (!dados.some(i => i.local === "lixeira")) return alert("A lixeira já está vazia!");
    if (confirm("Apagar TUDO da lixeira permanentemente?")) {
      dados = dados.filter(i => i.local !== "lixeira");
      localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
      carregarDadosIniciais();
    }
  });

  document.getElementById("btn-excluir-selecionados")?.addEventListener("click", () => {
    const selecionados = document.querySelectorAll(".card-checkbox:checked");
    if (selecionados.length === 0) return alert("Selecione ao menos um card.");
    if (confirm(`Excluir ${selecionados.length} itens permanentemente?`)) {
      let dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
      selecionados.forEach(cb => {
        const id = Number(cb.getAttribute("data-id"));
        dados = dados.filter(item => item.id !== id);
      });
      localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
      carregarDadosIniciais();
    }
  });

  /* ================================================================
       4. RENDERIZAÇÃO DE CARDS
       ================================================================ */
  function criarCardUnificado(item) {
    const { id, servico, categoria, senha, notas, local } = item;
    let gridId = local === "lista" ? "grid-lista" : (local === "lixeira" ? "grid-lixeira" : "grid-principal");
    const gridDestino = document.getElementById(gridId);
    if (!gridDestino) return;

    const novoCard = document.createElement("div");
    novoCard.className = "card-senha";
    const temSenha = senha && senha.trim() !== "";
    const temNota = notas && notas.trim() !== "";
    let statusTipo = temSenha && temNota ? "status-misto" : (temSenha ? "status-senha" : "status-nota");
    let iconeClass = temSenha && temNota ? "fas fa-vault" : (temSenha ? "fas fa-lock" : "fas fa-sticky-note");

    novoCard.innerHTML = `
      ${local === "lixeira" ? `<div class="card-checkbox-container"><input type="checkbox" class="card-checkbox" data-id="${id}" onclick="event.stopPropagation(); atualizarContadorLixeira();"></div>` : ""}
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
        <button class="btn-acao-card btn-importar-trigger" title="${local === "lixeira" ? "Restaurar" : "Mover para Lista"}">
          <i class="${local === "lixeira" ? "fas fa-undo" : "fas fa-arrow-right-to-bracket"}"></i>
        </button>
        <button class="btn-acao-card btn-deletar-trigger" title="Excluir"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;

    novoCard.querySelector(".btn-copiar-trigger").addEventListener("click", (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(senha || notas);
      const icon = e.currentTarget.querySelector("i");
      icon.className = "fas fa-check";
      setTimeout(() => icon.className = "fas fa-copy", 1000);
    });

    novoCard.querySelector(".btn-importar-trigger").addEventListener("click", (e) => {
      e.stopPropagation();
      moverParaLocal(id, local === "lixeira" ? "cofre" : "lista");
    });

    novoCard.querySelector(".btn-deletar-trigger").addEventListener("click", (e) => {
      e.stopPropagation();
      if (local === "lixeira") {
        if (confirm(`Apagar permanentemente?`)) removerDadosNoBanco(id);
      } else {
        if (confirm(`Mover para a lixeira?`)) moverParaLocal(id, "lixeira");
      }
    });

    novoCard.addEventListener("click", (e) => {
      if (!e.target.closest(".card-camada-acoes") && !e.target.closest(".card-checkbox")) {
        exibirModalView(servico, categoria, senha, notas);
      }
    });

    gridDestino.prepend(novoCard);
  }

  /* ================================================================
       5. PERSISTÊNCIA E LOGICA DE DADOS
       ================================================================ */
  function salvarDadosNoBanco(objeto) {
    const dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
    dados.push(objeto);
    localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
  }

  function removerDadosNoBanco(id) {
    let dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
    dados = dados.filter(item => item.id !== id);
    localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
    carregarDadosIniciais();
  }

  function moverParaLocal(id, novoLocal) {
    let dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
    const index = dados.findIndex(item => item.id === id);
    if (index !== -1) {
      dados[index].local = novoLocal;
      localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
      carregarDadosIniciais();
    }
  }

  function carregarDadosIniciais() {
    const dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
    ["grid-principal", "grid-lista", "grid-lixeira"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = (id === "grid-lixeira" && !dados.some(i => i.local === "lixeira")) ? '<div style="padding: 40px; text-align: center; width: 100%; grid-column: 1 / -1;"><i class="fas fa-trash-alt" style="font-size: 50px; color: var(--border-color); margin-bottom: 20px;"></i><h2 style="color: var(--text-muted);">Lixeira vazia</h2></div>' : "";
    });
    dados.forEach(item => criarCardUnificado(item));
    atualizarContadorLixeira();
  }

  function exibirModalView(servico, categoria, senha, notas) {
    document.getElementById("view-titulo").innerText = servico;
    document.getElementById("view-tag").innerText = categoria.toUpperCase();
    let conteudo = (senha ? `CHAVE/SENHA: ${senha}\n\n` : "") + (notas ? `NOTAS:\n${notas}` : "");
    document.getElementById("view-valor").innerText = conteudo || "Sem detalhes.";
    document.getElementById("modal-view").classList.add("modal-visivel");
    document.getElementById("btn-copiar-modal").onclick = () => {
      navigator.clipboard.writeText(senha || notas);
      const icon = document.querySelector("#btn-copiar-modal i");
      icon.className = "fas fa-check";
      setTimeout(() => icon.className = "far fa-copy", 1000);
    };
  }

  function atualizarContadorLixeira() {
    const grid = document.getElementById("grid-lixeira");
    if (!grid) return;
    const total = grid.querySelectorAll(".card-senha").length;
    const sel = grid.querySelectorAll(".card-checkbox:checked").length;
    const el = document.getElementById("contador-lixeira");
    if (el) el.innerText = sel > 0 ? `${sel} de ${total} selecionados` : `${total} itens`;
  }

  carregarDadosIniciais();
});