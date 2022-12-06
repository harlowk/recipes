import bodyParser from "body-parser"
import express from "express"
import http from "http"
import { recipeMiddleware, searchMiddleware } from "./routes"

const appStartup = async (): Promise<void> => {
  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  // create our routes
  app.get("/health", (req, res) => res.send("OK"))
  app.get("/api/health", (req, res) => res.send("OK"))
  app.get("/api/test", (req, res) => res.send({ message: "Hello World" }))
  app.post("/api/search", searchMiddleware)
  app.get("/api/recipe/:id", recipeMiddleware)
  // create a server
  const httpServer = new http.Server(app)
  httpServer.listen(4000, "0.0.0.0", () => {
    console.log("now running on 4000")
  })
}

appStartup()
