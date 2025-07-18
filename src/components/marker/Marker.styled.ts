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

export const Anchor = styled.a`
  font-size: 12px;
`;

export const ShopVicinity = styled.div`
  font-size: 12px;
  color: #666;
  white-space: normal;
`;

export const ShopRating = styled.div`
  font-size: 12px;
  color: #333;
`;

export const ShopStatus = styled.div<{ $isOpen: boolean }>`
  font-size: 12px;
  font-weight: bold;
  padding: 3px 6px;
  border-radius: 4px;

  background-color: ${({ $isOpen }) => ($isOpen ? "#e8f5e8" : "#ffeaea")};
  color: ${({ $isOpen }) => ($isOpen ? "#2d5a2d" : "#8b0000")};
`;
