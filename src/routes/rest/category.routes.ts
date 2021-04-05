import { Router } from "express";

import * as CategoryController from "../../controllers/category.controller";
import { Authentication } from "../../middleware/jwt/auth.jwt.middleware";
import {
    CategoryValidator,
    CategoryIDValidator,
    UpdateCategoryValidator,
} from "../../validator/category.validation";
const router: Router = Router();

router
    .route("/")
    .post(CategoryValidator, Authentication, CategoryController.create);

router
    .route("/:id")
    .get(CategoryIDValidator, Authentication, CategoryController.findOne);

router
    .route("/:id")
    .put(UpdateCategoryValidator, Authentication, CategoryController.updateOne);

export default router;
