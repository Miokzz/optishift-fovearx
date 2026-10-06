import { createServer } from "vite";
import { readFile, writeFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

const routes = {
  "/": [
    "FoveaRx One — OptiShift Technologies",
    "Conheça o FoveaRx One: um conceito educacional de óculos de prescrição adaptativa com modelo 3D e narrativa óptica.",
  ],
  "/tecnologia": [
    "Tecnologia e ciência — FoveaRx One",
    "Lentes de cristal líquido, GRIN, eye tracking e foco: explore as simulações e os estudos que fundamentam o conceito FoveaRx.",
  ],
  "/engenharia": [
    "Engenharia e vistas técnicas — FoveaRx One",
    "Explore a arquitetura conceitual, componentes, materiais, vista explodida e projeções ortográficas do FoveaRx One.",
  ],
  "/empresa": [
    "OptiShift Technologies — A empresa conceitual",
    "Pesquisa em Lausanne e produção em Shenzhen: conheça a organização educacional proposta, matérias-primas e toyotismo.",
  ],
  "/prototipo": [
    "Protótipo digital interativo — FoveaRx One",
    "Gire o modelo 3D, selecione componentes e simule foco, distância, bateria e lentes modulares do protótipo digital conceitual.",
  ],
  "/404": [
    "Página não encontrada — OptiShift",
    "Esta página não foi encontrada. Volte à apresentação do FoveaRx One.",
  ],
};
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  ssr: { noExternal: ["gsap"] },
});
try {
  const { default: App } = await server.ssrLoadModule("/src/App.tsx");
  const template = await readFile("dist/index.html", "utf8");
  for (const [route, [title, description]] of Object.entries(routes)) {
    const markup = renderToString(createElement(App, { path: route }));
    const html = template
      .replace(
        '<div id="root"></div>',
        `<div id="root">${markup}</div><noscript><style>.story-track{height:auto}.story-stage{position:relative;height:auto;overflow:visible}.story-stage>.product-stage{position:relative;height:380px}.story-copy{position:relative;inset:auto;padding:30px}.chapter-copy{position:relative;opacity:1;visibility:visible;transform:none;display:block;padding:35px 0}.chapter-copy p{margin-top:20px}.story-bottom,.story-progress{display:none}.chapter-copy[inert]{pointer-events:auto}.stage-fallback{display:flex}</style></noscript>`,
      )
      .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      .replace(
        /name="description" content="[^"]*"/,
        `name="description" content="${description}"`,
      )
      .replace(
        /rel="canonical" href="[^"]*"/,
        `rel="canonical" href="https://optishift-fovearx.vercel.app${route === "/" ? "/" : route}"`,
      )
      .replace(
        /property="og:title" content="[^"]*"/,
        `property="og:title" content="${title}"`,
      )
      .replace(
        /property="og:description" content="[^"]*"/,
        `property="og:description" content="${description}"`,
      );
    await writeFile(
      `dist/${route === "/" ? "index" : route.slice(1)}.html`,
      html,
    );
  }
  console.log(
    `Prerendered ${Object.keys(routes).length} routes with complete HTML content.`,
  );
} finally {
  await server.close();
}
