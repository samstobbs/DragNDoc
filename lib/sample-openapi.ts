export const sampleOpenAPI = {
  openapi: "3.0.0",
  info: {
    title: "Sample API",
    description: "A sample API to demonstrate OpenAPI documentation",
    version: "1.0.0",
  },
  servers: [
    {
      url: "https://api.example.com/v1",
      description: "Production server",
    },
    {
      url: "https://staging-api.example.com/v1",
      description: "Staging server",
    },
  ],
  paths: {
    "/users": {
      get: {
        summary: "List all users",
        description: "Returns a list of users",
        operationId: "listUsers",
        tags: ["users"],
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Maximum number of users to return",
            required: false,
            schema: {
              type: "integer",
              format: "int32",
              default: 20,
            },
          },
          {
            name: "offset",
            in: "query",
            description: "Number of users to skip",
            required: false,
            schema: {
              type: "integer",
              format: "int32",
              default: 0,
            },
          },
        ],
        responses: {
          "200": {
            description: "A list of users",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/User",
                  },
                },
                example: [
                  {
                    id: 1,
                    name: "John Doe",
                    email: "john@example.com",
                    createdAt: "2023-01-01T00:00:00Z",
                  },
                  {
                    id: 2,
                    name: "Jane Smith",
                    email: "jane@example.com",
                    createdAt: "2023-01-02T00:00:00Z",
                  },
                ],
              },
            },
          },
          "400": {
            description: "Invalid parameters",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a user",
        description: "Creates a new user",
        operationId: "createUser",
        tags: ["users"],
        requestBody: {
          description: "User to create",
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewUser",
              },
              example: {
                name: "John Doe",
                email: "john@example.com",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          "400": {
            description: "Invalid input",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/users/{id}": {
      get: {
        summary: "Get a user",
        description: "Returns a user by ID",
        operationId: "getUser",
        tags: ["users"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User ID",
            required: true,
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        responses: {
          "200": {
            description: "A user",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      put: {
        summary: "Update a user",
        description: "Updates a user by ID",
        operationId: "updateUser",
        tags: ["users"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User ID",
            required: true,
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        requestBody: {
          description: "User to update",
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewUser",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User updated",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete a user",
        description: "Deletes a user by ID",
        operationId: "deleteUser",
        tags: ["users"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User ID",
            required: true,
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        responses: {
          "204": {
            description: "User deleted",
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/products": {
      get: {
        summary: "List all products",
        description: "Returns a list of products",
        operationId: "listProducts",
        tags: ["products"],
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Maximum number of products to return",
            required: false,
            schema: {
              type: "integer",
              format: "int32",
              default: 20,
            },
          },
          {
            name: "offset",
            in: "query",
            description: "Number of products to skip",
            required: false,
            schema: {
              type: "integer",
              format: "int32",
              default: 0,
            },
          },
        ],
        responses: {
          "200": {
            description: "A list of products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Product",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            format: "int64",
            description: "User ID",
          },
          name: {
            type: "string",
            description: "User name",
          },
          email: {
            type: "string",
            format: "email",
            description: "User email",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Creation timestamp",
          },
        },
        required: ["id", "name", "email", "createdAt"],
      },
      NewUser: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "User name",
          },
          email: {
            type: "string",
            format: "email",
            description: "User email",
          },
        },
        required: ["name", "email"],
      },
      Product: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            format: "int64",
            description: "Product ID",
          },
          name: {
            type: "string",
            description: "Product name",
          },
          price: {
            type: "number",
            format: "float",
            description: "Product price",
          },
          category: {
            type: "string",
            description: "Product category",
          },
        },
        required: ["id", "name", "price"],
      },
      Error: {
        type: "object",
        properties: {
          code: {
            type: "integer",
            format: "int32",
          },
          message: {
            type: "string",
          },
        },
        required: ["code", "message"],
      },
    },
  },
}

// Add the missing export
export const sampleOpenAPISpec = sampleOpenAPI
