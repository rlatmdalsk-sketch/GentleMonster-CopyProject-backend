import express from "express";
import cors from "cors";
import passport from "passport";
import { jwtStrategy } from "./config/passport";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./config/swagger";
import authRouter from "./routes/auth.route";
import adminUserRouter from "./routes/admin.user.route";
import { validateClientKey } from "./middlewares/clientAuth.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import categoryRouter from "./routes/category.route";
import adminCategoryRouter from "./routes/admin.category.route";
import productRouter from "./routes/product.route";

const app = express();
const PORT = process.env.PORT || 4101;
const API_DOCS_ROUTE = process.env.API_DOCS_ROUTE || "/api-docs";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
passport.use(jwtStrategy);

app.use(`/${API_DOCS_ROUTE}`, swaggerUi.serve, swaggerUi.setup(swaggerOptions));

app.use(validateClientKey);
app.use("/api/auth", authRouter);
app.use("/api/admin/user", adminUserRouter);
app.use("/api/admin/category", adminCategoryRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
    console.log(`📄 Swagger Docs available at http://localhost:${PORT}/${API_DOCS_ROUTE}`);
});
