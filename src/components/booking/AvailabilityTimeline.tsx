"use client";

import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type BookingSegment = {
  id: string;
  start: number; // epoch ms
  end: number; // epoch ms
  status: "free" | "busy" | "pending";
  title?: string;
};

export type TimelineView = "day" | "week" | "month";

export interface AvailabilityTimelineProps {
  bookings: BookingSegment[];
  date: Date;
  view: TimelineView;
  onSelectRange?: (from: Date, to: Date) => void;
}

// Palette par statut
const statusClass: Record<BookingSegment["status"], string> = {
  free: "bg-green-500/60",
  busy: "bg-red-500/60",
  pending: "bg-yellow-500/60",
};

export default function AvailabilityTimeline({
  bookings,
  date,
  view,
  onSelectRange,
}: AvailabilityTimelineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragEndX, setDragEndX] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1); // zoom horizontal (1 = fit)

  const { rangeStart, rangeEnd } = useMemo(
    () => getViewRange(date, view),
    [date, view]
  );
  const totalMs = rangeEnd.getTime() - rangeStart.getTime();

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragging(true);
    const x = e.nativeEvent.offsetX;
    setDragStartX(x);
    setDragEndX(x);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const x = e.nativeEvent.offsetX;
    setDragEndX(x);
  };

  const handlePointerUp = () => {
    if (
      !isDragging ||
      dragStartX == null ||
      dragEndX == null ||
      !containerRef.current
    )
      return;
    setDragging(false);
    const left = Math.min(dragStartX, dragEndX);
    const right = Math.max(dragStartX, dragEndX);
    const width = containerRef.current.clientWidth;
    const fromMs = rangeStart.getTime() + (left / width) * totalMs;
    const toMs = rangeStart.getTime() + (right / width) * totalMs;
    if (onSelectRange) onSelectRange(new Date(fromMs), new Date(toMs));
    setDragStartX(null);
    setDragEndX(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!e.ctrlKey) return; // zoom seulement avec Ctrl+scroll
    e.preventDefault();
    const next = Math.min(4, Math.max(0.5, zoom + (e.deltaY > 0 ? -0.1 : 0.1)));
    setZoom(Number(next.toFixed(2)));
  };

  return (
    <section aria-label="Disponibilités" className="w-full">
      <div
        role="grid"
        aria-rowcount={1}
        aria-colcount={bookings.length}
        ref={containerRef}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className={cn(
          "relative select-none overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-2 outline-none focus-visible:ring-2 dark:border-neutral-800 dark:bg-neutral-900",
          "h-32 sm:h-40"
        )}
        style={
          {
            transform: `scaleX(${zoom})`,
            transformOrigin: "left center",
          } as React.CSSProperties
        }
      >
        {/* Piste */}
        <div className="absolute inset-y-4 left-2 right-2">
          <div className="relative h-full">
            {bookings.map((b) => {
              const left = ((b.start - rangeStart.getTime()) / totalMs) * 100;
              const right = ((rangeEnd.getTime() - b.end) / totalMs) * 100;
              const width = Math.max(0, 100 - left - right);
              return (
                <div
                  key={b.id}
                  role="gridcell"
                  aria-label={b.title ?? b.status}
                  className={cn(
                    "absolute top-0 h-full rounded-md",
                    statusClass[b.status]
                  )}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  title={b.title}
                />
              );
            })}
            {/* Drag-select overlay */}
            {isDragging && dragStartX != null && dragEndX != null && (
              <div
                aria-hidden
                className="absolute top-0 h-full rounded-md bg-blue-500/20 border border-blue-500"
                style={{
                  left: `${Math.min(dragStartX, dragEndX)}px`,
                  width: `${Math.abs(dragEndX - dragStartX)}px`,
                }}
              />
            )}
          </div>
        </div>
        {/* Now line */}
        {isInRange(new Date(), rangeStart, rangeEnd) && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-2 left-0 w-px bg-blue-600"
            style={{
              left: `${((Date.now() - rangeStart.getTime()) / totalMs) * 100}%`,
            }}
          />
        )}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300">
        <span>
          Vue: {view} · {rangeStart.toLocaleString()} →{" "}
          {rangeEnd.toLocaleString()}
        </span>
        <span>Zoom: x{zoom.toFixed(2)} (Ctrl + molette)</span>
      </div>
    </section>
  );
}

function getViewRange(date: Date, view: TimelineView) {
  const d = new Date(date);
  if (view === "day") {
    const start = new Date(d);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { rangeStart: start, rangeEnd: end };
  }
  if (view === "week") {
    const day = d.getDay(); // 0=dim
    const start = new Date(d);
    start.setDate(start.getDate() - day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return { rangeStart: start, rangeEnd: end };
  }
  // month
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return { rangeStart: start, rangeEnd: end };
}

function isInRange(x: Date, a: Date, b: Date) {
  const t = x.getTime();
  return t >= a.getTime() && t <= b.getTime();
}
