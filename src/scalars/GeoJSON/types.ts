// GeoJSON Types according to RFC 7946
export type Position = [number, number] | [number, number, number];

export type BBox =
  | [number, number, number, number]
  | [number, number, number, number, number, number];

export interface Point {
  type: 'Point';
  coordinates: Position;
  bbox?: BBox;
}

export interface MultiPoint {
  type: 'MultiPoint';
  coordinates: Position[];
  bbox?: BBox;
}

export interface LineString {
  type: 'LineString';
  coordinates: Position[];
  bbox?: BBox;
}

export interface MultiLineString {
  type: 'MultiLineString';
  coordinates: Position[][];
  bbox?: BBox;
}

export interface Polygon {
  type: 'Polygon';
  coordinates: Position[][];
  bbox?: BBox;
}

export interface MultiPolygon {
  type: 'MultiPolygon';
  coordinates: Position[][][];
  bbox?: BBox;
}

export type Geometry = Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon;

export interface GeometryCollection {
  type: 'GeometryCollection';
  geometries: Geometry[];
  bbox?: BBox;
}

export interface Feature<G extends Geometry | null = Geometry | null> {
  type: 'Feature';
  geometry: G;
  properties: { [key: string]: any } | null;
  bbox?: BBox;
}

export interface FeatureCollection<G extends Geometry | null = Geometry | null> {
  type: 'FeatureCollection';
  features: Feature<G>[];
  bbox?: BBox;
}

export type GeoJSONObject = Geometry | GeometryCollection | Feature | FeatureCollection;
