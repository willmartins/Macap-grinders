/**
 * A drawn world, as a grid of dots. It is a graphic, not a plotted list of partners,
 * so it claims no coverage Macap cannot back up.
 *
 * The land comes from coarse outlines in degrees, not from a hand-typed picture, so a dot
 * sits where its longitude and latitude say it should and the marker can be placed by
 * coordinate. Dots take `currentColor`, the way the logo does.
 */

type Point = [number, number];

/** Rough continent outlines, [longitude, latitude], east and north positive. */
const LAND: Point[][] = [
  // North America
  [
    [-168, 65], [-156, 71], [-130, 70], [-110, 73], [-95, 74], [-80, 73], [-65, 62], [-55, 52],
    [-67, 45], [-70, 41], [-76, 35], [-81, 25], [-83, 23], [-92, 18], [-97, 22], [-105, 20],
    [-110, 24], [-117, 32], [-124, 42], [-125, 49], [-133, 55], [-145, 60], [-160, 58],
  ],
  // Central America
  [[-92, 18], [-83, 9], [-77, 8], [-84, 15], [-90, 17]],
  // South America
  [
    [-77, 8], [-72, 12], [-60, 11], [-50, 5], [-35, -5], [-38, -13], [-48, -25], [-55, -35],
    [-62, -39], [-65, -45], [-70, -52], [-75, -50], [-72, -40], [-71, -30], [-70, -18],
    [-75, -5], [-79, 0], [-78, 5],
  ],
  // Greenland
  [[-45, 60], [-20, 70], [-20, 80], [-40, 83], [-60, 78], [-55, 68]],
  // Africa
  [
    [-17, 15], [-10, 28], [0, 33], [10, 37], [22, 32], [32, 31], [35, 22], [43, 12], [51, 12],
    [42, -1], [40, -15], [35, -25], [25, -34], [18, -34], [12, -18], [9, -1], [5, 5], [-5, 5],
    [-12, 8],
  ],
  // Madagascar
  [[43, -12], [50, -15], [48, -25], [44, -22]],
  // Eurasia
  [
    [-10, 36], [-9, 44], [0, 50], [5, 58], [10, 64], [20, 70], [30, 71], [60, 73], [90, 76],
    [110, 76], [140, 73], [170, 69], [180, 65], [170, 60], [150, 59], [140, 52], [130, 43],
    [122, 39], [120, 32], [108, 21], [100, 13], [95, 16], [90, 22], [80, 15], [72, 20],
    [65, 25], [56, 25], [48, 30], [36, 36], [28, 41], [18, 40], [14, 37], [0, 36],
  ],
  // British Isles
  [[-10, 51], [-6, 58], [-2, 58], [0, 52], [-5, 50]],
  // Japan
  [[130, 31], [141, 41], [145, 44], [140, 35], [135, 33]],
  // Indonesia and New Guinea
  [[95, 5], [105, -6], [120, -9], [140, -8], [141, -2], [130, 0], [118, 5], [105, 3]],
  // Australia
  [
    [113, -22], [114, -34], [129, -32], [138, -35], [146, -39], [150, -37], [153, -28],
    [146, -19], [142, -11], [132, -11], [125, -14], [117, -20],
  ],
  // New Zealand
  [[166, -46], [170, -34], [178, -37], [174, -41]],
];

/** Water carved back out, so the recognisable seas stay open. */
const SEA: Point[][] = [
  // Mediterranean
  [[-6, 36], [3, 43], [12, 45], [18, 40], [28, 41], [36, 36], [32, 31], [22, 32], [10, 37], [0, 33], [-6, 35]],
  // Hudson Bay
  [[-95, 60], [-80, 60], [-78, 55], [-92, 52]],
  // Baltic and North Sea
  [[2, 52], [4, 58], [18, 60], [22, 56], [12, 53]],
];

const LON_STEP = 4;
const LAT_STEP = 5;
const LAT_TOP = 78;
const LAT_BOTTOM = -56;
const COLS = 360 / LON_STEP;
const ROWS = Math.round((LAT_TOP - LAT_BOTTOM) / LAT_STEP);

/** Ray casting. True when the point falls inside the ring. */
function inside([lon, lat]: Point, ring: Point[]): boolean {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const straddles = yi > lat !== yj > lat;
    if (straddles && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

function isLand(point: Point): boolean {
  if (SEA.some((ring) => inside(point, ring))) return false;
  return LAND.some((ring) => inside(point, ring));
}

/** A column and row for real coordinates, so a marker lands where it belongs. */
function cellFor([lon, lat]: Point): { x: number; y: number } {
  return { x: (lon + 180) / LON_STEP + 0.5, y: (LAT_TOP - lat) / LAT_STEP + 0.5 };
}

/** The marked place. */
const MARKER: Point = [-98, 39];

const DOTS: Array<{ x: number; y: number }> = [];
for (let row = 0; row < ROWS; row += 1) {
  for (let col = 0; col < COLS; col += 1) {
    const lon = -180 + col * LON_STEP + LON_STEP / 2;
    const lat = LAT_TOP - row * LAT_STEP - LAT_STEP / 2;
    if (isLand([lon, lat])) DOTS.push({ x: col + 0.5, y: row + 0.5 });
  }
}

export function WorldDots({ className = "" }: { className?: string }) {
  const marker = cellFor(MARKER);

  return (
    <svg
      viewBox={`0 0 ${COLS} ${ROWS}`}
      className={className}
      role="img"
      aria-label="A drawn map of the world, with one place marked in the United States."
    >
      <g fill="currentColor" opacity="0.4">
        {DOTS.map((dot) => (
          <circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r="0.32" />
        ))}
      </g>
      <g>
        <circle cx={marker.x} cy={marker.y} r="1.5" fill="none" stroke="var(--yellow)" strokeWidth="0.3" />
        <circle cx={marker.x} cy={marker.y} r="0.6" fill="var(--yellow)" />
      </g>
    </svg>
  );
}
