import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { GraphQLSafeInt } from '../src/scalars/SafeInt.js';

describe('SafeInt', () => {
  const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
      echo: {
        type: GraphQLSafeInt,
        args: {
          num: { type: GraphQLSafeInt },
        },
        resolve: (_root, args) => args.num,
      },
      inc: {
        type: GraphQLSafeInt,
        args: {
          num: { type: GraphQLSafeInt },
        },
        resolve: (_root, args) => args.num + 1,
      },
      dec: {
        type: GraphQLSafeInt,
        args: {
          num: { type: GraphQLSafeInt },
        },
        resolve: (_root, args) => args.num - 1,
      },
      valueOf: {
        type: GraphQLSafeInt,
        resolve: _root => ({ valueOf: () => 42 }),
      },
      toJSON: {
        type: GraphQLSafeInt,
        resolve: _root => ({ toJSON: () => 42 }),
      },
      isTrue: {
        type: GraphQLSafeInt,
        resolve: _root => true,
      },
      isFalse: {
        type: GraphQLSafeInt,
        resolve: _root => false,
      },
      isString: {
        type: GraphQLSafeInt,
        resolve: _root => '42',
      },
      isEmptyString: {
        type: GraphQLSafeInt,
        resolve: (_root, args) => '',
      },
      isFloat: {
        type: GraphQLSafeInt,
        resolve: () => 3.14,
      },
    },
  });
  const schema = new GraphQLSchema({
    query: Query,
  });

  describe('valid', () => {
    test('serialize', async () => {
      const source = /* GraphQL */ `
        {
          a: inc(num: 1)
          b: inc(num: 9007199254740990)
          c: dec(num: -1)
          d: dec(num: -9007199254740990)
          e: valueOf
          f: toJSON
          g: isTrue
          h: isFalse
          i: isString
        }
      `;
      const { data, errors } = await graphql({ schema, source });

      expect(data.a).toEqual(2);
      expect(data.b).toEqual(9007199254740991);
      expect(data.c).toEqual(-2);
      expect(data.d).toEqual(-9007199254740991);
      expect(data.e).toEqual(42);
      expect(data.f).toEqual(42);
      expect(data.g).toEqual(1);
      expect(data.h).toEqual(0);
      expect(data.i).toEqual(42);
      expect(errors).toBeUndefined();
    });

    test('parseValue', async () => {
      const source = /* GraphQL */ `
        query ($a: SafeInt!, $b: SafeInt!, $c: SafeInt!, $d: SafeInt!) {
          a: echo(num: $a)
          b: echo(num: $b)
          c: echo(num: $c)
          d: echo(num: $d)
        }
      `;
      const variables = {
        a: 1,
        b: 9007199254740991,
        c: -1,
        d: -9007199254740991,
      };
      const { data, errors } = await graphql({
        schema,
        source,
        variableValues: variables,
      });

      expect(data.a).toEqual(1);
      expect(data.b).toEqual(9007199254740991);
      expect(data.c).toEqual(-1);
      expect(data.d).toEqual(-9007199254740991);
      expect(errors).toBeUndefined();
    });

    test('parseLiteral', async () => {
      const source = /* GraphQL */ `
        {
          a: echo(num: 1)
          b: echo(num: 9007199254740991)
          c: echo(num: -1)
          d: echo(num: -9007199254740991)
        }
      `;
      const { data, errors } = await graphql({ schema, source });

      expect(data.a).toEqual(1);
      expect(data.b).toEqual(9007199254740991);
      expect(data.c).toEqual(-1);
      expect(data.d).toEqual(-9007199254740991);
      expect(errors).toBeUndefined();
    });
  });

  describe('invalid', () => {
    test('serialize', async () => {
      const source = /* GraphQL */ `
        {
          a: inc(num: 9007199254740991)
          b: dec(num: -9007199254740991)
          c: isEmptyString
          d: isFloat
        }
      `;
      const { errors } = await graphql({ schema, source });

      expect(errors).toHaveLength(4);
      expect(errors[0].message).toEqual(
        'SafeInt cannot represent unsafe integer value: 9007199254740992',
      );
      expect(errors[1].message).toEqual(
        'SafeInt cannot represent unsafe integer value: -9007199254740992',
      );
      expect(errors[2].message).toEqual('SafeInt cannot represent non-integer value: ');
      expect(errors[3].message).toEqual('SafeInt cannot represent non-integer value: 3.14');
    });

    test('parseValue', async () => {
      const source = /* GraphQL */ `
        query ($a: SafeInt!, $b: SafeInt!) {
          a: echo(num: $a)
          b: echo(num: $b)
        }
      `;
      const variables = {
        a: 9007199254740992,
        b: -9007199254740992,
      };
      const { errors } = await graphql({
        schema,
        source,
        variableValues: variables,
      });

      expect(errors).toHaveLength(2);
      expect(errors[0].message).toEqual(
        'Variable "$a" got invalid value 9007199254740992; SafeInt cannot represent unsafe integer value: 9007199254740992',
      );
      expect(errors[1].message).toEqual(
        'Variable "$b" got invalid value -9007199254740992; SafeInt cannot represent unsafe integer value: -9007199254740992',
      );
    });

    test('parseLiteral', async () => {
      const source = /* GraphQL */ `
        {
          a: echo(num: 9007199254740992)
          b: echo(num: -9007199254740992)
          c: echo(num: "42")
        }
      `;
      const { errors } = await graphql({ schema, source });

      expect(errors).toHaveLength(3);
      expect(errors[0].message).toEqual(
        'SafeInt cannot represent unsafe integer value: 9007199254740992',
      );
      expect(errors[1].message).toEqual(
        'SafeInt cannot represent unsafe integer value: -9007199254740992',
      );
      expect(errors[2].message).toEqual('SafeInt cannot represent non-integer value: "42"');
    });
  });
});
