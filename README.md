# Cupcake Custom Creations

Aplicação web para uma loja de cupcakes personalizados. O projeto tem como objetivo permitir que clientes conheçam os produtos, personalizem cupcakes e organizem pedidos, enquanto a administração acompanha e gerencia as operações da loja.

> **Estado da documentação:** elaborada a partir das informações públicas do repositório, do README existente e das dependências declaradas no projeto. Os itens identificados como planejados ou sujeitos à validação não devem ser interpretados como funcionalidades já concluídas.

## Objetivos do sistema

- Apresentar um catálogo de cupcakes.
- Permitir cadastro e autenticação de clientes.
- Exibir detalhes dos produtos.
- Oferecer opções de personalização.
- Organizar produtos em um carrinho.
- Registrar e acompanhar pedidos.
- Disponibilizar recursos administrativos para a gestão da loja.

## Escopo inicial

A primeira versão prioriza o fluxo de compra com retirada na loja. O README do projeto informa que pagamento online, entrega em domicílio, integração com entregadores, relatórios avançados, histórico completo de compras, filtros avançados e recuperação personalizada de senha ficam para etapas posteriores. O pagamento inicial pode ocorrer na retirada ou por simulação, conforme a definição do projeto.

## Tecnologias identificadas

- React 19 e TypeScript
- TanStack Start e TanStack Router
- Vite
- Supabase JavaScript Client
- Tailwind CSS 4
- Drizzle ORM e Drizzle Kit
- Vitest para testes automatizados

As versões e dependências devem ser conferidas no package.json do repositório, pois podem mudar durante o desenvolvimento.

## Estrutura da documentação

| Arquivo | Conteúdo |
|---|---|
| [Introdução e objetivos](docs/01-introducao-objetivos.md) | Contexto, problema, justificativa e objetivos |
| [Requisitos funcionais](docs/02-requisitos-funcionais.md) | Serviços e comportamentos esperados |
| [Requisitos não funcionais](docs/03-requisitos-nao-funcionais.md) | Qualidade, segurança e usabilidade |
| [Regras de negócio](docs/04-regras-de-negocio.md) | Restrições do processo da loja |
| [Arquitetura](docs/05-arquitetura.md) | Organização técnica e componentes |
| [Dados](docs/06-modelagem-dados.md) | Diretrizes para documentação do banco |
| [Casos de uso](docs/07-casos-de-uso.md) | Atores e fluxos principais |
| [Tecnologias e execução](docs/08-tecnologias-execucao.md) | Ferramentas e instruções de desenvolvimento |
| [Plano de testes](docs/09-plano-testes.md) | Estratégia e cenários de teste |
| [Limitações e evolução](docs/10-limitacoes-evolucao.md) | Escopo atual e melhorias futuras |

## Executar localmente

Pré-requisitos: Node.js compatível com as dependências do projeto, npm e acesso às configurações necessárias do Supabase.

```bash
git clone https://github.com/augstnn/cupcake-custom-creations.git
cd cupcake-custom-creations
npm install
npm run dev
```

Os comandos acima seguem as instruções básicas do repositório. Para compilar, validar estilo e executar testes, os scripts declarados são:

```bash
npm run build
npm run lint
npm run test
```

A aplicação pode depender de variáveis de ambiente e de serviços externos. Configure-as conforme os arquivos de configuração do projeto e do painel Supabase. **Não publique chaves privadas, tokens ou senhas no GitHub.** O arquivo .env não deve ser versionado.

## Ambiente publicado

O README do repositório informa o endereço de demonstração:  
https://cupcake-custom-creations.lovable.app

## Repositório

https://github.com/augstnn/cupcake-custom-creations

## Observação acadêmica

Esta documentação descreve o escopo declarado e a estrutura técnica identificada no repositório. Antes da entrega final, recomenda-se conferir no código e no Supabase quais funcionalidades estão efetivamente implementadas, quais tabelas e relacionamentos existem e quais testes foram executados. Não se afirma que funcionalidades planejadas já estejam concluídas.
