import { useState } from "react";

const productionStages = [
  {
    name: "Lausanne",
    title: "Pesquisa define o problema.",
    body: "A matriz proposta reuniria pesquisa e desenvolvimento, engenharia óptica, algoritmos e design. A primeira tarefa seria transformar a ideia em requisitos verificáveis de desempenho, conforto e segurança.",
  },
  {
    name: "Projeto",
    title: "Uma arquitetura antes da produção.",
    body: "Engenharia óptica e eletrônica, programação e design industrial desenvolveriam a lente, os sensores, o controle e a armação como um sistema. Protótipos e ensaios seriam usados para revisar as hipóteses.",
  },
  {
    name: "Fornecedores",
    title: "Especialização em cada componente.",
    body: "Fornecedores especializados seriam selecionados para lentes, cristal líquido, sensores, baterias e eletrônica. Especificações de qualidade, rastreabilidade e compatibilidade orientariam essa cadeia proposta.",
  },
  {
    name: "Shenzhen",
    title: "Integração industrial planejada.",
    body: "A filial proposta coordenaria produção, fornecedores, logística e controle industrial. A preparação de ferramentas, processos e instruções de montagem antecederia qualquer escala de fabricação.",
  },
  {
    name: "Montagem",
    title: "Precisão nas interfaces.",
    body: "Técnicos integrariam lentes, eletrodos, circuitos, condutores, estrutura e materiais de montagem. O processo proposto verificaria alinhamento óptico, conexões elétricas e fixação de cada subconjunto.",
  },
  {
    name: "Calibração",
    title: "Cada sistema precisa de referência.",
    body: "A calibração proposta relacionaria sensores, geometria do dispositivo e resposta da camada óptica. O ajuste ao usuário exigiria uma etapa própria, além da verificação de fábrica.",
  },
  {
    name: "Qualidade",
    title: "Verificar. Aprender. Melhorar.",
    body: "Controle de qualidade avaliaria parâmetros ópticos, elétricos e mecânicos. Falhas deveriam interromper o processo e alimentar melhorias. Segurança ocular e validação clínica continuariam etapas específicas antes de uso médico.",
  },
  {
    name: "Produto",
    title: "Uma entrega que ainda é objetivo.",
    body: "O resultado pretendido é um dispositivo integrado, com instruções, manutenção e lente-base substituível. O FoveaRx One permanece um conceito educacional; este fluxo não representa uma fábrica ou produto comercial existente.",
  },
] as const;

const departments = [
  "Pesquisa e desenvolvimento",
  "Engenharia óptica",
  "Engenharia eletrônica",
  "Programação",
  "Design industrial",
  "Produção",
  "Controle de qualidade",
  "Logística",
  "Administração",
];

function InternationalMap() {
  return (
    <figure>
      <svg
        viewBox="0 0 1000 450"
        role="img"
        aria-labelledby="network-map-title network-map-desc"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <title id="network-map-title">
          Conexão proposta entre Lausanne e Shenzhen
        </title>
        <desc id="network-map-desc">
          Mapa mundial esquemático. Lausanne concentra pesquisa e projeto;
          Shenzhen concentra produção e integração. Uma linha liga os dois
          polos.
        </desc>
        <defs>
          <pattern
            id="company-map-grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.07"
            />
          </pattern>
        </defs>
        <rect width="1000" height="450" fill="url(#company-map-grid)" />
        <g fill="currentColor" opacity="0.13">
          <path d="M95 104 162 65 243 72 298 100 285 143 243 159 223 195 203 222 170 211 159 180 116 165 86 142Z" />
          <path d="M241 224 280 243 302 292 292 331 262 385 246 399 227 353 211 301 218 263Z" />
          <path d="M310 48 360 27 393 47 377 82 335 105 311 85Z" />
          <path d="M451 135 477 116 515 120 544 156 527 177 492 177 465 160Z" />
          <path d="M475 182 523 176 561 220 566 273 528 333 499 321 475 271 457 222Z" />
          <path d="M534 125 579 90 653 81 720 104 794 91 859 115 908 143 882 180 827 185 809 220 787 237 760 215 730 227 704 261 680 243 662 209 622 196 588 171 550 166Z" />
          <path d="M765 246 798 264 821 273 803 288 778 271Z" />
          <path d="M807 305 863 292 903 329 879 369 820 355 798 332Z" />
          <path d="M927 333 943 350 928 389 915 371Z" />
        </g>
        <path
          d="M478 150 Q 640 34 796 223"
          fill="none"
          stroke="#8de4ea"
          strokeWidth="2"
          strokeDasharray="5 7"
        />
        <g fill="#8de4ea">
          <circle cx="478" cy="150" r="5" />
          <circle cx="796" cy="223" r="5" />
        </g>
        <g fill="currentColor" fontFamily="inherit">
          <text x="410" y="195" fontSize="22" fontWeight="600">
            Lausanne
          </text>
          <text x="410" y="220" fontSize="13">
            SUÍÇA · PESQUISA / PROJETO
          </text>
          <text x="720" y="312" fontSize="22" fontWeight="600">
            Shenzhen
          </text>
          <text x="720" y="337" fontSize="13">
            CHINA · PRODUÇÃO / INTEGRAÇÃO
          </text>
        </g>
      </svg>
      <figcaption className="eyebrow">
        Rede conceitual · mapa esquemático, sem escala
      </figcaption>
    </figure>
  );
}

