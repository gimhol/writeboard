import typescript from "@rollup/plugin-typescript";
import html from "@rollup/plugin-html";
import fs from 'fs';
import copy from 'rollup-plugin-copy';
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
    copy({
      targets: [
        { src: "./public/**/*", dest: "./output", flatten: false }
      ]
    }),
    typescript({ tsconfig: './tsconfig.json' }),
    html({
      template: (args) => {
        let scripts_tags = "";
        for (const { preliminaryFileName } of args.files.js) {
          scripts_tags += `<script src="./${preliminaryFileName}" type="text/javascript"></script>`
        }
        console.log(scripts_tags)
        return fs.readFileSync("./public/index.html")
          .toString()
          .replace(`<!-- roll-up-scripts -->`, scripts_tags)
      },
    })
  ]
};