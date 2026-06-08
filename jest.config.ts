import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/lib/db$": "<rootDir>/src/__mocks__/db.mock.ts",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/app/**",
    "!src/lib/db.ts",
    "!src/repositories/IProductRepository.ts",
    "!src/repositories/PrismaProductRepository.ts",
    "!src/types/**",
    "!src/generated/**",
    "!src/components/search/**",
    "!src/components/ui/Pagination.tsx",
  ],
};

export default createJestConfig(config);
