# 3. Requisitos não funcionais

Os requisitos não funcionais definem características de qualidade esperadas para o sistema.

| Código | Requisito | Diretriz |
|---|---|---|
| RNF01 | Usabilidade | A navegação deve ser clara, com textos objetivos e fluxo de pedido compreensível. |
| RNF02 | Responsividade | As páginas devem se adaptar a diferentes larguras de tela, especialmente computadores e celulares. |
| RNF03 | Segurança | Dados e operações devem ser protegidos por autenticação, autorização e validação no backend. |
| RNF04 | Privacidade | Dados pessoais devem ser coletados somente quando necessários ao funcionamento do serviço e tratados com cuidado. |
| RNF05 | Integridade | O sistema deve evitar pedidos inconsistentes e preservar a relação entre pedido, itens e personalizações. |
| RNF06 | Manutenibilidade | O código deve permanecer organizado em módulos e componentes com responsabilidades compreensíveis. |
| RNF07 | Compatibilidade | A aplicação deve funcionar em navegadores modernos compatíveis com as tecnologias utilizadas. |
| RNF08 | Desempenho | As páginas e operações comuns devem apresentar tempo de resposta adequado ao uso cotidiano. |
| RNF09 | Confiabilidade | Falhas de comunicação ou validação devem gerar mensagens compreensíveis, sem confirmar operações não concluídas. |
| RNF10 | Configuração segura | Credenciais e segredos devem ser mantidos em variáveis de ambiente ou configurações protegidas, nunca no repositório público. |

## 3.1 Segurança e proteção de dados

- Aplicar controle de acesso às funções administrativas.
- Validar dados tanto na interface quanto nas operações de backend.
- Configurar corretamente as políticas de acesso do Supabase, incluindo Row Level Security (RLS) quando aplicável.
- Não confiar exclusivamente em controles visuais para restringir operações.
- Não armazenar senhas em texto simples.
- Não incluir chaves privadas, tokens ou dados reais de clientes em arquivos versionados.
- Utilizar somente dados fictícios em demonstrações e testes.

## 3.2 Observação

As diretrizes desta seção são requisitos recomendados para o sistema. A documentação não constitui prova de que todos já foram implementados ou auditados.
