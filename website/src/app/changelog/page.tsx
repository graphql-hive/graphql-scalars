import fs from 'node:fs/promises';
import { compileMdx, MDXRemote } from '@theguild/components/server';
import { useMDXComponents } from '../../mdx-components';

export const metadata = {
  title: 'Changelog',
  filePath: 'src/app/changelog/page.tsx',
};

const Wrapper = useMDXComponents().wrapper;

export default async function ChangelogPage() {
  const changelog = await fs.readFile('../CHANGELOG.md', 'utf8');
  const compiledSource = await compileMdx(
    // Remove first line
    changelog.replace(/^##.+/, ''),
  );
  return (
    <Wrapper toc={[]} metadata={metadata}>
      <h1>Changelog</h1>
      <MDXRemote compiledSource={compiledSource} />
    </Wrapper>
  );
}
