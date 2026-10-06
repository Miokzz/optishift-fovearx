import { useCallback, useRef, useState } from "react";
import { ProductStage } from "../components/ProductStage";
import type { SceneApi } from "../components/ProductStage";
import { Simulator } from "../components/Simulator";
import type { SimulationState } from "../components/Simulator";
import { Specs } from "../components/Specs";
import { componentInfo } from "../three/components";
const views = [
  ["hero", "Perspectiva"],
  ["front", "Frontal"],
  ["left", "Lateral esquerda"],
  ["right", "Lateral direita"],
  ["top", "Superior"],
  ["back", "Traseira"],
  ["exploded", "Explodida"],
];
export default function Explorer({
  engineering = false,
}: {
  engineering?: boolean;
}) {
  const api = useRef<SceneApi>(undefined);
  const [view, setView] = useState("hero");
  const [explode, setExplode] = useState(0);
  const [labels, setLabels] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [exportStatus, setExportStatus] = useState("");
  const changeSim = useCallback(
    (s: SimulationState) => api.current?.setState(s),
    [],
  );
  function chooseView(v: string) {
    setView(v);
    api.current?.setView(v);
    if (v === "exploded") {
      setExplode(1);
      api.current?.setState({ explode: 1 });
    } else {
      setExplode(0);
      api.current?.setState({ explode: 0 });
    }
  }
  function choosePart(id: string) {
    setSelected(id || null);
    api.current?.setState({ selected: id || null });
  }
  function reset() {
    api.current?.reset();
    setView("hero");
    setExplode(0);
    setSelected(null);
    setLabels(false);
    api.current?.setState({ explode: 0, selected: null, labels: false });
  }
  function download() {
    const url = api.current?.capture();
    if (!url) {
      setExportStatus("A exportação requer WebGL ativo.");
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = `fovearx-${view}-conceito.png`;
    a.click();
    setExportStatus(
      "Imagem da vista exportada. Medidas são referências conceituais.",
    );
  }
  const part = componentInfo.find((p) => p.id === selected);
  return (
    <>
      <section className="page-intro explorer-intro">
        <span className="eyebrow">
          {engineering
            ? "ARQUITETURA DO PRODUTO"
            : "PROTÓTIPO DIGITAL CONCEITUAL"}
        </span>
        <h1>
          {engineering ? (
            <>
              Nada por acaso.
              <br />
              <span>Nem por dentro.</span>
            </>
          ) : (
            <>
              Explore
              <br />
              <span>cada detalhe.</span>
            </>
          )}
        </h1>
        <p>
          {engineering
            ? "Uma estrutura de titânio. Óptica em camadas. Eletrônica integrada. Separe as peças para conhecer a proposta de engenharia."
            : "Um conceito construído sobre óptica, eletrônica e engenharia. Gire, aproxime e descubra o FoveaRx One."}
        </p>
      </section>
      <section
        className={`viewer-workbench ${engineering ? "engineering-workbench" : ""}`}
        aria-label="Explorador tridimensional"
      >
        <div className="viewer-top">
          <span className="eyebrow">FOVEARX ONE / ESTUDO DE DESIGN</span>
          <span>142 × 44 × 150 mm</span>
        </div>
        <div className="view-tabs" aria-label="Vistas do produto">
          {views.map(([id, label]) => (
            <button
              key={id}
              aria-pressed={view === id}
              onClick={() => chooseView(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="viewer-layout">
          <div className="viewer-visual">
            <ProductStage
              interactive
              ref={api}
              onReady={() => setReady(true)}
              onSelect={choosePart}
            />
            {engineering && view !== "hero" && view !== "exploded" && (
              <div className="dimension-overlay" aria-hidden="true">
                <div className="dimension-h">
                  <span>
                    {view === "front" || view === "back"
                      ? "142 mm"
                      : view === "top"
                        ? "142 mm"
                        : "150 mm"}
                  </span>
                </div>
                <div className="dimension-v">
                  <span>{view === "top" ? "150 mm" : "44 mm"}</span>
                </div>
              </div>
            )}
            <div className="viewer-tools">
              <button
                aria-label="Aproximar"
                onClick={() => api.current?.zoom(-0.2)}
              >
                ＋
              </button>
              <button
                aria-label="Afastar"
                onClick={() => api.current?.zoom(0.2)}
              >
                −
              </button>
              <button aria-label="Reiniciar câmera" onClick={reset}>
                ↺
              </button>
              <button
                aria-pressed={labels}
                onClick={() => {
                  setLabels(!labels);
                  api.current?.setState({ labels: !labels });
                }}
              >
                Labels
              </button>
            </div>
          </div>
          <aside className="component-panel">
            <span className="eyebrow">INSPECIONE A ARQUITETURA</span>
            <label htmlFor="component-select">Componente</label>
            <select
              id="component-select"
              value={selected ?? ""}
              onChange={(e) => choosePart(e.target.value)}
            >
              <option value="">Selecione uma peça</option>
              {componentInfo.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="part-description" aria-live="polite">
              <h2>{part?.name ?? "O todo e cada parte."}</h2>
              <p>
                {part?.description ??
                  "Selecione uma peça no modelo ou na lista. Arraste na horizontal para girar; use dois dedos para explorar no celular."}
              </p>
              {part && <span className="material-tag">{part.material}</span>}
            </div>
            <label htmlFor="explosion">
              Vista explodida <output>{Math.round(explode * 100)}%</output>
            </label>
            <input
              id="explosion"
              type="range"
              min="0"
              max="1"
              step=".01"
              value={explode}
              onChange={(e) => {
                setExplode(+e.target.value);
                api.current?.setState({ explode: +e.target.value });
              }}
            />
            <button
              className="outline-button"
              onClick={() => {
                const n = explode > 0 ? 0 : 1;
                setExplode(n);
                api.current?.setState({ explode: n });
              }}
            >
              {explode > 0 ? "Retornar à montagem" : "Separar componentes"}{" "}
              <span>↗</span>
            </button>
            <button className="text-link" disabled={!ready} onClick={download}>
              Exportar vista em PNG ↓
            </button>
            <p className="fine-print" role="status">
              {exportStatus ||
                "Geometria em dimensões conceituais. Exibição sem escala física fixa; não é um desenho para fabricação."}
            </p>
          </aside>
        </div>
        <div className="viewer-caption">
          <span>
            <i /> Protótipo digital conceitual
          </span>
          <span>
            {view === "hero" ? "Câmera em perspectiva" : "Projeção ortográfica"}{" "}
            · {labels ? "Identificação visível" : "Arraste para explorar"}
          </span>
        </div>
      </section>
      {engineering && (
        <section className="light-section">
          <div className="section-wrap">
            <span className="eyebrow">MATERIAIS E MONTAGEM</span>
            <h2>
              Integração.
              <br />
              Em outra escala.
            </h2>
            <div className="editorial-grid">
              <article>
                <h3>Titânio grafite</h3>
                <p>
                  Armação, ponte e hastes com geometria fina e bordas
                  suavizadas. A proposta estrutural equilibra rigidez, massa e
                  espaço para a eletrônica.
                </p>
              </article>
              <article>
                <h3>Óptica em camadas</h3>
                <p>
                  Lentes-base, cristal líquido e eletrodos transparentes são
                  peças independentes. A separação é ampliada na visualização
                  para explicar a arquitetura.
                </p>
              </article>
              <article>
                <h3>Eletrônica modular</h3>
                <p>
                  Sensores infravermelhos, ToF, processador, bateria, circuitos
                  e conexões ficam distribuídos pela ponte e pelas hastes.
                  Dimensões e dissipação exigem projeto físico.
                </p>
              </article>
            </div>
            <p className="fine-print">
              Representação digital de um protótipo conceitual em dimensões de
              referência 1:1 no modelo. O tamanho exibido na tela depende do
              dispositivo e do zoom. Não constitui prova de fabricação.
            </p>
          </div>
        </section>
      )}
      <div className="section-wrap">
        <Simulator onChange={changeSim} />
      </div>
      <Specs />
      <section className="section-wrap closing-note">
        <h2>
          {engineering
            ? "Da arquitetura à óptica."
            : "Uma visão para o futuro."}
        </h2>
        <p>
          O modelo permite explorar a ideia. Sua viabilidade depende de
          pesquisa, prototipagem, segurança ocular e validação clínica.
        </p>
        <a className="text-link" href="/tecnologia">
          Conheça a fundamentação científica ↗
        </a>
      </section>
    </>
  );
}
