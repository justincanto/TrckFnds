import { Request } from "express";
import { User as AppUser } from "../db/schema";

declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}
