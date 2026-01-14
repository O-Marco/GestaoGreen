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
      localStorage.setItem(
        "sidebar-aberta",
        sidebar.classList.contains("aberta")
      );
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
        secao.style.display =
          secao.id === `secao-${secaoAlvo}` ? "block" : "none";
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

  document
    .querySelector(".btn-adicionar")
    ?.addEventListener("click", () => modalReg.classList.add("modal-visivel"));
  document
    .getElementById("btn-fechar")
    ?.addEventListener("click", fecharRegistro);
  document
    .getElementById("btn-cancelar")
    ?.addEventListener("click", fecharRegistro);
  document
    .getElementById("btn-fechar-view")
    ?.addEventListener("click", fecharView);
  document
    .getElementById("btn-fechar-view-footer")
    ?.addEventListener("click", fecharView);

  [modalReg, modalView].forEach((m) => {
    m?.addEventListener("click", (e) => {
      if (e.target === m) m.classList.remove("modal-visivel");
    });
  });

  /* ================================================================
       3. LÓGICA DO FORMULÁRIO E AÇÕES DA LIXEIRA
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
    btnToggleSenha.innerHTML = isPassword
      ? '<i class="fas fa-eye-slash"></i>'
      : '<i class="fas fa-eye"></i>';
  });

  selectCat?.addEventListener("change", () => {
    inputNovaCat.style.display = selectCat.value === "outra" ? "block" : "none";
  });

  // Barra de ferramentas das notas
  document.querySelectorAll(".btn-tool").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const char = btn.getAttribute("data-char");
      const start = textareaNotas.selectionStart;
      const end = textareaNotas.selectionEnd;
      textareaNotas.value =
        textareaNotas.value.substring(0, start) +
        char +
        textareaNotas.value.substring(end);
      textareaNotas.focus();
      textareaNotas.selectionStart = textareaNotas.selectionEnd =
        start + char.length;
    });
  });

  // Salvar Registro
  formRegistro?.addEventListener("submit", (e) => {
    e.preventDefault();
    const servico = document.getElementById("reg-servico").value;
    const categoria =
      selectCat.value === "outra" ? inputNovaCat.value : selectCat.value;
    const senha = inputSenhaFixa.value;
    const notas = textareaNotas.value;

    criarCardUnificado(servico, categoria, senha, notas, true, "cofre");
    fecharRegistro();
  });

  // BOTÃO: Esvaziar Lixeira
  document
    .getElementById("btn-esvaziar-lixeira")
    ?.addEventListener("click", () => {
      let dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
      const temNaLixeira = dados.some((item) => item.local === "lixeira");

      if (!temNaLixeira) return alert("A lixeira já está vazia!");

      if (confirm("Deseja apagar TODOS os itens da lixeira permanentemente?")) {
        dados = dados.filter((item) => item.local !== "lixeira");
        localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
        carregarDadosIniciais();
      }
    });

  // BOTÃO: Excluir Selecionados
  document
    .getElementById("btn-excluir-selecionados")
    ?.addEventListener("click", () => {
      const selecionados = document.querySelectorAll(".card-checkbox:checked");
      if (selecionados.length === 0)
        return alert("Selecione ao menos um card.");

      if (confirm(`Excluir ${selecionados.length} itens permanentemente?`)) {
        let dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
        selecionados.forEach((cb) => {
          const nomeServico = cb.getAttribute("data-servico");
          dados = dados.filter((item) => item.servico !== nomeServico);
        });
        localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
        carregarDadosIniciais();
      }
    });

  /* ================================================================
       4. RENDERIZAÇÃO E PERSISTÊNCIA (CARDS)
       ================================================================ */

  function criarCardUnificado(
    servico,
    categoria,
    senha,
    notas,
    deveSalvar = true,
    localAlvo = "cofre"
  ) {
    let gridId = "grid-principal";
    if (localAlvo === "lista") gridId = "grid-lista";
    if (localAlvo === "lixeira") gridId = "grid-lixeira";

    const gridDestino = document.getElementById(gridId);
    if (!gridDestino) return;

    const novoCard = document.createElement("div");
    novoCard.className = "card-senha";

    const temSenha = senha && senha.trim() !== "";
    const temNota = notas && notas.trim() !== "";
    let iconeClass = temSenha ? "fas fa-lock" : "fas fa-sticky-note";
    let statusTipo = temSenha ? "status-senha" : "status-nota";
    if (temSenha && temNota) {
      iconeClass = "fas fa-vault";
      statusTipo = "status-misto";
    }

    // Checkbox apenas para lixeira com gatilho de atualização
    const htmlCheckbox =
      localAlvo === "lixeira"
        ? `<div class="card-checkbox-container">
            <input type="checkbox" class="card-checkbox" data-servico="${servico}" 
                   onclick="event.stopPropagation(); atualizarContadorLixeira();">
           </div>`
        : "";

    novoCard.innerHTML = `
            ${htmlCheckbox}
            <div class="card-topo">
                <div class="servico-icone ${statusTipo}"><i class="${iconeClass}"></i></div>
                <span class="tag-categoria">${categoria}</span>
            </div>
            <div class="card-info-central">
                <span class="servico-nome">${servico}</span>
                ${
                  temSenha
                    ? `<div class="senha-focada">••••••••</div>`
                    : `<div class="preview-texto notas-sutil">${notas}</div>`
                }
            </div>
            <div class="card-camada-acoes">
                <button class="btn-acao-card btn-copiar-trigger" title="Copiar"><i class="fas fa-copy"></i></button>
                <button class="btn-acao-card btn-importar-trigger" title="${
                  localAlvo === "lixeira" ? "Restaurar" : "Mover para Lista"
                }">
                    <i class="${
                      localAlvo === "lixeira"
                        ? "fas fa-undo"
                        : "fas fa-arrow-right-to-bracket"
                    }"></i>
                </button>
                <button class="btn-acao-card btn-deletar-trigger" title="Excluir Permanentemente"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;

    // Evento Copiar
    novoCard
      .querySelector(".btn-copiar-trigger")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(senha || notas);
        const icon = e.currentTarget.querySelector("i");
        icon.className = "fas fa-check";
        setTimeout(() => (icon.className = "fas fa-copy"), 1000);
      });

    // Evento Mover/Restaurar
    novoCard
      .querySelector(".btn-importar-trigger")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        const destino = localAlvo === "lixeira" ? "cofre" : "lista";
        moverParaLocal(servico, destino, novoCard);
      });

    // Evento Deletar (Individual)
    novoCard
      .querySelector(".btn-deletar-trigger")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        if (localAlvo === "lixeira") {
          if (confirm(`Apagar "${servico}" permanentemente?`)) {
            removerDadosNoBanco(servico);
            carregarDadosIniciais();
          }
        } else {
          if (confirm(`Mover "${servico}" para a lixeira?`)) {
            moverParaLocal(servico, "lixeira", novoCard);
          }
        }
      });

    novoCard.addEventListener("click", (e) => {
      if (
        !e.target.closest(".card-camada-acoes") &&
        !e.target.closest(".card-checkbox")
      ) {
        exibirModalView(servico, categoria, senha, notas);
      }
    });

    if (deveSalvar)
      salvarDadosNoBanco({ servico, categoria, senha, notas, local: "cofre" });
    gridDestino.prepend(novoCard);
  }

  /* ================================================================
       5. FUNÇÕES DE BANCO DE DADOS (LOCALSTORAGE)
       ================================================================ */

  function salvarDadosNoBanco(objeto) {
    const dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
    dados.push(objeto);
    localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
  }

  function removerDadosNoBanco(nome) {
    let dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
    dados = dados.filter((item) => item.servico !== nome);
    localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
  }

  function carregarDadosIniciais() {
    const dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
    const grids = ["grid-principal", "grid-lista", "grid-lixeira"];

    grids.forEach((id) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        if (id === "grid-lixeira") {
          const lixeiraVazia = !dados.some((i) => i.local === "lixeira");
          elemento.innerHTML = lixeiraVazia
            ? `
                        <div style="padding: 40px; text-align: center; width: 100%; grid-column: 1 / -1;">
                            <i class="fas fa-trash-alt" style="font-size: 50px; color: var(--border-color); margin-bottom: 20px;"></i>
                            <h2 style="color: var(--text-muted);">Lixeira vazia</h2>
                        </div>
                    `
            : "";
        } else {
          elemento.innerHTML = "";
        }
      }
    });

    dados.forEach((item) => {
      criarCardUnificado(
        item.servico,
        item.categoria,
        item.senha,
        item.notes || item.notas, // Compatibilidade caso o campo mude de nome
        false,
        item.local || "cofre"
      );
    });

    // Atualiza o contador após renderizar todos os cards
    atualizarContadorLixeira();
  }

  function moverParaLocal(nome, novoLocal, cardElemento) {
    let dados = JSON.parse(localStorage.getItem("gr_dash_dados") || "[]");
    const index = dados.findIndex((item) => item.servico === nome);

    if (index !== -1) {
      dados[index].local = novoLocal;
      localStorage.setItem("gr_dash_dados", JSON.stringify(dados));
      cardElemento.style.opacity = "0";
      cardElemento.style.transform = "scale(0.8)";
      setTimeout(() => carregarDadosIniciais(), 300);
    }
  }

  function exibirModalView(servico, categoria, senha, notas) {
    document.getElementById("view-titulo").innerText = servico;
    document.getElementById("view-tag").innerText = categoria.toUpperCase();
    let conteudo = "";
    if (senha && senha.trim() !== "") conteudo += `CHAVE/SENHA: ${senha}\n\n`;
    if (notes && notas.trim() !== "") conteudo += `NOTAS:\n${notas}`;
    document.getElementById("view-valor").innerText =
      conteudo || "Sem detalhes.";
    document.getElementById("modal-view").classList.add("modal-visivel");

    document.getElementById("btn-copiar-modal").onclick = () => {
      navigator.clipboard.writeText(senha || notas);
      const icon = document.querySelector("#btn-copiar-modal i");
      icon.className = "fas fa-check";
      setTimeout(() => (icon.className = "far fa-copy"), 1000);
    };
  }

  /* ================================================================
   X. LÓGICA DE CONTAGEM DA LIXEIRA
   ================================================================ */

  function atualizarContadorLixeira() {
    // Foca apenas no grid da lixeira para evitar erros
    const gridLixeira = document.getElementById("grid-lixeira");
    if (!gridLixeira) return;

    const totalItens = gridLixeira.querySelectorAll(".card-senha").length;
    const selecionados = gridLixeira.querySelectorAll(".card-checkbox:checked").length;
    const elementoContador = document.getElementById("contador-lixeira");

    if (elementoContador) {
      if (selecionados > 0) {
        elementoContador.innerText = `${selecionados} de ${totalItens} selecionados`;
        elementoContador.style.color = "var(--accent-color)";
      } else {
        // Ajuste gramatical para singular/plural
        const textoItens = totalItens === 1 ? "1 item" : `${totalItens} itens`;
        elementoContador.innerText = textoItens;
        elementoContador.style.color = "var(--text-muted)";
      }
    }
  }

  // Inicialização
  carregarDadosIniciais();
});