# OptiShift Technologies — FoveaRx One

Experiência de produto conceitual em português. React, TypeScript, Vite, Three.js e GSAP ScrollTrigger.

## Executar

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
npm test
```

Os testes usam o Chrome instalado. Para testar o build, defina `BASE_URL=http://127.0.0.1:4173`. `node scripts/render-evidence.mjs` registra capturas e deriva os assets estáticos do próprio modelo, usando o servidor de desenvolvimento na porta 5173.

## Rotas

- `/`: narrativa de produto com 12 capítulos reversíveis e canvas persistente.
- `/tecnologia`: princípios ópticos, laboratório interativo, limites e quatro referências verificadas.
- `/engenharia`: peças, vista explodida, projeções ortográficas e materiais.
- `/empresa`: organização educacional, Lausanne/Shenzhen, toyotismo, matérias-primas e mão de obra.
- `/prototipo`: exploração 360°, controles, simulações e ficha técnica.

O build gera HTML completo para cada rota e uma página 404. `vercel.json` preserva o projeto original com configuração Vite e URLs limpas.

## Estrutura

- `src/three/model.ts`: geometria procedural original em centímetros; armação chanfrada, volumes ópticos, hastes, sensores e eletrônica em 20 grupos identificados.
- `src/three/scene.ts`: estúdio PBR, câmeras, seleção, labels, projeções, animação, qualidade adaptativa e descarte.
- `src/pages/Home.tsx`: sincronização de scroll nativo com a narrativa.
- `src/components/Simulator.tsx`: foco, direção, distância, modos, bateria e modularidade.
- `src/data/science.ts`: literatura e distinção entre evidência e proposta.
- `scripts/prerender.mjs`: HTML, metadata e canonical por rota.
- `docs/evidence/`: capturas reais e estatísticas de renderização.

## Limites reais

O dispositivo e a empresa são conceitos educacionais. O modelo não é CAD de fabricação, não demonstra um produto físico nem valida conforto, tolerâncias, potência óptica, bateria ou segurança ocular. As simulações são didáticas e não prescrevem correções. As dimensões são nominais; a escala na tela depende do dispositivo. O PNG exportado é uma vista renderizada, não uma prancha certificada de fabricação.

O modelo é construído diretamente em Three.js porque Blender não estava disponível. Não há GLB, Draco ou texturas externas a comprimir. Geometrias e materiais são reaproveitados; componentes repetidos são agrupados. O renderer limita e adapta pixel ratio, pausa fora da tela e renderiza sob demanda. Não se promete 60 FPS universais; aparelhos físicos não foram medidos.

Fontes locais Inter (SIL Open Font License). Modelo, diagramas, favicon, fallback e imagem social são originais. Sem analytics, câmera, cookies de marketing, formulários, pagamentos ou backend. Nenhuma variável secreta de runtime é necessária.

## Publicação e recuperação

Repositório: `Miokzz/optishift-fovearx`. Projeto Vercel: `optishift-fovearx` (`prj_vd2zN1bk8XVlrycF53fALQPAnU8J`). Produção: https://optishift-fovearx.vercel.app/.

Use branch de desenvolvimento, build/testes e preview antes de produção. Para recuperação, selecione o deployment anterior no projeto original e utilize Rollback. A versão anterior ao redesign é o commit `856abc4`, deployment `dpl_AS3Dnqp8qRYWerSGmv29M1ZDfMvE`.

Veja `docs/architecture.md` e `docs/science-evidence.md` para o contrato e as fontes.
