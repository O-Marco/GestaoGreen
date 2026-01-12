/**
 * GR DASH - LÓGICA DE INTERFACE E GERENCIAMENTO
 * Seções: Sidebar, Modal, Campos Dinâmicos e Grid de Registros
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
       SEÇÃO 2: CONTROLE DO MODAL E CATEGORIAS
       ================================================================ */
    const modal = document.getElementById('modal-registro');
    const btnAbrirModal = document.querySelector('.btn-adicionar');
    const btnFecharX = document.getElementById('btn-fechar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const formRegistro = document.getElementById('form-novo-registro');
    const containerCampos = document.getElementById('lista-campos-dinamicos');

    const selectCat = document.getElementById('reg-categoria-select');
    const inputNovaCat = document.getElementById('reg-categoria-nova');

    if (btnAbrirModal) {
        btnAbrirModal.addEventListener('click', () => modal.classList.add('modal-visivel'));
    }

    const fecharModal = () => {
        modal.classList.remove('modal-visivel');
        formRegistro.reset();
        containerCampos.innerHTML = ''; // Limpa os campos dinâmicos ao fechar
        inputNovaCat.style.display = 'none';
    };

    [btnFecharX, btnCancelar].forEach(btn => {
        if (btn) btn.addEventListener('click', fecharModal);
    });

    selectCat.addEventListener('change', () => {
        inputNovaCat.style.display = selectCat.value === 'outra' ? 'block' : 'none';
    });

    /* ================================================================
       SEÇÃO 3: GERENCIAMENTO DE CAMPOS DINÂMICOS (NOME/SENHA)
       ================================================================ */
    const btnAddNome = document.getElementById('add-campo-nome');
    const btnAddSenha = document.getElementById('add-campo-senha');

    const adicionarNovaCaixa = (tipo) => {
        const divId = 'campo-' + Date.now();
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
        
        if (tipo === 'senha') {
            const btnOlho = novoCampo.querySelector('.btn-input-acao');
            const input = novoCampo.querySelector('input');
            btnOlho.addEventListener('click', () => {
                input.type = input.type === 'password' ? 'text' : 'password';
                btnOlho.innerHTML = input.type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
        }
    };

    if(btnAddNome) btnAddNome.addEventListener('click', () => adicionarNovaCaixa('nome'));
    if(btnAddSenha) btnAddSenha.addEventListener('click', () => adicionarNovaCaixa('senha'));

    window.removerCaixa = (id) => {
        const elemento = document.getElementById(id);
        if(elemento) {
            elemento.style.opacity = '0';
            elemento.style.transform = 'scale(0.9)';
            setTimeout(() => elemento.remove(), 200);
        }
    };

    /* ================================================================
       SEÇÃO 4: PROCESSAMENTO DO FORMULÁRIO E GRID
       ================================================================ */
    const gridPrincipal = document.getElementById('grid-principal');

    formRegistro.addEventListener('submit', (e) => {
        e.preventDefault();

        const servico = document.getElementById('reg-servico').value;
        const categoriaFinal = selectCat.value === 'outra' ? inputNovaCat.value : selectCat.value;
        
        // Captura todos os inputs dinâmicos criados
        const campos = document.querySelectorAll('.input-valor-dinamico');

        if (campos.length === 0) {
            alert("Adicione pelo menos um campo de Nome ou Senha.");
            return;
        }

        // Para cada campo dinâmico, criamos um card no grid
        campos.forEach(campo => {
            const valor = campo.value;
            const tipo = campo.dataset.tipo;
            criarCardHTML(servico, categoriaFinal, valor, tipo);
        });

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
                    <span class="tag-categoria">${categoria.toUpperCase()}</span>
                    <span class="servico-nome">${servico}</span>
                    <span class="servico-login">${tipo === 'senha' ? '••••••••' : valor}</span>
                </div>
            </div>
            <div class="card-acoes">
                <button class="btn-copiar" title="Copiar" data-valor="${valor}"><i class="fas fa-copy"></i></button>
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

        // Evento Copiar
        const btnCopiar = novoCard.querySelector('.btn-copiar');
        btnCopiar.addEventListener('click', (e) => {
            e.stopPropagation();
            const valorParaCopiar = btnCopiar.dataset.valor;
            navigator.clipboard.writeText(valorParaCopiar).then(() => {
                const iconeOriginal = btnCopiar.innerHTML;
                btnCopiar.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => btnCopiar.innerHTML = iconeOriginal, 2000);
            });
        });

        gridPrincipal.appendChild(novoCard);
    }
});