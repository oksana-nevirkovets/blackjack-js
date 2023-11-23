module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["tests"],
  globals: {
    "ts-jest": {
      diagnostics: {
        ignoreCodes: ["TS151001"],
      },
    },
  },
};
