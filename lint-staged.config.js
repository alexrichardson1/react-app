import { ESLint } from "eslint";

const getPaths = (files) => files.join(" ");

// https://github.com/okonet/lint-staged#how-can-i-ignore-files-from-eslintignore
const removeIgnoredFiles = async (files) => {
  const eslint = new ESLint();
  const isIgnored = await Promise.all(files.map((file) => eslint.isPathIgnored(file)));
  const filteredFiles = files.filter((_, i) => !isIgnored[i]);
  return getPaths(filteredFiles);
};

export default {
  "**/*": (files) => [`prettier --ignore-path .prettierignore --ignore-unknown --write ${getPaths(files)}`],
  "**/*.{ts,tsx,js,jsx}": async (files) => {
    const filesToLint = await removeIgnoredFiles(files);
    return [`eslint --max-warnings=0 ${filesToLint}`];
  },
};
