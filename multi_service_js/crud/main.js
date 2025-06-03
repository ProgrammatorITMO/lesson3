const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const OpenApiValidator = require('express-openapi-validator');


const app = express();
const PORT = process.env.PORT;
const FILES_DIR = path.join(__dirname, 'files');


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(cors());

app.use(
  OpenApiValidator.middleware({
    apiSpec: swaggerSpec,
    validateRequests: true, 
    validateResponses: true,
  }),
);

if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR);
}

const getNextFileName = () => {
  const files = fs.readdirSync(FILES_DIR).filter(file => file.endsWith('.json'));
  return `${files.length + 1}.json`;
};

app.post('/files', (req, res) => {
  const fileName = getNextFileName();
  const filePath = path.join(FILES_DIR, fileName);
  const content = req.body;

  fs.writeFile(filePath, JSON.stringify(content, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка при создании файла' });
    }
    res.status(201).json({ message: 'Файл создан', fileName });
  });
});

// Маршрут для редактирования файла
app.put('/files/:fileName', (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(FILES_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Файл не найден' });
  }

  const newContent = req.body;

  fs.writeFile(filePath, JSON.stringify(newContent, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка при редактировании файла' });
    }
    res.json({ message: 'Файл обновлен' });
  });
});

// Маршрут для удаления файла
app.delete('/files/:fileName', (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(FILES_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Файл не найден' });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка при удалении файла' });
    }
    res.json({ message: 'Файл удален' });
  });
});

// Запуск сервиса
app.listen(PORT, () => {
  console.log(`Сервис запущен на http://localhost:${PORT}`);
});