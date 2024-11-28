import { graphql, GraphQLInt, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { GraphQLJSON } from '../src/scalars/json/JSON.js';
// eslint-disable-next-line import/no-named-as-default
import { GraphQLJSONObject } from '../src/scalars/json/JSONObject.js';

const FIXTURE = {
  string: 'string',
  int: 3,
  float: 3.14,
  true: true,
  false: false,
  null: null,
  object: {
    string: 'string',
    int: 3,
    float: 3.14,
    true: true,
    false: false,
    null: null,
  },
  array: ['string', 3, 3.14, true, false, null],
};

function createSchema(type) {
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        value: {
          type,
          args: {
            arg: { type },
          },
          resolve: (obj, { arg }) => arg,
        },
        rootValue: {
          type,
          resolve: obj => obj,
        },
      },
    }),
    types: [GraphQLInt],
  });
}

describe('GraphQLJSON', () => {
  let schema;

  beforeEach(() => {
    schema = createSchema(GraphQLJSON);
  });

  describe('serialize', () => {
    it('should support serialization', () =>
      graphql({
        schema,
        source: /* GraphQL */ `
          query {
            rootValue
          }
        `,
        rootValue: FIXTURE,
      }).then(({ data, errors }) => {
        expect(data.rootValue).toEqual(FIXTURE);
        expect(errors).toBeUndefined();
      }));
  });

  describe('parseValue', () => {
    it('should support parsing values', () =>
      graphql({
        schema,
        source: /* GraphQL */ `
          query ($arg: JSON!) {
            value(arg: $arg)
          }
        `,
        variableValues: {
          arg: FIXTURE,
        },
      }).then(({ data, errors }) => {
        expect(data.value).toEqual(FIXTURE);
        expect(errors).toBeUndefined();
      }));
  });

  describe('parseLiteral', () => {
    it('should support parsing literals', () =>
      graphql({
        schema,
        source: /* GraphQL */ `
          query ($intValue: Int = 3) {
            value(
              arg: {
                string: "string"
                int: $intValue
                float: 3.14
                true: true
                false: false
                null: null
                object: {
                  string: "string"
                  int: $intValue
                  float: 3.14
                  true: true
                  false: false
                  null: null
                }
                array: ["string", $intValue, 3.14, true, false, null]
              }
            )
          }
        `,
      }).then(({ data, errors }) => {
        expect(data.value).toEqual(FIXTURE);
        expect(errors).toBeUndefined();
      }));

    it('should handle null literal', () =>
      graphql({
        schema,
        source: /* GraphQL */ `
          {
            value(arg: null)
          }
        `,
      }).then(({ data, errors }) => {
        expect(data).toEqual({
          value: null,
        });
        expect(errors).toBeUndefined();
      }));

    it('should handle list literal', () =>
      graphql({
        schema,
        source: /* GraphQL */ `
          {
            value(arg: [])
          }
        `,
      }).then(({ data, errors }) => {
        expect(data).toEqual({
          value: [],
        });
        expect(errors).toBeUndefined();
      }));

    it('should reject invalid literal', () =>
      graphql({
        schema,
        source: /* GraphQL */ `
          {
            value(arg: INVALID)
          }
        `,
      }).then(({ data, errors }) => {
        expect(data).toBeUndefined();
        expect(errors).toBeDefined();
      }));
  });
});

describe('GraphQLJSONObject', () => {
  let schema;

  beforeEach(() => {
    schema = createSchema(GraphQLJSONObject);
  });

  describe('serialize', () => {
    it('should support serialization', () =>
      graphql({
        schema,
        source: /* GraphQL */ `
          query {
            rootValue
          }
        `,
        rootValue: FIXTURE,
      }).then(({ data, errors }) => {
        expect(data.rootValue).toEqual(FIXTURE);
        expect(errors).toBeUndefined();
      }));

    it('should reject string value', () =>
      graphql({
        schema,
        source: /* GraphQL */ `
          query {
            rootValue
          }
        `,
        rootValue: 'foo',
      }).then(({ data, errors }) => {
        expect(data.rootValue).toBeNull();
        expect(errors).toBeDefined();
      }));

    it('should reject array value', () =>
      graphql({
        schema,
        source: /* GraphQL */ `
          query {
            rootValue
          }
        `,
        rootValue: [],
      }).then(({ data, errors }) => {
        expect(data.rootValue).toBeNull();
        expect(errors).toBeDefined();
      }));
  });

  describe('parseValue', () => {
    it('should support parsing values', () =>
      graphql({
        schema,
        source: /* GraphQL */ `
          query ($arg: JSONObject!) {
            value(arg: $arg)
          }
        `,
        variableValues: {
          arg: FIXTURE,
        },
      }).then(({ data, errors }) => {
        expect(data.value).toEqual(FIXTURE);
        expect(errors).toBeUndefined();
      }));

    it('should reject string value', () =>
      graphql({
        schema,
        source: /* GraphQL */ `
          query ($arg: JSONObject!) {
            value(arg: $arg)
          }
        `,
        variableValues: {
          arg: 'foo',
        },
      }).then(({ data, errors }) => {
        expect(data).toBeUndefined();
        expect(errors).toBeDefined();
      }));

    it('should reject array value', () =>
      graphql({
        schema,
        source: /* GraphQL */ `
          query ($arg: JSONObject!) {
            value(arg: $arg)
          }
        `,
        variableValues: {
          arg: [],
        },
      }).then(({ data, errors }) => {
        expect(data).toBeUndefined();
        expect(errors).toBeDefined();
      }));
  });

  describe('parseLiteral', () => {
    it('should support parsing literals', () =>
      graphql({
        schema,
        source: /* GraphQL */ `
          query ($intValue: Int = 3) {
            value(
              arg: {
                string: "string"
                int: $intValue
                float: 3.14
                true: true
                false: false
                null: null
                object: {
                  string: "string"
                  int: $intValue
                  float: 3.14
                  true: true
                  false: false
                  null: null
                }
                array: ["string", $intValue, 3.14, true, false, null]
              }
            )
          }
        `,
      }).then(({ data, errors }) => {
        expect(data.value).toEqual(FIXTURE);
        expect(errors).toBeUndefined();
      }));

    it('should reject string literal', () =>
      graphql({
        schema,
        source: /* GraphQL */ `
          {
            value(arg: "foo")
          }
        `,
      }).then(({ data, errors }) => {
        expect(data).toBeUndefined();
        expect(errors).toBeDefined();
        expect(errors).toMatchSnapshot();
      }));

    it('should reject array literal', () =>
      graphql({
        schema,
        source: /* GraphQL */ `
          {
            value(arg: [])
          }
        `,
      }).then(({ data, errors }) => {
        expect(data).toBeUndefined();
        expect(errors).toBeDefined();
      }));
  });
});
