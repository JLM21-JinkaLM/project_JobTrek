import SVG from 'react-inlinesvg';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export const LogoName = styled.div`
  display: flex;
  align-items: center;
  color: white;
  gap: 1rem;
`;

export const Wrapper = styled.div`
  align-items: flex-start;
  display: inline-flex;
  font-size: 0;

  svg {
    height: 42px;
    max-height: 100%;
    width: auto;
  }
`;

export const LogoText = styled.span`
  font-size: 24px; /* Increase the font size here */
  font-weight: bold; /* Optional: add font weight for emphasis */
`;

function Logo() {
  return (
    <Link to="/private">
      <LogoName className="d-flex justify-content-center align-items-center">
        <Wrapper>
          <SVG src="/media/brand/icon.svg" />
        </Wrapper>
        <LogoText>JOB_TREK</LogoText>
      </LogoName>
    </Link>
  );
}

export default Logo;
