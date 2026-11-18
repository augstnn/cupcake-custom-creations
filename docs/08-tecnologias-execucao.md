# 8. Tecnologias e execução

## 8.1 Tecnologias identificadas no repositório

As tecnologias abaixo constam nas dependências e scripts do package.json consultado:

| Tecnologia | Uso |
|---|---|
| React 19 | Interface do usuário. |
| TypeScript | Linguagem e tipagem. |
| TanStack Start | Estrutura da aplicação. |
| TanStack Router | Rotas. |
| Vite | Servidor de desenvolvimento e build. |
| Supabase JS | Cliente de integração com Supabase. |
| Tailwind CSS 4 | Estilização. |
| Drizzle ORM e Drizzle Kit | Recursos de ORM e configuração de schema/migrations. |
| Vitest | Testes automatizados. |
| ESLint | Análise estática e padronização. |
| Prettier | Formatação do código. |

## 8.2 Pré-requisitos

- Git instalado.
- Node.js em versão compatível com as dependências atuais.
- npm.
- Acesso ao projeto Supabase, quando necessário para executar funções integradas.
- Variáveis de ambiente configuradas conforme a implementação.

## 8.3 Clonar e instalar

```bash
git clone https://github.com/augstnn/cupcake-custom-creations.git
cd cupcake-custom-creations
npm install
```

## 8.4 Executar em desenvolvimento

```bash
npm run dev
```

O comando inicia o ambiente de desenvolvimento configurado no projeto.

## 8.5 Outros comandos disponíveis

```bash
npm run build
npm run preview
npm run lint
npm run test
npm run test:watch
```

- build: gera a versão de produção.
- preview: permite visualizar localmente a build.
- lint: executa o ESLint.
- test: executa os testes com Vitest.
- test:watch: mantém os testes em modo de observação.

## 8.6 Variáveis de ambiente e credenciais

Consulte os arquivos de configuração e a implementação do cliente Supabase para identificar os nomes exatos das variáveis exigidas. Não foram reproduzidos valores secretos nesta documentação.

Boas práticas:

- manter o .env fora do controle de versão;
- disponibilizar apenas um .env.example sem valores secretos, se necessário;
- usar chaves públicas somente nos contextos previstos pelo Supabase;
- nunca expor service_role, senhas ou tokens privados no frontend;
- revisar as permissões e políticas de acesso antes de publicar.

## 8.7 Publicação

O README do projeto informa uma versão publicada no Lovable: https://cupcake-custom-creations.lovable.app. O processo de publicação e as variáveis do ambiente de produção devem ser conferidos nas configurações efetivamente utilizadas pelo projeto.
