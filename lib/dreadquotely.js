const axios = require('axios');

const quote = async (text, name, avatar) => {
  const json = {
    "type": "quote",
    "format": "png",
    "backgroundColor": "#FFFFFF",
    "width": 512,
    "height": 768,
    "scale": 2,
    "messages": [
      {
        "entities": [],
        "avatar": true,
        "from": {
          "id": 1,
          "name": name,
          "photo": {
            "url": avatar,
          }
        },
        "text": text,
        "replyMessage": {}
      }
    ]
  };

  try {
    const res = await axios.post('https://bot.lyo.su/quote/generate', json, {
      headers: {'Content-Type': 'application/json'}
    });

    const buffer = Buffer.from(res.data.result.image, 'base64');

    return { 
      status: "200", 
      creator: "fortune",
      result: buffer
    };
  } catch (err) {
    return { 
      status: "500", 
      creator: "fortune",
      error: err.message
    };
  }
}

module.exports = { quote };
