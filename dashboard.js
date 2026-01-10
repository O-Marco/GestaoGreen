/**
 * GR DASH - LÓGICA DE INTERFACE
 * Organização: Sidebar Toggle + Navegação Ativa
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. SELEÇÃO DE ELEMENTOS
    const sidebar = document.getElementById('sidebar');
    const btnAlternar = document.getElementById('btn-alternar');
    const itensMenu = document.querySelectorAll('.item-menu');

    // 2. LÓGICA DA SETA (ABRIR/FECHAR SIDEBAR)
    if (btnAlternar && sidebar) {
        btnAlternar.addEventListener('click', () => {
            // Alterna a classe que controla a largura no CSS
            sidebar.classList.toggle('aberta');
            
            // Opcional: Salva a preferência no navegador para não fechar ao atualizar
            const estaAberto = sidebar.classList.contains('aberta');
            localStorage.setItem('sidebar-aberta', estaAberto);
        });

        // Recupera o estado salvo ao carregar a página
        const estadoSalvo = localStorage.getItem('sidebar-aberta');
        if (estadoSalvo === 'true') {
            sidebar.classList.add('aberta');
        }
    }

    // 3. LÓGICA DE NAVEGAÇÃO (EFEITO ATIVO)
    if (itensMenu.length > 0) {
        itensMenu.forEach(item => {
            item.addEventListener('click', function(e) {
                // Remove a classe 'ativo' de todos os itens
                itensMenu.forEach(i => i.classList.remove('ativo'));
                
                // Adiciona a classe 'ativo' apenas no item clicado
                this.classList.add('ativo');

                // Estudo: Se for um link real (não apenas para teste), 
                // remova o 'e.preventDefault()' abaixo.
                // e.preventDefault(); 
            });
        });
    }
});

/**
 * SEÇÃO: INTERAÇÕES DOS CARDS
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Simulação de Copiar Senha
    const botoesCopiar = document.querySelectorAll('.btn-copiar');

    botoesCopiar.forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o clique abra o card
            
            // Aqui futuramente entrará a lógica de copiar a senha real
            alert('Senha copiada para a área de transferência!');
            
            // Feedback visual rápido
            const iconeOriginal = botao.innerHTML;
            botao.innerHTML = '<i class="fas fa-check"></i>';
            botao.style.color = 'var(--accent-color)';
            
            setTimeout(() => {
                botao.innerHTML = iconeOriginal;
                botao.style.color = '';
            }, 2000);
        });
    });
});