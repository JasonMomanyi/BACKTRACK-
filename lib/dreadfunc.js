```javascript
const { proto, delay, getContentType } = require('@whiskeysockets/baileys');
const chalk = require('chalk');
const fs = require('fs');
const Crypto = require('crypto');
const axios = require('axios');
const moment = require('moment-timezone');
const { sizeFormatter } = require('human-readable');
const util = require('util');
const Jimp = require('jimp');
const { defaultMaxListeners } = require('stream');

const unixTimestampSeconds = (date = new Date()) => Math.floor(date.getTime() / 1000);

exports.unixTimestampSeconds = unixTimestampSeconds;

exports.generateMessageTag = (epoch) => {
    let tag = unixTimestampSeconds().toString();
    if (epoch)
        tag += '.--' + epoch; // attach epoch if provided
    return tag;
}

exports.processTime = (timestamp, now) => {
    return moment.duration(now - moment(timestamp * 1000)).asSeconds();
}

exports.getRandom = (ext) => {
    return Math.floor(Math.random() * 10000) + ext;
}

exports.getBuffer = async (url, options) => {
    try {
        options = options || {};
        const res = await axios({
            method: "get",
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options,
            responseType: 'arraybuffer'
        });
        return res.data;
    } catch (err) {
        return err;
    }
}

exports.fetchJson = async (url, options) => {
    try {
        options = options || {};
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        });
        return res.data;
    } catch (err) {
        return err;
    }
}

exports.runtime = function(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

exports.clockString = (ms) => {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}

exports.sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
}

exports.getTime = (format, date) => {
    if (date) {
        return moment(date).locale('id').format(format);
    } else {
        return moment.tz('Africa/Harare').locale('id').format(format);
    }
}

exports.formatDate = (n, locale = 'zw') => {
    let d = new Date(n);
    return d.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
}

exports.tanggal = (numer) => {
    const myMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"]; 
    const myDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];  
    var tgl = new Date(numer); 
    var day = tgl.getDate(); 
    var bulan = tgl.getMonth(); 
    var thisDay = tgl.getDay(); 
    thisDay = myDays[thisDay]; 
    var yy = tgl.getYear(); 
    var year = (yy < 1000) ? yy + 1900 : yy;  
    return `${thisDay}, ${day} - ${myMonths[bulan]} - ${year}`;

}

exports.formatp = sizeFormatter({
    std: 'JEDEC', //'SI' = default | 'IEC' | 'JEDEC'
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`,
})

exports.jsonformat = (string) => {
    return JSON.stringify(string, null, 2);
}

function format(...args) {
    return util.format(...args);
}

exports.logic = (check, inp, out) => {
    if (inp.length !== out.length) throw new Error('Input and Output must have same length');
    for (let i in inp)
        if (util.isDeepStrictEqual(check, inp[i])) return out[i];
    return null;
}

exports.generateProfilePicture = async (buffer) => {
    const jimp = await Jimp.read(buffer);
    const min = jimp.getWidth();
    const max = jimp.getHeight();
    const cropped = jimp.crop(0, 0, min, max);
    return {
        img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
        preview: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG)
    };
}

exports.bytesToSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' +
