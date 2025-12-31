import TSController from "../Controllers/TSController";
import TSToUserController from "../Controllers/TSToUserController";
import auth from "../Middleware/auth";

const TSRoutes = (app: any) => {
    // Auth protected routes
    // TS routes
    app.get("/ts", auth, TSController.getTSByNameCityAndFare);
    app.post("/ts", auth, TSController.createTS);
    app.get("/ts/all", auth, TSController.getAllTS);
    app.put("/ts/:TSId", auth, TSController.updateTS);
    app.delete("/ts/:TSId", auth, TSController.deleteTS);

    // User related routes
    app.post("/ts/user", auth, TSToUserController.createTSToUser);
    app.get("/ts/user/all", auth, TSToUserController.getAllTSByUser);
    app.get("/ts/user/:TSId", auth, TSToUserController.getTSUByUserIdAndTSId);
    app.put("/ts/user/:TSId", auth, TSToUserController.updateTSToUser);
    app.delete("/ts/user/:TSId", auth, TSToUserController.deleteTSToUser);

}

export default TSRoutes;