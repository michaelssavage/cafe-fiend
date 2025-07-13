import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FormEvent } from "react";
import {
  Anchor,
  Container,
  Error,
  Form,
  FormContainer,
  Input,
  Label,
  Title,
} from "~/components/auth/Auth.styled";
import { Button } from "~/components/button/Button";
import { signupFn } from "~/functions/signup.fn";
import { Flexbox } from "~/styles/global.styles";

export const Route = createFileRoute("/signup")({
  component: SignupComp,
});

function SignupComp() {
  const { mutate, status, data } = useMutation({
    mutationFn: useServerFn(signupFn),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.target as HTMLFormElement);

    mutate({
      data: {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      },
    });
  };

  return (
    <Container>
      <FormContainer>
        <Title>Sign Up</Title>
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
            text={status === "pending" ? "..." : "Sign up"}
          />
          {data?.error ? <Error>{data.message}</Error> : null}
        </Form>

        <Anchor to="/login">Have an Account? Login</Anchor>
      </FormContainer>
    </Container>
  );
}
