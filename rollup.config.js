import typescript from "@rollup/plugin-typescript";

const { output_format } = process.env;

export default {
  input: "src/index.ts",
  output: {
    dir: "dist/" + (output_format || ''),
    format: output_format ?? 'cjs',
    sourcemap: true,
  },
  plugins: [typescript({ outDir: "dist/" + (output_format || '') })]
};