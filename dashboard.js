/**
 * SEÇÃO 1: SELEÇÃO DE ELEMENTOS E ESTADO INICIAL
 * Capturamos todos os elementos que serão manipulados via JS.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Elementos da Sidebar
    const sidebar = document.getElementById('sidebar');
    const btnAlternar = document.getElementById('btn-alternar');
    const itensMenu = document.querySelectorAll('.item-menu');

    // Elementos do Modal
    const modal = document.getElementById('modal-item');
    const btnNovoItem = document.querySelector('.btn-adicionar');
    const btnFecharX = document.getElementById('fechar-modal');
    const btnCancelar = document.getElementById('cancelar-modal');
    const formCadastro = document.getElementById('form-cadastro');
    const containerDinamico = document.getElementById('container-campos-dinamicos');

    /**
     * SEÇÃO 2: CONTROLE DA BARRA LATERAL (SIDEBAR)
     * Gerencia a abertura/fechamento e qual item está selecionado.
     */
    btnAlternar.addEventListener('click', () => {
        sidebar.classList.toggle('aberta');
    });

    itensMenu.forEach(item => {
        item.addEventListener('click', () => {
            itensMenu.forEach(i => i.classList.remove('ativo'));
            item.classList.add('ativo');
        });
    });

    /**
     * SEÇÃO 3: CONTROLE DE EXIBIÇÃO DO MODAL
     * Funções para abrir e limpar/fechar a janela de novo item.
     */
    const fecharModal = () => {
        modal.classList.remove('ativo');
        formCadastro.reset(); // Limpa os textos digitados
        containerDinamico.innerHTML = ''; // Remove campos extras de usuário/senha
    };

    btnNovoItem.addEventListener('click', () => {
        modal.classList.add('ativo');
    });

    // Eventos para fechar (Botão X, Botão Cancelar e clicar fora)
    if (btnFecharX) btnFecharX.addEventListener('click', fecharModal);
    if (btnCancelar) btnCancelar.addEventListener('click', fecharModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    /**
     * SEÇÃO 4: FUNCIONALIDADE DE PESQUISA
     * Monitora o que o usuário digita na barra de busca superior.
     */
    const campoPesquisa = document.getElementById('campo-pesquisa');
    campoPesquisa.addEventListener('input', (e) => {
        const termoBusca = e.target.value.toLowerCase();
        console.log("Filtrando por:", termoBusca);
    });

    /**
     * SEÇÃO 5: LOGICA DO FORMULÁRIO (SUBMIT)
     * Coleta os dados fixos e dinâmicos e transforma em JSON para o banco.
     */
    formCadastro.addEventListener('submit', function(e) {
        e.preventDefault();

        // Captura Título e Categoria (agora pegando do seu novo input)
        const dadosParaBanco = {
            titulo: this.titulo.value,
            categoria: this.categoria.value,
            camposExtras: []
        };

        // Varre os campos dinâmicos criados pela função adicionarCampo
        const camposDinamicos = document.querySelectorAll('.campo-dinamico');
        camposDinamicos.forEach(div => {
            const input = div.querySelector('.js-valor');
            dadosParaBanco.camposExtras.push({
                valor: input.value,
                protegido: input.getAttribute('data-protegido') === 'true'
            });
        });

        console.log("Objeto pronto para salvar:", dadosParaBanco);
        alert('Item estruturado com sucesso!');
        fecharModal();
    });
});

/**
 * SEÇÃO: CAMPOS DINÂMICOS
 * Adiciona campos de Usuário ou Senha com funcionalidade de exibir/ocultar
 */
function adicionarCampo(comSenha) {
    const container = document.getElementById('container-campos-dinamicos');
    const tipoInput = comSenha ? 'password' : 'text';
    const rotulo = comSenha ? 'SENHA' : 'USUÁRIO/INFO';

    const div = document.createElement('div');
    div.className = 'campo-grupo campo-dinamico';
    
    // HTML do botão de olho (somente se for senha)
    const botaoOlho = comSenha ? `
        <button type="button" class="btn-ver-senha" onclick="alternarSenha(this)">
            <i class="fas fa-eye"></i>
        </button>` : '';

    div.innerHTML = `
        <div class="linha-flex" style="justify-content: space-between; align-items: flex-end;">
            <label style="font-size: 11px; color: var(--cor-amarela); font-weight: bold;">${rotulo}</label>
            <button type="button" class="btn-remover" onclick="this.closest('.campo-dinamico').remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="input-container">
            <input type="${tipoInput}" class="input-dados js-valor" data-protegido="${comSenha}" placeholder="Insira o valor...">
            ${botaoOlho}
        </div>
    `;

    container.appendChild(div);
}

/**
 * Função para alternar a visibilidade da senha
 */
function alternarSenha(botao) {
    const input = botao.parentElement.querySelector('input');
    const icone = botao.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icone.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icone.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

/**
 * Função para alternar entre mostrar/esconder senha
 */
function alternarVisibilidade(botao) {
    const input = botao.previousElementSibling;
    const icone = botao.querySelector('i');
    
    if (input.type === "password") {
        input.type = "text";
        icone.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = "password";
        icone.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

/**
 * SEÇÃO 7: BOTÕES DE FILTRO (PLACEHOLDERS)
 * Ações para os botões de classificação da lista.
 */
const btnFiltroNome = document.getElementById('filtro-nome');
if (btnFiltroNome) {
    btnFiltroNome.addEventListener('click', () => {
        alert('Ordenando por Nome...');
    });
}