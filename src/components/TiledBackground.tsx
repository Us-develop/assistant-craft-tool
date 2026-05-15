"use client";

import Image from "next/image";

const TILES = [
  "/login-bg/tile-1.png",
  "/login-bg/tile-2.png",
  "/login-bg/tile-3.png",
  "/login-bg/tile-4.png",
  "/login-bg/tile-5.png",
  "/login-bg/tile-6.png",
];

function buildGrid() {
  const rows = 8;
  const cols = 8;
  const items: { src: string; key: string }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      items.push({
        src: TILES[(r * cols + c) % TILES.length],
        key: `${r}-${c}`,
      });
    }
  }
  return { items, cols };
}

export default function TiledBackground() {
  const { items, cols } = buildGrid();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="animate-tile-scroll absolute flex flex-wrap gap-8 p-4"
        style={{
          width: `${cols * 480}px`,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) rotate(-20deg)",
        }}
      >
        {items.map(({ src, key }) => (
          <div
            key={key}
            className="shrink-0 overflow-hidden rounded-xl border border-(--color-border) shadow-md opacity-85"
            style={{ width: "440px", height: "300px" }}
          >
            <Image
              src={src}
              alt=""
              width={880}
              height={600}
              className="h-full w-full object-cover object-top"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
}
