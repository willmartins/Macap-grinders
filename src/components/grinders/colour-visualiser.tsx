"use client";

import Image from "next/image";
import { useState } from "react";

import { SectionHeader } from "@/components/site/section-header";
import type { Grinder } from "@/lib/content/types";

type ColourOption = {
  id: string;
  name: string;
  italianName: string;
  hex: string;
  borderHex?: string;
  description: string;
  code: string;
  glowRgba: string;
};

const COLOUR_OPTIONS: ColourOption[] = [
  {
    id: "matt-black",
    name: "Matt Black",
    italianName: "Nero Opaco",
    hex: "#18181b",
    borderHex: "#3f3f46",
    description: "Satin-finish micro-texture powder coat. Resists coffee oils, fingerprints, and daily counter wear.",
    code: "C18 • RAL 9005",
    glowRgba: "rgba(255, 255, 255, 0.08)",
  },
  {
    id: "pure-white",
    name: "Pure White",
    italianName: "Bianco Lucido",
    hex: "#f4f4f5",
    borderHex: "#d4d4d8",
    description: "High-density architectural white satin coating cured over die-cast aluminium.",
    code: "C01 • RAL 9016",
    glowRgba: "rgba(255, 255, 255, 0.25)",
  },
  {
    id: "polished-chrome",
    name: "Polished Chrome",
    italianName: "Alluminio Lucidato",
    hex: "#d4d4d8",
    borderHex: "#a1a1aa",
    description: "Hand-polished aluminium housing sealed with an anti-oxidising clear protective coat.",
    code: "C02 • Chrome Finish",
    glowRgba: "rgba(212, 212, 216, 0.25)",
  },
  {
    id: "venetian-red",
    name: "Venetian Red",
    italianName: "Rosso Veneziano",
    hex: "#991b1b",
    borderHex: "#b91c1c",
    description: "Signature Italian racing red gloss finish celebrating Macap's Venice heritage since 1930.",
    code: "C04 • RAL 3000",
    glowRgba: "rgba(153, 27, 27, 0.35)",
  },
  {
    id: "anthracite-grey",
    name: "Anthracite Grey",
    italianName: "Grigio Antracite",
    hex: "#3f3f46",
    borderHex: "#52525b",
    description: "Deep metallic charcoal with fine textured stipple for an understated, low-glare aesthetic.",
    code: "C10 • RAL 7016",
    glowRgba: "rgba(63, 63, 70, 0.3)",
  },
];

export function ColourVisualiser({ grinder }: { grinder: Grinder }) {
  const [selectedColour, setSelectedColour] = useState<ColourOption>(COLOUR_OPTIONS[0]);

  const displayImage = grinder.imageUrl;

  return (
    <section className="section border-b border-silver bg-sand" aria-labelledby="colours-heading">
      <div className="frame">
        <SectionHeader
          id="colours-heading"
          eyebrow="Finishes"
          title="Colour options & finishes"
          description="Choose a finish to complement your espresso machine and counter architecture."
        />

        <div className="mt-10 grid gap-8 border border-silver bg-white p-6 sm:p-8 md:grid-cols-12 md:gap-12 md:p-10">
          {/* Visualiser Stage */}
          <div className="relative flex flex-col items-center justify-center bg-off-black p-3 sm:p-8 md:p-10 md:col-span-7 overflow-hidden min-h-[24rem] sm:min-h-[28rem]">
            {/* Dynamic ambient backlight reflecting the chosen colour */}
            <div
              className="pointer-events-none absolute inset-0 transition-all duration-500 ease-out"
              style={{
                background: `radial-gradient(circle at 50% 55%, ${selectedColour.glowRgba} 0%, transparent 65%)`,
              }}
              aria-hidden="true"
            />

            {/* Subtle floor reflection podium */}
            <div
              className="pointer-events-none absolute bottom-4 inset-x-8 h-12 rounded-full opacity-40 blur-xl transition-colors duration-500"
              style={{ background: selectedColour.hex }}
              aria-hidden="true"
            />

            {/* Machine Display: On mobile crop in and scale up to fill vertical space */}
            {displayImage ? (
              <div className="relative z-10 h-72 sm:h-84 md:h-96 w-full max-w-sm scale-110 sm:scale-100 transition-transform">
                <Image
                  src={displayImage}
                  alt={`${grinder.name} in ${selectedColour.name}`}
                  fill
                  sizes="(min-width: 768px) 35vw, 90vw"
                  className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] select-none"
                />
              </div>
            ) : (
              <div className="relative z-10 text-center text-white/60">
                Machine visualiser preview
              </div>
            )}

            {/* Current Colour Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-md border border-white/15 px-3 py-1.5 type-eyebrow text-white">
              <span
                className="h-2.5 w-2.5 rounded-full border border-white/30"
                style={{ backgroundColor: selectedColour.hex }}
              />
              <span>{selectedColour.name}</span>
            </div>
          </div>

          {/* Selector & Details Panel */}
          <div className="flex flex-col justify-between md:col-span-5">
            <div>
              <p className="type-eyebrow text-grey">Select finish</p>

              {/* Swatches Grid */}
              <div className="mt-4 flex flex-wrap gap-3" role="radiogroup" aria-label="Available colours">
                {COLOUR_OPTIONS.map((colour) => {
                  const isSelected = colour.id === selectedColour.id;
                  return (
                    <button
                      key={colour.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedColour(colour)}
                      className={`group relative flex h-12 w-12 items-center justify-center rounded-full transition-all focus:outline-none ${
                        isSelected
                          ? "ring-2 ring-yellow ring-offset-2 ring-offset-white scale-105"
                          : "hover:scale-105 opacity-80 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: colour.hex,
                        border: `1.5px solid ${colour.borderHex || "rgba(255,255,255,0.2)"}`,
                      }}
                      title={`${colour.name} (${colour.code})`}
                    >
                      {isSelected && (
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            colour.id === "pure-white" ? "bg-black" : "bg-white"
                          }`}
                        />
                      )}
                      <span className="sr-only">{colour.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Finish Details */}
              <div className="mt-8 border border-silver bg-silver/50 p-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="type-h3 text-black">
                    {selectedColour.name}
                  </h3>
                  <span className="type-mono text-grey">{selectedColour.code}</span>
                </div>
                <p className="mt-1 text-xs text-grey">
                  {selectedColour.italianName}
                </p>
                <p className="mt-3 type-body text-grey">
                  {selectedColour.description}
                </p>
              </div>

              {/* Material Assurance */}
              <ul className="mt-6 space-y-2.5 text-sm text-grey">
                <li className="flex items-center gap-2.5">
                  <span className="font-semibold text-black">✓</span>
                  <span>Electrostatically applied powder coat cured at 200°C</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="font-semibold text-black">✓</span>
                  <span>UV and chemical resistant against espresso cleaning agents</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="font-semibold text-black">✓</span>
                  <span>Cast aluminium body for thermal mass and stability</span>
                </li>
              </ul>
            </div>

            {/* Custom Fleet Note */}
            <div className="mt-8 pt-5 border-t border-silver type-body text-grey">
              <strong className="text-black block font-semibold mb-1">Custom fleet orders</strong>
              Custom RAL colour matching and laser-etched branding are available on volume orders for roasters and cafe groups.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
