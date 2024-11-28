import { GraphQLScalarType, Kind, ValueNode } from 'graphql';
import { createGraphQLError } from '../../error.js';
import { generateGeoJSONType } from './codegenScalarType.js';
import { geojsonSchema } from './jsonSchema.js';
import { GeoJSONObject } from './types.js';
import {
  isValidBBox,
  isValidFeature,
  isValidFeatureCollection,
  isValidGeometry,
} from './validators.js';

const validate = (value: any, ast?: ValueNode): GeoJSONObject => {
  let parsed: unknown;

  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch {
      throw createGraphQLError(
        'Invalid GeoJSON: Failed to parse JSON string',
        ast ? { nodes: ast } : undefined,
      );
    }
  } else {
    parsed = value;
  }

  if (!parsed || typeof parsed !== 'object') {
    throw createGraphQLError(
      'Invalid GeoJSON: Must be an object',
      ast ? { nodes: ast } : undefined,
    );
  }

  if (!('type' in parsed)) {
    throw createGraphQLError(
      'Invalid GeoJSON: Missing type property',
      ast ? { nodes: ast } : undefined,
    );
  }

  // Validate bbox if present
  if ('bbox' in parsed && parsed.bbox !== undefined) {
    if (!isValidBBox(parsed.bbox)) {
      throw createGraphQLError(
        'Invalid GeoJSON: Invalid bbox format',
        ast ? { nodes: ast } : undefined,
      );
    }
  }

  // Validate based on type
  /*if (parsed.type === 'Feature') {
    if (!isValidFeature(parsed)) {
      throw createGraphQLError(
        'Invalid GeoJSON: Invalid Feature object',
        ast ? { nodes: ast } : undefined,
      );
    }
  } else if (parsed.type === 'FeatureCollection') {
    if (!isValidFeatureCollection(parsed)) {
      throw createGraphQLError(
        'Invalid GeoJSON: Invalid FeatureCollection object',
        ast ? { nodes: ast } : undefined,
      );
    }
  } else if (!isValidGeometry(parsed)) {
    throw createGraphQLError(
      'Invalid GeoJSON: Invalid Geometry object',
      ast ? { nodes: ast } : undefined,
    );
  }*/
  if (isValidFeature(parsed)) {
    return parsed;
  } else if (isValidFeatureCollection(parsed)) {
    return parsed;
  } else if (isValidGeometry(parsed)) {
    return parsed;
  }

  // return parsed as GeoJSONObject;
  throw createGraphQLError(
    'Invalid GeoJSON: Object does not match any valid GeoJSON type',
    ast ? { nodes: ast } : undefined,
  );
};

export const GraphQLGeoJSON = /*#__PURE__*/ new GraphQLScalarType({
  name: 'GeoJSON',
  description:
    'A GeoJSON object as defined by RFC 7946: https://datatracker.ietf.org/doc/html/rfc7946',

  serialize(value) {
    return validate(value);
  },

  parseValue(value) {
    return validate(value);
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING && ast.kind !== Kind.OBJECT) {
      throw createGraphQLError(
        `Can only validate strings or objects as GeoJSON but got a: ${ast.kind}`,
        { nodes: [ast] },
      );
    }
    return validate(ast.kind === Kind.STRING ? ast.value : ast, ast);
  },

  extensions: {
    codegenScalarType: generateGeoJSONType(),
    jsonSchema: geojsonSchema,
  },
});
