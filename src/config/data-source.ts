import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User.js"; // Note: .js extension for NodeNext module resolution
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
