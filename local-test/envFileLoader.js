(function () {
    if (!process.env.ENV_FILE_NAME) {
        throw false;
    }
    let path = require("path");
    let fs = require("fs");
    let jsonString = fs.readFileSync(path.resolve(process.cwd(), __dirname + "/" + process.env.ENV_FILE_NAME), {
        encoding: "utf8"
    });
    let envConfig = JSON.parse(jsonString);
    for (let key in envConfig) {
        let envConfigValue = envConfig[key];
        if (typeof envConfigValue == "object" || Array.isArray(envConfigValue)) {
            envConfigValue = JSON.stringify(envConfigValue);
        }
        process.env[key] = process.env[key] || envConfigValue;
    }
})();
