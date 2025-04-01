import { createRouter } from "../../utils/create-router";

export const userRouter = createRouter();

userRouter.get("/me", (req, res) => {
  const user = req.user!;
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    googleId: user.googleId,
    isSubscribed: user.isSubscribed,
    hasConnections: user.hasConnections,
    planId: user.planId,
  });
});
