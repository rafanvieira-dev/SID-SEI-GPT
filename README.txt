# SID-SEI — Protótipo Web

Protótipo funcional baseado no Documento de Visão do SID-SEI — Sistema de Controle de Digitalização e Inserção no SEI.

## Arquivos

- `index.html` — estrutura da aplicação
- `style.css` — interface responsiva
- `script.js` — lógica, fluxo, dados de demonstração e armazenamento local

## Como executar

Abra o arquivo `index.html` diretamente no navegador.

Não é necessário instalar servidor para testar esta versão.

## Funcionalidades implementadas

- Dashboard com indicadores
- Cadastro de solicitações
- Consulta, pesquisa e filtros
- Fluxo de recebimento
- Registro de digitalização
- Associação de arquivo, formato e quantidade de páginas
- Conferência com aprovação/reprovação
- Controle de nova digitalização
- Registro da inserção no SEI
- Histórico e rastreabilidade
- Perfis e usuários
- Relatórios/indicadores
- Exportação CSV
- Armazenamento local no navegador
- Interface responsiva

## Limitação importante

Esta é uma primeira versão de protótipo. O Documento de Visão informa que banco de dados, requisitos não funcionais, casos de uso, mecanismos de controle, perfis detalhados e outros aspectos ainda deverão ser especificados.

Para produção institucional, o armazenamento em `localStorage` deve ser substituído por backend, banco de dados, autenticação real, controle de acesso, armazenamento seguro de arquivos e auditoria persistente.

## Fluxo

Solicitação → Recebimento → Digitalização → Conferência → Liberação → Inserção no SEI → Conclusão
