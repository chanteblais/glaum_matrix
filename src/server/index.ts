import express, { Request, Response, Router, Express } from "express";
import router from "./router";
import { RequestHandler } from "express-serve-static-core";
import path from "path";

const app: Express = express();

// Configure app to use bodyParser for getting data from body of requests
app.use(express.urlencoded({ extended: true }) as RequestHandler);

app.use(express.json() as RequestHandler);

const port = process.env.NODE_ENV === "production" ? 3000 : 8050;

// Send index.html on root request (client)
app.use(express.static("dist"));
app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "../dist/index.html"));
});

// REGISTER ROUTES
const routes: Router[] = Object.values(router);
app.use("/api", routes);

// START THE SERVER
app.listen(port);
console.log(`App listening on ${port}`);
