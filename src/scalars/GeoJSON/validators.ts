import {
  BBox,
  Feature,
  FeatureCollection,
  Geometry,
  GeometryCollection,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  Position,
} from './types';

// Validation functions
const isValidPosition = (coords: unknown): coords is Position => {
  return (
    Array.isArray(coords) &&
    (coords.length === 2 || coords.length === 3) &&
    coords.every(c => typeof c === 'number') &&
    coords[0] >= -180 &&
    coords[0] <= 180 && // longitude
    coords[1] >= -90 &&
    coords[1] <= 90 // latitude
  );
};

/*const isValidPoint = (geometry: any): boolean => {
  return geometry.type === 'Point' && isValidPosition(geometry.coordinates);
};*/

const isValidPoint = (geometry: unknown): geometry is Point => {
  return (
    typeof geometry === 'object' &&
    geometry !== null &&
    'type' in geometry &&
    geometry.type === 'Point' &&
    'coordinates' in geometry &&
    isValidPosition(geometry.coordinates)
  );
};

/*const isValidMultiPoint = (geometry: any): boolean => {
  return (
    geometry.type === 'MultiPoint' &&
    Array.isArray(geometry.coordinates) &&
    geometry.coordinates.every(isValidPosition)
  );
};*/

const isValidMultiPoint = (geometry: unknown): geometry is MultiPoint => {
  return (
    typeof geometry === 'object' &&
    geometry !== null &&
    'type' in geometry &&
    geometry.type === 'MultiPoint' &&
    'coordinates' in geometry &&
    Array.isArray(geometry.coordinates) &&
    geometry.coordinates.every(isValidPosition)
  );
};

/*const isValidLineString = (geometry: any): boolean => {
  return (
    geometry.type === 'LineString' &&
    Array.isArray(geometry.coordinates) &&
    geometry.coordinates.length >= 2 &&
    geometry.coordinates.every(isValidPosition)
  );
};*/

const isValidLineString = (geometry: unknown): geometry is LineString => {
  return (
    typeof geometry === 'object' &&
    geometry !== null &&
    'type' in geometry &&
    geometry.type === 'LineString' &&
    'coordinates' in geometry &&
    Array.isArray(geometry.coordinates) &&
    geometry.coordinates.length >= 2 &&
    geometry.coordinates.every((pos): pos is Position => isValidPosition(pos))
  );
};

/*const isValidMultiLineString = (geometry: {
  type: string;
  coordinates: MultiLineStringCoordinates;
}): boolean => {
  return (
    geometry.type === 'MultiLineString' &&
    Array.isArray(geometry.coordinates) &&
    geometry.coordinates.every(
      line => Array.isArray(line) && line.length >= 2 && line.every(isValidPosition),
    )
  );
};*/

const isValidMultiLineString = (geometry: unknown): geometry is MultiLineString => {
  return (
    typeof geometry === 'object' &&
    geometry !== null &&
    'type' in geometry &&
    geometry.type === 'MultiLineString' &&
    'coordinates' in geometry &&
    Array.isArray(geometry.coordinates) &&
    geometry.coordinates.every(
      (line): line is Position[] =>
        Array.isArray(line) &&
        line.length >= 2 &&
        line.every((pos): pos is Position => isValidPosition(pos)),
    )
  );
};

/*const isValidPolygon = (geometry: { type: string; coordinates: PolygonCoordinates }): boolean => {
  return (
    geometry.type === 'Polygon' &&
    Array.isArray(geometry.coordinates) &&
    geometry.coordinates.every(
      ring =>
        Array.isArray(ring) &&
        ring.length >= 4 &&
        ring.every(isValidPosition) &&
        JSON.stringify(ring[0]) === JSON.stringify(ring[ring.length - 1]), // First and last positions must be equivalent
    )
  );
};*/

const isValidPolygon = (geometry: unknown): geometry is Polygon => {
  return (
    typeof geometry === 'object' &&
    geometry !== null &&
    'type' in geometry &&
    geometry.type === 'Polygon' &&
    'coordinates' in geometry &&
    Array.isArray(geometry.coordinates) &&
    geometry.coordinates.every(
      (ring): ring is Position[] =>
        Array.isArray(ring) &&
        ring.length >= 4 &&
        ring.every((pos): pos is Position => isValidPosition(pos)) &&
        JSON.stringify(ring[0]) === JSON.stringify(ring[ring.length - 1]),
    )
  );
};

