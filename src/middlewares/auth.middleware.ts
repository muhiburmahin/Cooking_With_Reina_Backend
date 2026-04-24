/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth"; 
import catchAsync from "../shared/catchAsync";
import AppError from "../errors/ApiError";


const authMiddleware = (...roles: string[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session || !session.user) {
            throw new AppError(
                httpStatus.UNAUTHORIZED, 
                "You are not authorized! Please login first."
            );
        }

        const user = session.user as any;

        if (roles.length && !roles.includes(user.role)) {
            throw new AppError(
                httpStatus.FORBIDDEN, 
                "You do not have permission to access this resource!"
            );
        }

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        next();
    });
};

export default authMiddleware;