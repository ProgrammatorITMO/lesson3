module.exports = {
    openapi: '3.0.0',
    info: {
      title: 'File Management API',
      version: '1.0.0',
      description: 'API для создания, редактирования и удаления JSON-файлов на сервере',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      schemas: {
        FileContent: {
          type: 'object',
          description: 'Произвольный JSON-объект',
          example: {
            name: "Пример файла",
            version: 1,
            data: {
              message: "Привет, мир!",
              tags: ["fastapi", "json", "файлы"],
            },
          },
        },
      },
    },
    paths: {
      '/files': {
        post: {
          summary: 'Создать новый JSON-файл',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FileContent',
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Файл успешно создан',
              content: {
                'application/json': {
                  schema: {
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
            500: {
              description: 'Ошибка при создании файла',
              content: {
                'application/json': {
                  example: {
                    error: 'Ошибка при создании файла',
                  },
                },
              },
            },
          },
        },
      },
      '/files/{fileName}': {
        put: {
          summary: 'Редактировать существующий JSON-файл',
          parameters: [
            {
              name: 'fileName',
              in: 'path',
              required: true,
              description: 'Имя файла для редактирования (например, 1.json)',
              schema: {
                type: 'string',
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FileContent',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Файл обновлен',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Файл обновлен',
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: 'Файл не найден',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Файл не найден',
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: 'Ошибка при редактировании файла',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Ошибка при редактировании файла',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        delete: {
          summary: 'Удалить существующий JSON-файл',
          parameters: [
            {
              name: 'fileName',
              in: 'path',
              required: true,
              description: 'Имя файла для удаления (например, 1.json)',
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description: 'Файл удален',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Файл удален',
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: 'Файл не найден',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Файл не найден',
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: 'Ошибка при удалении файла',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Ошибка при удалении файла',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  