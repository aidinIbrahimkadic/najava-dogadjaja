import styled from 'styled-components';
import { Input } from 'antd';
export const StyledPasswordInput = styled(Input.Password)`
  &.ant-input-affix-wrapper {
    border: 1px solid var(--color-grey-300);
    background-color: var(--color-grey-0);
    border-radius: var(--border-radius-sm);
    padding: 0.8rem 1.2rem;
    box-shadow: none;
    transition: all 0.3s;
    height: auto;

    &:hover {
      border-color: var(--color-brand-500);
    }

    &:focus,
    &.ant-input-affix-wrapper-focused {
      border-color: var(--color-brand-500);
      box-shadow: none;
    }

    .ant-input {
      background: transparent;
      border: none;
      padding: 0;
      height: auto;

      &:focus {
        box-shadow: none;
      }
    }

    .ant-input-prefix {
      margin-right: 8px;
    }
  }
`;
