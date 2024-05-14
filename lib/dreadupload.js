const axios = require('axios');
const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');
const { fromBuffer } = require('file-type');
const cheerio = require('cheerio');

async function TelegraPh(Path) {
    if (!fs.existsSync(Path)) throw new Error("File not found");
    try {
        const form = new FormData();
        form.append("file", fs.createReadStream(Path));
        const { data } = await axios.post("https://telegra.ph/upload", form, {
            headers: form.getHeaders()
        });
        return "https://telegra.ph" + data[0].src;
    } catch (err) {
        throw new Error(String(err));
    }
}

async function UploadFileUgu(input) {
    try {
        const form = new FormData();
        form.append("files[]", fs.createReadStream(input));
        const { data } = await axios.post("https://uguu.se/upload.php", form, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
                ...form.getHeaders()
            }
        });
        return data.files[0];
    } catch (err) {
        throw new Error(err);
    }
}

async function webp2mp4File(path) {
    try {
        const form = new FormData();
        form.append('new-image-url', '');
        form.append('new-image', fs.createReadStream(path));
        const { data } = await axios.post('https://s6.ezgif.com/webp-to-mp4', form, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${form._boundary}`
            }
        });
        const bodyFormThen = new FormData();
        const $ = cheerio.load(data);
        const file = $('input[name="file"]').attr('value');
        bodyFormThen.append('file', file);
        bodyFormThen.append('convert', "Convert WebP to MP4!");
        const { data: thenData } = await axios.post('https://ezgif.com/webp-to-mp4/' + file, bodyFormThen, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${bodyFormThen._boundary}`
            }
        });
        const $2 = cheerio.load(thenData);
        const result = 'https:' + $2('div#output > p.outfile > video > source').attr('src');
        return {
            status: true,
            message: "Created By MRHRTZ",
            result: result
        };
    } catch (err) {
        throw new Error(err);
    }
}

async function floNime(media, options = {}) {
    const { ext } = await fromBuffer(media) || options.ext;
    const form = new FormData();
    form.append('file', media, 'tmp.' + ext);
    const response = await fetch('https://flonime.my.id/upload', {
        method: 'POST',
        body: form
    });
    return response.json();
}

module.exports = { TelegraPh, UploadFileUgu, webp2mp4File, floNime };

