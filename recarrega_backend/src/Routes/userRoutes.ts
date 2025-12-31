import UserController from "../Controllers/userController";
import auth from "../Middleware/auth";

const userRoutes = (app: any) => {
    // Auth protected routes
    app.get("/users/me", auth, UserController.getUserById);
    app.put("/users/me", auth, UserController.updateUser);
    app.delete("/users/me", auth, UserController.deleteUser);

    // Public routes
    app.post("/auth/register", UserController.createUser);
    app.post("/auth/login", UserController.loginUser);
}

export default userRoutes;