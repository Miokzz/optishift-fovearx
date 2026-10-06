import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters } from "../data/product";
import { ProductStage } from "../components/ProductStage";
import type { SceneApi } from "../components/ProductStage";
gsap.registerPlugin(ScrollTrigger);
export default function Home() {
  const track = useRef<HTMLDivElement>(null);
  const api = useRef<SceneApi>(undefined);
  const [active, setActive] = useState(0);
  const progressLine = useRef<HTMLDivElement>(null);
  const [power, setPower] = useState(true);
  const progressRef = useRef(0);
  useEffect(() => {
    if (!track.current) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const driver = { p: 0 };
    const tween = gsap.to(driver, {
      p: 11,
      ease: "none",
      scrollTrigger: {
        trigger: track.current,
        start: "top top+=64",
        end: "bottom bottom",
        scrub: reduce ? true : 0.45,
      },
      onUpdate() {
        progressRef.current = driver.p;
        api.current?.setState({
          progress: reduce ? Math.round(driver.p) : driver.p,
        });
        setActive(Math.min(11, Math.round(driver.p)));
        if (progressLine.current)
          progressLine.current.style.transform = `scaleX(${driver.p / 11})`;
        const t = Math.max(0, 1 - Math.abs(driver.p - 7));
        const pale = t * t * (3 - 2 * t);
        const stage = track.current?.firstElementChild as HTMLElement | null;
        if (stage) {
          stage.style.backgroundColor = gsap.utils.interpolate(
            "#08090a",
            "#eef0ed",
            pale,
          );
          stage.style.setProperty(
            "--studio-ink",
            gsap.utils.interpolate("#f3f4f3", "#202527", pale),
          );
          stage.style.setProperty(
            "--studio-muted",
            gsap.utils.interpolate("#a1a7ac", "#535d60", pale),
          );
        }
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);
  function jump(n: number) {
    if (!track.current) return;
    const top = track.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: Math.max(
        0,
        top -
          64 +
          ((track.current.offsetHeight - window.innerHeight + 64) * n) / 11,
      ),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <>
      <div
        ref={track}
        className={`story-track chapter-${active}`}
        id="conceito"
      >
        <div className="story-stage">
          <div className="stage-meta">
            <span>FOVEARX ONE</span>
            <span>ÓPTICA ADAPTATIVA · CONCEITO</span>
          </div>
          <ProductStage
            ref={api}
            onReady={() =>
              api.current?.setState({ progress: progressRef.current })
            }
          />
          <div className="story-copy">
            {chapters.map((c, i) => (
              <section
                key={c.tag}
                className={`chapter-copy ${i === active ? "active" : ""}`}
                aria-hidden={i !== active}
                inert={i !== active}
              >
                <span className="eyebrow">{c.tag}</span>
                {i === 0 ? (
                  <h1>{c.title}</h1>
                ) : (
                  <h2>
                    {c.title}
                    <br />
                    <span>{c.subtitle}</span>
                  </h2>
                )}
                {i === 0 && <h2 className="hero-slogan">{c.subtitle}</h2>}
                <p>{c.body}</p>
                {i === 0 ? (
                  <div className="hero-actions">
                    <button className="button" onClick={() => jump(1)}>
                      Conheça o conceito <span>↓</span>
                    </button>
                    <a className="text-link" href="/prototipo">
                      Explorar em 3D ↗
                    </a>
                  </div>
                ) : (
                  <div className="chapter-detail">
                    <strong>{c.metric}</strong>
                    <small>{c.detail}</small>
                    {i === 7 && (
                      <a className="text-link" href="/engenharia">
                        Conhecer a engenharia ↗
                      </a>
                    )}
                    {i === 8 && (
                      <button
                        className="text-link"
                        onClick={() => {
                          setPower(!power);
                          api.current?.setState({ power: !power });
                        }}
                      >
                        {power ? "Desligar eletrônica" : "Ligar eletrônica"} ↗
                      </button>
                    )}
                    {i === 11 && (
                      <div className="hero-actions">
                        <a className="button" href="/prototipo">
                          Explore cada detalhe <span>↗</span>
                        </a>
                        <a className="text-link" href="/empresa">
                          Conheça a OptiShift ↗
                        </a>
                      </div>
                    )}
                    {i === 10 && (
                      <a className="text-link" href="/empresa">
                        Conhecer a produção ↗
                      </a>
                    )}
                  </div>
                )}
              </section>
            ))}
          </div>
          <div className="story-bottom">
            <span className="concept-label">
              <i /> Protótipo digital conceitual
            </span>
            <div className="chapter-navigation">
              <button
                aria-label="Capítulo anterior"
                disabled={active === 0}
                onClick={() => jump(active - 1)}
              >
                ←
              </button>
              <span>
                {String(active + 1).padStart(2, "0")} <i>/ 12</i>
              </span>
              <button
                aria-label="Próximo capítulo"
                disabled={active === 11}
                onClick={() => jump(active + 1)}
              >
                →
              </button>
            </div>
            <span className="scroll-hint">
              ROLE PARA DESCOBRIR <span>↓</span>
            </span>
          </div>
          <div
            ref={progressLine}
            className="story-progress"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
      <section className="section-wrap home-paths">
        <span className="eyebrow">CONTINUE A EXPLORAÇÃO</span>
        <h2>
          Uma ideia.
          <br />
          Todos os seus detalhes.
        </h2>
        <div className="path-links">
          <a href="/tecnologia">
            <span>A ciência</span>
            <strong>Entenda a óptica.</strong>
            <i>↗</i>
          </a>
          <a href="/engenharia">
            <span>A arquitetura</span>
            <strong>Veja por dentro.</strong>
            <i>↗</i>
          </a>
          <a href="/empresa">
            <span>A produção</span>
            <strong>Conheça a OptiShift.</strong>
            <i>↗</i>
          </a>
        </div>
      </section>
    </>
  );
}
