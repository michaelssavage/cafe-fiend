import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FormEvent, MouseEvent } from "react";
import { Button } from "~/components/button/Button";
import {
  Anchor,
  Container,
  Form,
  FormContainer,
  Input,
  Label,
  Title,
} from "~/styles/Auth.styled";
import { Flexbox } from "~/styles/global.styles";
import { loginFn } from "../functions/login.fn";
import { signupFn } from "../functions/signup.fn";

export function Login() {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: loginFn,
    onSuccess: async (data) => {
      if (data && !data.error) {
        await router.invalidate();
        await router.navigate({ to: "/" });
      }
    },
  });

  const { mutate, status, data } = useMutation({
    mutationFn: useServerFn(signupFn),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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

    mutate({
      data: {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      },
    });
  };

  const afterSubmit = () => {
    if (!data) return null;

    return (
      <>
        <div>{data.message}</div>
        {data.error && data.message === "Invalid login credentials" ? (
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
    <Container>
      <FormContainer>
        <Title>Login</Title>
        <Form onSubmit={handleSubmit}>
          <Flexbox gap="0">
            <Label htmlFor="email">Username</Label>
            <Input type="email" name="email" id="email" />
          </Flexbox>
          <Flexbox gap="0">
            <Label htmlFor="password">Password</Label>
            <Input type="password" name="password" id="password" />
          </Flexbox>
          <Button
            type="submit"
            disabled={status === "pending"}
            text={status === "pending" ? "..." : "Login"}
          />
          {afterSubmit()}
        </Form>

        <Anchor to="/signup">No Account? Sign up</Anchor>
      </FormContainer>
    </Container>
  );
}
