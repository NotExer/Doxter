"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";

export default function WorkspaceLoader() {
  const [Workspace, setWorkspace] = useState<ComponentType | null>(null);

  useEffect(() => {
    const load = () =>
      import("./doxter-workspace").then((module) =>
        setWorkspace(() => module.default),
      );
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(load, { timeout: 700 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(load, 120);
    return () => clearTimeout(id);
  }, []);

  if (!Workspace) {
    return (
      <section
        className="workspace-card workspace-placeholder"
        aria-label="Cargando panel de consulta"
      >
        <div className="placeholder-line" />
        <div className="placeholder-box" />
      </section>
    );
  }
  return <Workspace />;
}
