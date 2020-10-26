import cors from '@koa/cors';

export default {
    open: true,
    port: 8080,
    watch: true,
    nodeResolve: true,
    appIndex: 'build/index.html',
    rootDir: 'build/',
    cors: true,
    plugins: [],
    middleware: [cors()],
    moduleDirs: ['node_modules', 'web_modules'],
};