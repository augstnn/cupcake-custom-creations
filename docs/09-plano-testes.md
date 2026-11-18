# 9. Plano de testes

## 9.1 Objetivo

Definir uma estratégia mínima para verificar se as principais funcionalidades do Cupcake Custom Creations atendem aos requisitos e se alterações no código não comprometem fluxos existentes.

O package.json declara Vitest e scripts para execução de testes. A existência da ferramenta não comprova, por si só, a cobertura ou aprovação dos testes.

## 9.2 Tipos de teste recomendados

- **Testes unitários:** verificar funções isoladas, cálculos, validações e regras.
- **Testes de componentes:** verificar formulários, mensagens, botões e estados da interface.
- **Testes de integração:** verificar comunicação entre interface, serviços e persistência.
- **Testes de fluxo:** simular navegação do catálogo até a confirmação do pedido.
- **Testes de autorização:** confirmar que recursos administrativos não são acessíveis por usuários sem permissão.
- **Testes responsivos:** verificar o uso em diferentes tamanhos de tela.

## 9.3 Cenários sugeridos

| ID | Cenário | Resultado esperado |
|---|---|---|
| CT01 | Abrir o catálogo | Produtos disponíveis são apresentados corretamente. |
| CT02 | Abrir detalhes de um produto | Informações correspondentes ao produto são exibidas. |
| CT03 | Tentar cadastrar com campos obrigatórios vazios | Sistema informa os campos que precisam ser corrigidos. |
| CT04 | Realizar cadastro com dados válidos | Conta é criada ou o sistema informa eventual falha. |
| CT05 | Selecionar personalizações | Escolhas são refletidas no item selecionado. |
| CT06 | Adicionar item ao carrinho | Item aparece no carrinho com as opções selecionadas. |
| CT07 | Remover item do carrinho | Item deixa de compor o carrinho. |
| CT08 | Confirmar pedido com dados válidos | Pedido é registrado uma única vez. |
| CT09 | Simular falha na comunicação | Sistema apresenta erro sem indicar sucesso indevido. |
| CT10 | Acessar área administrativa sem autorização | Acesso é bloqueado. |
| CT11 | Abrir aplicação em tela estreita | Conteúdo permanece utilizável e legível. |

## 9.4 Execução

```bash
npm run test
```

Para desenvolver ou depurar testes:

```bash
npm run test:watch
```

## 9.5 Registro dos resultados

Para cada execução, registrar:

- data da execução;
- versão ou commit testado;
- cenário executado;
- resultado obtido;
- resultado esperado;
- evidência, quando aplicável;
- defeitos encontrados e situação da correção.

Não declarar que os cenários foram aprovados sem executá-los no ambiente correspondente.
