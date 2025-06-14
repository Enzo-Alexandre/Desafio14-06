document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api';
    const token = localStorage.getItem('token');
    
    // Proteção de rota: se não houver token ou o perfil não for 'funcionario', volta pro login
    if (!token || localStorage.getItem('perfil') !== 'funcionario') {
        localStorage.clear();
        window.location.href = 'login.html';
        return;
    }

    const welcomeMessage = document.getElementById('welcome-message');
    const currentDateElem = document.getElementById('current-date');
    const currentTimeElem = document.getElementById('current-time');
    const messageArea = document.getElementById('message-area');
    const recordsTableBody = document.getElementById('records-table-body');
    
    welcomeMessage.textContent = `Bem-vindo(a), ${localStorage.getItem('nome')}`;

    // Função para atualizar o relógio a cada segundo
    function updateClock() {
        const now = new Date();
        currentDateElem.textContent = now.toLocaleDateString('pt-BR');
        currentTimeElem.textContent = now.toLocaleTimeString('pt-BR');
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Função para buscar os registros de ponto do dia
    async function fetchRecords() {
        try {
            const response = await fetch(`${API_URL}/ponto/meus-registros-hoje`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 401) { // Token expirado ou inválido
                localStorage.clear();
                window.location.href = 'login.html';
            }
            if (!response.ok) throw new Error('Falha ao buscar registros.');
            
            const records = await response.json();
            
            recordsTableBody.innerHTML = ''; // Limpa a tabela antes de preencher
            if (records.length > 0) {
                records.forEach(rec => {
                    const tipoFormatado = rec.tipo_registro.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                    // Ajuste para exibir a hora local corretamente
                    const horaFormatada = new Date(`1970-01-01T${rec.horario_registro}`).toLocaleTimeString('pt-BR');
                    recordsTableBody.innerHTML += `<tr><td>${tipoFormatado}</td><td>${horaFormatada}</td></tr>`;
                });
            } else {
                recordsTableBody.innerHTML = '<tr><td colspan="2">Nenhum registro para hoje.</td></tr>';
            }
        } catch(err) {
            console.error(err);
            messageArea.textContent = 'Erro ao carregar seus registros.';
            messageArea.className = 'message error';
        }
    }

    // Adiciona evento de clique para os botões de registro
    document.querySelectorAll('.ponto-button').forEach(button => {
        button.addEventListener('click', async () => {
            const tipo_registro = button.dataset.tipo;
            messageArea.textContent = '';
            messageArea.className = 'message';
            
            try {
                const response = await fetch(`${API_URL}/ponto/registrar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ tipo_registro })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message);

                messageArea.textContent = 'Ponto registrado com sucesso!';
                messageArea.classList.add('success');
                fetchRecords(); // Atualiza a tabela após o registro
            } catch (error) {
                messageArea.textContent = error.message;
                messageArea.classList.add('error');
            }
        });
    });

    // Evento de clique para o botão de logout
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });

    // Carrega os registros do dia ao abrir a página
    fetchRecords();
});