"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  Building2,
  Check,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Info,
  Loader2,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

interface ResultRow {
  nit: string;
  nombre_empresa: string;
  categoria_matricula: string;
  camara_comercio: string;
  estado_matricula: string;
  ultimo_ano_renovado: string;
  actividad_economica: string;
  error?: string;
}
async function processWithConcurrency<T>(
  items: T[],
  fn: (item: T) => Promise<void>,
  concurrency: number,
) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (queue.length) await fn(queue.shift()!);
    }),
  );
}

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [nits, setNits] = useState<string[]>([]);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const parseFile = useCallback((f: File) => {
    if (!f?.name.toLowerCase().endsWith(".xlsx")) return;
    setFile(f);
    setResults([]);
    setProgress({ done: 0, total: 0 });
    const reader = new FileReader();
    reader.onload = async (e) => {
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(
        new Uint8Array(e.target?.result as ArrayBuffer),
        { type: "array" },
      );
      const rows: unknown[][] = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]],
        { header: 1 },
      );
      const parsed = rows.flatMap((row) => {
        const raw =
          row[0] == null ? "" : String(row[0]).replace(/\D/g, "").slice(0, 9);
        return raw ? [raw] : [];
      });
      setNits([...new Set(parsed)]);
    };
    reader.readAsArrayBuffer(f);
  }, []);
  const clearFile = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFile(null);
    setNits([]);
    setResults([]);
    setProgress({ done: 0, total: 0 });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);
  const handleProcess = useCallback(async () => {
    if (!nits.length) return;
    setProcessing(true);
    setResults([]);
    setProgress({ done: 0, total: nits.length });
    let done = 0;
    await processWithConcurrency(
      nits,
      async (nit) => {
        try {
          const data = await (
            await fetch(`/api/rues/lookup?nit=${nit}`)
          ).json();
          setResults((prev) => [
            ...prev,
            {
              nit,
              nombre_empresa: data.nombre_empresa ?? "",
              categoria_matricula: data.categoria_matricula ?? "",
              camara_comercio: data.camara_comercio ?? "",
              estado_matricula: data.estado_matricula ?? "",
              ultimo_ano_renovado: data.ultimo_ano_renovado ?? "",
              actividad_economica: data.actividad_economica ?? "",
              error: data.error,
            },
          ]);
        } catch {
          setResults((prev) => [
            ...prev,
            {
              nit,
              nombre_empresa: "",
              categoria_matricula: "",
              camara_comercio: "",
              estado_matricula: "",
              ultimo_ano_renovado: "",
              actividad_economica: "",
              error: "Error de conexión",
            },
          ]);
        }
        done += 1;
        setProgress({ done, total: nits.length });
      },
      3,
    );
    setProcessing(false);
  }, [nits]);
  const downloadResults = useCallback(async () => {
    const XLSX = await import("xlsx");
    const ws = XLSX.utils.json_to_sheet(
      results.map((r) => ({
        NIT: r.nit,
        "Nombre Empresa": r.nombre_empresa,
        "Categoría de la Matrícula": r.categoria_matricula,
        "Cámara de Comercio": r.camara_comercio,
        "Estado de la Matrícula": r.estado_matricula,
        "Último Año Renovado": r.ultimo_ano_renovado,
        "Actividad Económica": r.actividad_economica,
      })),
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");
    XLSX.writeFile(wb, "Resultados-Doxter.xlsx");
  }, [results]);
  const completed = results.filter((r) => !r.error).length;
  const progressPercent = progress.total
    ? Math.round((progress.done / progress.total) * 100)
    : 0;
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
        <section className="workspace-card" aria-labelledby="workspace-title">
          <div className="section-heading">
            <div>
              <p className="kicker">Paso 01 · Fuente de datos</p>
              <h2 id="workspace-title">Carga tu archivo</h2>
            </div>
            <span className="step-chip">1 / 3</span>
          </div>
          <div
            className={`dropzone ${isDragging ? "dropzone-dragging" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              parseFile(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                fileInputRef.current?.click();
            }}
          aria-label="Arrastra tu Excel aquí o selecciónalo desde tu equipo · solo .xlsx"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              onChange={(e) =>
                e.target.files?.[0] && parseFile(e.target.files[0])
              }
              hidden
            />
            {file ? (
              <>
                <span className="file-icon">
                  <FileSpreadsheet size={25} />
                </span>
                <div>
                  <strong>{file.name}</strong>
                  <p>
                    {nits.length} NIT{nits.length === 1 ? "" : "s"} válidos
                    detectados
                  </p>
                </div>
                <button
                  type="button"
                  className="icon-button"
                  onClick={clearFile}
                  aria-label="Quitar archivo"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <>
                <span className="upload-icon">
                  <UploadCloud size={25} />
                </span>
                <div>
                  <strong>Arrastra tu Excel aquí</strong>
                  <p>o selecciónalo desde tu equipo · solo .xlsx</p>
                </div>
                <ArrowUpRight className="drop-arrow" size={19} />
              </>
            )}
          </div>
          <div className="privacy-note">
            <Info size={15} /> Los datos se procesan en esta sesión y no se
            almacenan.
          </div>
        </section>
        {file && nits.length > 0 && !results.length && (
          <section
            className="preview-card animate-slide-up"
            aria-labelledby="preview-title"
          >
            <div className="section-heading">
              <div>
                <p className="kicker">Paso 02 · Vista previa</p>
                <h2 id="preview-title">Esto es lo que vamos a extraer</h2>
              </div>
              <span className="success-chip">
                <Check size={14} /> Archivo listo
              </span>
            </div>
            <div className="preview-grid">
              <div className="preview-list">
                <p className="small-label">NITs a consultar</p>
                <div className="nit-list">
                  {nits.slice(0, 8).map((nit) => (
                    <span key={nit}>{nit}</span>
                  ))}
                  {nits.length > 8 && <span>+{nits.length - 8} más</span>}
                </div>
              </div>
              <div className="extract-list">
                <p className="small-label">Campos de salida</p>
                <span>
                  <Building2 size={15} /> Nombre y estado de la empresa
                </span>
                <span>
                  <Activity size={15} /> Actividad económica y cámara
                </span>
                <span>
                  <FileText size={15} /> Categoría y último año renovado
                </span>
              </div>
            </div>
            <button
              className="primary-button"
              onClick={handleProcess}
              disabled={processing}
            >
              <Play size={17} /> Consultar {nits.length} empresa
              {nits.length === 1 ? "" : "s"}
            </button>
          </section>
        )}
        {processing && (
          <section
            className="progress-card animate-slide-up"
            aria-live="polite"
          >
            <div className="progress-top">
              <span>
                <Loader2 size={17} className="spin" /> Consultando RUES…
              </span>
              <strong>{progressPercent}%</strong>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p>
              {progress.done} de {progress.total} registros procesados
            </p>
          </section>
        )}
        {results.length > 0 && !processing && (
          <section
            className="results-card animate-slide-up"
            aria-labelledby="results-title"
          >
            <div className="section-heading">
              <div>
                <p className="kicker">Paso 03 · Resultado final</p>
                <h2 id="results-title">Datos listos para usar</h2>
              </div>
              <button className="secondary-button" onClick={downloadResults}>
                <Download size={16} /> Descargar Excel
              </button>
            </div>
            <div className="result-summary">
              <div>
                <strong>{results.length}</strong>
                <span>registros procesados</span>
              </div>
              <div>
                <strong className="success-text">{completed}</strong>
                <span>consultas exitosas</span>
              </div>
              <div>
                <strong>{results.length - completed}</strong>
                <span>con observaciones</span>
              </div>
              <button className="text-button" onClick={clearFile}>
                <Trash2 size={15} /> Nueva consulta
              </button>
            </div>
            <div className="table-wrap">
              <table>
                <caption className="sr-only">
                  Resultados de la consulta RUES
                </caption>
                <thead>
                  <tr>
                    <th>NIT</th>
                    <th>Empresa</th>
                    <th>Estado</th>
                    <th>Cámara</th>
                    <th>Actividad económica</th>
                    <th>Año</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, i) => (
                    <tr key={`${row.nit}-${i}`}>
                      <td className="mono">{row.nit}</td>
                      <td>
                        {row.error ? (
                          <span className="error-text">
                            <AlertCircle size={14} /> {row.error}
                          </span>
                        ) : (
                          <strong>
                            {row.nombre_empresa || "Sin nombre reportado"}
                          </strong>
                        )}
                      </td>
                      <td>
                        {row.estado_matricula ? (
                          <span
                            className={`status-badge ${row.estado_matricula.toLowerCase().includes("activ") ? "active" : "neutral"}`}
                          >
                            {row.estado_matricula}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{row.camara_comercio || "—"}</td>
                      <td className="truncate" title={row.actividad_economica}>
                        {row.actividad_economica || "—"}
                      </td>
                      <td className="mono">{row.ultimo_ano_renovado || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
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
              <span className="feature-number">01</span>
              <Search size={20} />
              <h3>Normaliza automáticamente</h3>
              <p>
                Doxter limpia puntos, guiones y dígitos de verificación antes de
                consultar.
              </p>
            </article>
            <article>
              <span className="feature-number">02</span>
              <Activity size={20} />
              <h3>Consulta en paralelo</h3>
              <p>
                Procesa tres registros al tiempo y muestra el avance en tiempo
                real.
              </p>
            </article>
            <article>
              <span className="feature-number">03</span>
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
