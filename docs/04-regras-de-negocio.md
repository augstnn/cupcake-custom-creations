# 4. Regras de negócio

As regras abaixo formalizam o funcionamento esperado a partir do escopo descrito no README. Regras dependentes de decisões comerciais ainda não registradas devem ser confirmadas com o responsável pelo projeto.

| Código | Regra |
|---|---|
| RN01 | O catálogo deve apresentar somente produtos que a loja disponibilizar para consulta ou pedido. |
| RN02 | As opções de personalização devem respeitar as opções cadastradas para cada produto. |
| RN03 | O carrinho deve refletir os produtos e as personalizações selecionadas pelo cliente. |
| RN04 | Antes de confirmar o pedido, o cliente deve poder revisar os itens selecionados. |
| RN05 | O pedido deve registrar informações suficientes para identificar os itens e suas personalizações. |
| RN06 | O cliente deve conseguir consultar o andamento do pedido de acordo com as permissões e funcionalidades disponíveis. |
| RN07 | Operações administrativas devem ser restritas a usuários autorizados. |
| RN08 | Na versão inicial, a modalidade de atendimento prevista é retirada na loja. |
| RN09 | O pagamento online integrado não faz parte do escopo inicial descrito no README; o projeto prevê pagamento na retirada ou simulado. |

## 4.1 Definições que precisam ser confirmadas

Antes de considerar as regras completas, o responsável pelo sistema deve definir:

- Quais campos são obrigatórios no cadastro do cliente.
- Quais opções de personalização existem e se alteram o preço.
- Como são calculados preços, quantidades, descontos e total do pedido.
- Quais status um pedido pode assumir e quem pode alterá-los.
- Se o pedido pode ser editado ou cancelado após a confirmação.
- Como será feita a confirmação do pagamento na retirada.
- Quais dados o administrador pode consultar ou alterar.

Essas definições não foram inventadas nesta documentação porque dependem das regras reais da loja e da implementação.
