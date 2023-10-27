/**
 * 注意：
 * 本工程这里并不是使用 babel 进行了打包，而仅仅是因为 ts-jest 的测试需要识别 ts 代码，才需要 babel 转一道
 */
module.exports = {
    presets: [
        [
            '@babel/preset-env', { target: { node: 'corrent' } }
        ],
        '@babel/preset-typescript'
    ]
};