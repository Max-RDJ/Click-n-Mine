const fs = require("fs");

function readDb(dbName = "db.json") {
    const data = fs.readFileSync(dbName, "utf-8");
    const converted_data = JSON.parse(data);
    return converted_data;
}

function writeDb(obj, dbName = "db.json") {
    if (!obj) {
        return;
    }

    try {
        let converted_data = JSON.stringify(obj);
        fs.writeFileSync(dbName, converted_data);
        console.log("Save successful");
    } catch(err) {
        console.log("Failed to save data\n", err.message);
    }
}

module.exports = {
    readDb, writeDb
}