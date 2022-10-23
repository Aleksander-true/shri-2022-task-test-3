module.exports = {
  baseUrl: "http://localhost:3000/hw/store/",
  gridUrl: "http://127.0.0.1:4444/wd/hub",

  browsers: {
    chrome: {
      desiredCapabilities: {
        browserName: "chrome",
      },
    },
  },
  plugins: {
    "html-reporter/hermione": {
      path: "hermione-html-report",
    },
    "hermione-selenium-stanalone-runner-by-aleksander-true": true,
  },
};
