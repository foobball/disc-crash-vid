const fs = require('fs');
const consola = require('consola');
const { exec } = require("child_process");
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
            consola.error('Could not find ffmpeg.exe\n    Download ffmpeg.exe from https://github.com/foobball/disc-crash-vid/raw/main/ffmpeg.exe');
            process.exit();
        }

        if (files.indexOf('template.mp4') == -1) {
            consola.error('Could not find template.mp4\n    Download template.mp4 from https://github.com/foobball/disc-crash-vid/raw/main/template.mp4');
            process.exit();
        }

        let mp4file = 'main.mp4';
        process.argv.forEach((arg) => {
            if (arg.length >= 4) {
                if (arg.substr(arg.length - 4, 4) == '.mp4') {
                    mp4file = arg;
                }
            }
        })

        if (files.indexOf(mp4file) == -1) {
            consola.error('Could not find ' + mp4file);
            process.exit();
        }

        fs.writeFile('.config.temp', `file '${mp4file}'
file 'template.mp4'
inpoint 1000`, function(err) {
            if (err) throw err;

            // ffmpeg -y -f concat -i config.txt -c copy output.mp4
            exec('ffmpeg -hide_banner -loglevel panic -y -f concat -i .config.temp -c copy output.mp4', (error, stdout, stderr) => {
                if (error) {
                    consola.error(error.message);
                    return;
                } else if (stderr) {
                    consola.error(stderr);
                    return;
                } else {
                    consola.success(`Successfully created glitched file "output.mp4"`);
                }

                fs.unlink('./.config.temp', () => {
                    process.exit();
                })
            })
        });
    });
}

convert();