import { useEffect, useId, useState } from "react";
export interface SimulationState {
  focus: number;
  gazeX: number;
  gazeY: number;
  power: boolean;
  modular: number;
}
export function Simulator({
  onChange,
  compact = false,
}: {
  onChange?: (s: SimulationState) => void;
  compact?: boolean;
}) {
  const id = useId();
  const [mode, setMode] = useState<"auto" | "manual">("manual");
  const [focus, setFocus] = useState(0);
  const [distance, setDistance] = useState(1);
  const [power, setPower] = useState(true);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [modular, setModular] = useState(false);
  useEffect(() => {
    if (mode !== "auto" || !power) return;
    const timer = window.setInterval(() => {
      setDistance((v) => (v + 1) % 3);
    }, 2600);
    return () => clearInterval(timer);
  }, [mode, power]);
  const actualFocus = power
    ? mode === "auto"
      ? [1.5, 0.75, 0][distance]
      : focus
    : 0;
  useEffect(() => {
    onChange?.({
      focus: actualFocus,
      gazeX: gaze.x,
      gazeY: gaze.y,
      power,
      modular: modular ? 1 : 0,
    });
  }, [actualFocus, gaze, power, modular, onChange]);
  function reset() {
    setMode("manual");
    setFocus(0);
    setDistance(1);
    setPower(true);
    setGaze({ x: 0, y: 0 });
    setModular(false);
  }
  function move(e: React.PointerEvent<SVGSVGElement>) {
    if (!power) return;
    const r = e.currentTarget.getBoundingClientRect();
    setGaze({
      x: Math.max(
        -0.8,
        Math.min(0.8, ((e.clientX - r.left) / r.width) * 2 - 1),
      ),
      y: Math.max(
        -0.65,
        Math.min(0.65, -(((e.clientY - r.top) / r.height) * 2 - 1)),
      ),
    });
  }
  return (
    <section
      className={`simulator ${compact ? "compact" : ""}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="sim-heading">
        <div>
          <span className="eyebrow">LABORATÓRIO ÓPTICO</span>
          <h2 id={`${id}-title`}>Experimente a ideia.</h2>
        </div>
        <span className="status-dot">Simulação conceitual</span>
      </div>
      <div className="sim-grid">
        <div className="optical-demo">
          <svg
            viewBox="0 0 500 280"
            onPointerDown={move}
            onPointerMove={(e) => {
              if (e.buttons === 1 || e.pointerType === "mouse") move(e);
            }}
            role="img"
            aria-label="Zona ativa ilustrativa sobre a lente; use os controles abaixo para mover o olhar"
          >
            <defs>
              <clipPath id={`${id}-clip`}>
                <rect x="38" y="38" width="424" height="204" rx="68" />
              </clipPath>
              <radialGradient id={`${id}-gradient`}>
                <stop stopColor="#8de4ea" stopOpacity=".4" />
                <stop offset="1" stopColor="#8de4ea" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect
              x="36"
              y="36"
              width="428"
              height="208"
              rx="70"
              fill="#181f22"
              stroke="#798286"
              strokeWidth="2"
            />
            <g clipPath={`url(#${id}-clip)`}>
              <path
                d="M0 140H500M250 0V280"
                stroke="#ffffff"
                opacity=".12"
                strokeDasharray="3 7"
              />
              <g
                style={{
                  filter: `blur(${Math.abs(1.5 - actualFocus) * 1.8}px)`,
                }}
                fill="#a7b1b5"
                fontFamily="Inter, sans-serif"
                textAnchor="middle"
              >
                <text x="250" y="129" fontSize="26" letterSpacing="12">
                  F O C O
                </text>
                <text x="250" y="171" fontSize="12" letterSpacing="9">
                  Ó P T I C A
                </text>
              </g>
              {power && (
                <g
                  transform={`translate(${250 + gaze.x * 155} ${140 - gaze.y * 100})`}
                >
                  <circle r="61" fill={`url(#${id}-gradient)`} />
                  <circle r="34" fill="none" stroke="#8de4ea" strokeWidth="1" />
                  <path d="M-7 0H7M0-7V7" stroke="#8de4ea" />
                </g>
              )}
            </g>
          </svg>
          <div className="sim-readout">
            <span>
              {power ? "CAMADA ELETRÔNICA ATIVA" : "ELETRÔNICA DESLIGADA"}
            </span>
            <output aria-label="Ajuste atual">
              {actualFocus >= 0 ? "+" : ""}
              {actualFocus.toFixed(2).replace(".", ",")} <small>D</small>
            </output>
          </div>
          <p className="fine-print">
            Desfoque ilustrativo. A imagem na tela não reproduz a resposta de
            uma lente oftálmica no olho humano.
          </p>
          <div
            className="depth-demo"
            aria-label="Medição de distância ilustrativa"
          >
            <div className="depth-caption">
              <span>SENSOR ToF</span>
              <output aria-label="Distância atual">
                {power ? ["0,4 m", "1 m", "6 m"][distance] : "Sem medição"}
              </output>
            </div>
            <svg
              viewBox="0 0 460 82"
              role="img"
              aria-label="Alvo próximo, médio ou distante em um esquema sem escala"
            >
              <path
                d="M20 24V58M15 24H25M15 58H25"
                stroke="#a1a7ac"
                fill="none"
              />
              <path d="M30 41H440" stroke="#424b50" strokeDasharray="3 7" />
              {power && (
                <g
                  style={{
                    transform: `translateX(${[110, 240, 420][distance]}px)`,
                    transition: "transform 600ms ease",
                  }}
                >
                  <path
                    d="M-13 17H13V65H-13Z"
                    fill="#162e32"
                    stroke="#8de4ea"
                  />
                  <circle cy="41" r="4" fill="#8de4ea" />
                </g>
              )}
            </svg>
            <span className="fine-print">
              Associação ilustrativa entre alvo e distância. Esquema sem escala.
            </span>
          </div>
        </div>
        <div className="sim-controls">
          <div className="segmented" aria-label="Modo de controle">
            {(["manual", "auto"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
              >
                {m === "auto" ? "Automático" : "Manual"}
              </button>
            ))}
          </div>
          <label htmlFor={`${id}-focus`}>
            Ajuste eletrônico <span>−1,50 a +1,50 D</span>
          </label>
          <input
            id={`${id}-focus`}
            type="range"
            min="-1.5"
            max="1.5"
            step=".05"
            value={focus}
            disabled={mode === "auto" || !power}
            onChange={(e) => setFocus(+e.target.value)}
          />
          <fieldset>
            <legend>Distância simulada</legend>
            <div className="distance-buttons">
              {["Próximo · 0,4 m", "Médio · 1 m", "Distante · 6 m"].map(
                (s, i) => (
                  <button
                    key={s}
                    disabled={!power}
                    aria-pressed={distance === i}
                    onClick={() => {
                      setDistance(i);
                      if (mode === "manual") setFocus([1.5, 0.75, 0][i]);
                    }}
                  >
                    {s}
                  </button>
                ),
              )}
            </div>
          </fieldset>
          <p className="fine-print">
            {mode === "auto"
              ? "Demonstração guiada: alternância entre três distâncias."
              : "Selecione uma distância para aplicar o ajuste ilustrativo ou use o controle manual."}{" "}
            Os valores não são uma prescrição.
          </p>
          <div className="gaze-controls">
            <label>
              Olhar horizontal
              <input
                aria-label="Olhar horizontal"
                type="range"
                min="-.8"
                max=".8"
                step=".01"
                value={gaze.x}
                disabled={!power}
                onChange={(e) => setGaze({ ...gaze, x: +e.target.value })}
              />
            </label>
            <label>
              Olhar vertical
              <input
                aria-label="Olhar vertical"
                type="range"
                min="-.65"
                max=".65"
                step=".01"
                value={gaze.y}
                disabled={!power}
                onChange={(e) => setGaze({ ...gaze, y: +e.target.value })}
              />
            </label>
          </div>
          <div className="sim-actions">
            <button aria-pressed={!power} onClick={() => setPower(!power)}>
              {power ? "Desligar eletrônica" : "Ligar eletrônica"}
            </button>
            <button aria-pressed={modular} onClick={() => setModular(!modular)}>
              {modular ? "Recolocar lente-base" : "Trocar lente-base"}
            </button>
            <button className="text-link" onClick={reset}>
              Reiniciar ↺
            </button>
          </div>
          <p className="fine-print">
            {!power
              ? "Estado neutro proposto: sua viabilidade óptica ainda exige validação."
              : modular
                ? "Lente-base separada para ilustrar substituição técnica. Eletrônica preservada."
                : "A zona acompanha uma direção simulada. Não há captura de câmera nem rastreamento real dos seus olhos."}
          </p>
        </div>
      </div>
    </section>
  );
}
