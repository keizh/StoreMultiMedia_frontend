import useSelectorHook from "../customHooks/useSelectorHook";
import AlertComp from "./AlertComp";
import { AlertType } from "../features/Alert/AlertSlice";

function AlertSystem() {
  //   const { alertArray } = useSelector((store: RootState) => store.Alert);
  const { alertArray } = useSelectorHook("Alert");

  return (
    <div className="fixed z-[99] pointer-events-none  left-0 top-[5px] h-full w-[100%] ">
      {alertArray.map((ele: AlertType, index: number) => (
        <AlertComp key={ele.alertId} ele={ele} index={index} />
      ))}
    </div>
  );
}

export default AlertSystem;
