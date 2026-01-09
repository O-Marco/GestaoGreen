// Aguarda o carregamento total do documento
document.addEventListener('DOMContentLoaded', () => {
    
    // Seleção dos elementos principais
    const sidebar = document.getElementById('sidebar');
    const btnAlternar = document.getElementById('btn-alternar');
    const itensMenu = document.querySelectorAll('.item-menu');

    /**
     * SEÇÃO: CONTROLE DO MENU
     * Alterna a classe 'aberta' na sidebar
     */
    btnAlternar.addEventListener('click', () => {
        sidebar.classList.toggle('aberta');
    });

    /**
     * SEÇÃO: NAVEGAÇÃO
     * Gerencia qual item do menu está ativo (selecionado)
     */
    itensMenu.forEach(item => {
        item.addEventListener('click', (evento) => {
            // Remove a classe ativo de todos os itens
            itensMenu.forEach(i => i.classList.remove('ativo'));
            
            // Adiciona a classe ativo apenas no item clicado
            item.classList.add('ativo');
        });
    });

});

/**
 * SEÇÃO: FUNCIONALIDADE DE PESQUISA
 * Detecta quando o usuário digita no campo de busca
 */
const campoPesquisa = document.getElementById('campo-pesquisa');

campoPesquisa.addEventListener('input', (e) => {
    const termoBusca = e.target.value.toLowerCase();
    
    // Por enquanto, apenas mostra no console o que está sendo digitado
    // No próximo passo, usaremos isso para filtrar a lista de itens
    console.log("Buscando por:", termoBusca);
});

/**
 * SEÇÃO: LOGICA DOS FILTROS
 * Gerencia os cliques nos botões de classificação e o botão de adicionar
 */
const btnFiltroNome = document.getElementById('filtro-nome');
const btnAdicionar = document.querySelector('.btn-adicionar');

btnFiltroNome.addEventListener('click', () => {
    // Aqui no futuro abriremos um menu suspenso (dropdown)
    alert('Opções de classificação: A-Z, Recentes, etc.');
});

btnAdicionar.addEventListener('click', () => {
    console.log('Abrindo formulário de novo item...');
    // No futuro, aqui chamaremos a função para abrir um Modal (janela flutuante)
});

/**
 * SEÇÃO: CONTROLE DO MODAL
 */
const modal = document.getElementById('modal-item');
const btnNovoItem = document.querySelector('.btn-adicionar');
const btnFechar = document.getElementById('fechar-modal');
const btnCancelar = document.getElementById('cancelar-modal');

// Função para abrir
btnNovoItem.addEventListener('click', () => {
    modal.classList.add('ativo');
});

// Funções para fechar
const fecharModal = () => modal.classList.remove('ativo');

btnFechar.addEventListener('click', fecharModal);
btnCancelar.addEventListener('click', fecharModal);

// Fechar ao clicar fora da janela branca
window.addEventListener('click', (e) => {
    if (e.target === modal) fecharModal();
});

/**
 * SEÇÃO: CAMPOS DINÂMICOS
 * Adiciona campos que o banco de dados receberá como um Array de objetos
 */
function adicionarCampo(comSenha) {
    const container = document.getElementById('container-campos-dinamicos');
    const tipoInput = comSenha ? 'password' : 'text';
    const rotulo = comSenha ? 'Senha' : 'Usuário/Info';

    const div = document.createElement('div');
    div.className = 'campo-grupo campo-dinamico';
    
    // Usamos classes específicas (js-valor e js-tipo) para coletar os dados depois
    div.innerHTML = `
        <div class="linha-flex" style="justify-content: space-between; align-items: flex-end;">
            <label style="font-size: 11px; color: var(--cor-amarela);">${rotulo.toUpperCase()}</label>
            <button type="button" class="btn-remover" onclick="this.closest('.campo-dinamico').remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <input type="${tipoInput}" class="input-dados js-valor" data-protegido="${comSenha}" placeholder="Insira o valor...">
    `;

    container.appendChild(div);
}

/**
 * SEÇÃO: PREPARAÇÃO PARA O BANCO DE DADOS
 * Captura todos os campos e transforma em um objeto JSON
 */
document.getElementById('form-cadastro').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Captura campos fixos
    // Certifique-se de que o select tenha name="categoria" e o input tenha name="titulo" no HTML
    const dadosParaBanco = {
        titulo: this.titulo.value,
        categoria: this.categoria.value, // Captura o valor selecionado no <select>
        camposExtras: []
    };

    // 2. Captura campos dinâmicos (varredura)
    const camposDinamicos = document.querySelectorAll('.campo-dinamico'); //
    camposDinamicos.forEach(div => {
        const input = div.querySelector('.js-valor'); //
        dadosParaBanco.camposExtras.push({
            valor: input.value,
            protegido: input.getAttribute('data-protegido') === 'true' //
        });
    });

    console.log("Enviando para o Banco:", dadosParaBanco); //
    
    alert('Dados estruturados com sucesso! Verifique o console (F12).');
    fecharModal(); // Função que fecha o modal após salvar
});

/**
 * Alterna entre o Dropdown e o Campo de Digitação
 */
function alternarModoCategoria(mostrarInput) {
    const seletor = document.getElementById('container-seletor-categoria');
    const entrada = document.getElementById('container-nova-categoria');
    
    if (mostrarInput) {
        seletor.style.display = 'none';
        entrada.style.display = 'flex';
        document.getElementById('novo-nome-categoria').focus();
    } else {
        seletor.style.display = 'flex';
        entrada.style.display = 'none';
        document.getElementById('novo-nome-categoria').value = '';
    }
}

/**
 * Adiciona a nova categoria ao Select e guarda a cor (no console por enquanto)
 */
function confirmarNovaCategoria() {
    const inputNome = document.getElementById('novo-nome-categoria');
    const inputCor = document.getElementById('cor-categoria');
    const nome = inputNome.value.trim();
    const cor = inputCor.value;

    if (nome !== "") {
        const select = document.getElementById('categoria-item');
        const novaOpcao = document.createElement('option');
        
        novaOpcao.value = nome.toLowerCase().replace(/\s+/g, '-');
        novaOpcao.textContent = nome;
        novaOpcao.dataset.cor = cor; // Guarda a cor escolhida no elemento

        select.appendChild(novaOpcao);
        novaOpcao.selected = true;

        console.log(`Categoria criada: ${nome} com a cor: ${cor}`);
        alternarModoCategoria(false);
    } else {
        inputNome.focus();
    }
}