/*const isValidMultiPolygon = (geometry: {
  type: string;
  coordinates: MultiPolygonCoordinates;
}): boolean => {
  return (
    geometry.type === 'MultiPolygon' &&
    Array.isArray(geometry.coordinates) &&
    geometry.coordinates.every(
      polygon =>
        Array.isArray(polygon) &&
        polygon.every(
          ring =>
            Array.isArray(ring) &&
            ring.length >= 4 &&
            ring.every(isValidPosition) &&
            JSON.stringify(ring[0]) === JSON.stringify(ring[ring.length - 1]),
        ),
    )
  );
};*/

const isValidMultiPolygon = (geometry: unknown): geometry is MultiPolygon => {
  return (
    typeof geometry === 'object' &&
    geometry !== null &&
    'type' in geometry &&
    geometry.type === 'MultiPolygon' &&
    'coordinates' in geometry &&
    Array.isArray(geometry.coordinates) &&
    geometry.coordinates.every(
      (polygon): polygon is Position[][] =>
        Array.isArray(polygon) &&
        polygon.every(
          (ring): ring is Position[] =>
            Array.isArray(ring) &&
            ring.length >= 4 &&
            ring.every((pos): pos is Position => isValidPosition(pos)) &&
            JSON.stringify(ring[0]) === JSON.stringify(ring[ring.length - 1]),
        ),
    )
  );
};

/*const isValidGeometryCollection = (geometry: any): boolean => {
  return (
    geometry.type === 'GeometryCollection' &&
    Array.isArray(geometry.geometries) &&
    geometry.geometries.every(isValidGeometry)
  );
};*/

const isValidGeometryCollection = (geometry: unknown): geometry is GeometryCollection => {
  return (
    typeof geometry === 'object' &&
    geometry !== null &&
    'type' in geometry &&
    geometry.type === 'GeometryCollection' &&
    'geometries' in geometry &&
    Array.isArray(geometry.geometries) &&
    geometry.geometries.every(isValidGeometry)
  );
};

export const isValidGeometry = (geometry: unknown): geometry is Geometry => {
  if (!geometry || typeof geometry !== 'object') return false;

  if (!('type' in geometry)) return false;

  switch (geometry.type) {
    case 'Point':
      return isValidPoint(geometry);
    case 'MultiPoint':
      return isValidMultiPoint(geometry);
    case 'LineString':
      return isValidLineString(geometry);
    case 'MultiLineString':
      return isValidMultiLineString(geometry);
    case 'Polygon':
      return isValidPolygon(geometry);
    case 'MultiPolygon':
      return isValidMultiPolygon(geometry);
    case 'GeometryCollection':
      return isValidGeometryCollection(geometry);
    default:
      return false;
  }
};

/*const isValidFeature = (obj: any): boolean => {
  return (
    obj.type === 'Feature' &&
    (obj.geometry === null || isValidGeometry(obj.geometry)) &&
    (obj.properties === undefined || obj.properties === null || typeof obj.properties === 'object')
  );
};*/

export const isValidFeature = (obj: unknown): obj is Feature => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'type' in obj &&
    obj.type === 'Feature' &&
    'geometry' in obj &&
    'properties' in obj &&
    (obj.geometry === null || isValidGeometry(obj.geometry)) &&
    (obj.properties === null || (typeof obj.properties === 'object' && obj.properties !== null))
  );
};

/*const isValidFeatureCollection = (obj: any): boolean => {
  return (
    obj.type === 'FeatureCollection' &&
    Array.isArray(obj.features) &&
    obj.features.every(isValidFeature)
  );
};*/
export const isValidFeatureCollection = (obj: unknown): obj is FeatureCollection => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'type' in obj &&
    obj.type === 'FeatureCollection' &&
    'features' in obj &&
    Array.isArray(obj.features) &&
    obj.features.every(isValidFeature)
  );
};

/*const isValidBBox = (bbox: BBox): boolean => {
  return (
    Array.isArray(bbox) &&
    //[4, 6].includes(bbox.length) && // should be less faster, though negligible
    (bbox.length === 4 || bbox.length === 6) &&
    bbox.every(n => typeof n === 'number')
  );
};*/
export const isValidBBox = (bbox: unknown): bbox is BBox => {
  return (
    Array.isArray(bbox) &&
    (bbox.length === 4 || bbox.length === 6) &&
    bbox.every(n => typeof n === 'number')
  );
};
