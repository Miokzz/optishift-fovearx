import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { ProductState } from "../three/types";
import type { createProductScene } from "../three/scene";
export type SceneApi = ReturnType<typeof createProductScene>;
export const ProductStage = forwardRef<
  SceneApi | undefined,
  {
    interactive?: boolean;
    state?: Partial<ProductState>;
    onSelect?: (id: string) => void;
    className?: string;
    onReady?: () => void;
  }
>(function ProductStage(
  { interactive = false, state, onSelect, className = "", onReady },
  ref,
) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<SceneApi>(undefined);
  const latest = useRef(state);
  const callbacks = useRef({ onSelect, onReady });
  const [status, setStatus] = useState("loading");
  latest.current = state;
  callbacks.current = { onSelect, onReady };
  useImperativeHandle(
    ref,
    () => ({
      setState: (s) => api.current?.setState(s),
      setView: (v) => api.current?.setView(v),
      zoom: (v) => api.current?.zoom(v),
      reset: () => api.current?.reset(),
      capture: () => api.current?.capture() ?? "",
      dispose: () => api.current?.dispose(),
      getStats: () => api.current?.getStats() ?? { drawCalls: 0, triangles: 0 },
    }),
    [],
  );
  useEffect(() => {
    let cancelled = false;
    import("../three/scene")
      .then(({ createProductScene }) => {
        if (cancelled || !host.current) return;
        try {
          api.current = createProductScene(host.current, {
            interactive,
            onSelect: (id) => callbacks.current.onSelect?.(id),
            onReady: () => {
              setStatus("ready");
              queueMicrotask(() => {
                if (!cancelled) callbacks.current.onReady?.();
              });
            },
            onError: () => setStatus("fallback"),
          });
          if (latest.current) api.current.setState(latest.current);
        } catch {
          setStatus("fallback");
        }
      })
      .catch(() => setStatus("fallback"));
    return () => {
      cancelled = true;
      api.current?.dispose();
      api.current = undefined;
    };
  }, [interactive]);
  useEffect(() => {
    if (state) api.current?.setState(state);
  }, [state]);
  return (
    <div className={`product-stage ${className}`} data-renderer={status}>
      <div
        className="webgl-host"
        ref={host}
        aria-label={
          interactive
            ? "Modelo tridimensional interativo do FoveaRx One"
            : "Modelo tridimensional do FoveaRx One"
        }
      />
      {status !== "ready" && (
        <div className="stage-fallback">
          <img
            src="/product-still.webp"
            srcSet="/product-still-small.webp 600w, /product-still.webp 1200w"
            sizes="(max-width: 700px) 100vw, 88vw"
            width="1200"
            height="580"
            fetchPriority="high"
            alt="FoveaRx One: armação grafite, lentes transparentes e sensores integrados"
          />
          <span>
            {status === "loading"
              ? "Preparando o estúdio 3D…"
              : "Apresentação estática · WebGL indisponível"}
          </span>
        </div>
      )}
    </div>
  );
});
