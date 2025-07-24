import styled, { css } from 'styled-components';

const sizes = {
  small: css`
    font-size: 1.2rem;
    padding: 0.6rem 1.2rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
  `,
  medium: css`
    font-size: 1.6rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;
  `,
  large: css`
    font-size: 2rem;
    padding: 1.2rem 2.4rem;
    font-weight: 700;
  `,
};

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background: linear-gradient(135deg, #f97316, #ea580c);
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
    transition: all 0.3s ease-in-out;
    /* background-color: var(--color-brand-600); */

    &:hover {
      background: linear-gradient(135deg, #ea580c, #dc2626);
      box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4) !important;
      transform: translateY(-1px);
    }
  `,
  secondary: css`
    color: var(--color-grey-600);
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);
    transition: all 0.3s ease-in-out;

    &:hover {
      background-color: var(--color-grey-50);
      transform: translateY(-1px);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);
    transition: all 0.3s ease-in-out;

    &:hover {
      background-color: var(--color-red-800);
      transform: translateY(-1px);
    }
  `,
  link: css`
    color: var(--color-blue-700);
    background-color: transparent;
    text-transform: capitalize;
    font-size: 1.6rem;
    font-weight: 100;
    box-shadow: none;
    padding: 0;
    &:hover {
      text-decoration: underline;

      color: var(--color-blue-800);
    }
  `,
};

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'variartion' || prop !== 'size',
})`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);

  ${(props) => sizes[props.size]}
  ${(props) => variations[props.variation]}
`;

Button.defaultProps = {
  variation: 'primary',
  size: 'medium',
};

export default function Button({ ...props }) {
  return <StyledButton {...props} />;
}
