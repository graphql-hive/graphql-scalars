// Helper function to generate Position type
const generatePositionType = () => `[number, number] | [number, number, number]`;

// Helper function to generate BBox type
const generateBBoxType = () =>
  `[number, number, number, number] | [number, number, number, number, number, number]`;

// Helper function to generate Point type
const generatePointType = () => `{
  type: "Point";
  coordinates: ${generatePositionType()};
  bbox?: ${generateBBoxType()};
}`;

// Helper function to generate MultiPoint type
const generateMultiPointType = () => `{
  type: "MultiPoint";
  coordinates: ${generatePositionType()}[];
  bbox?: ${generateBBoxType()};
}`;

// Helper function to generate LineString type
const generateLineStringType = () => `{
  type: "LineString";
  coordinates: ${generatePositionType()}[];
  bbox?: ${generateBBoxType()};
}`;

// Helper function to generate MultiLineString type
const generateMultiLineStringType = () => `{
  type: "MultiLineString";
  coordinates: ${generatePositionType()}[][];
  bbox?: ${generateBBoxType()};
}`;

// Helper function to generate Polygon type
const generatePolygonType = () => `{
  type: "Polygon";
  coordinates: ${generatePositionType()}[][];
  bbox?: ${generateBBoxType()};
}`;

// Helper function to generate MultiPolygon type
const generateMultiPolygonType = () => `{
  type: "MultiPolygon";
  coordinates: ${generatePositionType()}[][][];
  bbox?: ${generateBBoxType()};
}`;

// Helper function to generate GeometryCollection type
const generateGeometryCollectionType = () => `{
  type: "GeometryCollection";
  geometries: (${generatePointType()} | ${generateMultiPointType()} | ${generateLineStringType()} | ${generateMultiLineStringType()} | ${generatePolygonType()} | ${generateMultiPolygonType()})[];
  bbox?: ${generateBBoxType()};
}`;

// Helper function to generate Feature type
const generateFeatureType = () => `{
  type: "Feature";
  geometry: (${generatePointType()} | ${generateMultiPointType()} | ${generateLineStringType()} | ${generateMultiLineStringType()} | ${generatePolygonType()} | ${generateMultiPolygonType()} | ${generateGeometryCollectionType()}) | null;
  properties: { [key: string]: any } | null;
  bbox?: ${generateBBoxType()};
}`;

// Helper function to generate FeatureCollection type
const generateFeatureCollectionType = () => `{
  type: "FeatureCollection";
  features: ${generateFeatureType()}[];
  bbox?: ${generateBBoxType()};
}`;

// Generate the complete GeoJSON type
export const generateGeoJSONType = () =>
  `(${generatePointType()} | ${generateMultiPointType()} | ${generateLineStringType()} | ${generateMultiLineStringType()} | ${generatePolygonType()} | ${generateMultiPolygonType()} | ${generateGeometryCollectionType()} | ${generateFeatureType()} | ${generateFeatureCollectionType()})`;
