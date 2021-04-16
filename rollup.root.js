import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
import cleanup from 'rollup-plugin-cleanup';
import pluginDelete from 'rollup-plugin-delete';
import path from 'path';

const extensions = ['.js', '.ts', '.tsx'];

const defaultConfig = {
    plugins: [],
    copy: undefined,
    cleanDist: false,
};

const isDev = process.env.NODE_ENV === 'development';

export function createConfig(curPath, pkgInfo, initConfig = {}) {
    let config = {
        ...defaultConfig,
        ...initConfig,
    };

    const resolve = function (...args) {
        return path.resolve(curPath, ...args);
    };

    return [
        {
            input: resolve('./src/index.ts'),
            output: [
                {
                    file: resolve('./', pkgInfo.main),
                    format: 'cjs',
                },
                {
                    file: resolve('./', pkgInfo.module),
                    format: 'es',
                },
            ],
            plugins: [
                config.copy ? copy(config.copy) : null,
                json(),
                nodeResolve({
                    extensions,
                    // modulesOnly: true,
                    // resolveOnly: ['./src/**'],
                }),
                babel({
                    exclude: 'node_modules/**', // 只编译我们的源代码
                    extensions,
                    babelHelpers: 'bundled',
                    presets: ['@babel/preset-env', '@babel/preset-typescript'],
                    plugins: [
                        // '@babel/plugin-transform-runtime',
                        '@babel/plugin-proposal-class-properties',
                    ],
                }),
                replace({
                    'process.env.NODE_ENV': JSON.stringify(
                        process.env.NODE_ENV,
                    ),
                    'preventAssignment': false,
                }),
                cleanup(),
                config.cleanDist
                    ? pluginDelete({ targets: 'lib/*' })
                    : undefined,
                ...config.plugins,
            ],
        },
        {
            input: resolve('./src/index.ts'),
            output: {
                file: resolve('./', pkgInfo.types),
                format: 'es',
            },
            plugins: [dts()],
        },
    ];
}
