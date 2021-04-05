import { NextFunction, Request, Response, Router } from "express";

import { messageWelcome } from "../../../config/message.config";
import { responseSuccess } from "../../../core/response/response.json";
import { apiLimiter } from "../../../middleware/limit/rate.limit";
import { randomNumberBothIncluded } from "../../../utils/math/function.math";
import V1 from "./api.branching.routes";

const router: Router = Router();

if (process.env.NODE_ENV === `production`) {
    router.use(apiLimiter);
}

router.use("/v1", V1);

router.all("/v1", (req: Request, res: Response) => {
    return responseSuccess(res, {
        message:
            messageWelcome[
                randomNumberBothIncluded(0, messageWelcome.length - 1)
            ],
    });
});

export default router;
