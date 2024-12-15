import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import tokenAuth from "../utils/auth";

function Home() {
  /* THE BELOW CODE WAS EXPECTED TO RUN , WHEN I HARD REFRESH THE PAGE , BUT IT DIDN'T ROUTE MY NAVIGATION BACK TO /USER/LOGIN */
  // const navigate = useNavigate();
  // useEffect(() => {
  //   const ans = tokenAuth();
  //   if (!ans) {
  //     navigate("/user/login", { replace: true });
  //     console.log("move");
  //   }
  // }, [navigate]);
  return <div>welcome back</div>;
}

export default Home;
