import { Simulator } from "../components/Simulator";
import { scienceReferences, scienceTopics } from "../data/science";
import { ProductStage } from "../components/ProductStage";

export default function Technology() {
  return (
    <>
      <section
        className="page-intro section-wrap"
        aria-labelledby="technology-title"
      >
        <p className="eyebrow">A tecnologia · Conceito 2026</p>
        <h1 id="technology-title">
          Precisão começa
          <br />
          com uma pergunta.
        </h1>
        <p>Como uma lente poderia acompanhar a distância que você observa?</p>
        <p className="article-copy">
          A proposta FoveaRx une uma prescrição convencional a um complemento
          eletrônico de foco. Conheça o princípio óptico, explore a simulação e
          veja o que a ciência já demonstrou.
        </p>
        <a className="text-link" href="#demonstracao">
          Explore o funcionamento ↓
        </a>
      </section>

      <figure className="technology-cutaway">
        <ProductStage state={{ progress: 2 }} />
        <figcaption>
          <span>Lente-base convencional</span>
          <span>Camada eletrônica de cristal líquido</span>
          <small>Separação ampliada para explicar a proposta óptica.</small>
        </figcaption>
      </figure>
      <section
        className="section-wrap editorial-grid"
        aria-labelledby="architecture-title"
      >
        <div>
          <p className="eyebrow">01 · Arquitetura óptica</p>
          <h2 className="section-title" id="architecture-title">
            Duas camadas.
            <br />
            Funções distintas.
          </h2>
        </div>
        <div className="article-copy">
          <h3>{scienceTopics[1].title}</h3>
          <p>{scienceTopics[1].body}</p>
          <h3>{scienceTopics[2].title}</h3>
          <p>{scienceTopics[2].body}</p>
          <h3>{scienceTopics[3].title}</h3>
          <p>{scienceTopics[3].body}</p>
        </div>
      </section>

      <section className="light-section" aria-labelledby="control-title">
        <div className="section-wrap">
          <p className="eyebrow">02 · Controle proposto</p>
          <h2 className="section-title" id="control-title">
            O olhar informa.
            <br />A óptica responde.
          </h2>
          <ol className="process-flow" aria-label="Fluxo conceitual de ajuste">
            <li>
              <strong>01 · Olhar</strong>
              <p>Estimar a direção com eye tracking.</p>
            </li>
            <li>
              <strong>02 · Medir</strong>
              <p>Associar o alvo à distância observada.</p>
            </li>
            <li>
              <strong>03 · Calcular</strong>
              <p>Estimar o ajuste complementar.</p>
            </li>
            <li>
              <strong>04 · Ajustar</strong>
              <p>Comandar a distribuição óptica.</p>
            </li>
          </ol>
          <div className="editorial-grid article-copy">
            <div>
              <h3>{scienceTopics[4].title}</h3>
              <p>{scienceTopics[4].body}</p>
            </div>
            <div>
              <h3>{scienceTopics[5].title}</h3>
              <p>{scienceTopics[5].body}</p>
            </div>
          </div>
          <p className="article-copy">{scienceTopics[6].body}</p>
        </div>
      </section>

      <section
        className="section-wrap"
        id="demonstracao"
        aria-labelledby="simulation-title"
      >
        <p className="eyebrow">03 · Demonstração interativa</p>
        <h2 className="section-title" id="simulation-title">
          Experimente a ideia.
        </h2>
        <p className="article-copy">
          Altere a distância, o foco e a direção simulada. Os valores e imagens
          ilustram a proposta. Desfoque de tela não reproduz fielmente a ação de
          uma lente oftálmica no olho humano.
        </p>
        <Simulator />
      </section>

      <section
        className="section-wrap editorial-grid"
        aria-labelledby="limits-title"
      >
        <div>
          <p className="eyebrow">04 · Limites de projeto</p>
          <h2 className="section-title" id="limits-title">
            Uma possibilidade.
            <br />
            Muitas etapas reais.
          </h2>
        </div>
        <div className="article-copy">
          {scienceTopics.slice(7, 11).map((topic) => (
            <article key={topic.title}>
              <h3>{topic.title}</h3>
              <p>{topic.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="light-section" aria-labelledby="science-title">
        <div className="section-wrap">
          <p className="eyebrow">05 · Literatura científica</p>
          <h2 className="section-title" id="science-title">
            Ciência por trás
            <br />
            do conceito.
          </h2>
          <div className="editorial-grid article-copy">
            <div>
              <h3>Tecnologias demonstradas individualmente</h3>
              <p>
                Lentes ajustáveis, controle local de frente de onda e protótipos
                guiados pelo olhar aparecem na literatura abaixo. Cada estudo
                tem sua própria arquitetura e condições experimentais.
              </p>
            </div>
            <div>
              <h3>Integração proposta para o FoveaRx</h3>
              <p>{scienceTopics[0].body}</p>
              <p>{scienceTopics[11].body}</p>
            </div>
          </div>
          <ol className="reference-list">
            {scienceReferences.map((reference) => (
              <li key={reference.doi}>
                <p className="eyebrow">{reference.year} · Pesquisa publicada</p>
                <h3>
                  <a href={reference.url} target="_blank" rel="noreferrer">
                    {reference.title} ↗
                  </a>
                </h3>
                <p>{reference.authors}</p>
                <p>{reference.finding}</p>
                <p>
                  <strong>Limite da evidência.</strong> {reference.limitation}
                </p>
                <a
                  className="text-link"
                  href={`https://doi.org/${reference.doi}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  DOI: {reference.doi} ↗
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-wrap" aria-labelledby="technology-next-title">
        <p className="eyebrow">Do princípio à arquitetura</p>
        <h2 className="section-title" id="technology-next-title">
          Veja como as partes
          <br />
          se conectam.
        </h2>
        <a className="button" href="/engenharia">
          Explore a engenharia
        </a>
      </section>
    </>
  );
}
