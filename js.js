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

