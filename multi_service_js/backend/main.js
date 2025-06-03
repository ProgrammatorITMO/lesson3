const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const swaggerSpec = require('./swagger');
const swaggerUi = require('swagger-ui-express');
const OpenApiValidator = require('express-openapi-validator');

const app = express();
const PORT = process.env.PORT;
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const CRUD_SERVICE_URL = `${process.env.CRUD_URL}:${process.env.CRUD_PORT}/files`;

// Создаем папку для загрузок, если нет
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  if (req.is('multipart/form-data')) {
    // пропускаем OpenAPI валидацию для multipart запросов
    return next();
  }
  // включаем OpenAPI валидацию для остальных запросов
  OpenApiValidator.middleware({
    apiSpec: swaggerSpec,
    validateRequests: true,
    validateResponses: true,
  })(req, res, next);
});

// Конфигурация multer для сохранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.use(express.json());

// Маршрут для загрузки изображения
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не загружен' });
  }

  const filePath = req.file.path;
  const fileName = req.file.originalname;

  try {
    const metadata = await sharp(filePath).metadata();
    const stats = fs.statSync(filePath);

    const fileInfo = {
      name: fileName,
      weight: stats.size, // размер в байтах
      width: metadata.width,
      height: metadata.height
    };

    // Отправляем данные на CRUD-сервис
    const response = await axios.post(CRUD_SERVICE_URL, fileInfo);

    res.status(201).json({
      message: 'Изображение обработано и данные отправлены',
      crudResponse: response.data
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при обработке изображения' });
  }
});

// Запуск сервиса
app.listen(PORT, () => {
  console.log(`Image сервис запущен на http://localhost:${PORT}`);
});
