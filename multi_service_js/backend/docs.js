module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Image Processing API',
    version: '1.0.0',
    description: 'API для загрузки изображений, получения их параметров и отправки на CRUD-сервис',
  },
  servers: [
    {
      url: 'http://localhost:3011',
    },
  ],
  components: {
    schemas: {
      ImageInfo: {
        type: 'object',
        required: ['name', 'weight', 'width', 'height'],
        properties: {
          name: {
            type: 'string',
            description: 'Имя файла изображения',
          },
          weight: {
            type: 'integer',
            description: 'Размер изображения в байтах',
          },
          width: {
            type: 'integer',
            description: 'Ширина изображения в пикселях',
          },
          height: {
            type: 'integer',
            description: 'Высота изображения в пикселях',
          },
        },
        example: {
          name: 'example.jpg',
          weight: 204800,
          width: 1920,
          height: 1080,
        },
      },
    },
  },
  paths: {
    '/upload': {
      post: {
        summary: 'Загрузить изображение и отправить параметры в CRUD-сервис',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Файл изображения для загрузки',
                  },
                },
                required: ['image'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Изображение обработано и данные успешно отправлены в CRUD-сервис',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Изображение обработано и данные отправлены',
                    },
                    crudResponse: {
                      type: 'object',
                      properties: {
                        message: {
                          type: 'string',
                          example: 'Файл создан',
                        },
                        fileName: {
                          type: 'string',
                          example: '1.json',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Файл изображения не загружен',
            content: {
              'application/json': {
                example: {
                  error: 'Файл не загружен',
                },
              },
            },
          },
          500: {
            description: 'Ошибка при обработке изображения',
            content: {
              'application/json': {
                example: {
                  error: 'Ошибка при обработке изображения',
                },
              },
            },
          },
        },
      },
    },
  },
};
