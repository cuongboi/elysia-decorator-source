import { $ } from 'bun';
import { build as tsupBuild, type Options } from 'tsup';

// Base tsup configuration
const tsupConfig: Options = {
  entry: ['src/**/*.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  bundle: false,
  minify: false,
  target: 'node20',
} satisfies Options;

// Build configurations
const builds = [
  { outDir: 'dist', format: 'esm' as const, cjsInterop: false },
  { outDir: 'dist/cjs', format: 'cjs' as const },
];

// Main build function
async function buildAll() {
  try {
    // Run tsup builds in parallel
    await Promise.all(
      builds.map((config) => tsupBuild({ ...tsupConfig, ...config })),
    );

    // Generate type declarations once
    await $`bunx tsc --project tsconfig.dts.json`.quiet();

    // Bun-specific build with optimized config
    const bunBuildPromise = Bun.build({
      entrypoints: ['./src/index.ts'],
      outdir: './dist/bun',
      minify: { whitespace: true, syntax: true, identifiers: false },
      target: 'bun',
      sourcemap: 'external',
      external: ['tsyringe'],
    });

    // Optimize .mjs imports
    const fixMjsImportsPromise = async () => {
      const glob = new Bun.Glob('dist/ems/**/*.mjs');
      const files = Array.from(glob.scanSync('.')); // Use sync for better perf
      const replacePatterns = [
        [
          /([ie]xport)\s*\{([^{}]+)\}\s*from\s*['"]([^'"]*[./][^'"]*)['"]/g,
          '$1{$2}from"$3.mjs"',
        ],
        [
          /([ie]xport) ([^ ]+) from\s*['"]([^'"]*[./][^'"]*)['"]/g,
          '$1 $2 from"$3.mjs"',
        ],
      ];

      await Promise.all(
        files.map(async (file) => {
          const content = await Bun.file(file).text();
          const newContent = replacePatterns.reduce(
            (acc, [pattern, replacement]) =>
              acc.replace(pattern, String(replacement)),
            content,
          );
          if (content !== newContent) {
            return Bun.write(file, newContent);
          }
        }),
      );
    };

    // Copy declarations more efficiently
    const copyDeclarationsPromise = $`mkdir -p dist/bun/lib/decorators`.then(
      async () =>
        await Promise.all([
          $`cp dist/*.d.ts dist/cjs`,
          $`cp dist/lib/*.d.ts dist/cjs/lib`,
          $`cp dist/lib/decorators/*.d.ts dist/cjs/lib/decorators`,
          $`cp dist/*.d.ts dist/bun`,
          $`cp -f dist/lib/*.d.ts dist/bun/lib`,
          $`cp -f dist/lib/decorators/*.d.ts dist/bun/lib/decorators`,
        ]),
    );

    // Execute all tasks concurrently
    await Promise.all([
      bunBuildPromise,
      fixMjsImportsPromise(),
      copyDeclarationsPromise,
    ]);

    console.log('Build completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Execute build
buildAll();
