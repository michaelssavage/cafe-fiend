import { FormEvent, ReactNode } from "react";
import {
  Button,
  Container,
  Form,
  FormContainer,
  Input,
  InputGroup,
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
  return (
    <Container>
      <FormContainer>
        <Title>{actionText}</Title>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(e);
          }}
        >
          <InputGroup>
            <Label htmlFor="email">Username</Label>
            <Input type="email" name="email" id="email" />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input type="password" name="password" id="password" />
          </InputGroup>
          <Button type="submit" disabled={status === "pending"}>
            {status === "pending" ? "..." : actionText}
          </Button>
          {afterSubmit ?? null}
        </Form>
      </FormContainer>
    </Container>
  );
}
