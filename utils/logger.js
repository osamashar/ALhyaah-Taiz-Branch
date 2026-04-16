const fs = require('fs');
const path = require('path');

class Logger {
    constructor(filename) {
        this.filename = filename;
        this.logStream = fs.createWriteStream(path.join(__dirname, filename), { flags: 'a' });
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} - ${message}`;
        console.log(logMessage);
        this.logStream.write(`${logMessage}\n`);
    }

    logFileUpload(file) {
        this.log(`File uploaded: ${file}`);
    }

    logError(error) {
        this.log(`Error: ${error}`);
    }

    logActivity(activity) {
        this.log(`Activity: ${activity}`);
    }

    end() {
        this.logStream.end();
    }
}

module.exports = Logger;