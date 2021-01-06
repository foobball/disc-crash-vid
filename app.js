const fs = require('fs');
const consola = require('consola');
let files = [];

function getFiles(callback) {
    fs.readdir('./', (err, filelist) => {
        if (err) throw err;
        files = filelist;
        callback();
    })
}

async function convert() {
    getFiles(() => {
        if (files.indexOf('ffmpeg.exe') == -1) {
            consola.error('Could not find ffmpeg.exe');
            process.exit();
        }


    });
}

console.log(process.argv);

convert();