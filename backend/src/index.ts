import bodyParser from "body-parser"
import express from "express"
import http from "http"
import { errorHandlerMiddleware } from "./middleware/errorHandler"
import { requestLoggerMiddleware } from "./middleware/requestLogger"
import { createRecipeMiddleware, recipeMiddleware, searchMiddleware } from "./routes"

const appStartup = async (): Promise<void> => {
  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(errorHandlerMiddleware)
  app.use(requestLoggerMiddleware)

  // ecs health checks
  app.get("/health", (_, res) => res.send("OK"))
  app.get("/api/health", (_, res) => res.send("OK"))

  // create our routes
  app.post("/api/search", searchMiddleware)
  app.post("/api/recipe", createRecipeMiddleware)
  app.get("/api/recipe/:id", recipeMiddleware)
  // create a server
  const httpServer = new http.Server(app)
  httpServer.listen(4000, "0.0.0.0", () => {
    console.log("now running on 4000")
  })
}

appStartup()
