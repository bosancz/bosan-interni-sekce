var path = require("path");

module.exports = {
  
  server: {
    port: 80,
    host: "127.0.0.1"
  },
  
  data: {
    root: "../../../test.bosan.cz-data"
  },

  keys: {
    google: require("../../../test.bosan.cz-keys/google"),
    vapid: require("../../../test.bosan.cz-keys/vapid"),
    jwt: require("../../../test.bosan.cz-keys/jwt")
  },
  
  apiRoot: "/api",
  shareRoot: "/api/share",
  
  url: "https://test.bosan.cz",  
  
  google: {
    impersonate: "info@bosan.cz",
    appId: ""
  },

  facebook: {
    appId: "284020775534023"
  },
  
  cookieSecure: false,
  
  databaseUri: "mongodb://localhost:27017/bosan-test"
}