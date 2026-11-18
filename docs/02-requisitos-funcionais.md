# 2. Requisitos funcionais

Os requisitos funcionais descrevem serviços que o sistema deve oferecer. A lista abaixo formaliza o escopo declarado no README do projeto. A situação de cada requisito deve ser confirmada no aplicativo antes de ser apresentada como implementação concluída.

| Código | Requisito | Descrição |
|---|---|---|
| RF01 | Cadastro de cliente | O sistema deve permitir que um visitante crie uma conta informando os dados solicitados pela aplicação. |
| RF02 | Autenticação | O sistema deve permitir que um cliente cadastrado acesse sua conta por meio de autenticação. |
| RF03 | Catálogo | O sistema deve apresentar os cupcakes disponíveis para consulta. |
| RF04 | Detalhes do produto | O sistema deve apresentar informações individuais do cupcake selecionado. |
| RF05 | Personalização | O sistema deve permitir selecionar opções de personalização disponibilizadas para o produto. |
| RF06 | Carrinho | O sistema deve permitir adicionar, consultar e remover itens do carrinho. |
| RF07 | Revisão do pedido | O sistema deve apresentar os itens e as personalizações escolhidas antes da confirmação. |
| RF08 | Criação do pedido | O sistema deve registrar a solicitação do cliente com os dados necessários ao atendimento. |
| RF09 | Acompanhamento | O sistema deve permitir consultar a situação do pedido, conforme os estados definidos pela loja. |
| RF10 | Administração | O sistema deve disponibilizar área administrativa para as atividades de gestão previstas no projeto. |
| RF11 | Gestão de catálogo | A área administrativa deve permitir manter as informações dos produtos, caso esse recurso esteja habilitado na versão entregue. |
| RF12 | Gestão de pedidos | A área administrativa deve permitir visualizar e atualizar pedidos, conforme as permissões implementadas. |

## 2.1 Requisitos fora da primeira versão

Conforme o README atual, os itens abaixo foram adiados:

- Pagamento online integrado. Na etapa inicial, está previsto pagamento na retirada ou simulado.
- Entrega em domicílio; inicialmente, o atendimento será por retirada na loja.
- Integração com entregadores.
- Relatórios avançados.
- Histórico completo de compras.
- Pesquisa e filtros avançados.
- Recuperação personalizada de senha.

## 2.2 Critérios gerais de aceitação

- As telas devem apresentar informações coerentes com a ação solicitada.
- Os dados obrigatórios devem ser validados antes do envio.
- O cliente deve receber retorno compreensível após operações de cadastro e pedido.
- Um pedido deve preservar os produtos e as personalizações selecionadas no momento da confirmação.
- Recursos administrativos devem ser acessíveis somente a usuários autorizados.

> Os critérios específicos de cada tela e os estados efetivamente utilizados devem ser ajustados após conferência do código-fonte.
