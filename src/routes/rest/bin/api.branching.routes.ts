import { Router } from "express";

import CategoryRouter from "../category.routes";
import UserRouter from "../user.routes";

const router: Router = Router();

router.use("/users", UserRouter);
router.use("/categories", CategoryRouter);

export default router;
