export default {
  "**/*.{js,ts,json,html}": (stagedFiles) => [
    /* `eslint .`, */ `prettier --write --ignore-unknown ${stagedFiles
      .map((filePath) => {
        // console.log("filePath", filePath);
        return filePath;
      })
      .join(" ")}`,
  ],
};
