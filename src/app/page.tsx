import Image from "next/image";
import WorkspaceLoader from "./workspace-loader";
import {
  Activity,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Page() {
  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="app-container">
        <header className="topbar">
          <a className="brand" href="#inicio" aria-label="Doxter, inicio">
            <span className="brand-mark">
              <Sparkles size={17} />
            </span>
            <span>Doxter</span>
          </a>
          <nav className="topnav" aria-label="Navegación principal">
            <a href="#flujo">Cómo funciona</a>
            <a href="#formato">Formato</a>
            <a href="#ayuda">Ayuda</a>
          </nav>
          <span className="secure-label">
            <ShieldCheck size={15} /> Procesamiento seguro
          </span>
        </header>
        <section id="inicio" className="hero">
          <div className="eyebrow">
            <span className="status-dot" /> Consulta empresarial para Colombia
          </div>
          <h1>
            La información de tu Excel,
            <br />
            <span>lista para decidir.</span>
          </h1>
          <p>
            Extrae datos empresariales del RUES de forma masiva, clara y sin
            consultas manuales repetitivas.
          </p>
          <div className="hero-stats">
            <span>
              <strong>3×</strong> consultas concurrentes
            </span>
            <span>
              <strong>.xlsx</strong> compatible
            </span>
            <span>
              <strong>100%</strong> descargable
            </span>
          </div>
        </section>
        <WorkspaceLoader />
        <section id="flujo" className="content-section">
          <div className="section-heading">
            <div>
              <p className="kicker">Pensado para tu flujo</p>
              <h2>Menos pasos. Más contexto.</h2>
            </div>
            <a href="#ayuda" className="inline-link">
              Ver ayuda <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="feature-grid">
            <article>
              <span className="feature-number" aria-hidden="true">
                01
              </span>
              <Search size={20} />
              <h3>Normaliza automáticamente</h3>
              <p>
                Doxter limpia puntos, guiones y dígitos de verificación antes de
                consultar.
              </p>
            </article>
            <article>
              <span className="feature-number" aria-hidden="true">
                02
              </span>
              <Activity size={20} />
              <h3>Consulta en paralelo</h3>
              <p>
                Procesa tres registros al tiempo y muestra el avance en tiempo
                real.
              </p>
            </article>
            <article>
              <span className="feature-number" aria-hidden="true">
                03
              </span>
              <CheckCircle2 size={20} />
              <h3>Exporta sin fricción</h3>
              <p>
                Recibe un Excel ordenado con todos los campos para tu siguiente
                reporte.
              </p>
            </article>
          </div>
        </section>
        <section id="formato" className="format-section">
          <div>
            <p className="kicker">Antes de empezar</p>
            <h2>Un archivo simple es suficiente.</h2>
            <p>
              Usa una sola columna con los NITs, sin encabezados. Puedes
              consultar desde uno hasta cientos de registros.
            </p>
            <div className="format-tags">
              <span>
                <Check size={14} /> Una columna
              </span>
              <span>
                <Check size={14} /> Sin encabezados
              </span>
              <span>
                <Check size={14} /> Sin guiones
              </span>
            </div>
          </div>
          <Image
            src="/Ejemplo.png"
            alt="Ejemplo de archivo Excel con una columna de NITs"
            width={360}
            height={220}
            loading="lazy"
            sizes="(max-width: 720px) calc(100vw - 34px), 360px"
            quality={65}
          />
        </section>
        <footer id="ayuda">
          <div className="brand">
            <span className="brand-mark">
              <Sparkles size={15} />
            </span>
            <span>Doxter</span>
          </div>
          <p>Consulta masiva de información empresarial en el RUES.</p>
          <a
            href="https://github.com/NotExer"
            target="_blank"
            rel="noopener noreferrer"
          >
            Creado por NotExer <ArrowUpRight size={14} />
          </a>
        </footer>
      </div>
    </main>
  );
}
