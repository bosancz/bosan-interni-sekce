const fs = require("fs-extra");
const path = require("path");
const config = require("../config");
const environment = require("../environment");

const dirs = [
  config.config.storageDir,
  config.events.storageDir,
  config.photos.storageDir,
  config.photos.thumbsDir,
  config.uploads.dir
];

async function ensureDirs() {
  for (let dir of dirs) {
    await fs.ensureDir(dir)
      .then(() => console.log("[FS] Initialized dir: " + dir))
      .catch(() => console.error("[FS] Failed to initialize dir: " + dir));
  }
}

module.exports = ensureDirs();