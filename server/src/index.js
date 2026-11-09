import express from "express";
import cors from "cors";
import policiesRouter from "./routes/policies.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "selector-de-poliza" });
});

app.use("/api/policies", policiesRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});