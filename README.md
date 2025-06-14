# Sistema de Registro de Ponto

Este é um sistema web completo para registro de ponto de funcionários, com painéis distintos para administradores e funcionários, validação de horários e geração de relatórios.

## Tecnologias Utilizadas

-   **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS)
-   **Backend:** Node.js, Express.js
-   **Banco de Dados:** MySQL
-   **ORM:** Sequelize
-   **Autenticação:** JWT (JSON Web Tokens)
-   **Geração de PDF:** PDFKit

## Pré-requisitos

Antes de começar, garanta que você tem os seguintes softwares instalados:
-   [Node.js](https://nodejs.org/) (versão LTS recomendada)
-   Um servidor MySQL (pode ser o [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) ou um pacote como [XAMPP](https://www.apachefriends.org/index.html))
-   Um editor de código, como o [VS Code](https://code.visualstudio.com/)
-   A extensão **Live Server** para o VS Code.

## Como Executar o Projeto

Siga estes passos para colocar o sistema no ar.

### 1. Preparar o Banco de Dados

-   Abra o seu gestor de MySQL (Workbench, DBeaver, etc.).
-   Execute o script SQL completo encontrado no ficheiro `database.sql` deste projeto. Ele criará o banco de dados, as tabelas e o utilizador administrador inicial.

### 2. Configurar o Backend

-   Abra um terminal e navegue até a pasta `backend` do projeto:
    ```bash
    cd caminho/para/o/projeto/backend
    ```
-   Abra o ficheiro `.env` e **configure a sua senha do MySQL** na variável `DB_PASSWORD`.
-   Instale as dependências do projeto:
    ```bash
    npm install
    ```
-   Inicie o servidor:
    ```bash
    npm start
    ```
-   O terminal deverá exibir a mensagem: `Servidor backend a funcionar na porta 5000`. Deixe este terminal aberto.

### 3. Iniciar o Frontend

-   Abra a pasta do projeto no VS Code.
-   No explorador de ficheiros, vá até a pasta `frontend`.
-   Clique com o botão direito no ficheiro `login.html` e selecione **"Open with Live Server"**.

### 4. Aceder ao Sistema

-   O seu navegador abrirá na tela de login. Use as seguintes credenciais de administrador para aceder:
    -   **Matrícula:** `admin`
    -   **Senha:** `admin123`


 Script SQL Completo (database.sql)
Este ficheiro único prepara todo o seu banco de dados, desde a criação até a inserção do primeiro utilizador.

-- Apaga o banco de dados antigo, se existir, para uma instalação limpa.
DROP DATABASE IF EXISTS pontodb;

-- Cria o novo banco de dados.
CREATE DATABASE pontodb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seleciona o banco de dados para os próximos comandos.
USE pontodb;

-- Cria a tabela de funcionários.
CREATE TABLE `funcionarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `matricula` varchar(255) NOT NULL,
  `nome_completo` varchar(255) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `perfil` varchar(255) NOT NULL DEFAULT 'funcionario',
  PRIMARY KEY (`id`),
  UNIQUE KEY `matricula` (`matricula`)
) ENGINE=InnoDB;

-- Cria a tabela para os registros de ponto.
CREATE TABLE `registrosponto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `data_registro` date NOT NULL,
  `horario_registro` time NOT NULL,
  `tipo_registro` varchar(255) NOT NULL,
  `funcionario_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `funcionario_id` (`funcionario_id`),
  CONSTRAINT `registrosponto_ibfk_1` FOREIGN KEY (`funcionario_id`) REFERENCES `funcionarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Insere o utilizador administrador padrão.
-- Senha: admin123 (em texto simples, sem criptografia)
INSERT INTO `funcionarios` (matricula, nome_completo, senha_hash, perfil)
VALUES ('admin', 'Administrador do Sistema', 'admin123', 'admin');
