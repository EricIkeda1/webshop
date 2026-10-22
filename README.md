# EYI Store · React + TypeScript + servidor Node.js

Loja fictícia com interface responsiva, catálogo paginado, carrossel automático, favoritos, carrinho, checkout e página Institucional. A entrada exige confirmação de que o site é demonstrativo.

## Feedback de toque · versão 2.2.2

O realce retangular nativo de toque foi desativado em links, botões, campos, rótulos e demais controles interativos. A navegação mobile mantém a cápsula azul da aba ativa e a animação de toque existente. Botões e links preservam seus formatos arredondados.

O foco de teclado permanece visível e acompanha o formato dos controles. Na navegação inferior o indicador aparece ao redor da cápsula do ícone. Seleção de textos e funcionamento de formulários não foram desativados.

## Visibilidade e fixação do menu · versão 2.2.1

O botão hambúrguer e o painel de categorias são renderizados somente quando a área da página tem até 650 px. No desktop eles não são inseridos na interface. O cabeçalho e a barra com Início, Tecnologia, Beleza, Casa e decoração, Moda e Ofertas permanecem juntos no topo ao rolar em qualquer direção somente no desktop. No mobile, o cabeçalho acompanha a rolagem normal; a navegação inferior permanece disponível.

Se ainda aparecer “Todas as categorias” no desktop, a página está usando uma versão anterior: substitua os arquivos pelo conteúdo deste ZIP, execute novamente a compilação e, na Vercel, faça um novo deploy do projeto atualizado. O ZIP não atualiza automaticamente uma implantação existente.

## Navegação e ordenação · versão 2.2.0

No desktop, a barra de categorias contém Início, Tecnologia, Beleza, Casa e decoração, Moda e Ofertas. O botão Todas as categorias foi removido; o menu hambúrguer fica disponível apenas no mobile. O cabeçalho e a barra de categorias compartilham o mesmo bloco fixo durante a rolagem, com destaque do link atual.

O seletor de ordenação foi substituído por um painel inspirado no Material Design 3 Expressive: superfícies claras, cantos arredondados, ícones, indicador de seleção e animação respeitando movimento reduzido. Abre como diálogo no desktop e como painel inferior no mobile. A seleção aplica imediatamente Mais relevantes, Menor preço, Maior preço ou Melhor avaliação. Fechar, clicar no fundo ou pressionar Escape cancela a abertura sem alterar a opção atual. O foco fica contido no diálogo e retorna ao botão de origem.

Verificação: navegação desktop e mobile, cabeçalho durante a rolagem, aplicação de Menor preço, fechamento por Escape e menu mobile conferidos no navegador. Compilação e testes automatizados aprovados. Não houve novo deploy na sua conta Vercel.

## Imagens e carrosséis · versão 2.1.1

A cópia de segurança agora inclui as miniaturas dos 194 produtos e as fotos dos oito destaques (212 arquivos WebP). Elas são entregues pelas mesmas rotas `/api/catalog/products/...`, sem consultas externas de imagem quando a URL cadastrada corresponde à cópia local. O catálogo de produtos continua consultando a DummyJSON e recorrendo à cópia de segurança se a API falhar.

As imagens ficam em `server/data/product-images/`, dentro da Function da Vercel, e não são expostas como uma pasta pública. O servidor só utiliza uma imagem local quando ela corresponde exatamente à origem registrada. Produtos novos ou com URLs diferentes seguem pelo proxy existente; quando uma foto não está disponível, a interface mostra “Imagem indisponível”. Esta cópia melhora a disponibilidade, mas pode apresentar a foto capturada durante a atualização do pacote.

Para atualizar as imagens após atualizar `server/data/products.json`, execute `npm run sync:images`. Esse comando manual consulta o domínio fixo da DummyJSON, valida tipo e tamanho e salva as imagens conhecidas; não é necessário executá-lo no deploy. Inclua a pasta de imagens completa no repositório enviado à Vercel.

