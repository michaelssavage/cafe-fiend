import styled from "@emotion/styled";

export const SlideWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  border: 1px solid hsl(0, 0%, 80%);
  border-radius: 4px;
  height: 30px;
  padding: 0 4px;

  .slider-root {
    position: relative;
    display: flex;
    align-items: center;
    user-select: none;
    touch-action: none;
    width: 100px;
    height: 20px;
  }

  .slider-track {
    background-color: #1e1e1e;
    position: relative;
    flex-grow: 1;
    border-radius: 9999px;
    height: 3px;
  }

  .slider-range {
    position: absolute;
    background-color: #1e1e1e;
    border-radius: 9999px;
    height: 100%;
  }

  .slider-thumb {
    display: block;
    width: 20px;
    height: 20px;
    background-color: #646cff;
    box-shadow: 0 2px 10px #1e1e1e;
    border-radius: 10px;
    cursor: grab;

    &:hover {
      background-color: #353fff;
    }

    &:focus {
      outline: none;
    }
  }
`;
