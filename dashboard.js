/**
 * GR DASH - LÓGICA DE INTERFACE E GERENCIAMENTO
 * Seções: Sidebar, Modal, Grid de Senhas e Utilidades
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
       SEÇÃO 2: CONTROLE DO MODAL
       ================================================================ */
    const modal = document.getElementById('modal-registro');
    const btnAbrirModal = document.querySelector('.btn-adicionar');
    const btnFecharX = document.getElementById('btn-fechar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const formRegistro = document.getElementById('form-novo-registro');

    if (btnAbrirModal) {
        btnAbrirModal.addEventListener('click', () => modal.classList.add('modal-visivel'));
    }

    const fecharModal = () => {
        modal.classList.remove('modal-visivel');
        formRegistro.reset();
    };

    [btnFecharX, btnCancelar].forEach(btn => {
        if (btn) btn.addEventListener('click', fecharModal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    /* ================================================================
       SEÇÃO 3: PROCESSAMENTO DO FORMULÁRIO E GRID
       ================================================================ */
    const gridPrincipal = document.getElementById('grid-principal');

    formRegistro.addEventListener('submit', (e) => {
        e.preventDefault();

        const servico = document.getElementById('reg-servico').value;
        const login = document.getElementById('reg-login').value;
        const icone = document.getElementById('reg-icone').value;

        // Criar o card
        criarCardHTML(servico, login, icone);

        fecharModal();
    });

    /**
     * Descrição: Cria a estrutura do card e insere no grid.
     * Ajuste: Adicionado tratamento para garantir que o ícone apareça.
     */
    function criarCardHTML(servico, login, icone) {
        if (!gridPrincipal) return;

        const novoCard = document.createElement('div');
        novoCard.classList.add('card-senha');

        // Estrutura interna idêntica ao seu CSS
        novoCard.innerHTML = `
            <div class="card-info">
                <div class="servico-icone">
                    <i class="${icone}"></i>
                </div>
                <div class="servico-detalhes">
                    <span class="servico-nome">${servico}</span>
                    <span class="servico-login">${login}</span>
                </div>
            </div>
            <div class="card-acoes">
                <button class="btn-copiar" title="Copiar Senha">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="btn-opcoes">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
        `;

        // Configura o evento do novo botão copiar
        const btnCopiar = novoCard.querySelector('.btn-copiar');
        configurarEventoCopiar(btnCopiar);

        gridPrincipal.appendChild(novoCard);
    }

    /**
     * Feedback visual de cópia
     */
    function configurarEventoCopiar(botao) {
        botao.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Simulação de cópia real (opcional)
            // navigator.clipboard.writeText("senha123"); 

            const iconeOriginal = botao.innerHTML;
            botao.innerHTML = '<i class="fas fa-check"></i>';
            botao.style.color = 'var(--accent-color)';
            
            setTimeout(() => {
                botao.innerHTML = iconeOriginal;
                botao.style.color = '';
            }, 2000);
        });
    }

    // Inicializa botões existentes no HTML
    document.querySelectorAll('.btn-copiar').forEach(btn => configurarEventoCopiar(btn));
});