import typescript from "@rollup/plugin-typescript";
import html from "@rollup/plugin-html";
import fs from 'fs';

const { output_format = 'cjs' } = process.env;

export default {
  input: "demo/index.ts",
  output: {
    entryFileNames: 'bundle.js',
    dir: "./output",
    format: output_format,
    sourcemap: true,
  },
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    html({
      template: (args) => {

        
        console.log(args.files.js.map(v => v.preliminaryFileName))
        return fs.readFileSync("./public/index.html").toString()
      },
    })
  ]
};