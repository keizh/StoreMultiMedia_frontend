import { useState, useEffect, ReactElement } from "react";
import { Input, Button, Typography, Alert } from "@material-tailwind/react";
// import { postCreateNewUser } from "../features/userSignupSignin/userSSSlice";
// import useDispatchHook from "../customHooks/useDispatchHook";
import { z } from "zod";
import { NavLink, useNavigate } from "react-router-dom";
import tokenAuth from "../utils/auth";

function IconSolid(): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .trim()
    .min(7, { message: "Must be 8 or more characters long" })
    .max(25, { message: "Must be 25 or fewer characters long" })
    .refine((val) => /[a-z]/.test(val), {
      message: "Must include at least one lowercase letter",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Must include at least one Uppercase letter",
    })
    .refine((val) => /[1-9]/.test(val), {
      message: "Must include at least one number",
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: "Must include at least one special character",
    }),
});

interface signupCredentialsInterface {
  name: string;
  email: string;
  password: string;
}

interface errorInterface {
  email: string[];
  password: string[];
}

export function SignUp() {
  const navigate = useNavigate();
  // const dispatch = useDispatchHook();
  const initialData: signupCredentialsInterface = {
    name: "",
    email: "",
    password: "",
  };
  const initialError: errorInterface = {
    email: [],
    password: [],
  };

  const [data, setData] = useState<signupCredentialsInterface>(initialData);
  const [error, setError] = useState<errorInterface>(initialError);
  const [canClick, setCanClick] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value }: { name: string; value: string } = e.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(initialError);
    const result = UserSchema.safeParse(data);
    setLoadingState(true);
    console.log(result);
    if (result.success) {
      // dispatch(postCreateNewUser(data));
      setTimeout(() => {
        navigate("/user/login");
      }, 3500);
    } else {
      result.error.issues.forEach((err) => {
        console.log(err);
        setError((error) => ({
          ...error,
          [err.path[0]]: [err.message, ...error[err.path[0]]],
        }));
      });
    }
  };

  useEffect(() => {
    if (data.name != "" && data.email != "" && data.password != "") {
      setCanClick(true);
    } else {
      setCanClick(false);
    }
  }, [data]);

  useEffect(() => {
    const asyncFn = async () => {
      const ans = tokenAuth();
      if (ans) {
        navigate("/user/auth/photos", { replace: true });
        console.log(`valid token`);
      }
    };
    asyncFn();
  }, [navigate]);

  return (
    <div className="min-h-[100vh] overflow-y-auto overflow-x-hidden w-full flex justify-center items-center">
      <div className="max-w-[90%] sm:w-[400px]">
        <Typography className="text-center" variant="h4" color="blue-gray">
          KoviasPix
        </Typography>
        <Typography color="gray" className="text-center mt-1 font-normal">
          Welcome to KoviasPix. Enter your details to register.
        </Typography>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (canClick) {
              submitHandler(e);
            }
          }}
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Name
            </Typography>
            <Input
              crossOrigin={undefined}
              disabled
              name="name"
              onChange={handleChange}
              size="lg"
              placeholder="Hrithik"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Email
            </Typography>
            <Input
              crossOrigin={undefined}
              disabled
              name="email"
              onChange={handleChange}
              size="lg"
              placeholder="HrithikRoshan@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {error.email.length > 0 && (
              <div className="flex flex-col gap-1">
                {error.email?.map((ele, index) => (
                  <Typography
                    key={index}
                    variant="lead"
                    className="-mb-2 text-center"
                    color="red"
                  >
                    {ele}
                  </Typography>
                ))}
              </div>
            )}
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>

            <Input
              crossOrigin={undefined}
              disabled
              name="password"
              onChange={handleChange}
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          {error.password?.length > 0 && (
            <div className="my-4 flex flex-col gap-1">
              {error.password?.map((ele, index) => (
                <Typography
                  key={index}
                  variant="lead"
                  color="blue-gray"
                  className="-mb-2 text-center"
                >
                  {ele}
                </Typography>
              ))}
            </div>
          )}
          <Alert className="mt-5" variant="outlined" icon={<IconSolid />}>
            <Typography className="font-medium">
              Ensure that these requirements are met:
            </Typography>
            <ul className="mt-2 ml-2 list-inside list-disc">
              <li>At least 8 Character </li>
              <li>At Max 25 Character </li>
              <li>At least one lowercase character</li>
              <li>At least one uppercase character</li>
              <li>At least one digit character</li>
              <li>
                Inclusion of at least one special character, e.g., ! @ # ?
              </li>
            </ul>
          </Alert>
          <Button
            disabled
            loading={loadingState}
            type="submit"
            color={canClick ? "green" : "red"}
            className="mt-6 flex justify-center items-center gap-2"
            fullWidth
          >
            sign up
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <NavLink to="/user/login" className="font-medium text-gray-900">
              Sign In
            </NavLink>
          </Typography>
          <div className="flex my-4 items-center gap-2">
            <div className="border h-[0px] flex-auto border-black"></div>
            <Typography className="font-bold">OR</Typography>
            <div className="border h-[0px] flex-auto border-black"></div>
          </div>
          <Button
            size="lg"
            variant="outlined"
            color="blue-gray"
            className="flex justify-center items-center gap-3"
            fullWidth
            onClick={() =>
              (window.location.href = `${
                import.meta.env.VITE_BACKEND_URI
              }/api/v1/auth/google/oauth`)
            }
          >
            {/* /api/v1/ */}
            <img
              src="https://docs.material-tailwind.com/icons/google.svg"
              alt="metamask"
              className="h-6 w-6"
            />
            Continue with Google
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
