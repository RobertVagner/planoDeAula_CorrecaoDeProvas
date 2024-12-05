supabase.auth.getSession().then(({ data }) => {
    if (data.session) {
        window.location.href = "../index.html";
    }
});

function onChangeEmail() {
    toggleButtonsDisable();
    toggleEmailErrors();
}

function onChangePassword() {
    toggleButtonsDisable();
    togglePasswordErrors();
}

function login() {
    console.log("Botão de login clicado"); // Adiciona um log para verificar
    showLoading();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { error } = supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    hideLoading();

    if (error) {
        if (error.message === 'Invalid login credentials') {
            alert('Senha incorreta. Por favor, tente novamente.');
        } else {
            alert(getErrorMessage(error));
        }
    } else {
        window.location.href = "../index.html";
    }
}

function register() {
    window.location.href = "../register/register.html";
}

function recoverPassword() {
    showLoading();

    const { error } = supabase.auth.resetPasswordForEmail(form.email().value);

    hideLoading();

    if (error) {
        alert(getErrorMessage(error));
    } else {
        alert('Email enviado com sucesso');
    }
}

function getErrorMessage(error) {
    if (error.message === "Invalid login credentials") {
        return "Senha inválida";
    }
    if (error.message === "User not found") {
        return "Usuário não encontrado";
    }
    return error.message;
}

function toggleEmailErrors() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";
    
    form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block";
}

function togglePasswordErrors() {
    const password = form.password().value;
    form.passwordRequiredError().style.display = password ? "none" : "block";
}

function toggleButtonsDisable() {
    const emailValid = isEmailValid();
    const passwordValid = isPasswordValid();

    console.log('Email válido:', emailValid);
    console.log('Senha válida:', passwordValid);

    form.recoverPasswordButton().disabled = !emailValid; // Habilita botão de recuperação se o e-mail for válido
    form.loginButton().disabled = !emailValid || !passwordValid; // Habilita botão de login se e-mail e senha forem válidos
}

function isEmailValid() {
    const email = form.email().value;
    if (!email) {
        return false;
    }
    return validateEmail(email);
}

function isPasswordValid() {
    const password = form.password().value;
    return password && password.length >= 6; // Verifica se a senha tem no mínimo 6 caracteres
}

const form = {
    email: () => document.getElementById("email"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    loginButton: () => document.getElementById("login-button"),
    password: () => document.getElementById("password"),
    passwordRequiredError: () => document.getElementById("password-required-error"),
    recoverPasswordButton: () => document.getElementById("recover-password-button"),
} 