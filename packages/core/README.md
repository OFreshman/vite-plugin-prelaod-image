<div align="center">
  <h1>vite-plugin-preload-image</h1>
  <h5>供学习用，不建议放生产！</h5>
</div>
<br>

## 🔦 介绍

> The Vite Image Preloader Plugin helps optimize web performance by preloading critical images during the build process. It integrates seamlessly with Vite and supports custom configurations for image types and directories.()

简言之，`vite-plugin-preload-image` 是一个 Vite 插件，用于在构建时自动预加载页面中的图片资源，提高页面加载性能。

## 🔩 安装

通过 npm 或 pnpm 安装该插件：

```bash
npm install vite-plugin-preload-image --save-dev
```

或

```bash
pnpm add vite-plugin-preload-image --save-dev
```

## 🛴 配置

在 `vite.config.ts` 中，使用 `vite-plugin-preload-image` 插件来配置图片预加载。

### 配置项

| 属性名           | 类型               | 默认值         | 说明                                                         |
|------------------|--------------------|----------------|--------------------------------------------------------------|
| `attrs`          | `object`           | `{ rel: 'prefetch' }` | 设置预加载的 `<link>` 标签的属性，支持 `rel` 等属性。             |
| `max`            | `number`           | `3`            | 设置预加载的最大图片数量。                                     |
| `dir`            | `string`           | `undefined`    | 图片文件的路径，可以是 glob 模式的路径。                       |

### 使用

1. 在 `vite.config.ts` 中引入并配置插件：

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { preloadImages } from 'vite-plugin-preload-image'

export default defineConfig({
  plugins: [
    vue(),
    preloadImages({
      attrs: {
        rel: 'preload',  // 设置预加载的链接类型为 preload
      },
      max: 2,  // 最大预加载数量
      dir: './src/assets/images/*.{jpg,jpeg,png,gif,svg}',  // 图片目录路径
    }),
  ]
})
```

2. 该插件会根据 `dir` 属性指定的路径查找图片，并将它们在 HTML 文件中通过 `<link rel="preload" href="...">` 的方式预加载。你可以根据项目需要调整 `max` 和 `attrs` 配置。

### 预加载属性说明

- **`attrs`**：用于设置图片预加载的属性，默认 `rel` 为 `prefetch`，你可以修改为 `preload` 或其他值。
- **`max`**：控制同时预加载的图片数量，默认为 3，设置为你希望并发加载的数量。
- **`dir`**：用于匹配图片的路径，支持 glob 格式，可以指定图片目录和扩展名。

### 插件功能

该插件会扫描你项目中的指定图片文件夹（通过 `dir` 属性），并自动为每个图片生成一个 `<link>` 标签来预加载图片。你可以使用 `rel` 属性设置为 `preload` 或 `prefetch`，来控制图片的加载优先级。

### 示例

假设你的项目中有如下文件结构：

```
src/
  assets/
    images/
      logo.png
      banner.jpg
      icon.svg
```

在 `vite.config.ts` 中配置插件如下：

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { preloadImages } from 'vite-plugin-preload-image'

export default defineConfig({
  plugins: [
    vue(),
    preloadImages({
      attrs: {
        rel: 'preload', // 设置为 preload
      },
      max: 2, // 预加载最多 2 张图片
      dir: './src/assets/images/*.{jpg,jpeg,png,gif,svg}', // 匹配图片
    }),
  ]
})
```

当你运行 `vite` 开发服务器或执行构建时，插件会根据配置扫描 `src/assets/images` 目录中的图片，并在 HTML 中插入以下 `<link>` 标签：

```html
<link rel="preload" href="/src/assets/images/logo.png" as="image">
<link rel="preload" href="/src/assets/images/banner.jpg" as="image">
```

### 预加载工作原理

- 插件会根据 `dir` 配置扫描指定的图片路径。
- 根据 `max` 属性，限制最多预加载的图片数量。
- 在 HTML 文件中通过 `<link rel="preload" href="...">` 标签加载这些图片资源。

## 🍗贡献

如果你发现任何问题或有改进建议，保留意见哈🐶。


### 🏆 License

- MIT [LICENSE](./LICENSE)