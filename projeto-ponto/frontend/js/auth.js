document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api';
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    // Se o usuário já estiver logado, redireciona para a página correta
    const token = localStorage.getItem('token');
    if (token) {
        const perfil = localStorage.getItem('perfil');
        window.location.href = perfil === 'admin' ? 'admin.html' : 'ponto.html';
        return;
    }

    // Evento de submissão do formulário de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';
        const matricula = e.target.matricula.value;
        const senha = e.target.senha.value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matricula, senha })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            
            // Salva dados no localStorage para manter a sessão
            localStorage.setItem('token', data.token);
            localStorage.setItem('perfil', data.perfil);
            localStorage.setItem('nome', data.nome);

            // Redireciona com base no perfil retornado pela API
            window.location.href = data.perfil === 'admin' ? 'admin.html' : 'ponto.html';
        } catch (error) {
            errorMessage.textContent = error.message || 'Erro ao tentar fazer login.';
        }
    });
});