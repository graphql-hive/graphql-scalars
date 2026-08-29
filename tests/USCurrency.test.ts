import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { GraphQLUSCurrency } from '../src/scalars/USCurrency.js';

const noop = () => {};

const createGraphQLSchema = (queryResolver, mutationResolver: (...args: any[]) => any = noop) => {
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        currencyValue: {
          type: GraphQLUSCurrency,
          resolve: queryResolver,
        },
      },
    }),
    mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: {
        setCurrency: {
          type: GraphQLUSCurrency,
          args: {
            currencyValue: {
              type: GraphQLUSCurrency,
            },
          },
          resolve: mutationResolver,
        },
      },
    }),
  });
};

describe('USCurrency', () => {
  it('should fail serializing', () => {
    const value = 'invalid';
    const schema = createGraphQLSchema(() => {
      return value;
    });
    const source = /* GraphQL */ `
      {
        currencyValue
      }
    `;
    return graphql({ schema, source }).then(result => {
      const { errors } = result;
      expect(errors[0].message).toEqual(`Currency cannot represent non integer type "${value}"`);
    });
  });

  it('should serialize number value', async () => {
    const value = 12500;
    const schema = createGraphQLSchema(() => {
      return value;
    });
    const source = /* GraphQL */ `
      {
        currencyValue
      }
    `;
    const result = await graphql({ schema, source });

    const {
      data: { currencyValue },
    } = result;

    expect(currencyValue).toEqual('$125.00');
  });

  it('should serialize number value - 2290000', () => {
    const value = 2290000;
    const schema = createGraphQLSchema(() => {
      return value;
    });
    const source = /* GraphQL */ `
      {
        currencyValue
      }
    `;
    return graphql({ schema, source }).then(result => {
      const {
        data: { currencyValue },
      } = result;
      expect(currencyValue).toEqual('$22,900.00');
    });
  });

  it('should fail parsing literal', () => {
    const value = 2332;
    const schema = createGraphQLSchema(noop, (source, { currencyValue }) => {
      return currencyValue;
    });
    const source = /* GraphQL */ `
      mutation {
        setCurrency(currencyValue:${value})
      }
    `;
    return graphql({ schema, source }).catch(e => {
      expect(e.message).toEqual(`Currency cannot represent an invalid currency-string ${value}.`);
    });
  });

  it('should fail parsing literal - 2290000', () => {
    const value = 2290000;
    const schema = createGraphQLSchema(noop, (source, { currencyValue }) => {
      return currencyValue;
    });
    const source = /* GraphQL */ `
      mutation {
        setCurrency(currencyValue:${value})
      }
    `;
    return graphql({ schema, source }).catch(e => {
      expect(e.message).toEqual(`Currency cannot represent an invalid currency-string ${value}.`);
    });
  });

  it('should parse literal number value', () => {
    const value = '$12.50';
    const schema = createGraphQLSchema(noop, (source, { currencyValue }) => {
      expect(currencyValue).toEqual(1250);
      return currencyValue;
    });
    const source = /* GraphQL */ `
      mutation {
        setCurrency(currencyValue:"${value}")
      }
    `;
    return graphql({ schema, source }).then(result => {
      expect(result.errors).toBeFalsy();
    });
  });

  it('should parse literal number value - 2290000', () => {
    const value = '$22,900.00';
    const schema = createGraphQLSchema(noop, (source, { currencyValue }) => {
      expect(currencyValue).toEqual(2290000);
      return currencyValue;
    });
    const source = /* GraphQL */ `
      mutation {
        setCurrency(currencyValue:"${value}")
      }
    `;
    return graphql({ schema, source }).then(result => {
      expect(result.errors).toBeFalsy();
    });
  });

  it('should parse literal value with multiple thousands separators', () => {
    const value = '$1,000,000.00';
    const schema = createGraphQLSchema(noop, (source, { currencyValue }) => {
      expect(currencyValue).toEqual(100000000);
      return currencyValue;
    });
    const source = /* GraphQL */ `
      mutation {
        setCurrency(currencyValue:"${value}")
      }
    `;
    return graphql({ schema, source }).then(result => {
      expect(result.errors).toBeFalsy();
    });
  });

  it('should parse input string value', () => {
    const value = '$12.50';
    const schema = createGraphQLSchema(noop, (source, { currencyValue }) => {
      expect(currencyValue).toEqual(1250);
      return currencyValue;
    });
    const source = /* GraphQL */ `
      mutation set($currency: USCurrency!) {
        setCurrency(currencyValue: $currency)
      }
    `;
    return graphql({
      schema,
      source,
      variableValues: { currency: value },
    }).then(result => {
      expect(result.errors).toBeFalsy();
    });
  });

  it('should parse input string value - 2290000', () => {
    const value = '$22,900.00';
    const schema = createGraphQLSchema(noop, (source, { currencyValue }) => {
      expect(currencyValue).toEqual(2290000);
      return currencyValue;
    });
    const source = /* GraphQL */ `
      mutation set($currency: USCurrency!) {
        setCurrency(currencyValue: $currency)
      }
    `;
    return graphql({
      schema,
      source,
      variableValues: { currency: value },
    }).then(result => {
      expect(result.errors).toBeFalsy();
    });
  });
});
