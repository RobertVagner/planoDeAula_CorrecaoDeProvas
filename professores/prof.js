// Função para mostrar mensagens de erro
function showError(message) {
    alert(message); // Você pode personalizar para exibir de uma maneira mais elegante
}

// Função para validar campos do formulário
function validateForm() {
    const nome = document.getElementById('professor-nome').value.trim();

    if (!nome) {
        showError('O campo Nome é obrigatório.');
        return false;
    }

    return true;
}

// Função para inicializar eventos e configurações globais
function initialize() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            document.getElementById('user-email').innerText = user.email;
            loadProfessorData(user.uid);
        } else {
            window.location.href = '/login/login.html';
        }
    });

    document.querySelector('#planForm button').addEventListener('click', () => {
        if (validateForm()) {
            saveProfessorData();
        }
    });
}

document.addEventListener('DOMContentLoaded', initialize);
