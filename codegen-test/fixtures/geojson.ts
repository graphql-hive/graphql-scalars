// Type-level test for the generated GeoJSON codegen type.
//
// Typechecking `types.ts` on its own only proves the emitted type is *valid*
// TypeScript. The GeoJSON precedence bug produced a valid-but-wrong type
// (`Position | Position[]` without parentheses before `[]`), so `tsc` accepted
// it. Assigning real values is what exercises the type: an arrayed geometry's
// coordinates stop being assignable the moment the union isn't grouped.
//
// `input` and `output` are the same union for this scalar; testing one covers both.
import type { Scalars } from '../types';

type GeoJSON = Scalars['GeoJSON']['input'];

// Valid — every geometry from the scalar's own validExamples must be assignable.
const point: GeoJSON = {
  type: 'Point',
  coordinates: [100.0, 0.0],
};

const multiPoint: GeoJSON = {
  type: 'MultiPoint',
  coordinates: [
    [100.0, 0.0],
    [101.0, 1.0],
  ],
};

const lineString: GeoJSON = {
  type: 'LineString',
  coordinates: [
    [100.0, 0.0],
    [101.0, 1.0],
  ],
};

const multiLineString: GeoJSON = {
  type: 'MultiLineString',
  coordinates: [
    [
      [100.0, 0.0],
      [101.0, 1.0],
    ],
    [
      [102.0, 2.0],
      [103.0, 3.0],
    ],
  ],
};

const polygon: GeoJSON = {
  type: 'Polygon',
  coordinates: [
    [
      [100.0, 0.0],
      [101.0, 0.0],
      [101.0, 1.0],
      [100.0, 1.0],
      [100.0, 0.0],
    ],
  ],
};

const multiPolygon: GeoJSON = {
  type: 'MultiPolygon',
  coordinates: [
    [
      [
        [102.0, 2.0],
        [103.0, 2.0],
        [103.0, 3.0],
        [102.0, 3.0],
        [102.0, 2.0],
      ],
    ],
  ],
};

const geometryCollection: GeoJSON = {
  type: 'GeometryCollection',
  geometries: [{ type: 'Point', coordinates: [100.0, 0.0] }],
};

const feature: GeoJSON = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [100.0, 0.0] },
  properties: { name: 'Test Point' },
};

const featureCollection: GeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [100.0, 0.0] },
      properties: { name: 'Test Point' },
    },
  ],
};

// Invalid — a single Position is not an array of Positions. The unparenthesized
// bug wrongly accepts this; then the directive is unused and tsc fails, catching
// the bug from the "accepts too much" side and guarding against widening to `any`.
const barePosition: GeoJSON = {
  type: 'MultiPoint',
  // @ts-expect-error coordinates must be an array of Positions, not one Position
  coordinates: [100.0, 0.0],
};

// Reference every binding so unused-local checks stay quiet.
void [
  point,
  multiPoint,
  lineString,
  multiLineString,
  polygon,
  multiPolygon,
  geometryCollection,
  feature,
  featureCollection,
  barePosition,
];