export default function Company() {
  const [selectedStage, setSelectedStage] = useState(0);
  const currentStage = productionStages[selectedStage];

  return (
    <>
      <section
        className="page-intro section-wrap"
        aria-labelledby="company-title"
      >
        <p className="eyebrow">OptiShift Technologies S.A.</p>
        <h1 id="company-title">
          Uma ideia precisa.
          <br />
          Uma visão integrada.
        </h1>
        <p>
          Pesquisa óptica, design industrial e eletrônica em uma mesma proposta.
        </p>
        <p className="article-copy">
          A OptiShift faz parte de um cenário educacional conceitual. Sua
          organização foi desenhada para explorar como um produto de prescrição
          adaptativa poderia avançar da pesquisa à fabricação.
        </p>
      </section>

      <section
        className="section-wrap editorial-grid"
        aria-labelledby="company-profile-title"
      >
        <div>
          <p className="eyebrow">01 · Perfil proposto</p>
          <h2 className="section-title" id="company-profile-title">
            Engenharia de precisão.
            <br />
            Produto final.
          </h2>
        </div>
        <div className="article-copy">
          <p>
            A modalidade empresarial proposta é uma sociedade anônima de capital
            aberto. Essa definição pertence ao exercício educacional; não
            representa ações negociadas, registro legal ou investidores reais.
          </p>
          <p>
            No setor secundário da economia, a atividade proposta é a indústria
            de produto final, na interseção entre óptica, eletrônica, saúde
            visual, tecnologia de consumo e engenharia de precisão.
          </p>
          <dl className="spec-table">
            <div>
              <dt>Empresa no conceito</dt>
              <dd>OptiShift Technologies S.A.</dd>
            </div>
            <div>
              <dt>Produto proposto</dt>
              <dd>FoveaRx One</dd>
            </div>
            <div>
              <dt>Modalidade proposta</dt>
              <dd>Capital aberto</dd>
            </div>
            <div>
              <dt>Atividade</dt>
              <dd>Indústria de produto final</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>Conceito educacional · 2026</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="light-section" aria-labelledby="network-title">
        <div className="section-wrap">
          <p className="eyebrow">02 · Organização internacional</p>
          <h2 className="section-title" id="network-title">
            Do projeto
            <br />à integração.
          </h2>
          <InternationalMap />
          <div className="editorial-grid article-copy">
            <div>
              <h3>Lausanne, Suíça</h3>
              <p>
                A matriz proposta concentraria pesquisa, desenvolvimento,
                engenharia óptica, algoritmos, design, validação e investigação
                de novas tecnologias.
              </p>
            </div>
            <div>
              <h3>Shenzhen, China</h3>
              <p>
                A filial proposta coordenaria produção, integração de
                componentes, montagem, fornecedores, logística e controle
                industrial.
              </p>
            </div>
          </div>
          <p className="article-copy">
            As localizações descrevem a organização imaginada para o projeto.
            Não são endereços de instalações existentes da OptiShift.
          </p>
        </div>
      </section>

      <section className="section-wrap" aria-labelledby="production-title">
        <p className="eyebrow">03 · Toyotismo</p>
        <h2 className="section-title" id="production-title">
          Precisão em
          <br />
          cada etapa.
        </h2>
        <div className="editorial-grid article-copy">
          <div>
            <h3>Produção ajustada à demanda</h3>
            <p>
              O sistema proposto segue princípios do toyotismo: produção
              flexível, estoques reduzidos, just-in-time e fornecedores
              especializados. O objetivo seria coordenar materiais e montagem
              conforme a demanda, com redução de desperdícios.
            </p>
          </div>
          <div>
            <h3>Qualidade dentro do processo</h3>
            <p>
              Melhoria contínua, identificação de problemas e controle de
              qualidade acompanhariam cada etapa. Detectar uma anomalia deveria
              permitir interromper o processo, investigar a causa e revisar o
              trabalho.
            </p>
            <a
              className="text-link"
              href="https://global.toyota/en/company/vision-and-philosophy/production-system/"
              target="_blank"
              rel="noreferrer"
            >
              Conheça os princípios do sistema Toyota ↗
            </a>
          </div>
        </div>
        <p className="eyebrow">Selecione uma etapa do fluxo proposto</p>
        <ol className="process-flow" aria-label="Etapas da produção proposta">
          {productionStages.map((stage, index) => (
            <li key={stage.name}>
              <button
                className="button"
                type="button"
                aria-pressed={selectedStage === index}
                aria-controls="production-detail"
                onClick={() => setSelectedStage(index)}
              >
                <span>{String(index + 1).padStart(2, "0")} · </span>
                {stage.name}
              </button>
            </li>
          ))}
        </ol>
        <div
          id="production-detail"
          className="article-copy"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="eyebrow">
            {currentStage.name} · Etapa {selectedStage + 1} de{" "}
            {productionStages.length}
          </p>
          <h3>{currentStage.title}</h3>
          <p>{currentStage.body}</p>
        </div>
      </section>

      <section
        className="section-wrap editorial-grid"
        aria-labelledby="materials-title"
      >
        <div>
          <p className="eyebrow">04 · Materiais e pessoas</p>
          <h2 className="section-title" id="materials-title">
            Cada disciplina
            <br />
            faz parte da lente.
          </h2>
        </div>
        <div className="article-copy">
          <h3>Matérias-primas e componentes</h3>
          <p>
            Lentes ópticas, cristal líquido e eletrodos formariam o conjunto
            óptico. Sensores, baterias, componentes eletrônicos, circuitos e
            condutores comporiam o controle. Materiais estruturais e materiais
            de montagem completariam o dispositivo.
          </p>
          <h3>Mão de obra especializada</h3>
          <p>
            Engenheiros, programadores, designers, técnicos, especialistas em
            óptica e profissionais de controle de qualidade trabalhariam de
            forma coordenada. O modelo industrial proposto depende da
            contribuição humana para resolver problemas e melhorar processos.
          </p>
          <h3>Setores da organização proposta</h3>
          <ul>
            {departments.map((department) => (
              <li key={department}>{department}</li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="light-section"
        aria-labelledby="company-research-title"
      >
        <div className="section-wrap">
          <p className="eyebrow">Pesquisa e desenvolvimento</p>
          <h2 className="section-title" id="company-research-title">
            O próximo passo
            <br />é demonstrar.
          </h2>
          <p className="article-copy">
            Uma arquitetura plausível precisa se tornar um protótipo mensurável.
            Integração óptica, miniaturização, consumo, segurança e validação
            clínica fazem parte desse caminho. As demonstrações deste site
            apresentam o conceito; não constituem ensaios do dispositivo.
          </p>
          <a className="button" href="/tecnologia">
            Conheça a base científica
          </a>
        </div>
      </section>
    </>
  );
}
