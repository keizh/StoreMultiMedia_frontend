import { useEffect, ReactElement } from "react";
import { Alert } from "@material-tailwind/react";
import { AlertType, removeAlert } from "../features/Alert/AlertSlice";
import useDispatchHook from "../customHooks/useDispatchHook";
import { useNavigate } from "react-router-dom";

function Icon(): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  );
}

function AlertComp(props: { ele: AlertType; index: number }) {
  const dispatch = useDispatchHook();
  const navigate = useNavigate();
  useEffect(() => {
    const jwtRegex = /jwt/gi;
    const msg = props.ele.message;
    let timer: ReturnType<typeof setTimeout>;
    if (msg.match(jwtRegex)) {
      navigate("/user/login");
    } else {
      timer = setTimeout(() => {
        dispatch(removeAlert({ id: props.ele.alertId }));
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <Alert
      className={`pointer-events-auto max-w-fit mx-2  absolute  ${
        props.ele.color == "red" ? "bg-red-500" : "bg-green-500"
      }`}
      style={{ top: 70 * props.index }}
      onClose={() => {
        dispatch(removeAlert({ id: props.ele.alertId }));
      }}
      icon={<Icon />}
    >
      <span className="text-wrap"> {props.ele.message}</span>
    </Alert>
  );
}

export default AlertComp;
