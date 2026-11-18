# 7. Casos de uso

## 7.1 Atores

- **Visitante:** pessoa que acessa o catálogo sem necessariamente estar autenticada.
- **Cliente:** usuário que possui conta e utiliza as funções de pedido.
- **Administrador:** usuário autorizado a executar tarefas de gestão.

A disponibilidade de cada ação deve respeitar as permissões efetivamente implementadas.

## 7.2 Casos de uso principais

| Código | Ator | Caso de uso | Resultado esperado |
|---|---|---|---|
| UC01 | Visitante/Cliente | Consultar catálogo | Visualizar os produtos disponíveis. |
| UC02 | Visitante | Criar conta | Registrar uma conta de cliente. |
| UC03 | Cliente | Entrar no sistema | Acessar as funções permitidas à conta. |
| UC04 | Cliente | Consultar produto | Visualizar detalhes de um cupcake. |
| UC05 | Cliente | Personalizar produto | Selecionar opções disponíveis. |
| UC06 | Cliente | Gerenciar carrinho | Adicionar, revisar ou remover itens. |
| UC07 | Cliente | Confirmar pedido | Registrar a solicitação após a revisão. |
| UC08 | Cliente | Acompanhar pedido | Consultar o estado da solicitação. |
| UC09 | Administrador | Gerenciar catálogo | Manter informações de produtos, se habilitado. |
| UC10 | Administrador | Gerenciar pedidos | Consultar e atualizar pedidos, conforme permissões. |

## 7.3 Fluxo principal — realizar pedido

**Pré-condição:** o catálogo está disponível e o cliente consegue acessar as funções necessárias.

1. O cliente abre o catálogo.
2. Seleciona um cupcake.
3. Consulta os detalhes.
4. Escolhe as personalizações disponíveis.
5. Adiciona o item ao carrinho.
6. Repete o processo caso queira incluir outros itens.
7. Abre o carrinho e confere a seleção.
8. Informa os dados solicitados pelo sistema.
9. Confirma o pedido.
10. O sistema registra o pedido e apresenta o retorno da operação.

**Pós-condição:** o pedido fica registrado se a operação for concluída com sucesso.

## 7.4 Fluxo alternativo — dados inválidos

1. Durante o cadastro ou confirmação, o cliente informa dados inválidos ou deixa campos obrigatórios vazios.
2. O sistema identifica a inconsistência.
3. A operação não deve ser confirmada.
4. O sistema apresenta orientação para correção.
5. O cliente ajusta os dados e tenta novamente.

## 7.5 Fluxo administrativo

1. O administrador acessa a área restrita.
2. O sistema verifica sua autenticação e autorização.
3. O administrador acessa os recursos permitidos.
4. Realiza a consulta ou alteração necessária.
5. O sistema valida e registra a operação.

O fluxo detalhado deve ser atualizado de acordo com as telas e permissões existentes no projeto.
