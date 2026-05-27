# Lumière 🎬 - Guia de Inicialização e Testes (Manual do Desenvolvedor)

Bem-vindo ao repositório de desenvolvimento do **Lumière**! Este guia contém o passo a passo completo para configurar, executar e testar todo o ecossistema da aplicação (Frontend em React, Backend em Node.js com Banco de Dados e Backend em Python com Agente de IA).

---

## 🚀 Como Executar o Projeto do Zero

Certifique-se de que você possui o **Node.js** e o **Python** instalados em sua máquina.

### Passo 1: Acessar a Branch de Desenvolvimento
Abra o seu terminal na pasta onde deseja baixar o projeto e execute:
```bash
# Clonar o repositório
git clone https://github.com/MrFelps/lumiere.git
cd lumiere

# Mudar para a branch correta de desenvolvimento
git checkout dev
```

---

### Passo 2: Inicializar o Backend Node.js (Autenticação e Feed)
Este backend é responsável por cadastrar os usuários, fazer login e gerenciar as listas e comentários. **Ele já possui banco de dados embutido e portátil (SQLite) pré-configurado!**

```bash
# Navegar até a pasta do backend Node
cd lumiere-api-backend/backend-node

# Instalar as dependências do banco de dados (SQLite3, PG, Bcrypt, JWT)
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```
> 🔌 **Nota de QA:** No momento em que você rodar `npm run dev`, o backend criará automaticamente o arquivo de banco de dados `database.db` local e gerará todas as tabelas e relacionamentos sozinho. **Você não precisa instalar nenhum servidor de banco de dados externo ou rodar scripts SQL manualmente!**

---

### Passo 3: Inicializar o Backend Python FastAPI (Chatbot e Recomendador LumIA)
Este servidor roda o agente inteligente de recomendação que faz perguntas ao usuário (quiz) e analisa os dados em tempo real.

Abra um novo terminal na raiz do projeto e execute:
```bash
# Navegar até a pasta do backend Python
cd lumiere-app-frontend/backend

# Instalar as bibliotecas necessárias (caso ainda não possua)
pip install fastapi uvicorn pydantic python-dotenv requests

# Iniciar o servidor FastAPI com Uvicorn bindado em IPv4 local
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

---

### Passo 4: Inicializar o Frontend (Interface React + Vite)
Abra um terceiro terminal na raiz do projeto e execute:
```bash
# Navegar até a pasta do frontend React
cd lumiere-app-frontend/frontend

# Instalar as dependências visuais
npm install

# Iniciar o servidor local do Vite
npm run dev
```

Abra o seu navegador no endereço indicado (geralmente **`http://localhost:5173`**).

---

## 🕵️‍♂️ Roteiro de Testes e Controle de Qualidade (QA)

Siga este roteiro para testar todas as funcionalidades dinâmicas e persistentes integradas com a API do TMDB e o Banco de Dados.

### Teste A: Cadastro e Login Real
1. Acesse `http://localhost:5173/cadastro` no navegador.
2. Preencha todos os campos (Nome, Sobrenome, Nome de usuário, E-mail, Senha e Data de Nascimento) e clique em **Criar Conta**.
3. Faça o login na tela seguinte usando o e-mail e senha criados.
4. **Verificação de Persistência:** Você será direcionado para o perfil e ele exibirá o **seu nome**, as iniciais corretas no avatar (ex: `FJ` para `Felipe de Jesus`) e a data de criação dinâmica.

### Teste B: Perfil da "Rede Social" Iniciado do Zero
* Como a conta é nova, você verá suas estatísticas perfeitamente zeradas:
  * 0 Filmes Assistidos, 0 Seguidores, 0 Seguindo, 0 Avaliações, 0 Listas.
* O carrossel de *"Assistidos Recentemente"* já trará dinamicamente filmes reais buscados direto da API do TMDB, e ao clicar neles você navegará para a tela de detalhes.
* **Editar Perfil:** Clique em *"Editar Perfil"*, altere seu nome ou a biografia, e salve. Os dados serão atualizados e persistidos direto no arquivo do banco de dados `database.db`.

### Teste C: Conversar com a LumIA (Quiz e Recomendador)
1. Clique no botão de IA com ícone de estrelas (`✨`) no topo da página.
2. Inicie a recomendação inteligente.
3. Responda às perguntas dinâmicas do quiz geradas pelo agente em Python.
4. **Verificação da IA:** A IA analisará suas respostas e listará **4 indicações reais de filmes do TMDB** sob medida, contendo sinopse, capa oficial e avaliação!

---

## ⚙️ Teste de QA Automatizado de Banco de Dados
Para os desenvolvedores do grupo que quiserem rodar a suíte de testes de controle de qualidade física do banco de dados (verificando criptografia hash, chaves e contagens), basta rodar o comando:

```bash
cd lumiere-api-backend/backend-node
node qa-test.js
```
A suíte retornará o status de **PASSED** para todas as tabelas e funções testadas diretamente no arquivo local do banco.
