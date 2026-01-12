let isLogin = true;

function toggleMode() {
    isLogin = !isLogin;
    
    const title = document.getElementById('title');
    const extraFields = document.getElementById('extra-fields');
    const btnToggle = document.querySelector('.btn-outline');
    const sideTitle = document.querySelector('.left-side h1');

    if (isLogin) {
        title.innerText = "Acessar Cofre";
        sideTitle.innerText = "Welcome Back!";
        btnToggle.innerText = "CRIAR CONTA";
        extraFields.classList.add('hidden');
    } else {
        title.innerText = "Cadastro";
        sideTitle.innerText = "Olá, Amigo!";
        btnToggle.innerText = "FAZER LOGIN";
        extraFields.classList.remove('hidden');
    }
}

/* =========================================
   EFEITO PARALLAX NO BACKGROUND
   ========================================= */
document.addEventListener('mousemove', (e) => {
    const esferas = document.querySelectorAll('.esfera');
    
    // Calcula a posição do mouse em relação ao centro
    const x = (window.innerWidth / 2 - e.pageX) / 25;
    const y = (window.innerHeight / 2 - e.pageY) / 25;

    esferas.forEach((esfera, index) => {
        // Aplica movimento diferente para cada esfera para criar profundidade
        const fator = (index + 1) * 0.5;
        esfera.style.transform = `translate(${x * fator}px, ${y * fator}px)`;
    });
});

/* =========================================
   ANIMAÇÃO DE CLIQUE NOS BOTÕES
   ========================================= */
const botoes = document.querySelectorAll('button');

botoes.forEach(botao => {
    botao.addEventListener('mousedown', () => {
        botao.style.transform = 'scale(0.95)';
    });
    
    botao.addEventListener('mouseup', () => {
        botao.style.transform = 'scale(1.02)';
    });
});
