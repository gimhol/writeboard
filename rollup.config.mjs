import html from "@rollup/plugin-html";
import image from "@rollup/plugin-image";
import fs from "fs";
import { dts } from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import typescript from 'rollup-plugin-typescript2';

const { output_format = 'cjs' } = process.env;
const demo_config = {
  input: "demo/index.ts",
  output: {
    entryFileNames: 'bundle.js',
    dir: "./output",
    format: output_format,
    sourcemap: true,
  },
  plugins: [
    image(),
    postcss({
      extensions: ['.scss'],
      extract: true,
      modules: {
        generateScopedName: 'writeboard_[local]_[hash:base64:5]'
      },
      use: ['sass']
    }),
    typescript({ tsconfig: './tsconfig.json' }),
    html({
      template: (opts) => {
        let scripts_tags = "";
        let link_tags = "";
        const full_html_text = fs.readFileSync("./public/index.html").toString()
        const scripts_place_regexp = /\n( *)<!-- roll-up-script -->/
        const scripts_place_info = full_html_text.match(scripts_place_regexp)
        if (scripts_place_info) {
          const [, space] = scripts_place_info
          for (const info of opts.files.js) {
            const { fileName } = info
            scripts_tags += `\n${space}<script src="./${fileName}" type="text/javascript"></script>`
          }
        }

        const css_place_regexp = /\n( *)<!-- roll-up-css -->/
        const css_place_info = full_html_text.match(css_place_regexp)
        if (css_place_info) {
          const [, space] = css_place_info
          for (const info of opts.files.css) {
            const { fileName } = info
            link_tags += `\n${space}<link rel="stylesheet" href="./${fileName}">`
          }
        }
        return full_html_text
          .replace(scripts_place_regexp, scripts_tags)
          .replace(css_place_regexp, link_tags)
      },
    })
  ]
}

const targets = [
  { dir: 'dist/es6', tsconfig: "./tsconfig.lib.es6.json" },
  { dir: 'dist/es5', tsconfig: "./tsconfig.lib.es5.json" }
]
const formats = ['module', 'amd', 'cjs', 'es', 'iife', 'system', 'umd', 'commonjs', 'esm', 'systemjs']
const configs = [];
for (const format of formats) {
  for (const { dir, tsconfig } of targets) {
    const bundle_js_config = {
      input: 'writeboard/index.ts',
      output: {
        file: `${dir}/${format}/writeboard.js`,
        format,
        sourcemap: true,
        name: "writeboard"
      },
      plugins: [
        typescript({ tsconfig }),
        postcss({
          extensions: ['.scss'],
          extract: true,
          modules: {
            generateScopedName: 'writeboard_[local]_[hash:base64:5]'
          },
          use: ['sass']
        }),
      ],
    }
    const bundle_dts_config = {
      input: 'writeboard/index.ts',
      output: {
        file: `${dir}/${format}/writeboard.d.ts`,
        format
      },
      plugins: [dts()],
    }
    configs.push(bundle_js_config, bundle_dts_config)
  }
}
if (process.argv.some(v => v === '-w')) {
  configs.length = 0
  configs.push(demo_config);
}
export default configs