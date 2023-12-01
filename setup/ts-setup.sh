#!/usr/bin/env bash

npm init -y

npm install typescript --save-dev

npm install @types/node --save-dev

npx tsc --init --rootDir src --outDir build \
--esModuleInterop --resolveJsonModule --lib es6 \
--module commonjs --allowJs true --noImplicitAny true

mkdir src
touch src/index.ts

sed -i '' -E 's/("test": "echo \\"Error: no test specified\\" && exit 1")/"build": "npx tsc",\
\t\t"start1": "node build\/part1.js",\
\t\t"start2": "node build\/part2.js",\
\t\t"test": "jest"/' package.json

cp ../setup/ts.gitignore .gitignore

mv src/index.ts src/part1.ts
cp src/part1.ts src/part2.ts

touch src/index.test.ts
echo 'import { describe, expect, test } from "@jest/globals";' >> src/index.test.ts
echo '' >> src/index.test.ts
echo 'describe("part1", () => {' >> src/index.test.ts
echo '  test("calculates example line 1", () => {' >> src/index.test.ts
echo '    expect(1+1).toBe(2);' >> src/index.test.ts
echo '  });' >> src/index.test.ts
echo '});' >> src/index.test.ts
echo '' >> src/index.test.ts
echo 'describe("part2", () => {' >> src/index.test.ts
echo '  test("calculates example line 1", () => {' >> src/index.test.ts
echo '    expect(1+1).toBe(2);' >> src/index.test.ts
echo '  });' >> src/index.test.ts
echo '});' >> src/index.test.ts

npm install --save-dev ts-jest
npm install --save-dev @jest/globals
npx ts-jest config:init


sed -i '' -E 's/(testEnvironment: .node.,)/\1\
\tmodulePathIgnorePatterns: [\"build\"]/' jest.config.js

touch README.md

day=`basename "$PWD"`

echo "# $day" >> README.md

touch input.txt
touch input-example.txt

touch src/engine.ts

# Update  tsconfig to include 
# "exclude": ["node_modules", "build/**/*", "jest.config.js"]