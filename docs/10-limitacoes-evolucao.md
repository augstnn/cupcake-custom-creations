# 10. Limitações e evolução do projeto

## 10.1 Escopo inicial

O README do repositório estabelece uma primeira versão com foco no catálogo, cadastro e login de clientes, detalhes e personalização dos produtos, carrinho, criação e acompanhamento de pedidos e painel administrativo.

A operação inicial foi delimitada para retirada na loja. O pagamento poderá ocorrer na retirada ou ser simulado, conforme a configuração definida para a etapa.

## 10.2 Funcionalidades previstas para etapas futuras

| Funcionalidade | Situação indicada no README |
|---|---|
| Pagamento online | Adiado; início com pagamento na retirada ou simulado. |
| Entrega em domicílio | Adiada; inicialmente somente retirada na loja. |
| Integração com entregadores | Não necessária na etapa inicial. |
| Relatórios avançados | Previstos para depois que houver pedidos reais. |
| Histórico completo de compras | Previsto para etapa posterior. |
| Pesquisa e filtros avançados | Catálogo inicial simples. |
| Recuperação personalizada de senha | Solução básica inicialmente. |

## 10.3 Evolução sugerida

1. Validar o fluxo completo de cadastro, catálogo, personalização, carrinho e pedido.
2. Revisar regras de acesso e segurança dos dados.
3. Documentar o modelo físico do banco a partir das migrations reais.
4. Ampliar testes automatizados e registrar resultados.
5. Avaliar a implementação de histórico e relatórios.
6. Planejar integração de pagamento online.
7. Planejar entrega em domicílio e integração logística, se necessário.

## 10.4 Critérios para priorização

As próximas funcionalidades devem ser priorizadas considerando valor para o cliente, necessidade operacional da loja, complexidade técnica, segurança, custo de manutenção e disponibilidade de tempo.

## 10.5 Limitações desta documentação

Esta documentação foi construída com base no README e nas dependências visíveis no repositório. A estrutura interna completa de telas, tabelas, políticas, endpoints, regras de preço e permissões deve ser validada diretamente no código e no projeto Supabase. Os itens descritos como requisitos ou modelos conceituais não significam que já estejam implementados.
