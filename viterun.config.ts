// import basicSsl from '@vitejs/plugin-basic-ssl'
import {resolve} from "node:path";
import {readFileSync} from "node:fs";
import {BaseConfigReturnType, defineConfig, ViteRunHandleFunctionOptions, viteRunLogPlugin} from "vite-run";
import vue from '@vitejs/plugin-vue'
import createCopyDts from "vite-plugin-copy-dts";
import dts from "vite-plugin-dts";

export default defineConfig({
  baseConfig: getBaseConfig,
  packages: [
    'packages/*',
    'examples/base/*',
    'examples/apps/native',
    'examples/apps/vue3',
  ],
  targets: {
    'tiyi-core': {
      build: [
        ['es'],
        ['umd', 'minify']
      ],
      dev: [
        ['es', 'watch', 'sourcemap']
      ],
      types: [
        ['types']
      ]
    },
    'tiyi-core-yang': {
      build: [
        ['es', 'tiyi_core_yang_external'],
        ['umd', 'minify']
      ],
      dev: [
        ['es', 'tiyi_core_yang_external', 'watch', 'sourcemap']
      ],
      types: [
        ['types']
      ]
    },
    'tiyi': {
      build: [
        ['es', 'tiyi_external'],
        ['umd', 'minify']
      ],
      dev: [
        ['es', 'tiyi_external', 'watch', 'sourcemap']
      ],
      types: [
        ['types']
      ]
    },
    'test-base-vue': {
      dev: ['10000'],
    },
    'native': {
      dev: ['11000']
    },
    'vue3': {
      dev: ['12000']
    },
  },
  mode: {
    production: 'production',
    development: 'development',
  },
  build: {
    es: {
      lib: {
        formats: ['es']
      }
    },
    umd: {
      lib: {
        formats: ['umd']
      },
    },
    watch: {
      watch: {},
    },
    sourcemap: {
      rollupOptions:{
        output:{
          sourcemap:true
        }
      }
    },
    minify: {
      minify: true
    },
    tiyi_core_yang_external: {
      rollupOptions: {
        external: ['tiyi-core', 'history-stack-manager']
      }
    },
    tiyi_external: {
      rollupOptions: {
        external: ['tiyi-core', 'tiyi-core-yang', 'tiyi-core-history']
      }
    },
  },
  server: {
    10000: {
      open: true,
      port: 10000
    },
    11000: {
      port: 11000
    },
    12000: {
      port: 12000
    },
  },
  plugins: {
    types: (options: ViteRunHandleFunctionOptions) => {
      return [
        createCopyDts({
          // logLevel:'info',
          root: options.packagePath,
          files: [
            {
              from: ['types/*.d.ts'],
              to: `dist/${options.name}.d.ts`,
              excludes: ['types/index.d.ts']
            }
          ]
        }),
        dts({
          rollupTypes: true,
          copyDtsFiles: true,
          clearPureImport: true
          // logLevel: 'silent',
        }),
        {
          name: 'block-js-file-output',
          apply: 'build',
          generateBundle(_: any, bundle: Record<any, any>) {
            for (const k in bundle) {
              delete bundle[k]   // 禁止该js后面产物的输出文件，目的为了只输出dts
            }
          },
        },
      ]
    }
  }
})


function getBaseConfig(options: ViteRunHandleFunctionOptions): BaseConfigReturnType {
  // console.log(this);
  return {
    resolve: {
      extensions: [".ts", ".js", ".d.ts", '.vue', '.css'],
      alias: {
        "@": resolve(options.packagePath, 'src'),
        types: resolve(options.packagePath, 'src/types')
      }
    },
    build: {
      emptyOutDir: false,
      minify: false,
      lib: {
        entry: resolve(options.packagePath, 'src', `index.ts`),
        name: options.name,
        fileName: (format: string) => `${options.name}.${format}.js`,
      },
      rollupOptions: {
        external: ['tslib', 'vite', 'node:fs'],
        output: {
          sourcemap: false,
          globals: {},
        },
      },
    },
    server: {
      hmr: true,
      cors: true,
      strictPort: true,
      https: {
        key: readFileSync(resolve(__dirname, './keys/localhost+1-key.pem')),
        cert: readFileSync(resolve(__dirname, './keys/localhost+1.pem'))
      },
      port: 6000
    },
    plugins: [
      vue(),
      viteRunLogPlugin(),
      // checker({
      //   typescript: {
      //     root:options.packagePath
      //   }
      // }),
    ]
  }
}
