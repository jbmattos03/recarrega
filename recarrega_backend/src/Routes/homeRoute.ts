import { Request, Response } from "express";

const homeRoute = (app: any) => {
    app.get("/", (req: Request, res: Response) => { return res.status(200).json({ message: "Recarrega API is running" }); });
}

export default homeRoute;