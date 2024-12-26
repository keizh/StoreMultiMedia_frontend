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

// POINT_1 ==> RESPONSIBLE FOR CHECKING IF TOKEN IS EXPIRED OR NOT
// POINT_2 ==> IF TOKEN IS EXPIRED RETURN FALSE
// POINT_3 ==> IF TOKEN IS NOT EXPRED RETURN TRUE
// POINT_4 ==> IF TOKEN IS ABSENT SEND FALSE
const tokenAuth = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const {
        email,
        userId,
        exp,
      }: { email: string; userId: string; exp: number } =
        jwtDecode<customJwtPayload>(token);
      if (exp * 1000 > Date.now()) {
        store.dispatch(setUserLoginCredential({ email, userId }));
        //  POINT_3
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
        //  POINT_4
        return false;
      }
    } catch (err: unknown) {
      const mssg = err instanceof Error ? err.message : "";
      store.dispatch(
        addAlert({ message: mssg, alertId: uniqid(), color: "red" })
      );
      localStorage.removeItem("token");
      //  ERROR RETURN FALSE
      return false;
    }
  } else {
    // POINT_4
    return false;
  }
};

export default tokenAuth;
