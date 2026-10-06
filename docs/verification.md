# Verificação do redesign

Verificado em 6 de outubro de 2026, no Chrome local, por Playwright.

## Evidências

- TypeScript, ESLint e build de produção com pré-renderização de seis documentos (cinco rotas e 404).
- Suíte funcional: rotas/reload, controles de foco por teclado, distância, automático/manual, bateria, reinício, seleção de componentes, vistas e montagem/explosão.
- Reversibilidade do scroll e preservação da identidade do canvas entre capítulos.
- Layout sem overflow horizontal em 360×800, 390×844, 430×932, 768×1024, 1440×900, 1920×1080 e 844×390.
- Axe: nenhuma violação séria ou crítica nas cinco rotas testadas. Isso não substitui auditoria manual integral de acessibilidade.
- Sem WebGL e após perda de contexto: fallback com imagem efetivamente carregada, navegação e simulação textual funcionais.
- Revisão visual independente sobre capturas reais. Reparos: tamanho/enquadramento do produto, lentes mais claras, cascas das hastes, explosão óptica separada da engenharia, integração do fundo claro e labels mobile sem cobrir a silhueta.
- 90 draw calls e 69.504 triângulos renderizados na medição do estúdio, incluindo passes ópticos. Após estabilização, zero novos frames da cena durante uma amostra de 500 ms.

As capturas estão em `docs/evidence/`. `render-stats.json` registra o ambiente da amostra. O Lighthouse inicial apontou um gargalo de inicialização de shaders, documentado em `lighthouse-before.json`; métricas finais são registradas separadamente após a correção.

## Cobertura do briefing

- Modelo original com vinte grupos: armação, ponte, narigueiras, lentes-base, camadas LC, eletrodos, sensores IR/ToF, processador, circuitos, bateria, hastes, dobradiças, botões, USB-C, tampas e conexões.
- Doze cenas: reveal, problema, camadas, eye tracking, distância, processamento, foco, engenharia, estado passivo, substituição modular, design/produção e campanha final.
- Sete simulações: foco, direção do olhar, distância, modos, energia, explosão e modularidade.
- Empresa S.A. de capital aberto conceitual, setor secundário/indústria de produto final, matriz Lausanne, filial Shenzhen, P&D, fornecedores, matérias-primas, mão de obra, toyotismo e fluxo de produção selecionável.
- Vistas frontal, posterior, laterais, superior e explodida, com projeção ortográfica e indicações dimensionais nominais.
- Especificações completas, OptiShift One/FoveaRx One, preço estimado de R$ 4.499 e slogan do briefing.
- Quatro pesquisas verificadas, com autores, ano, DOI, resultado e limites; empresa e dispositivo explicitamente educacionais.

## Limitações declaradas

Modelagem procedural Three.js, sem Blender/GLB. Não é CAD de fabricação. As vistas não fixam escala física na tela. PNG exporta a vista do modelo, sem certificado ou cotas para fabricação. As simulações não são ensaios ópticos, eye tracking por câmera, prescrição ou validação clínica. Nenhum aparelho móvel físico foi medido; responsividade foi testada por emulação. FPS universal não é garantido. Não foram realizadas ações de Search Console ou instalação de analytics.

## Resultado final local

15 testes Playwright passaram no build de produção. Lighthouse 13.5.0 em simulação mobile: performance 85, acessibilidade 100, boas práticas 100, SEO 100; LCP 3.207 ms, TBT 250,5 ms, CLS 0,00151. O TBT inicial era 3.890 ms. A melhoria combina compilação assíncrona dos shaders e poster WebP responsivo (8 KB mobile / 25 KB desktop). Estes são resultados de laboratório local, não dados de campo ou certificação WCAG.
