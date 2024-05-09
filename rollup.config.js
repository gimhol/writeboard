import typescript from "@rollup/plugin-typescript";

const { output_format = 'cjs' } = process.env;

export default {
  input: "demo/index.ts",
  output: {
    entryFileNames: 'bundle.js',
    dir: "output",
    format: output_format,
    sourcemap: true,
  },
  plugins: [typescript({ outDir: "output/" + output_format })]
};