import express from "express";
import cors from "cors";
import passport from "passport";
import { jwtStrategy } from "./config/passport";
import authRouter from "./routes/auth.route";
import adminUserRouter from "./routes/admin.user.route";
import { validateClientKey } from "./middlewares/clientAuth.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import categoryRouter from "./routes/category.route";
import adminCategoryRouter from "./routes/admin.category.route";
import productRouter from "./routes/product.route";
import { generateOpenApiDocs } from "./config/openApi";
import { apiReference } from "@scalar/express-api-reference";
import userRouter from "./routes/user.route";
import uploadRoute from "./routes/upload.route";
import adminProductRoute from "./routes/admin.product.route";

const app = express();
const PORT = process.env.PORT || 4101;
const API_DOCS_ROUTE = process.env.API_DOCS_ROUTE || "/api-docs";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
passport.use(jwtStrategy);

const openApiDocument = generateOpenApiDocs();

app.use(
    "/api-docs",
    apiReference({
        spec: { content: openApiDocument },
        theme: "purple",
    }),
);

app.use(validateClientKey);

app.use("/api/uploads", uploadRoute);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/admin/user", adminUserRouter);
app.use("/api/admin/category", adminCategoryRouter);
app.use("/api/admin/product", adminProductRoute);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
    console.log(`📄 Swagger Docs available at http://localhost:${PORT}/${API_DOCS_ROUTE}`);
});
