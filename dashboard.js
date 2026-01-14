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
    m?.addEventListener("click", (e) => {
      if (e.target === m) m.classList.remove("modal-visivel");
    });
  });

  /* ================================================================
       3. LÓGICA DO FORMULÁRIO E AÇÕES DA LIXEIRA
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

  formRegistro?.addEventListener("submit", (e) => {
    e.preventDefault();
    const novoItem = {
      id: Date.now(),
      servico: document.getElementById("reg-servico").value,
      categoria: selectCat.value === "outra" ? inputNovaCat.value : selectCat.value,
      senha: inputSenhaFixa.value,
      notas: textareaNotas.value,
      local: "cofre",
    };
    salvarDadosNoBanco(novoItem);
    carregarDadosIniciais();
    fecharRegistro();
  });

  document.getElementById("btn-esvaziar-lixeira")?.addEventListener("click", () => {
    let dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
    if (!dados.some((i) => i.local === "lixeira")) return alert("A lixeira já está vazia!");
    if (confirm("Apagar TUDO da lixeira permanentemente?")) {
      dados = dados.filter((i) => i.local !== "lixeira");
      localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
      carregarDadosIniciais();
    }
  });

  document.getElementById("btn-excluir-selecionados")?.addEventListener("click", () => {
    const selecionados = document.querySelectorAll(".card-checkbox:checked");
    if (selecionados.length === 0) return alert("Selecione itens para excluir.");
    if (confirm(`Excluir ${selecionados.length} itens permanentemente?`)) {
      let dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
      selecionados.forEach((cb) => {
        const idParaRemover = Number(cb.getAttribute("data-id"));
        dados = dados.filter((item) => item.id !== idParaRemover);
      });
      localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
      carregarDadosIniciais();
    }
  });

  /* ================================================================
       4. PERSISTÊNCIA E FUNÇÕES DE APOIO
       ================================================================ */
  function salvarDadosNoBanco(objeto) {
    const dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
    dados.push(objeto);
    localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
  }

  function removerDadosNoBanco(id) {
    let dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
    dados = dados.filter((item) => item.id !== id);
    localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
    carregarDadosIniciais();
  }

  function moverParaLocal(id, novoLocal) {
    let dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
    const index = dados.findIndex((item) => item.id === id);
    if (index !== -1) {
      dados[index].local = novoLocal;
      localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
      carregarDadosIniciais();
    }
  }

  function atualizarContadorLixeira() {
    const grid = document.getElementById("grid-lixeira");
    if (!grid) return;
    const total = grid.querySelectorAll(".card-senha").length;
    const sel = grid.querySelectorAll(".card-checkbox:checked").length;
    const el = document.getElementById("contador-lixeira");
    if (el) el.innerText = sel > 0 ? `${sel} de ${total} selecionados` : `${total} itens`;
  }

  /* ================================================================
       5. RENDERIZAÇÃO (CARDS E TABELA)
       ================================================================ */
  function criarCardUnificado(item) {
    const { id, servico, categoria, senha, notas, local } = item;
    const gridDestino = document.getElementById(local === "lixeira" ? "grid-lixeira" : "grid-principal");
    if (!gridDestino) return;

    const novoCard = document.createElement("div");
    novoCard.className = "card-senha";
    const temSenha = senha && senha.trim() !== "";
    const temNota = notas && notas.trim() !== "";

    let statusTipo = temSenha && temNota ? "status-misto" : temSenha ? "status-senha" : "status-nota";
    let iconeClass = temSenha && temNota ? "fas fa-vault" : temSenha ? "fas fa-lock" : "fas fa-sticky-note";

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
        <button class="btn-acao-card btn-mover-trigger" title="${local === "lixeira" ? "Restaurar" : "Enviar para Lista"}">
          <i class="${local === "lixeira" ? "fas fa-undo" : "fas fa-list-ul"}"></i>
        </button>
        <button class="btn-acao-card btn-deletar-trigger" title="Excluir"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;

    novoCard.querySelector(".btn-copiar-trigger").addEventListener("click", (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(senha || notas);
      e.currentTarget.querySelector("i").className = "fas fa-check";
      setTimeout(() => (e.currentTarget.querySelector("i").className = "fas fa-copy"), 1000);
    });

    novoCard.querySelector(".btn-mover-trigger").addEventListener("click", (e) => {
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
        exibirModalView(id, servico, categoria, senha, notas);
      }
    });

    gridDestino.prepend(novoCard);
  }

  function criarLinhaTabela(item) {
    const corpoTabela = document.getElementById("corpo-tabela-lista");
    if (!corpoTabela) return;
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><div class="col-servico"><div class="servico-icone status-misto" style="width: 28px; height: 28px; font-size: 12px;"><i class="fas fa-globe"></i></div>${item.servico}</div></td>
        <td><span class="tag-categoria">${item.categoria}</span></td>
        <td><span class="col-senha-code">${item.senha ? "••••••••" : "---"}</span></td>
        <td><div class="col-notas-preview">${item.notas || "<em>Sem notas</em>"}</div></td>
        <td style="text-align: right;"><div class="acoes-tabela">
          <button class="btn-tabela btn-copiar-lista"><i class="fas fa-copy"></i></button>
          <button class="btn-tabela btn-excluir-lista" style="color: #ff4d4d"><i class="fas fa-trash-alt"></i></button>
        </div></td>
    `;
    tr.querySelector(".btn-copiar-lista").addEventListener("click", (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(item.senha || item.notas || "");
      alert("Copiado!");
    });
    tr.querySelector(".btn-excluir-lista").addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm("Mover para lixeira?")) moverParaLocal(item.id, "lixeira");
    });
    tr.addEventListener("click", () => exibirModalView(item.id, item.servico, item.categoria, item.senha, item.notas));
    corpoTabela.appendChild(tr);
  }

  function carregarDadosIniciais() {
    const dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
    const gridPrincipal = document.getElementById("grid-principal");
    const gridLixeira = document.getElementById("grid-lixeira");
    const corpoTabela = document.getElementById("corpo-tabela-lista");
    const placeholderLista = document.getElementById("lista-vazia-placeholder");
    const tabelaElemento = document.querySelector(".tabela-moderna");

    if (gridPrincipal) gridPrincipal.innerHTML = "";
    if (gridLixeira) gridLixeira.innerHTML = "";
    if (corpoTabela) corpoTabela.innerHTML = "";

    const itensLista = dados.filter((i) => i.local === "lista");
    if (placeholderLista && tabelaElemento) {
      placeholderLista.style.display = itensLista.length === 0 ? "block" : "none";
      tabelaElemento.style.display = itensLista.length === 0 ? "none" : "table";
    }

    dados.forEach((item) => {
      if (item.local === "lista") { criarLinhaTabela(item); } 
      else { criarCardUnificado(item); }
    });
    atualizarContadorLixeira();
  }

  /* ================================================================
       6. VISUALIZAÇÃO E EDIÇÃO (LÓGICA REFEITA)
       ================================================================ */
  function exibirModalView(id, servico, categoria, senha, notas) {
    const viewValorBox = document.querySelector(".view-valor-box");
    const viewValorElemento = document.getElementById("view-valor");
    const modalView = document.getElementById("modal-view");

    document.getElementById("view-titulo").innerText = servico;
    document.getElementById("view-tag").innerText = categoria.toUpperCase();
    
    // Define o texto inicial
    const textoInicial = senha || notas || "";
    viewValorElemento.innerText = textoInicial || "Clique para adicionar...";
    
    modalView.classList.add("modal-visivel");

    // Limpa eventos antigos da caixa inteira para não duplicar prompts
    const novaBox = viewValorBox.cloneNode(true);
    viewValorBox.parentNode.replaceChild(novaBox, viewValorBox);

    // Adiciona evento na BOX (fica mais fácil de clicar)
    novaBox.style.cursor = "pointer";
    novaBox.addEventListener("click", (e) => {
        // Se clicar no botão de copiar, não abre o prompt
        if (e.target.closest("#btn-copiar-modal")) return;

        const valorAtual = novaBox.querySelector("#view-valor").innerText;
        const inputEditar = (valorAtual === "Clique para adicionar...") ? "" : valorAtual;
        
        const novoTexto = prompt(`Editar ${servico}:`, inputEditar);
        
        if (novoTexto !== null) {
            salvarEdicaoNoBanco(id, novoTexto);
        }
    });

    // Reatribui o clique do botão de copiar (já que clonamos a box)
    novaBox.querySelector("#btn-copiar-modal").onclick = (e) => {
      e.stopPropagation();
      const texto = novaBox.querySelector("#view-valor").innerText;
      navigator.clipboard.writeText(texto);
      const icon = novaBox.querySelector("#btn-copiar-modal i");
      icon.className = "fas fa-check";
      setTimeout(() => (icon.className = "far fa-copy"), 1000);
    };
  }

  function salvarEdicaoNoBanco(id, novoTexto) {
    let dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
    const index = dados.findIndex(i => i.id === id);

    if (index !== -1) {
        // Lógica: Se o item já tinha senha, edita a senha. Caso contrário, edita notas.
        if (dados[index].senha) {
            dados[index].senha = novoTexto;
        } else {
            dados[index].notas = novoTexto;
        }

        localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
        carregarDadosIniciais(); // Recarrega a interface
        document.getElementById("modal-view").classList.remove("modal-visivel");
        alert("Alteração salva!");
    }
  }

  carregarDadosIniciais();
});