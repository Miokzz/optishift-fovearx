import { specifications } from "../data/product";
export function Specs() {
  return (
    <section className="section-wrap specifications" id="especificacoes">
      <div className="section-title">
        <span className="eyebrow">FICHA TÉCNICA</span>
        <h2>
          O conceito.
          <br />
          Em números.
        </h2>
        <p>
          Metas de design e engenharia. Nenhum valor abaixo representa um
          resultado de testes físicos do FoveaRx One.
        </p>
      </div>
      <dl className="spec-table">
        {specifications.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
