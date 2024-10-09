import { Options } from "swagger-jsdoc";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Jongrhanrhao API",
      version: "1.0.0",
      description: "API documentation for Jongrhanrhao Project",
    },
  },
  apis: ["./src/docs/*.ts"],
};

export default swaggerOptions;
