# EYI Store · React + TypeScript

E-commerce responsivo inspirado na referência EYI, com React, TypeScript e Vite. Esta é a conversão completa para componentes React; não é uma página HTML inserida via `innerHTML`.

## Rodar no computador

Requisito: Node.js 22.12 ou superior.

1. Extraia o ZIP.
2. Abra a pasta `EYI-Store-React` no VS Code.
3. Abra o terminal nessa pasta e execute:

```sh
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

Para reproduzir exatamente as versões do arquivo de lock, use `npm ci` no lugar de `npm install`.

## Comandos

```sh
npm run dev        # Desenvolvimento com atualização automática
npm run typecheck  # Verificação de tipos TypeScript
npm test           # Testes de paginação, filtros, ordenação e cancelamento
npm run build      # Verificação TypeScript + build de produção em dist/
npm run preview    # Prévia local após o build
npm run format     # Formatação do código-fonte
```

## Organização

| Pasta ou arquivo                | Responsabilidade                                                                 |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `src/main.tsx`                  | Inicialização do React e importação dos estilos                                  |
| `src/App.tsx`                   | Rotas e provedores da aplicação                                                  |
| `src/pages/`                    | Início, catálogo, detalhes, favoritos, carrinho, checkout, conta, pedido e ajuda |
| `src/components/layout/`        | Cabeçalho, rodapé, logo, navegação mobile e estrutura comum                      |
| `src/components/product/`       | Cards, grid, carrossel de produtos e carrossel principal                         |
| `src/components/cart/`          | Linha do carrinho e resumo do pedido                                             |
| `src/components/ui/`            | Ícones, seletor de quantidade, estado vazio e notificações                       |
| `src/contexts/StoreContext.tsx` | Estado compartilhado do carrinho, favoritos, cupom e pedidos                     |
| `src/hooks/`                    | Hooks para carregamento de produtos e persistência local                         |
| `src/services/productsApi.ts`   | Comunicação HTTP com a DummyJSON e catálogo de segurança                         |
| `src/types/`                    | Interfaces dos produtos, carrinho e pedidos                                      |
| `src/utils/`                    | Formatação de valores e agrupamento de categorias                                |
| `src/styles/`                   | Estilos CSS separados por área e responsividade, sem estilos inline no JSX       |
| `public/assets/`                | Logo e cópia de segurança do catálogo                                            |
| `vite.config.ts`                | Configuração do Vite                                                             |
| `tsconfig.json`                 | Configuração TypeScript com modo estrito                                         |
| `package.json`                  | Dependências e scripts                                                           |
| `package-lock.json`             | Versões exatas das dependências                                                  |

## Funcionalidades

- Catálogo paginado na DummyJSON com `limit` e `skip`; nunca usa `limit=0`.
- Botão **Ver mais** na página inicial e no catálogo: acrescenta até 12 produtos por clique.
- Cabeçalho, conteúdo e rodapé aproveitam a largura disponível, com margens responsivas.
- Animações de entrada, revelação ao rolar, troca de destaque e feedback de botões; respeitam `prefers-reduced-motion`.
- Busca e ordenação na API; categorias agrupadas mesclam páginas ordenadas sem carregar todo o catálogo.
- Preço, avaliação e ofertas são filtrados ao percorrer os lotes. Filtros restritivos podem exigir mais de uma requisição para completar 12 resultados.
- Mudar a busca, categoria ou filtros cancela a requisição anterior e reinicia a seleção.
- Botão com estado de carregamento, proteção contra cliques repetidos e aviso ao final da lista.
- Detalhes abertos por link direto e favoritos restaurados carregam apenas os IDs necessários.
- Carrosséis com indicadores e rolagem por toque.
- Detalhes do produto, galeria e controle de quantidade limitado pelo estoque.
- Favoritos e carrinho persistidos no navegador.
- Cupom `EYI10` para desconto demonstrativo de 10% no subtotal.
- Frete e checkout simulados, confirmação e histórico local de pedidos.
- Layout adaptado para computador e celular.
- Rotas via `HashRouter`, compatíveis com hospedagem estática.
- Catálogo de segurança local quando a API não estiver disponível.

## Comportamento demonstrativo

Não há backend de pedidos, autenticação real ou processamento de pagamentos. A conta mostra apenas o histórico deste navegador. Use dados fictícios no checkout. Endereço e e-mail não são persistidos nem enviados para um servidor de pedidos. A newsletter é uma simulação e não cadastra e-mails.

Os números retornados pela API são apresentados como valores ilustrativos em reais, sem conversão cambial. O preço riscado é calculado a partir do percentual de desconto da API. A interface usa português; títulos e descrições dos produtos preservam o idioma original da API.

O ZIP não contém `node_modules` nem o resultado de build: essas pastas são geradas pelos comandos acima. O site hospedado anteriormente continua sendo a versão HTML/JavaScript; este ZIP contém a nova versão React/TypeScript.

## Validação

A checagem de tipos e o build de produção foram executados com sucesso. Os testes automatizados verificam lotes de 12 itens, ausência de duplicação, fim da lista, ordenação entre categorias, filtros, recuperação de falhas e cancelamento. A navegação e o botão Ver mais também foram conferidos no navegador.
