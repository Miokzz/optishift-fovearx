import { useState } from "react";
import Home from "./pages/Home";
import Technology from "./pages/Technology";
import Company from "./pages/Company";
import Explorer from "./pages/Explorer";
const nav = [
  ["/", "Visão geral"],
  ["/tecnologia", "Tecnologia"],
  ["/engenharia", "Engenharia"],
  ["/empresa", "Empresa"],
];
export default function App({ path: providedPath }: { path?: string }) {
  const path =
    providedPath ?? (window.location.pathname.replace(/\/$/, "") || "/");
  const [menu, setMenu] = useState(false);
  let page;
  switch (path) {
    case "/":
      page = <Home />;
      break;
    case "/tecnologia":
      page = <Technology />;
      break;
    case "/empresa":
      page = <Company />;
      break;
    case "/engenharia":
      page = <Explorer engineering />;
      break;
    case "/prototipo":
      page = <Explorer />;
      break;
    default:
      page = (
        <section className="page-intro">
          <span className="eyebrow">404</span>
          <h1>Fora de foco.</h1>
          <p>Esta página não foi encontrada.</p>
          <a href="/" className="button">
            Voltar ao FoveaRx One ↗
          </a>
        </section>
      );
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Pular para o conteúdo
      </a>
      <header className="site-header">
        <a
          className="brand"
          href="/"
          aria-label="OptiShift Technologies — início"
        >
          <svg viewBox="0 0 40 28" aria-hidden="true">
            <ellipse cx="20" cy="14" rx="17" ry="10" />
            <circle cx="20" cy="14" r="5" />
          </svg>
          <span>
            OptiShift<small>TECHNOLOGIES</small>
          </span>
        </a>
        <nav aria-label="Navegação principal" className={menu ? "open" : ""}>
          {nav.map(([href, label]) => (
            <a
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          className="nav-cta"
          href="/prototipo"
          aria-current={path === "/prototipo" ? "page" : undefined}
        >
          Explore o protótipo <span>↗</span>
        </a>
        <button
          className="menu-toggle"
          aria-expanded={menu}
          aria-label={menu ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenu(!menu)}
        >
          {menu ? "×" : "☰"}
        </button>
      </header>
      <main id="main">{page}</main>
      <footer className="site-footer">
        <div className="footer-top">
          <a className="footer-wordmark" href="/">
            OptiShift<span>Technologies.</span>
          </a>
          <p>
            Seu olhar muda.
            <br />
            Sua visão acompanha.
          </p>
        </div>
        <div className="footer-links">
          {[...nav, ["/prototipo", "Protótipo"]].map(([href, label]) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 OptiShift Technologies S.A. · Projeto educacional</span>
          <p>
            Empresa e produto conceituais. Especificações, preço e estrutura
            empresarial são propostas. Sem oferta comercial ou validação clínica
            do FoveaRx One.
          </p>
        </div>
      </footer>
    </>
  );
}
