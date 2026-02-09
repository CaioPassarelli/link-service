# Link Service (Encurtador de URL)

API escalável para encurtamento de URLs, desenvolvida com **NestJS**, **Prisma**, **PostgreSQL** e **Docker**.

## Funcionalidades

- **Autenticação:** Login e Cadastro com JWT (JSON Web Token).
- **Encurtamento:** Geração de URLs curtas (6 caracteres) com NanoID.
- **Redirecionamento:** Acesso rápido e contagem de cliques.
- **Gestão:**
  - Usuários podem listar, editar e excluir suas próprias URLs.
  - Soft Delete (exclusão lógica) para auditoria e segurança.
- **Documentação:** Swagger UI interativo.

## Tecnologias

- [NestJS](https://nestjs.com/) - Framework Node.js progressivo.
- [Prisma](https://www.prisma.io/) - ORM moderno.
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional.
- [Docker](https://www.docker.com/) - Containerização completa.
- [NanoID](https://github.com/ai/nanoid) - Geração de IDs únicos e seguros.
- [Swagger](https://swagger.io/) - Documentação da API.

## Como Rodar (Docker)

A maneira mais simples de rodar o projeto é utilizando Docker Compose.

### Pré-requisitos
- Docker e Docker Compose instalados.

## Nota para Usuários Windows

Este projeto foi desenvolvido em ambiente Linux. Para garantir a melhor experiência ao rodar no Windows, recomendo fortemente o uso do **WSL 2 (Windows Subsystem for Linux)** ou do terminal **Git Bash**.

Caso opte por usar o **PowerShell**, atente-se aos seguintes ajustes:

1. **Geração do JWT Secret:**
   O comando `openssl` pode não estar disponível nativamente. Utilize o comando abaixo no PowerShell para gerar uma hash segura:
   ```powershell
   [Convert]::ToBase64String((1..32 | %{ [byte](Get-Random -Max 256) }))

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SEU_USUARIO/link-service.git](https://github.com/SEU_USUARIO/link-service.git)
   cd link-service
   ```

2. **Configure as Variáveis de Ambiente:**
   Copie o arquivo de exemplo para criar o seu `.env`:
   ```bash
   cp .env.example .env
   ```

3. **Gere uma chave segura para o JWT:**
   Rode o comando abaixo no terminal para gerar um hash aleatório e seguro:
   ```bash
   openssl rand -base64 32
   ```
   *Copie o resultado e cole na variável `JWT_SECRET` dentro do arquivo `.env` que você acabou de criar.*

4. **Suba a aplicação:**
   ```bash
   docker compose up --build
   ```
   *Aguarde até ver a mensagem "Nest application successfully started".*

   Obs: A primeira execução pode demorar alguns minutos para baixar as imagens e instalar as dependências. As execuções subsequentes serão muito mais rápidas devido ao cache do Docker.

5. **Acesse:**
   - **API:** http://localhost:3000
   - **Swagger Docs:** http://localhost:3000/api
## Decisões de Arquitetura

### 1. Geração de Short IDs
Optei pela biblioteca **NanoID (v3)** ao invés de soluções nativas ou UUID.
- **Motivo:** O NanoID é URL-friendly, mais rápido que UUID e possui baixa probabilidade de colisão mesmo com apenas 6 caracteres, ideal para URLs curtas.

### 2. Soft Delete
Implementado o padrão de "Exclusão Lógica" (campo `deletedAt`).
- **Motivo:** Preservar o histórico de dados e integridade referencial, além de permitir auditoria futura ou recuperação de dados acidentais.

### 3. Autenticação JWT Stateless
- **Motivo:** Permite escalabilidade horizontal, já que o servidor não precisa manter sessão em memória.

## Como Testar

Acesse a documentação do Swagger em `http://localhost:3000/api`.
1. Crie um usuário em `POST /auth/register`.
2. Faça login em `POST /auth/login` e copie o `access_token`.
3. Clique no botão **Authorize** no topo do Swagger e cole o token: `Bearer SEU_TOKEN`.