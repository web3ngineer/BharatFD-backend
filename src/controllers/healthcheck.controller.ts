import { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse";

const healthcheck = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json(new ApiResponse(200, {}, "Healthcheck is OK"));
};

export { healthcheck };
