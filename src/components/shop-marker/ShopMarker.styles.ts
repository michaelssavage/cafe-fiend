import styled from "@emotion/styled";

export const ShopMarkerContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #666;
  padding: 2px;
  line-height: 1;
  z-index: 10001;

  &:hover {
    color: #000;
  }
`;

export const TitleContent = styled.div`
  font-weight: bold;
  font-size: 14px;
`;

export const ShopName = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
  white-space: normal; 
`;

export const ShopVicinity = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
  white-space: normal;
`;

export const ShopRating = styled.div`
  font-size: 12px;
  color: #333;
  margin-bottom: 5px;
`;

export const ShopStatus = styled.div`
  font-size: 12px;
  font-weight: bold;
  padding: 3px 6px;
  border-radius: 4px;

  &.open {
    background-color: #e8f5e8;
    color: #2d5a2d;
  }

  &.closed {
    background-color: #ffeaea;
    color: #8b0000;
  }
`;