O carrossel de produtos calcula seus grupos pela largura disponível, incluindo o último grupo parcial. Os indicadores acompanham a rolagem e se adaptam ao redimensionamento. No mobile os alvos de toque são maiores, preservando as bolinhas visuais.

Verificação: compilação e testes de API, paginação, CEP, frete, Vercel, imagens durante indisponibilidade e grupos do carrossel aprovados. As fotos foram conferidas na prévia em áreas de 320 e 390 px, e o último grupo do carrossel foi alcançado pelo indicador correspondente. Não houve teste em aparelho físico nem deploy na sua conta Vercel.

## Interface mobile · versão 2.1.0

Em telas de até 650 px, a interface segue a referência EYI enviada: cabeçalho escuro com logo central, busca arredondada, menu de categorias em diálogo, quatro abas na navegação inferior, filtros em painel e cards em duas colunas. O carrinho continua disponível no cabeçalho. O desktop preserva a apresentação anterior.

O banner mobile foi reduzido para mostrar os produtos mais cedo. A troca automática a cada 5 segundos, controles de pausa, carrossel de produtos, botão Ver mais, favoritos, carrinho, aviso inicial e páginas existentes foram mantidos. As preferências de redução de movimento continuam respeitadas.

Os filtros mobile são editados antes da confirmação: **Aplicar filtros** atualiza o catálogo, **Limpar** restaura as opções do painel e fechar o painel descarta mudanças não aplicadas. Os diálogos usam foco contido, Escape e restauração de foco do navegador.

A conta permanece demonstrativa: os itens Meus dados, Endereços e Formas de pagamento explicam o funcionamento e encaminham para as telas disponíveis. Não há autenticação ou armazenamento de cartões.

A navegação, o menu, os filtros e a conta foram conferidos na prévia em área de 390 px. O problema de imagens identificado nessa revisão foi resolvido na versão 2.1.1 descrita acima.

## Rodar no computador

Requer Node.js 22.x atualizado (22.12 ou superior dentro da linha 22).

