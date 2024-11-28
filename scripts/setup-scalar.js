/**
 * this is a script that helped me do the exports and preparations when
 * a new scalar was created
 * i came up with this because doing all the necessary exports after creating
 * a scalar became too tedious
 *
 * NB: i used this to setup the GeoJSON scalar and later for the CountryName scalar (after removing the manual entries)
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

class ScalarSetup {
  constructor(scalarName) {
    this.baseDir = process.cwd();
    this.scalarName = scalarName;
    this.status = {
      created: [],
      alreadyExists: [],
      warnings: [],
    };
  }

  async readFile(filePath) {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error.message}`);
    }
  }

  async writeFile(filePath, content) {
    try {
      await fs.writeFile(filePath, content);
    } catch (error) {
      throw new Error(`Failed to write file ${filePath}: ${error.message}`);
    }
  }

  async ensureFile(filePath, defaultContent = '') {
    try {
      await fs.access(filePath);
      return await this.readFile(filePath);
    } catch {
      await this.writeFile(filePath, defaultContent);
      this.status.created.push(`Created new file: ${filePath}`);
      return defaultContent;
    }
  }

  async updateOrInsertContent(filePath, searchPattern, newContent, type = 'array') {
    let content = await this.readFile(filePath);

    if (content.includes(newContent)) {
      this.status.alreadyExists.push(`${newContent} already exists in ${filePath}`);
      return;
    }

    switch (type) {
      case 'array':
        content = this.insertIntoArray(content, searchPattern, newContent);
        break;
      case 'object':
        content = this.insertIntoObject(content, searchPattern, newContent);
        break;
      case 'import':
        content = `${newContent}\n${content}`;
        break;
    }

    await this.writeFile(filePath, content);
    this.status.created.push(`Added ${newContent} to ${filePath}`);
  }

  normalizeQuotes(content) {
    // Convert template literals and double quotes to single quotes
    return content.replace(/`([^`]*)`/g, "'$1'").replace(/"([^"]*)"/g, "'$1'");
  }

  formatScalarDeclaration(name) {
    return `export const ${name} = 'scalar ${name}';`;
  }

  parseExistingScalars(content) {
    const exportMatches = content.match(/export const (\w+) = ['"`]scalar \w+['"`];/g) || [];
    return exportMatches.map(match => {
      const name = match.match(/export const (\w+)/)[1];
      return name;
    });
  }

  insertIntoArray(content, searchPattern, newEntry) {
    const arrayStart = content.indexOf('[', content.indexOf(searchPattern));
    if (arrayStart === -1) {
      this.status.warnings.push(`Could not find array start in pattern: ${searchPattern}`);
      return content;
    }

    // Find the array closing bracket
    const arrayEnd = this.findMatchingBracket(content, arrayStart);
    if (arrayEnd === -1) {
      this.status.warnings.push(`Could not find array end in pattern: ${searchPattern}`);
      return content;
    }

    // Extract current array items
    const arrayContent = content.slice(arrayStart + 1, arrayEnd).trim();
    const items = arrayContent
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    // Add new entry if it doesn't exist
    if (!items.includes(newEntry)) {
      items.push(newEntry);
      //items.sort();
    }

    // Sort items alphabetically
    const sortedItems = items.sort((a, b) => {
      // Remove quotes and compare
      const aClean = a.replace(/['"`]/g, '').trim();
      const bClean = b.replace(/['"`]/g, '').trim();
      return aClean.localeCompare(bClean);
    });

    // Reconstruct the array with consistent formatting
    const newArrayContent = sortedItems.join(',\n  ');
    return (
      content.slice(0, arrayStart + 1) + '\n  ' + newArrayContent + '\n' + content.slice(arrayEnd)
    );
  }

  toKebabCase(str) {
    return (
      str
        // Handle special cases first
        .replace(/([A-Z]{2,})/g, match => match.charAt(0) + match.slice(1).toLowerCase()) // Handle acronyms
        .replace(/([A-Z])/g, match => '-' + match.toLowerCase()) // Convert camelCase to kebab
        .replace(/^-/, '') // Remove leading dash
        .toLowerCase()
    );
  }

  formatMetaEntry(scalarName) {
    const kebabKey = this.toKebabCase(scalarName);
    return `'${kebabKey}': '${scalarName}'`;
  }

  insertIntoObject(content, searchPattern, newEntry) {
    const objectStart = content.indexOf('{', content.indexOf(searchPattern));
    if (objectStart === -1) {
      this.status.warnings.push(`Could not find object start in pattern: ${searchPattern}`);
      return content;
    }

    // Find the object closing brace
    const objectEnd = this.findMatchingBracket(content, objectStart, '{', '}');
    if (objectEnd === -1) {
      this.status.warnings.push(`Could not find object end in pattern: ${searchPattern}`);
      return content;
    }

    // Extract current object entries
    const objectContent = content.slice(objectStart + 1, objectEnd).trim();
    const entries = objectContent
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    // Add new entry and sort alphabetically
    if (!entries.includes(newEntry)) {
      entries.push(newEntry);
      //entries.sort();
    }

    // Sort entries alphabetically by the kebab-case key
    const sortedEntries = entries.sort((a, b) => {
      // Remove quotes and compare
      const aKey = a.split(':')[0].replace(/['"]/g, '').trim();
      const bKey = b.split(':')[0].replace(/['"]/g, '').trim();
      return aKey.localeCompare(bKey);
    });

    // Format the entries with consistent indentation
    const newObjectContent = sortedEntries.join(',\n  ');

    // Reconstruct the object with proper formatting
    return [content.slice(0, objectStart) + '{', '  ' + newObjectContent, '};'].join('\n');
  }

  findMatchingBracket(content, start, openChar = '[', closeChar = ']') {
    let count = 1;
    let pos = start + 1;

    while (count > 0 && pos < content.length) {
      if (content[pos] === openChar) count++;
      if (content[pos] === closeChar) count--;
      pos++;
    }

    return count === 0 ? pos - 1 : -1;
  }

  /*async updateMainIndex() {
    const indexPath = path.join(this.baseDir, 'src/index.ts');

    // Add imports and exports
    const imports = `import { GraphQL${this.scalarName} } from './scalars/index.js';`;
    const exports = `
export { ${this.scalarName} as ${this.scalarName}TypeDefinition } from './typeDefs.js';
export { GraphQL${this.scalarName} as ${this.scalarName}Resolver };
export { ${this.scalarName} as ${this.scalarName}Mock } from './mocks.js';
export { GraphQL${this.scalarName} };`;

    await this.updateOrInsertContent(indexPath, '', imports + exports, 'import');

    // Update resolvers object
    await this.updateOrInsertContent(
      indexPath,
      'export const resolvers: Record<string, GraphQLScalarType>',
      `${this.scalarName}: GraphQL${this.scalarName}`,
      'object',
    );
  }*/

  /*async updateMainIndex() {
    const indexPath = path.join(this.baseDir, 'src/index.ts');
    let content = await this.readFile(indexPath);

    // Preserve existing content while adding new scalar
    const newImport = `import { GraphQL${this.scalarName} } from './scalars/index.js';`;

    // Group new exports by type
    const newExports = {
      typeDefinition: `export { ${this.scalarName} as ${this.scalarName}TypeDefinition } from './typeDefs.js';`,
      resolver: `export { GraphQL${this.scalarName} as ${this.scalarName}Resolver };`,
      mock: `export { ${this.scalarName} as ${this.scalarName}Mock } from './mocks.js';`,
      direct: `export { GraphQL${this.scalarName} };`,
    };

    // Add import if it doesn't exist
    if (!content.includes(newImport)) {
      const lastImportIndex = content.lastIndexOf('import');
      const importEndIndex = content.indexOf(';', lastImportIndex) + 1;
      content = content.slice(0, importEndIndex) + '\n' + newImport + content.slice(importEndIndex);
    }

    // Helper function to find the last export of a certain type
    const findLastExportIndex = pattern => {
      const matches = [...content.matchAll(new RegExp(pattern, 'g'))];
      return matches.length ? matches[matches.length - 1].index : -1;
    };

    // Add exports in their respective sections
    const exportPatterns = {
      typeDefinition: /export \{ .* as .*TypeDefinition \} from '\.\/typeDefs\.js';/,
      resolver: /export \{ GraphQL.* as .*Resolver \};/,
      mock: /export \{ .* as .*Mock \} from '\.\/mocks\.js';/,
      direct: /export \{ GraphQL.* \};/,
    };

    for (const [type, pattern] of Object.entries(exportPatterns)) {
      const lastIndex = findLastExportIndex(pattern);
      if (lastIndex !== -1) {
        // Insert after the last export of this type
        const insertIndex = content.indexOf(';', lastIndex) + 1;
        content =
          content.slice(0, insertIndex) + '\n' + newExports[type] + content.slice(insertIndex);
      } else {
        // If no existing exports of this type, add to end of file
        content += '\n' + newExports[type];
      }
    }

    // Update resolvers object while preserving existing entries
    const resolversPattern =
      /export const resolvers: Record<string, GraphQLScalarType> = {([^}]*)}/;
    const resolversMatch = content.match(resolversPattern);

    if (resolversMatch) {
      const existingResolvers = resolversMatch[1].trim();
      const newResolver = `  ${this.scalarName}: GraphQL${this.scalarName}`;

      // Check if resolver already exists
      if (!existingResolvers.includes(this.scalarName + ':')) {
        const resolvers = existingResolvers
          .split(',')
          .map(r => r.trim())
          .filter(Boolean);

        resolvers.push(newResolver);

        // Sort resolvers alphabetically
        const sortedResolvers = resolvers.sort((a, b) => {
          const aKey = a.split(':')[0].trim();
          const bKey = b.split(':')[0].trim();
          return aKey.localeCompare(bKey);
        });

        const newResolversContent = '{\n  ' + sortedResolvers.join(',\n  ') + '\n}';
        content = content.replace(
          resolversPattern,
          `export const resolvers: Record<string, GraphQLScalarType> = ${newResolversContent}`,
        );
      }
    }

    await this.writeFile(indexPath, content);
    this.status.created.push(`Updated index.ts with ${this.scalarName} scalar`);
  }*/

  async updateMainIndex() {
    const indexPath = path.join(this.baseDir, 'src/index.ts');
    let content = await this.readFile(indexPath);

    // Check all possible export variations for the scalar
    let exportPatterns = [
      `export { ${this.scalarName} as ${this.scalarName}TypeDefinition }`,
      `export { GraphQL${this.scalarName} as ${this.scalarName}Resolver }`,
      `export { ${this.scalarName} as ${this.scalarName}Mock }`,
      `export { GraphQL${this.scalarName} }`,
      `${this.scalarName}: GraphQL${this.scalarName}`,
    ];

    // If any of these patterns exist, log it and skip
    const existingExports = exportPatterns.filter(pattern => content.includes(pattern));
    if (existingExports.length > 0) {
      this.status.alreadyExists.push(
        `Scalar ${this.scalarName} exports already exist in index.ts:`,
      );
      existingExports.forEach(exp => {
        this.status.alreadyExists.push(`  ${exp}`);
      });
      return;
    }

    // If we get here, we know we need to add the new scalar
    const newImport = `import { GraphQL${this.scalarName} } from './scalars/index.js';`;

    // Group new exports by type
    const newExports = {
      typeDefinition: `export { ${this.scalarName} as ${this.scalarName}TypeDefinition } from './typeDefs.js';`,
      resolver: `export { GraphQL${this.scalarName} as ${this.scalarName}Resolver };`,
      mock: `export { ${this.scalarName} as ${this.scalarName}Mock } from './mocks.js';`,
      direct: `export { GraphQL${this.scalarName} };`,
    };

    // Add import if it doesn't exist (extra check even though we checked exports)
    if (!content.includes(newImport)) {
      const lastImportIndex = content.lastIndexOf('import');
      const importEndIndex = content.indexOf(';', lastImportIndex) + 1;
      content = content.slice(0, importEndIndex) + '\n' + newImport + content.slice(importEndIndex);
    }

    // Helper function to find the last export of a certain type
    const findLastExportIndex = pattern => {
      const matches = [...content.matchAll(new RegExp(pattern, 'g'))];
      return matches.length ? matches[matches.length - 1].index : -1;
    };

    // Add exports in their respective sections
    exportPatterns = {
      typeDefinition: /export \{ .* as .*TypeDefinition \} from '\.\/typeDefs\.js';/,
      resolver: /export \{ GraphQL.* as .*Resolver \};/,
      mock: /export \{ .* as .*Mock \} from '\.\/mocks\.js';/,
      direct: /export \{ GraphQL.* \};/,
    };

    for (const [type, pattern] of Object.entries(exportPatterns)) {
      const lastIndex = findLastExportIndex(pattern);
      if (lastIndex !== -1) {
        const insertIndex = content.indexOf(';', lastIndex) + 1;
        content =
          content.slice(0, insertIndex) + '\n' + newExports[type] + content.slice(insertIndex);
      } else {
        content += '\n' + newExports[type];
      }
    }

    // Update resolvers object while preserving existing entries
    const resolversPattern =
      /export const resolvers: Record<string, GraphQLScalarType> = {([^}]*)}/;
    const resolversMatch = content.match(resolversPattern);

    if (resolversMatch) {
      const existingResolvers = resolversMatch[1].trim();
      const newResolver = `${this.scalarName}: GraphQL${this.scalarName}`;

      if (!existingResolvers.includes(this.scalarName + ':')) {
        const resolvers = existingResolvers
          .split(',')
          .map(r => r.trim())
          .filter(Boolean);

        resolvers.push(newResolver);

        const sortedResolvers = resolvers.sort((a, b) => {
          const aKey = a.split(':')[0].trim();
          const bKey = b.split(':')[0].trim();
          return aKey.localeCompare(bKey);
        });

        const newResolversContent = '{\n  ' + sortedResolvers.join(',\n  ') + '\n}';
        content = content.replace(
          resolversPattern,
          `export const resolvers: Record<string, GraphQLScalarType> = ${newResolversContent}`,
        );
      }
    }

    await this.writeFile(indexPath, content);
    this.status.created.push(`Updated index.ts with ${this.scalarName} scalar`);
  }

  async updateScalarsIndex() {
    const scalarsIndexPath = path.join(this.baseDir, 'src/scalars/index.ts');
    const content = await this.readFile(scalarsIndexPath);

    // Check for all possible export variations
    const exportVariations = [
      `export { GraphQL${this.scalarName} }`,
      `export { GraphQL${this.scalarName} as GraphQL${this.scalarName} }`,
      `export * from './${this.scalarName}.js'`,
      `export * from "./${this.scalarName}.js"`,
      `export * from './${this.scalarName}'`,
      `export * from "./${this.scalarName}"`,
    ];

    // If any variation exists, log and return
    const existingExport = exportVariations.find(pattern => content.includes(pattern));
    if (existingExport) {
      this.status.alreadyExists.push(
        `Export for ${this.scalarName} already exists in scalars/index.ts: ${existingExport}`,
      );
      return;
    }

    // Add new export
    const exportContent = `export { GraphQL${this.scalarName} } from './${this.scalarName}.js';`;

    // Find the last export statement to maintain grouping
    const lastExportIndex = content.lastIndexOf('export');
    if (lastExportIndex !== -1) {
      const insertIndex = content.indexOf(';', lastExportIndex) + 1;
      const newContent =
        content.slice(0, insertIndex) + '\n' + exportContent + content.slice(insertIndex);
      await this.writeFile(scalarsIndexPath, newContent);
    } else {
      // If no exports exist yet, add at the end
      await this.writeFile(scalarsIndexPath, (content + '\n' + exportContent).trim() + '\n');
    }

    this.status.created.push(`Added ${this.scalarName} export to scalars/index.ts`);
  }

  async updateMocks() {
    const mocksPath = path.join(this.baseDir, 'src/mocks.ts');
    const mockContent = `export const ${this.scalarName} = () => 'Example ${this.scalarName}';`;
    await this.updateOrInsertContent(mocksPath, '', mockContent, 'import');
  }

  async updateTypeDefs() {
    const typeDefsPath = path.join(this.baseDir, 'src/typeDefs.ts');
    const content = await this.readFile(typeDefsPath);

    // Normalize all scalar declarations to use single quotes
    let normalizedContent = this.normalizeQuotes(content);

    // Add scalar declaration if it doesn't exist
    const scalarDeclaration = this.formatScalarDeclaration(this.scalarName);
    if (!normalizedContent.includes(scalarDeclaration)) {
      normalizedContent = scalarDeclaration + '\n' + normalizedContent;
      this.status.created.push(`Added scalar declaration: ${scalarDeclaration}`);
    }

    // Update typeDefs array
    normalizedContent = this.insertIntoArray(
      normalizedContent,
      'export const typeDefs =',
      this.scalarName,
    );

    await this.writeFile(typeDefsPath, normalizedContent);
  }

  /*async updateScalarsIndex() {
    const scalarsIndexPath = path.join(this.baseDir, 'src/scalars/index.ts');
    const exportContent = `export { GraphQL${this.scalarName} } from './${this.scalarName}.js';`;
    await this.updateOrInsertContent(scalarsIndexPath, '', exportContent, 'import');
  }*/

  async updateDocsMeta() {
    const metaPath = path.join(this.baseDir, 'website/src/pages/docs/scalars/_meta.ts');
    const metaEntry = this.formatMetaEntry(this.scalarName);
    await this.updateOrInsertContent(metaPath, 'export default', metaEntry, 'object');
  }

  async createDocumentation() {
    const mdxPath = path.join(
      this.baseDir,
      `website/src/pages/docs/scalars/${this.toKebabCase(this.scalarName)}.mdx`,
    );

    const mdxContent = `# ${this.scalarName}

The \`${this.scalarName}\` scalar type represents a custom scalar in the GraphQL schema.

## Examples

\`\`\`graphql
type Query {
  example${this.scalarName}: ${this.scalarName}!
}
\`\`\`

## Technical Details

Add implementation details and validation rules here.
`;

    await this.ensureFile(mdxPath, mdxContent);
  }

  async setup() {
    try {
      await this.updateMainIndex();
      await this.updateMocks();
      await this.updateTypeDefs();
      await this.updateScalarsIndex();
      await this.updateDocsMeta();
      await this.createDocumentation();

      this.printStatus();
    } catch (error) {
      console.error(chalk.red('\n❌ Error during setup:'));
      console.error(chalk.red(`  ${error.message}`));
      process.exit(1);
    }
  }

  printStatus() {
    console.log('\n📋 Status Report:\n');

    if (this.status.created.length > 0) {
      console.log(chalk.green('✨ New additions:'));
      this.status.created.forEach(item => console.log(chalk.green(`  ${item}`)));
    }

    if (this.status.alreadyExists.length > 0) {
      console.log(chalk.blue('\n✅ Already exists:'));
      this.status.alreadyExists.forEach(item => console.log(chalk.blue(`  ${item}`)));
    }

    if (this.status.warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️  Warnings:'));
      this.status.warnings.forEach(item => console.log(chalk.yellow(`  ${item}`)));
    }

    console.log(chalk.green('\n🎉 Setup process completed!'));
  }
}

// CLI interface
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const scalarName = process.argv[2];
  if (!scalarName) {
    console.error(chalk.red('Please provide a scalar name: node setupScalar.js ScalarName'));
    process.exit(1);
  }

  const setup = new ScalarSetup(scalarName);
  setup.setup();
}

export default ScalarSetup;
