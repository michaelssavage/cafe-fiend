import styled from "@emotion/styled";

/* Custom marker styles */
export const ShopMarkerContainer = styled.div`
  position: relative;
  cursor: pointer;

  &.hovered .marker-pin {
    transform: scale(1.1);
    transition: transform 0.2s ease;
  }

  &.clicked .marker-pin {
    transform: scale(1.2);
    transition: transform 0.2s ease;
  }
`;

export const CustomPin = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;


/* Title popup on click */
export const TitlePopup = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 200px;
  text-align: center;
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

  &:hover {
    color: #000;
  }
`;

export const TitleContent = styled.div`
  font-weight: bold;
  font-size: 14px;
  margin-top: 15px;
`;

export const ShopName = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
`;

export const ShopVicinity = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
`;

export const ShopRating = styled.div`
  font-size: 12px;
  color: #333;
  margin-bottom: 5px;
`;

export const ShopStatus = styled.div`
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
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

/* Image popup on hover */
export const ImagePopup = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  background: white;
  border: 1px solid #ccc;
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);

  img {
    max-width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

/* Tip/arrow for popups */
export const Tip = styled.div`
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid white;
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
`;