module.exports = {
    apps: [{
      name: "botx-rss",
      script: "bun",
      args: "run src/index.ts",
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }]
}
