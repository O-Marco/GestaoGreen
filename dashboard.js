/* SEÇÃO: CONTROLE DA SIDEBAR */
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const btnAlternar = document.getElementById('btn-alternar');

    if (btnAlternar && sidebar) {
        btnAlternar.addEventListener('click', () => {
            // Alterna a classe 'aberta'
            sidebar.classList.toggle('aberta');
            
            // Estudo: Troca o ícone de barras (menu) para fechar (times)
            const icone = btnAlternar.querySelector('i');
            if (sidebar.classList.contains('aberta')) {
                icone.classList.replace('fa-bars', 'fa-times');
            } else {
                icone.classList.replace('fa-times', 'fa-bars');
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const btnAlternar = document.getElementById('btn-alternar');

    // Função para alternar Sidebar
    if (btnAlternar && sidebar) {
        btnAlternar.addEventListener('click', () => {
            sidebar.classList.toggle('aberta');
            
            // Opcional: Trocar ícone do hamburguer por um 'X' ao abrir
            const icone = btnAlternar.querySelector('i');
            if (sidebar.classList.contains('aberta')) {
                icone.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icone.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    }

    // Gerenciar seleção de itens (efeito Ativo)
    const itensMenu = document.querySelectorAll('.item-menu');
    itensMenu.forEach(item => {
        item.addEventListener('click', function() {
            itensMenu.forEach(i => i.classList.remove('ativo'));
            this.classList.add('ativo');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const btnAlternar = document.getElementById('btn-alternar');

    if (btnAlternar) {
        btnAlternar.addEventListener('click', () => {
            sidebar.classList.toggle('aberta');
        });
    }
});