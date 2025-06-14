document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');

    // Proteção de rota: se não houver token ou o perfil não for 'admin', volta pro login
    if (!token || localStorage.getItem('perfil') !== 'admin') {
        localStorage.clear();
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('admin-welcome').textContent = `Painel do Administrador - ${localStorage.getItem('nome')}`;
    const addEmployeeForm = document.getElementById('add-employee-form');
    const adminMessage = document.getElementById('admin-message');

    // Evento de clique para o botão de logout
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });

    // Evento de submissão do formulário para adicionar funcionário
    addEmployeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        adminMessage.textContent = '';
        adminMessage.className = 'message';
        
        const nome_completo = e.target.nome_completo.value;
        const matricula = e.target.matricula.value;
        const senha = e.target.senha.value;

        try {
            const response = await fetch(`${API_URL}/admin/funcionarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ nome_completo, matricula, senha })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            adminMessage.textContent = "Funcionário cadastrado com sucesso!";
            adminMessage.classList.add('success');
            addEmployeeForm.reset(); // Limpa o formulário

        } catch (error) {
            adminMessage.textContent = error.message || "Erro ao cadastrar funcionário.";
            adminMessage.classList.add('error');
        }
    });

    // Configura o link do relatório para passar o token (se necessário)
    // Uma abordagem mais segura seria usar fetch para obter o PDF como um blob
    document.getElementById('report-link').addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/admin/relatorio/dia`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao gerar o relatório.');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `relatorio_ponto_${new Date().toISOString().slice(0,10)}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            adminMessage.textContent = error.message;
            adminMessage.classList.add('error');
        }
    });
});