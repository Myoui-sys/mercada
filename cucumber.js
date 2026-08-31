const common = {
  requireModule: ["ts-node/register"],
  require: [
    "tests/steps/**/*.ts",
    "tests/support/**/*.ts"
  ],
  format: [
    "progress",
    "html:reports/cucumber-report.html"
  ],
  publishQuiet: true
};

module.exports = {
  default: {
    ...common,
    paths: [
      "tests/features/**/*.feature"
    ],
    tags: "not @performance"
  },
  performance: {
    ...common,
    paths: [
      "tests/features/performance.feature"
    ],
    tags: "@performance"
  }
};
