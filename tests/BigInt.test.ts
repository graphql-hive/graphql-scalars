import {
  graphql,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import 'json-bigint-patch';
import { GraphQLBigInt } from '../src/scalars/BigInt.js';

describe('BigInt', () => {
  const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
      inc: {
        type: new GraphQLNonNull(GraphQLBigInt),
        args: {
          num: { type: new GraphQLNonNull(GraphQLBigInt) },
        },
        resolve: (root, args) => args.num + 1n,
      },
      emptyErr: {
        type: new GraphQLNonNull(GraphQLBigInt),
        resolve: () => '',
      },
      typeErr: {
        type: new GraphQLNonNull(GraphQLBigInt),
        resolve: () => 3.14,
      },
    },
  });

  const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      inc: {
        type: new GraphQLNonNull(
          new GraphQLObjectType({
            name: 'IncPayload',
            fields: {
              result: { type: new GraphQLNonNull(GraphQLBigInt) },
            },
          }),
        ),
        args: {
          input: {
            type: new GraphQLNonNull(
              new GraphQLInputObjectType({
                name: 'IncInput',
                fields: {
                  num: { type: new GraphQLNonNull(GraphQLBigInt) },
                },
              }),
            ),
          },
        },
        resolve: (root, args) => ({ result: args.input.num + 1n }),
      },
    },
  });

  const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
  });

  const validQuery = `{
        a: inc(num: 1)
        b: inc(num: 2147483646)
        c: inc(num: 2147483647)
        d: inc(num: 2147483648)
        e: inc(num: 439857257821345)
        f: inc(num: 9007199254740992)
      }`;

  const invalidQuery2 = `{
        k: typeErr
      }`;

  const validMutation = `mutation test(
        $input1: IncInput!,
        $input2: IncInput!,
        $input4: IncInput!
      ) {
        a: inc(input: $input1) { result }
        b: inc(input: $input2) { result }
        d: inc(input: $input4) { result }
      }`;

  const validVariables = {
    input1: { num: 2147483646 },
    input2: { num: 9007199254740990n },
    input4: { num: 1 },
  };

  it('2', async () => {
    const { data, errors } = await graphql({ schema, source: invalidQuery2 });

    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('BigInt cannot represent non-integer value: ');
    expect(data).toEqual(null);
  });
  it('3', async () => {
    const { data, errors } = await graphql({ schema, source: validQuery });
    expect(errors).toEqual(undefined);
    expect(data).toEqual({
      a: 2,
      b: 2147483647,
      c: 2147483648,
      d: 2147483649,
      e: 439857257821346,
      f: 9007199254740993n,
    });
  });
  it('4', async () => {
    const { data, errors } = await graphql({
      schema,
      source: validMutation,
      variableValues: validVariables,
    });
    expect(errors).toEqual(undefined);
    expect(data).toEqual({
      a: { result: 2147483647 },
      b: { result: 9007199254740991 },
      d: { result: 2 },
    });
  });
});
