import styled from "@emotion/styled";
import { Link } from "@tanstack/react-router";

export const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #ffffff;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
`;

export const FormContainer = styled.div`
  background-color: #b6caf3;
  margin: 2rem auto;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.75rem;
`;

export const Input = styled.input`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid rgba(107, 114, 128, 0.2);
  background-color: white;
`;

export const Error = styled.p`
  color: red;
  font-size: 0.7rem;
`;

export const Anchor = styled(Link)`
  font-size: 0.875rem;
  color: #3c4149;

  &:hover {
    color: #1f2937;
  }
`;
