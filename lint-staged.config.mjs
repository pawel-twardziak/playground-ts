export default {
  "**/*.{js,ts}": (stagedFiles) => [
    /* `eslint .`, */ `prettier --write --ignore-unknown ${stagedFiles.join(" ")}`,
  ],
};
