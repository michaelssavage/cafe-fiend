import { FormEvent, ReactNode } from "react";
import { Flexbox } from "~/styles/global.styles";
import { Button } from "../button/Button";
import {
  Anchor,
  Container,
  Form,
  FormContainer,
  Input,
  Label,
  Title,
} from "./Auth.styled";

interface AuthI {
  actionText: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  status: "pending" | "idle" | "success" | "error";
  afterSubmit?: ReactNode;
}

export function Auth({ actionText, onSubmit, status, afterSubmit }: AuthI) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Container>
      <FormContainer>
        <Title>{actionText}</Title>
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
            text={status === "pending" ? "..." : actionText}
          />
          {afterSubmit ?? null}
        </Form>

        <Anchor to="/signup">No Account? Sign up</Anchor>
      </FormContainer>
    </Container>
  );
}
