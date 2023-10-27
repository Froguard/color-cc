import { Config } from '@jest/types';

/**
 * ts-jest 测试配置文件
 */
export default async (): Promise<Config.InitialOptions> => {
    return {
        verbose: true,
        bail: true,
        noStackTrace: true,
        // coverage
        collectCoverage: !!process.env.coverage,
        coverageDirectory: '__coverage__',
        coveragePathIgnorePatterns: ['/node_modules/'],
        coverageReporters: ['json', 'html'],
        coverageThreshold: {
            global: {
                branches: 0,
                functions: 20,
                lines: 50,
                statements: 50
            }
        },
        testEnvironment: 'node',
        testMatch: ['**/__tests__/**/*.ts'],
        testPathIgnorePatterns: ['/node_modules/'],
        moduleFileExtensions: ['ts', 'js', 'json', 'node'],
        transform: { '^.+\\.ts$': 'ts-jest' },
        transformIgnorePatterns: ['node_modules/(?!variables/.*)']
    };
};