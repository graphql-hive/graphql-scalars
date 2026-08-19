import { ASTNode, GraphQLError, Source, versionInfo } from 'graphql';

interface GraphQLErrorOptions {
  nodes?: ReadonlyArray<ASTNode> | ASTNode | null;
  source?: Source;
  positions?: ReadonlyArray<number>;
  path?: ReadonlyArray<string | number>;
  originalError?: Error & {
    readonly extensions?: unknown;
  };
  extensions?: any;
}

export function createGraphQLError(message: string, options?: GraphQLErrorOptions): GraphQLError {
  if (versionInfo?.major >= 17) {
    return new GraphQLError(message, options);
  }
  const nodes: ReadonlyArray<ASTNode> | undefined = options?.nodes
    ? Array.isArray(options.nodes)
      ? (options.nodes as ReadonlyArray<ASTNode>)
      : [options.nodes as ASTNode]
    : undefined;
  return new GraphQLError(
    message,
    nodes,
    options?.source,
    options?.positions,
    options?.path,
    options?.originalError,
    options?.extensions,
  );
}
