import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/errorHandler.js";
import UserModel from "../src/user/models/user.schema.js";

export const auth = async (req, res, next) => {
  try {
    const { token: cookieToken } = req.cookies;
    const headerToken = req.headers.authorization?.split(" ")[1];
    const token = cookieToken || headerToken;

    if (!token) {
      return next(new ErrorHandler(401, "Login to access this route!"));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedData || !decodedData.id) {
      return next(new ErrorHandler(401, "Invalid token. Please login again."));
    }

    const user = await UserModel.findById(decodedData.id);
    if (!user) {
      return next(new ErrorHandler(404, "User not found."));
    }
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return next(
      new ErrorHandler(401, "Authentication failed. Please login again.")
    );
  }
};

export const authByUserRole = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          403,
          `Role: ${req.user.role} is not allowed to access this resource`
        )
      );
    }
    next();
  };
};
