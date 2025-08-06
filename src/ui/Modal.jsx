import { cloneElement, createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';
import styled from 'styled-components';
import { useOutsideClick } from '../hooks/useOutsideClick';

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  overflow: hidden;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  transition: all 0.5s;

  width: ${(props) =>
    props.size == 'small'
      ? '30%'
      : props.size == 'medium'
        ? '40%'
        : props.size == 'extraLarge'
          ? '70%'
          : '55%'};
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color-modal);
  backdrop-filter: blur(2px);
  z-index: 1000;
  transition: all 0.5s;
`;

const ModalHeader = styled.div`
  height: 6rem;
  display: flex;
  align-items: center;
  padding: 0 4rem;
  background-color: var(--color-grey-200);
  border-bottom: 1px solid var(--color-grey-300);
`;

const ModalHeading = styled.h2`
  font-size: 2.4rem;
  font-weight: 500;
`;

const ModalContent = styled.div`
  padding: ${(props) =>
    props.size === 'large' ? '3.2rem 4rem 3.2rem 46px' : '2.4rem 3rem 2.4rem 36px'};
  max-height: 80dvh;
  scrollbar-gutter: stable;
  overflow-y: auto;

  display: flex;
  justify-content: center;
  width: 100%;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-top-right-radius: var(--border-radius-lg);
    border-bottom-right-radius: var(--border-radius-lg);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-grey-300);
    border-radius: 20px;
    border: 3px solid var(--color-grey-0);
  }
`;

const ModalContentDiv = styled.div`
  width: 100%;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;

    color: var(--color-grey-900);
  }
`;

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState('');

  const close = () => setOpenName('');
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>{children}</ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name, size }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <Overlay>
      <StyledModal size={size} ref={ref}>
        <ModalHeader>
          <ModalHeading>{name}</ModalHeading>
          <Button onClick={close}>
            <HiXMark />
          </Button>
        </ModalHeader>
        <ModalContent size={size}>
          <ModalContentDiv>{cloneElement(children, { onCloseModal: close })}</ModalContentDiv>
        </ModalContent>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
