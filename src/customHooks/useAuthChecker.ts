import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import tokenAuth from "../utils/auth";

function useAuthChecker(
  loginPageURL: string = "",
  destinationURL: string | null
): void {
  const navigate = useNavigate();
  useEffect(() => {
    const token = tokenAuth();
    // if token is true AND
    // if destination is specified move to destination
    // if destination is not specified stay over that page
    // if token is false move to next page
    if (token && destinationURL) {
      navigate(destinationURL, { replace: true });
      //   console.log("/user/photos");
    } else if (!token) {
      navigate(loginPageURL, { replace: true });
      //   console.log("/user/login");
    }
  }, [destinationURL, loginPageURL, navigate]);
}

export default useAuthChecker;
