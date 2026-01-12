import "dotenv/config";
import app from "./app.js";
import "reflect-metadata";
import { AppDataSource } from "./config/data-source.js";
const PORT = process.env.PORT || 5000;
AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error("Error during Data Source initialization", err);
});
