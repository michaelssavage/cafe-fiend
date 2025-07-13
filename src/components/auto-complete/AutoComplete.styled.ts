import styled from "@emotion/styled";

export const Wrapper = styled.div`
  margin: 0.5rem 0.25rem;

  input[id="search-input"] {
    border-radius: 0.4rem;
    border: 1px solid #333333;

    &:focus {
      border-color: #646cff;
    }
  }
`;

export const SuggestionList = styled.ul`
  background-color: white;
  border: 1px solid #333333;
  list-style: none;
  padding: 0.5rem;
  border-radius: 0.4rem;
`;

export const SuggestionItem = styled.li`
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;
