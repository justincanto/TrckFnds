import { createRouter } from "../../utils/create-router";
import passport from "../config/passport";

const authRouter = createRouter();

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login", "email"],
  })
);

/* Callback route for OAuth2 authentication */
authRouter.get(
  "/callback/google",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONT_URL!,
    successRedirect: process.env.FRONT_URL! + "/dashboard",
  }),
  function (req, res) {
    req.session.save();
  }
);

authRouter.post("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      res.clearCookie("connect.sid");
      res.send();
    });
  });
});

export default authRouter;
