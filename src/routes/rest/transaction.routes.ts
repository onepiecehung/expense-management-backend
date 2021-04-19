import { Router } from "express";

import * as TransactionController from "../../controllers/transaction.controller";
import { Authentication } from "../../middleware/jwt/auth.jwt.middleware";
import {
    TransactionIDValidator,
    TransactionValidator,
    UpdateTransactionValidator,
} from "../../validator/transaction.validation";

const router: Router = Router();

router
    .route("/create")
    .post(TransactionValidator, Authentication, TransactionController.create);

router.route("/remove/:id").put(TransactionIDValidator, Authentication);

router
    .route("/update/:id")
    .put(
        UpdateTransactionValidator,
        Authentication,
        TransactionController.updateOne
    );

router
    .route("/:id")
    .get(TransactionIDValidator, Authentication, TransactionController.findOne);

router.route("/:time").get(Authentication);

export default router;
