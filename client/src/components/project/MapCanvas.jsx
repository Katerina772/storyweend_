import { useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { MapMarker } from "./MapMarker.jsx";

export function MapCanvas({
  mapImageUrl,
  markers,
  canCreate,
  onMapClick,
  onMarkerClick,
  selectedMarkerId,
  moveMode,
}) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const handleMapClick = (e) => {
    // Якщо це клік по маркеру — ігноруємо (маркер викликає stopPropagation)
    if (!onMapClick) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Клампимо до 0-100
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    onMapClick(clampedX, clampedY);
  };

  const cursorStyle = moveMode
    ? "crosshair"
    : canCreate
      ? "crosshair"
      : "default";

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
      <TransformWrapper
        initialScale={1}
        minScale={0.3}
        maxScale={6}
        doubleClick={{ disabled: true }}
        wheel={{ step: 0.1 }}
        onZoom={(ref) => setScale(ref.state.scale)}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Кнопки керування */}
            <div className="absolute top-3 right-3 z-30 flex flex-col gap-1 bg-slate-900 border border-slate-700 rounded-lg p-1">
              <button
                onClick={() => zoomIn()}
                className="w-8 h-8 text-slate-200 hover:bg-slate-800 rounded"
                title="Збільшити"
              >
                +
              </button>
              <button
                onClick={() => zoomOut()}
                className="w-8 h-8 text-slate-200 hover:bg-slate-800 rounded"
                title="Зменшити"
              >
                −
              </button>
              <button
                onClick={() => resetTransform()}
                className="w-8 h-8 text-slate-200 hover:bg-slate-800 rounded text-sm"
                title="Скинути"
              >
                ⟲
              </button>
            </div>

            {/* Індикатор масштабу */}
            <div className="absolute bottom-3 right-3 z-30 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-400">
              {Math.round(scale * 100)}%
            </div>

            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
              }}
              contentStyle={{
                width: "100%",
                height: "100%",
              }}
            >
              <div
                ref={containerRef}
                onClick={handleMapClick}
                className="relative w-full h-full flex items-center justify-center"
                style={{ cursor: cursorStyle }}
              >
                {mapImageUrl ? (
                  <img
                    src={mapImageUrl}
                    alt="Карта світу"
                    className="block max-w-full max-h-full select-none"
                    draggable={false}
                  />
                ) : (
                  <div className="text-slate-500 text-center p-10">
                    <div className="text-6xl mb-4">🗺️</div>
                    <p>Зображення карти ще не встановлено</p>
                  </div>
                )}

                {/* Маркери */}
                {mapImageUrl && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="relative w-full h-full pointer-events-auto">
                      {markers.map((m) => (
                        <MapMarker
                          key={m.id}
                          marker={m}
                          selected={m.id === selectedMarkerId}
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkerClick?.(m);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
