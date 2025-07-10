import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FormEvent, MouseEvent } from "react";
import { loginFn } from "../functions/login.function";
import { signupFn } from "../functions/signup.function";
import { Auth } from "./auth/Auth";

export function Login() {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: loginFn,
    onSuccess: async (data) => {
      console.log("!!!login", data);
      if (data && !data.error) {
        await router.invalidate();
        await router.navigate({ to: "/" });
      }
    },
  });

  const signupMutation = useMutation({
    mutationFn: useServerFn(signupFn),
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.target as HTMLFormElement);

    loginMutation.mutate({
      data: {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      },
    });
  };

  const signUpButton = (e: MouseEvent<HTMLButtonElement>) => {
    const formData = new FormData((e.target as HTMLButtonElement).form!);

    signupMutation.mutate({
      data: {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      },
    });
  };

  const afterSubmit = () => {
    if (!loginMutation.data) {
      return null;
    }

    const { message, error } = loginMutation.data;

    return (
      <>
        <div>{message}</div>
        {error && message === "Invalid login credentials" ? (
          <div>
            <button onClick={signUpButton} type="button">
              Sign up instead?
            </button>
          </div>
        ) : null}
      </>
    );
  };

  return (
    <Auth
      actionText="Login"
      status={loginMutation.status}
      onSubmit={onSubmit}
      afterSubmit={afterSubmit()}
    />
  );
}
