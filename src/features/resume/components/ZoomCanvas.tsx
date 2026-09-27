"use client";

import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { PageThumbnailNav } from "./PageThumbnailNav";

// ─── Constants ────────────────────────────────────────────────────────────────
const NATURAL_PAGE_W = 794;   // 210 mm at 96 dpi
const CANVAS_PAD     = 48;    // px of breathing room around content
const MIN_ZOOM       = 0.15;
const MAX_ZOOM       = 4.0;
const ZOOM_STEP      = 0.08;  // per mouse-wheel notch

// ─── Types ────────────────────────────────────────────────────────────────────
interface ZoomCanvasProps {
  children: React.ReactNode;
  totalPages?: number;
  activePage?: number;
  onSelectPage?: (pageNum: number) => void;
  zoom?: number;
  onZoomChange?: (zoom: number | ((prev: number) => number)) => void;
  isPanToolActive?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
export const ZoomCanvas: React.FC<ZoomCanvasProps> = ({
  children,
  totalPages = 1,
  activePage = 1,
  onSelectPage,
  zoom: externalZoom,
  onZoomChange,
  isPanToolActive: externalPanTool = false,
}) => {
  // ── UI state (cursor, thumbnails) ─────────────────────────────────────────
  const [isDragging, setIsDragging]           = useState(false);
  const [isSpacePressed, setIsSpacePressed]   = useState(false);
  const [isThumbnailsOpen, setIsThumbnailsOpen] = useState(true);

  // Internal zoom state (used when no external zoom prop)
  const [internalZoom, setInternalZoom] = useState(1);
  const zoom    = externalZoom !== undefined ? externalZoom : internalZoom;
  const setZoom = (onZoomChange ?? setInternalZoom) as (v: number) => void;

  // ── Refs ───────────────────────────────────────────────────────────────────
  // stageRef: the div we mutate directly — no React state for pan/zoom
  const stageRef     = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Live pan + zoom values — always current, no React re-render needed
  const panRef  = useRef({ x: 0, y: CANVAS_PAD });
  const zoomRef = useRef(zoom);

  // Drag tracking
  const dragRef = useRef({ x: 0, y: 0, panX: 0, panY: CANVAS_PAD });

  // Prevent the "external zoom" effect from firing on our own internal updates
  const skipExtRef  = useRef(false);
  const prevZoomRef = useRef(zoom);

  // Debounce timer — syncs zoom to React state for bottom-bar display
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Core: apply transform directly to DOM (zero React re-render) ──────────
  const applyTransform = useCallback((px: number, py: number, z: number) => {
    if (!stageRef.current) return;
    stageRef.current.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${z})`;
  }, []);

  // Lazily sync zoom to React state so the bottom-bar percentage stays accurate
  const scheduleZoomSync = useCallback((z: number) => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      skipExtRef.current = true;
      setZoom(z);
    }, 80);
  }, [setZoom]);

  // ── Initial center on mount ────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const initialX = (container.clientWidth - NATURAL_PAGE_W * zoomRef.current) / 2;
    const initialY = CANVAS_PAD;
    panRef.current = { x: initialX, y: initialY };
    applyTransform(initialX, initialY, zoomRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── External zoom change (toolbar +/- buttons) ────────────────────────────
  useEffect(() => {
    if (zoom === prevZoomRef.current) return;
    const oldZoom = prevZoomRef.current;
    prevZoomRef.current = zoom;
    zoomRef.current = zoom;

    if (skipExtRef.current) {
      skipExtRef.current = false;
      return; // Our own debounced sync — DOM already up to date
    }

    // Toolbar zoom → re-center horizontally, keep vertical anchor
    const container = containerRef.current;
    if (!container) return;
    const cy  = container.clientHeight / 2;
    const { x: px, y: py } = panRef.current;
    const canvasY = (cy - py) / oldZoom;
    const newX = (container.clientWidth - NATURAL_PAGE_W * zoom) / 2;
    const newY = cy - canvasY * zoom;
    panRef.current = { x: newX, y: newY };
    applyTransform(newX, newY, zoom);
  }, [zoom, applyTransform]);

  // ── Re-center ─────────────────────────────────────────────────────────────
  const centerCanvas = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const z    = zoomRef.current;
    const newX = (container.clientWidth - NATURAL_PAGE_W * z) / 2;
    const newY = CANVAS_PAD;
    panRef.current = { x: newX, y: newY };
    applyTransform(newX, newY, z);
  }, [applyTransform]);

  // ── Scroll to a specific page ─────────────────────────────────────────────
  const handleScrollToPage = useCallback((pageNum: number) => {
    if (onSelectPage) onSelectPage(pageNum);
    const el        = document.getElementById(`resume-page-${pageNum}`);
    const container = containerRef.current;
    if (!el || !container) return;
    const elTop        = el.getBoundingClientRect().top;
    const containerTop = container.getBoundingClientRect().top;
    const newY = panRef.current.y + (CANVAS_PAD - (elTop - containerTop));
    panRef.current = { ...panRef.current, y: newY };
    applyTransform(panRef.current.x, newY, zoomRef.current);
  }, [onSelectPage, applyTransform]);

  // ── Mouse wheel: Ctrl → zoom-to-cursor | else → pan ──────────────────────
  // Everything here hits the DOM directly — zero React renders during scroll.
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const container = containerRef.current;
      if (!container) return;
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        // ── Zoom toward cursor ───────────────────────────────────────────────
        const rect   = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const delta  = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        const oldZ   = zoomRef.current;
        const newZ   = Math.min(Math.max(Number((oldZ + delta).toFixed(3)), MIN_ZOOM), MAX_ZOOM);

        // Pivot math: keep canvas point under cursor stationary
        const { x: px, y: py } = panRef.current;
        const cx   = (mouseX - px) / oldZ;
        const cy   = (mouseY - py) / oldZ;
        const newX = mouseX - cx * newZ;
        const newY = mouseY - cy * newZ;

        panRef.current  = { x: newX, y: newY };
        zoomRef.current = newZ;
        applyTransform(newX, newY, newZ);   // ← DOM, no React
        scheduleZoomSync(newZ);             // ← React sync debounced 80 ms
      } else {
        // ── Pan (two-finger swipe or plain scroll) ───────────────────────────
        const { x: px, y: py } = panRef.current;
        const newX = px - (e.deltaX || 0);
        const newY = py - (e.deltaY || 0);
        panRef.current = { x: newX, y: newY };
        applyTransform(newX, newY, zoomRef.current); // ← DOM, no React
      }
    };

    const el = containerRef.current;
    if (el) el.addEventListener("wheel", handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener("wheel", handleWheel); };
  }, [applyTransform, scheduleZoomSync]);

  // ── Drag / pan (mouse & touch) ────────────────────────────────────────────
  const isPanningActive = externalPanTool || isSpacePressed;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPanningActive) {
      const t = e.target as HTMLElement;
      if (t.closest("a") || t.closest("button") || t.closest("input") || t.closest("textarea") || t.closest("select")) return;
    }
    setIsDragging(true);
    dragRef.current = { x: e.clientX, y: e.clientY, panX: panRef.current.x, panY: panRef.current.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const dx   = e.clientX - dragRef.current.x;
    const dy   = e.clientY - dragRef.current.y;
    const newX = dragRef.current.panX + dx;
    const newY = dragRef.current.panY + dy;
    panRef.current = { x: newX, y: newY };
    applyTransform(newX, newY, zoomRef.current); // DOM only
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    dragRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, panX: panRef.current.x, panY: panRef.current.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx   = e.touches[0].clientX - dragRef.current.x;
    const dy   = e.touches[0].clientY - dragRef.current.y;
    const newX = dragRef.current.panX + dx;
    const newY = dragRef.current.panY + dy;
    panRef.current = { x: newX, y: newY };
    applyTransform(newX, newY, zoomRef.current);
  };

  const handleTouchEnd = () => setIsDragging(false);

  // ── Space-bar → temporary pan mode ───────────────────────────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isSpacePressed && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    const up = (e: KeyboardEvent) => { if (e.code === "Space") setIsSpacePressed(false); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [isSpacePressed]);

  // ── IntersectionObserver: active page detection ───────────────────────────
  useEffect(() => {
    if (totalPages <= 1) return;
    const observers: IntersectionObserver[] = [];
    for (let p = 1; p <= totalPages; p++) {
      const el = document.getElementById(`resume-page-${p}`);
      if (!el) continue;
      const pageNum = p;
      const obs = new IntersectionObserver(
        (entries) => entries.forEach(en => { if (en.isIntersecting && onSelectPage) onSelectPage(pageNum); }),
        { root: null, threshold: 0.4 },
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach(o => o.disconnect());
  }, [totalPages, onSelectPage]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full flex-1 flex overflow-hidden">
      <PageThumbnailNav
        totalPages={totalPages}
        activePage={activePage}
        onSelectPage={handleScrollToPage}
        isOpen={isThumbnailsOpen}
        onToggleOpen={() => setIsThumbnailsOpen(prev => !prev)}
      />

      {/* Canvas viewport — overflow:hidden, content moved via direct DOM transform */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={cn(
          "relative w-full h-full flex-1 overflow-hidden select-none",
          isDragging      ? "cursor-grabbing" :
          isPanningActive ? "cursor-grab"     :
                            "cursor-default",
        )}
      >
        {/* Re-center button */}
        <button
          onClick={centerCanvas}
          title="Re-center canvas"
          aria-label="Re-center canvas"
          className="absolute bottom-24 right-4 z-30 print:hidden w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/70 shadow-md text-slate-500 hover:text-slate-800 hover:bg-white transition-all flex items-center justify-center text-sm"
        >
          ⊙
        </button>

        {/* Zoom limit hints */}
        {zoom <= MIN_ZOOM + 0.01 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 print:hidden pointer-events-none px-2.5 py-1 rounded-md bg-slate-800/75 text-white text-[10px] font-mono">
            Min zoom
          </div>
        )}
        {zoom >= MAX_ZOOM - 0.01 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 print:hidden pointer-events-none px-2.5 py-1 rounded-md bg-slate-800/75 text-white text-[10px] font-mono">
            Max zoom
          </div>
        )}

        {/* ── Stage: transform applied directly via stageRef — no React renders ── */}
        <div
          ref={stageRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transformOrigin: "0 0",
            // No will-change (avoids premature rasterisation / blur)
            // No CSS transition (applied instantly via DOM for 0-latency feel)
          }}
        >
          <div className={cn(isDragging && "pointer-events-none")}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
