import html from "@rollup/plugin-html";
import image from "@rollup/plugin-image";
import typescript from "@rollup/plugin-typescript";
import fs from "fs";
import postcss from "rollup-plugin-postcss";
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
    image(),
    postcss({ extract: true, autoModules: true }),
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
};