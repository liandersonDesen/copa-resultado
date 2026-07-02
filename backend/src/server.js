import express from "express";
import cors from "cors";
import selecoesRouter from "./routes/selecoes.js";
import partidasRouter from "./routes/partidas.js";
import artilhariaRouter from "./routes/artilharia.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
    
const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json", "utf8"));

const app = express();
app.use(cors());
app.use(express.json());

app.use("/selecoes", selecoesRouter);
app.use("/partidas", partidasRouter);
app.use("/artilharia", artilhariaRouter);


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.json({ status: "ok", mensagem: "Central de Resultados API" });
});

app.listen(3333, () => console.log("Servidor em http://localhost:3333"));