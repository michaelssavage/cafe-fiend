import styled from "@emotion/styled";

interface ButtonI { 
  disabled: boolean;
}

export const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;

  @media (prefers-color-scheme: dark) {
    background-color: black;
  }
`;

export const FormContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    background-color: #111827;
  }
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
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.75rem;
`;

export const Input = styled.input`
  padding: 0.25rem 0.5rem;
  width: 100%;
  border-radius: 0.25rem;
  border: 1px solid rgba(107, 114, 128, 0.2);
  background-color: white;

  @media (prefers-color-scheme: dark) {
    background-color: #1f2937;
  }
`;


export const Button =
  styled.button<ButtonI>`
  width: 100%;
  background-color: #0891b2;
  color: white;
  border-radius: 0.25rem;
  padding: 0.5rem 0;
  font-weight: 900;
  text-transform: uppercase;
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;
