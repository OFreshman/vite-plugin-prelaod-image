import process from "node:process";
import fg from "fast-glob";
import type { Plugin } from "vite";
// import type { PreloadImagesOptions, TransformOptions } from "./types.ts";

export interface PreloadImagesOptions {
  dir: string | string[];
  attrs: {
    rel: "preload" | "prefetch";
  };
  max?: number;
}

export interface TransformOptions {
  assetsDir: string;
  base: string;
}

export function replace(mark: string, placeholder: string, code: string): any {
  const re = new RegExp(mark, "g");
  return code.replace(re, placeholder);
}

function transformAsset(path: string, options: TransformOptions, command: string): string {
  const { assetsDir, base } = options;
  if (command === "serve") {
    return `${base}${path}`;
  } else {
    return `${base}${assetsDir}/${path}`;
  }
}

export function preloadImages(options: PreloadImagesOptions): Plugin {
  let assetsDir: string;
  let base: string;
  let command: string;
  return {
    name: "vite-plugin-preload-images",
    configResolved(config) {
      const { build } = config;
      assetsDir = build.assetsDir;
      base = config.base;
      command = config.command;
    },
    transformIndexHtml(html) {
      const { dir = "", attrs = { rel: "prefetch" }, max = 3 } = options;

      const files = fg.sync(dir, {
        cwd: process.cwd()
      });

      const images = files.map((file: string) => transformAsset(file, {
        assetsDir,
        base
      }, command));

      const scriptContent = `
          const _images = ${JSON.stringify(images)};
          function loadImage() {
            const src =  _images.shift()
            return new Promise((resolve, reject) => {
              const link = document.createElement('link');
              link.rel = '${attrs.rel}' || 'preload';
              link.href = src;
              link.as='image';
              document.head.appendChild(link);
              link.onload = resolve;
              link.onerror = reject;
              setTimeout(reject, 1000);
            })
          }

          function _loadImage() {
            loadImage().finally(() => {
              if(_images.length > 0) {
                _loadImage();
              }
            })
          }

          for (let i = 0; i < ${max}; i++) {
            _loadImage()
          }
        `;
      const result = html.replace(
        "</body>",
        `<script>${scriptContent}</script></body>`
      );
      return result;
    }
  };
}