```sh
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite, normalmente http://localhost:5173. O mesmo comando inicia as rotas do servidor durante o desenvolvimento. Não abra o HTML diretamente nem use somente um servidor estático.

Produção e prévia completa:

```sh
npm run build
npm start
```

Abra http://localhost:3000. O servidor Node entrega `dist/` e as rotas de API. É necessário hospedar o projeto com suporte a Node; somente publicar a pasta `dist` não disponibiliza as APIs.

## Publicar na Vercel

Esta versão inclui Functions da Vercel em `api/index.mjs` e configuração em `vercel.json`. Não depende de um processo permanente `npm start` na Vercel.

1. Envie o **projeto completo** ao repositório, incluindo `api/`, `server/`, `src/`, `public/`, `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json` e `vercel.json`. Não envie somente `dist/`.
2. No projeto da Vercel, use como **Root Directory** a pasta que contém `package.json` e `vercel.json` (se o repositório tem a subpasta `EYI-Store-React`, selecione essa subpasta).
3. Framework Preset: **Vite**; Install Command: **npm ci**; Build Command: **npm run build**; Output Directory: **dist**; Node.js: **22.x**. O arquivo de configuração já declara os comandos e a saída.
4. Faça um novo deploy. Se houver configurações antigas manuais de rotas/build no painel, ajuste para os valores acima.
5. Após publicar, o caminho `/api/health` deve responder `{"status":"ok"}`. Se o site abre mas as funções não respondem, confira se `api/` foi enviado e se Root Directory está correto.

O arquivo `vercel.json` encaminha `/api/...` à Function, incluindo parâmetros de busca e paginação. Os arquivos privados do catálogo e do servidor são incluídos na Function, sem publicá-los como arquivos estáticos. O corpo JSON do frete funciona tanto em Node local quanto quando a Vercel já o processou.

As variáveis do frete devem ser cadastradas em **Settings → Environment Variables** da Vercel, sem prefixo `VITE_`, e exigem novo deploy para entrar em vigor. O frete permanece indisponível até configurar credenciais, CEP de origem e embalagens. O cadastro de embalagens precisa existir no pacote de implantação da Function; o arquivo real é ignorado por padrão, portanto o responsável deve incluí-lo explicitamente no seu repositório/pacote privado quando estiver pronto. Não envie credenciais ao repositório.

Build e testes locais das rotas foram aprovados, incluindo a simulação dos rewrites e do corpo JSON da Vercel. O deploy da sua conta não foi executado nem verificado nesta sessão.

## APIs e limites da proteção

As consultas externas de produtos, imagens, CEP e frete ficam em `server/`. O código servido ao navegador não contém os endereços externos dessas integrações nem suas credenciais. Produtos e imagens passam por rotas próprias. A cópia de segurança do catálogo fica em `server/data/`, fora dos arquivos públicos.

Requisições às rotas `/api/...` da própria loja continuam visíveis na aba Network do navegador. Não existe forma de tornar invisível uma requisição que o navegador precisa executar. O projeto não usa desativação de Inspecionar ou ofuscação como proteção. Quem possui o ZIP pode ler o código do servidor, como esperado em um projeto de desenvolvimento.

As rotas públicas têm validação de parâmetros e limitação básica de frequência em memória. O proxy de imagens aceita somente imagens do domínio fixo do catálogo e não aceita uma URL arbitrária do visitante. Os erros não retornam tokens ou pilhas do servidor. Source maps de produção estão desativados. Em produção apenas `dist/` é servido; em desenvolvimento o Vite também bloqueia o acesso HTTP direto a `server/`, scripts e arquivos de ambiente.

O navegador ainda precisa receber os dados dos produtos para exibi-los. A API local de catálogo é pública. Não se trata de autenticação ou autorização para dados privados. Nenhum sistema de pagamento real foi adicionado.

## Frete real: configuração necessária

O botão **Calcular frete** foi integrado à cotação do Melhor Envio. Os valores fixos anteriores foram removidos. Sem credenciais ou dados de embalagem, a interface informa que a consulta ainda não está configurada. Nunca é apresentado um valor inventado como se fosse uma cotação real.

1. Crie uma cópia de `.env.example` com o nome `.env` na raiz.
2. Preencha **somente no servidor**:
   - `MELHOR_ENVIO_TOKEN`: credencial da sua conta Melhor Envio. Não compartilhe no chat nem use prefixo `VITE_`.
   - `SHIPPING_ORIGIN_CEP`: CEP de postagem, com 8 dígitos.
   - `SHIPPING_USER_AGENT`: nome da aplicação e e-mail técnico, por exemplo `MinhaLoja (suporte@seu-dominio.com.br)`.
   - `SHIPPING_SANDBOX`: `true` para testes com token sandbox; `false` com token de produção para cotações reais.
3. Copie `server/config/shipping-products.example.json` para `server/config/shipping-products.json`.
4. Cadastre cada ID de produto que será cotado com `width`, `height`, `length` em centímetros, `weight` em quilogramas e `insurance_value` como valor unitário declarado em reais. Os zeros do exemplo são marcadores inválidos: precisam ser substituídos por dados reais. Os pesos e dimensões da DummyJSON não são usados como medidas reais das embalagens.
5. Reinicie `npm run dev` ou `npm start` após alterar a configuração.

A cotação envia somente os CEPs de origem/destino e os dados de produtos necessários à transportadora. Peso, dimensões e valor declarado vêm do cadastro no servidor, e não de valores enviados pelo visitante. Usa `custom_price` e `custom_delivery_time` quando retornados pelo provedor. Respostas sandbox são identificadas na interface. Nenhuma etiqueta é comprada, nenhum pagamento é efetuado e nenhum envio é criado.

É possível selecionar uma opção de entrega no carrinho ou no checkout. A seleção compõe o resumo e o total. Mudar o CEP ou o conteúdo do carrinho invalida a escolha anterior. Cotações expiram em 10 minutos. Enquanto nenhuma entrega estiver selecionada, o resumo exibe **A calcular**, sem assumir frete grátis; a confirmação do pedido demonstrativo exige uma opção válida.

A integração foi validada com respostas simuladas do provedor; uma cotação real de produção depende das credenciais, origem e medidas ainda não fornecidas. Os produtos e preços da loja continuam fictícios.

Referência de implementação: https://docs.melhorenvio.com.br/reference/calculo-de-fretes-por-produtos

## CEP com dois provedores

O checkout consulta `/api/address/{cep}`. O servidor tenta ViaCEP primeiro e BrasilAPI em caso de falha, resposta inválida ou tempo de 4,5 segundos excedido. Preenche logradouro, bairro, cidade e UF. Todos os campos continuam editáveis; número e complemento são manuais. A mudança de CEP cancela a solicitação do navegador e descarta respostas antigas. Uma edição manual feita durante a consulta é preservada.

CEP público de exemplo: `01001-000`. Somente o CEP é enviado para consultar o endereço. Nome, número, complemento e e-mail não são enviados a esses serviços. Não há armazenamento de endereço no histórico de pedidos.

## Organização

| Caminho                    | Responsabilidade                                             |
| -------------------------- | ------------------------------------------------------------ |
| `src/App.tsx`              | Aviso de loja fictícia, rotas e provedores                   |
| `src/pages/`               | Páginas React, incluindo Institucional com três seções       |
| `src/components/layout/`   | Cabeçalho, navegação e rodapé com a logo Pix enviada         |
| `src/components/product/`  | Cards, carrosséis e botão Ver mais                           |
| `src/components/cart/`     | Itens, resumo e calculadora de frete                         |
| `src/components/checkout/` | Campos de endereço                                           |
| `src/components/ui/`       | Controles reutilizáveis e aviso de entrada                   |
| `src/contexts/`            | Estado de produtos, carrinho, favoritos e seleção de entrega |
| `src/hooks/`               | Busca incremental, temporizador, CEP e animações             |
| `src/services/`            | Chamadas às rotas da própria loja                            |
| `src/types/`, `src/utils/` | Interfaces e utilitários                                     |
| `src/styles/`              | CSS separado, responsividade e animações                     |
| `server/api.mjs`           | Rotas de API, validação e proxy de imagens                   |
| `server/services/`         | Integrações externas de produtos, CEP e frete                |
| `server/config/`           | Configuração privada de envio                                |
| `server/data/`             | Catálogo de segurança privado                                |
| `server/index.mjs`         | Servidor HTTP de produção                                    |
| `scripts/`                 | Testes automatizados                                         |
| `public/assets/`           | Logo EYI e logo Pix, sem catálogo público                    |

## Comandos

```sh
npm run dev         # Interface + APIs em desenvolvimento
npm run typecheck   # Verificação TypeScript
npm run build       # Verificação TypeScript e build do cliente
npm start           # Servidor completo após o build
npm run preview     # Mesmo servidor completo de produção
npm test            # Paginação, CEP, rotas e integração de cotação com mocks
npm run format      # Formatação do projeto
```

## Funcionalidades e dados

- Produtos em lotes de 12, com busca, categorias, filtros e ordenação; sem baixar o catálogo inteiro na abertura.
- Carrossel principal a cada 5 segundos, com pausa, navegação manual e respeito a movimento reduzido.
- Introdução compacta com benefícios e indicação de conteúdo abaixo.
- Favoritos, carrinho e pedidos demonstrativos salvos no navegador.
- Cupom de teste `EYI10`.
- Checkout fictício, com conta local, sem autenticação ou processamento financeiro.
- Newsletter demonstrativa, sem cadastro real.
- Valores do catálogo ilustrativos em reais, sem conversão cambial. Títulos e descrições mantêm o idioma da API.

O ZIP não inclui dependências, build, credenciais ou cadastro real de embalagens. Instale e gere o build pelos comandos acima. O link hospedado anteriormente continua sendo a versão estática antiga; este projeto é a versão para baixar e executar com Node.
