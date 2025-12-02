const multer = require("multer");
const path = require("path");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
};

const itemsStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads/pictures/items");
    },
    filename: (req, file, callback) => {
        const fileInfo = path.parse(file.originalname);
        const name = fileInfo.name.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];

        if (!MIME_TYPES.hasOwnProperty(file.mimetype)) {
            return callback(new Error('Invalid file type'));
        }
        callback(null, `${name}_${new Date().getTime()}.${extension}`);
    }
});

const newsStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads/pictures/news");
    },
    filename: (req, file, callback) => {
        const fileInfo = path.parse(file.originalname);
        const name = fileInfo.name.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];

        if (!MIME_TYPES.hasOwnProperty(file.mimetype)) {
            return callback(new Error('Invalid file type'));
        }
        callback(null, `${name}_${new Date().getTime()}.${extension}`);
    }
});

const threadsStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads/pictures/threads");
    },
    filename: (req, file, callback) => {
        const fileInfo = path.parse(file.originalname);
        const name = fileInfo.name.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];

        if (!MIME_TYPES.hasOwnProperty(file.mimetype)) {
            return callback(new Error('Invalid file type'));
        }
        callback(null, `${name}_${new Date().getTime()}.${extension}`);
    }
});

const uploadItems = multer({ 
  storage: itemsStorage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 Mo max
}).single('img_url');
const uploadNews = multer({ storage: newsStorage }).single('img_url');
const uploadThreads = multer({ storage: threadsStorage }).single('img_url');

module.exports = { uploadItems, uploadNews, uploadThreads }; 