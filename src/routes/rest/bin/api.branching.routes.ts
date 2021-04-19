import { Router } from "express";

import CategoryRouter from "../category.routes";
import UserRouter from "../user.routes";
import TransactionRouter from "../transaction.routes";

const router: Router = Router();

router.use("/users", UserRouter);
router.use("/categories", CategoryRouter);
router.use("/transactions", TransactionRouter);

export default router;
