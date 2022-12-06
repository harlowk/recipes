import { NextFunction, Request, Response } from "express";

export const errorHandlerMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        next();
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Internal Server Error",
            error: err
        });
    }
}