const ImageKit = require('imagekit')

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_URL,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
});

module.exports = imagekit