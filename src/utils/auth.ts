import { jwtDecode, JwtPayload } from "jwt-decode";
import store from "../app/store";
interface customJwtPayload extends JwtPayload {
  name: string;
  email: string;
  userId: string;
  exp: number;
}
import { setUserLoginCredential } from "../features/userSignupSignin/userSSSlice";
import { addAlert } from "../features/Alert/AlertSlice";
import uniqid from "uniqid";

const tokenAuth = () => {
  const token = localStorage.getItem("token");
  console.log(`run`, token);
  if (token) {
    try {
      const {
        name,
        email,
        userId,
        exp,
      }: { name: string; email: string; userId: string; exp: number } =
        jwtDecode<customJwtPayload>(token);
      if (exp * 1000 > Date.now()) {
        store.dispatch(setUserLoginCredential({ name, email, userId }));
        return true;
      } else {
        localStorage.removeItem("token");
        store.dispatch(
          addAlert({
            message: "session expired",
            alertId: uniqid(),
            color: "red",
          })
        );
        return false;
      }
    } catch (err: unknown) {
      const mssg = err instanceof Error ? err.message : "";
      store.dispatch(
        addAlert({ message: mssg, alertId: uniqid(), color: "red" })
      );
      return false;
    }
  } else {
    return false;
  }
};

export default tokenAuth;
