/**
 * GR DASH - LÓGICA DE INTERFACE E GERENCIAMENTO
 * Seções: Sidebar, Modal, Alternância de Tipo e Grid de Registros
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ================================================================
       SEÇÃO 1: SIDEBAR E NAVEGAÇÃO
       ================================================================ */
    const sidebar = document.getElementById('sidebar');
    const btnAlternar = document.getElementById('btn-alternar');
    const itensMenu = document.querySelectorAll('.item-menu');

    if (btnAlternar && sidebar) {
        btnAlternar.addEventListener('click', () => {
            sidebar.classList.toggle('aberta');
            localStorage.setItem('sidebar-aberta', sidebar.classList.contains('aberta'));
        });

        if (localStorage.getItem('sidebar-aberta') === 'true') {
            sidebar.classList.add('aberta');
        }
    }

    itensMenu.forEach(item => {
        item.addEventListener('click', function() {
            itensMenu.forEach(i => i.classList.remove('ativo'));
            this.classList.add('ativo');
        });
    });

    /* ================================================================
       SEÇÃO 2: CONTROLE DO MODAL E FORMULÁRIO
       ================================================================ */
    const modal = document.getElementById('modal-registro');
    const btnAbrirModal = document.querySelector('.btn-adicionar');
    const btnFecharX = document.getElementById('btn-fechar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const formRegistro = document.getElementById('form-novo-registro');

    // Elementos internos do formulário
    const selectCat = document.getElementById('reg-categoria-select');
    const inputNovaCat = document.getElementById('reg-categoria-nova');
    const btnsTipo = document.querySelectorAll('.btn-tipo');
    const labelDado = document.getElementById('label-dado');
    const inputValor = document.getElementById('reg-valor');
    const btnVerSenha = document.getElementById('btn-ver-senha');
    
    let tipoAtual = 'nome'; // Controla se é +Nome ou +Senha

    if (btnAbrirModal) {
        btnAbrirModal.addEventListener('click', () => modal.classList.add('modal-visivel'));
    }

    const fecharModal = () => {
        modal.classList.remove('modal-visivel');
        formRegistro.reset();
        inputNovaCat.style.display = 'none';
        // Reseta para o padrão 'nome'
        resetarTipoForm();
    };

    [btnFecharX, btnCancelar].forEach(btn => {
        if (btn) btn.addEventListener('click', fecharModal);
    });

    // 1. Lógica de "Nova Categoria"
    selectCat.addEventListener('change', () => {
        inputNovaCat.style.display = selectCat.value === 'outra' ? 'block' : 'none';
    });

    // 2. Alternar entre +Nome e +Senha (Botões)
    btnsTipo.forEach(btn => {
        btn.addEventListener('click', () => {
            btnsTipo.forEach(b => b.classList.remove('ativo'));
            btn.classList.add('ativo');
            tipoAtual = btn.dataset.tipo;
            
            if (tipoAtual === 'senha') {
                labelDado.innerText = 'Senha Digitada';
                inputValor.type = 'password';
                inputValor.placeholder = '••••••••';
                btnVerSenha.style.display = 'block';
            } else {
                labelDado.innerText = 'Nome Digitado';
                inputValor.type = 'text';
                inputValor.placeholder = 'Digite o nome aqui';
                btnVerSenha.style.display = 'none';
            }
        });
    });

    function resetarTipoForm() {
        btnsTipo.forEach(b => b.classList.remove('ativo'));
        btnsTipo[0].classList.add('ativo');
        tipoAtual = 'nome';
        labelDado.innerText = 'Nome Digitado';
        inputValor.type = 'text';
        btnVerSenha.style.display = 'none';
    }

    // 3. Olhinho (Visualizar Senha)
    btnVerSenha.addEventListener('click', () => {
        inputValor.type = inputValor.type === 'password' ? 'text' : 'password';
        btnVerSenha.innerHTML = inputValor.type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    /* ================================================================
       SEÇÃO 3: PROCESSAMENTO E GRID
       ================================================================ */
    const gridPrincipal = document.getElementById('grid-principal');

    formRegistro.addEventListener('submit', (e) => {
        e.preventDefault();

        const servico = document.getElementById('reg-servico').value;
        const categoriaFinal = selectCat.value === 'outra' ? inputNovaCat.value : selectCat.value;
        const valor = inputValor.value;

        criarCardHTML(servico, categoriaFinal, valor, tipoAtual);
        fecharModal();
    });

    function criarCardHTML(servico, categoria, valor, tipo) {
        const novoCard = document.createElement('div');
        novoCard.classList.add('card-senha');

        novoCard.innerHTML = `
            <div class="card-info">
                <div class="servico-icone">
                    <i class="${tipo === 'senha' ? 'fas fa-lock' : 'fas fa-user'}"></i>
                </div>
                <div class="servico-detalhes">
                    <span class="tag-categoria" style="font-size: 10px; color: var(--accent-color); font-weight: bold;">${categoria.toUpperCase()}</span>
                    <span class="servico-nome">${servico}</span>
                    <span class="servico-login">${tipo === 'senha' ? '••••••••' : valor}</span>
                </div>
            </div>
            <div class="card-acoes">
                <button class="btn-copiar" title="Copiar"><i class="fas fa-copy"></i></button>
                <button class="btn-deletar" title="Excluir"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;

        // Evento Deletar
        novoCard.querySelector('.btn-deletar').addEventListener('click', (e) => {
            e.stopPropagation();
            if(confirm('Excluir este registro?')) {
                novoCard.style.opacity = '0';
                novoCard.style.transform = 'translateX(20px)';
                setTimeout(() => novoCard.remove(), 300);
            }
        });

        // Evento Copiar (Feedback visual)
        const btnCopiar = novoCard.querySelector('.btn-copiar');
        btnCopiar.addEventListener('click', (e) => {
            e.stopPropagation();
            const iconeOriginal = btnCopiar.innerHTML;
            btnCopiar.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => btnCopiar.innerHTML = iconeOriginal, 2000);
        });

        gridPrincipal.appendChild(novoCard);
    }
});

/**
 * SEÇÃO: GERENCIAMENTO DE CAMPOS DINÂMICOS (NOME/SENHA)
 */

document.addEventListener('DOMContentLoaded', () => {
    const containerCampos = document.getElementById('lista-campos-dinamicos');
    const btnAddNome = document.getElementById('add-campo-nome');
    const btnAddSenha = document.getElementById('add-campo-senha');

    // Função para criar uma nova caixa de input
    const adicionarNovaCaixa = (tipo) => {
        const divId = 'campo-' + Date.now(); // ID único
        const novoCampo = document.createElement('div');
        novoCampo.classList.add('item-campo-dinamico');
        novoCampo.id = divId;

        const label = tipo === 'senha' ? 'Senha' : 'Nome/Login';
        const inputType = tipo === 'senha' ? 'password' : 'text';
        const placeholder = tipo === 'senha' ? '••••••••' : 'Digite aqui...';

        novoCampo.innerHTML = `
            <label>${label}</label>
            <button type="button" class="btn-remover-campo" onclick="removerCaixa('${divId}')">
                <i class="fas fa-times"></i>
            </button>
            <div class="campo-senha-container">
                <input type="${inputType}" class="input-valor-dinamico" data-tipo="${tipo}" placeholder="${placeholder}" required>
                ${tipo === 'senha' ? '<button type="button" class="btn-input-acao"><i class="fas fa-eye"></i></button>' : ''}
            </div>
        `;

        containerCampos.appendChild(novoCampo);
        
        // Lógica do olhinho para campos de senha dinâmicos
        if (tipo === 'senha') {
            const btnOlho = novoCampo.querySelector('.btn-input-acao');
            const input = novoCampo.querySelector('input');
            btnOlho.addEventListener('click', () => {
                input.type = input.type === 'password' ? 'text' : 'password';
            });
        }
    };

    // Eventos dos botões principais
    btnAddNome.addEventListener('click', () => adicionarNovaCaixa('nome'));
    btnAddSenha.addEventListener('click', () => adicionarNovaCaixa('senha'));

    // Função global para remover (chamada pelo onclick no HTML gerado)
    window.removerCaixa = (id) => {
        const elemento = document.getElementById(id);
        elemento.style.opacity = '0';
        elemento.style.transform = 'scale(0.9)';
        setTimeout(() => elemento.remove(), 200);
    };

    // Ao resetar o formulário, limpa os campos dinâmicos
    document.getElementById('form-novo-registro').addEventListener('reset', () => {
        containerCampos.innerHTML = '';
    });
});

