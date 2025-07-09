// import styled from 'styled-components';

// const StyledSelect = styled.select`
//   padding: 0.8rem 1.2rem;
//   border: 1px solid var(--color-grey-300);
//   border-radius: 5px;
//   background-color: var(--color-grey-0);
//   width: 100%;
//   box-sizing: border-box;
//   font-size: 1.4rem;

//   &:focus,
//   &:hover {
//     outline: none;
//     border-color: var(--color-brand-500);
//   }

//   &:disabled {
//     background-color: var(--color-grey-200);
//   }
// `;

// const Select = ({
//   id,
//   register,
//   name,
//   options,
//   defaultValue = '',
//   disabled = false,
//   required = false,
//   placeholder = 'Select an option',
//   validation = {},
//   onChange,
//   ...props
// }) => {
//   const registerProps =
//     register && name
//       ? register(name, {
//           required: required ? validation.required || 'This field is required' : false,
//           ...validation,
//         })
//       : {};

//   return (
//     <StyledSelect
//       id={id}
//       defaultValue={defaultValue}
//       disabled={disabled}
//       {...registerProps}
//       {...props}
//       onChange={(e) => {
//         registerProps.onChange?.(e);
//         onChange?.(e.target.value);
//       }}
//     >
//       <option value="" disabled>
//         {placeholder}
//       </option>
//       {options?.map((option) => (
//         <option key={option.idguid || option.value} value={option.idguid || option.value}>
//           {option.naziv || option.label}
//         </option>
//       ))}
//     </StyledSelect>
//   );
// };

// export default Select;

// RADI
// import styled from 'styled-components';

// const StyledSelect = styled.select`
//   width: 100%;
//   padding: 10px;
//   border: 2px solid var(--color-grey-300);
//   border-radius: 5px;
//   background: var(--color-grey-0);
//   font-size: 1.4rem;
//   transition: 0.4s;
//   appearance: base-select;
//   box-sizing: border-box;

//   &:hover,
//   &:focus {
//     background: var(--color-grey-100);
//     outline: none;
//     border-color: var(--color-brand-500);
//   }

//   &:disabled {
//     background-color: var(--color-grey-200);
//   }

//   &::picker-icon {
//     color: var(--color-grey-500);
//     transition: 0.4s rotate;
//   }

//   &:open::picker-icon {
//     rotate: 180deg;
//   }
// `;

// const Select = ({
//   id,
//   register,
//   name,
//   options,
//   defaultValue = '',
//   disabled = false,
//   required = false,
//   placeholder = 'Select an option',
//   validation = {},
//   onChange,
//   ...props
// }) => {
//   const registerProps =
//     register && name
//       ? register(name, {
//           required: required ? validation.required || 'This field is required' : false,
//           ...validation,
//         })
//       : {};

//   return (
//     <StyledSelect
//       id={id}
//       defaultValue={defaultValue}
//       disabled={disabled}
//       {...registerProps}
//       {...props}
//       onChange={(e) => {
//         registerProps.onChange?.(e);
//         onChange?.(e.target.value);
//       }}
//     >
//       <option value="" disabled>
//         {placeholder}
//       </option>
//       {options?.map((option) => (
//         <option key={option.idguid || option.value} value={option.idguid || option.value}>
//           {option.naziv || option.label}
//         </option>
//       ))}
//     </StyledSelect>
//   );
// };

// export default Select;

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ArrowIcon = styled.span`
  display: inline-block;
  margin-left: 1rem;
  transition: transform 0.2s ease-in-out;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  color: var(--color-grey-500);
`;

const StyledSelect = styled.div`
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: 5px;
  background-color: var(--color-grey-0);
  width: 100%;
  font-size: 1.4rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover,
  &:focus {
    border-color: var(--color-brand-500);
    outline: none;
  }

  &.disabled {
    background-color: var(--color-grey-200);
    cursor: not-allowed;
  }
`;

const OptionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-300);
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const OptionItem = styled.li`
  padding: 0.8rem 1.2rem;
  border-bottom: 0.5px solid var(--color-grey-100);

  cursor: pointer;
  &:hover {
    background-color: var(--color-grey-100);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const Select = ({
  id,
  name,
  options,
  placeholder = 'Odaberite kategoriju',
  disabled = false,
  required = false,
  validation = {},
  register,
  setValue,
  watch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const selectedValue = watch?.(name); // WATCH current value
  const selectedLabel = options.find((opt) => opt.value === selectedValue)?.label || '';

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(options[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setValue(name, option.value, { shouldValidate: true });
    setIsOpen(false);
  };

  const hiddenInputProps =
    register && name
      ? register(name, {
          required: required ? validation.required || 'This field is required' : false,
          ...validation,
        })
      : {};

  return (
    <Wrapper ref={wrapperRef}>
      <StyledSelect
        className={disabled ? 'disabled' : ''}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <span>{selectedLabel || placeholder}</span>
        <ArrowIcon $isOpen={isOpen}>▼</ArrowIcon>
      </StyledSelect>
      {isOpen && !disabled && (
        <OptionsList>
          {options.map((option, index) => (
            <OptionItem
              key={option.value}
              onClick={() => handleSelect(option)}
              style={{
                backgroundColor: index === highlightedIndex ? 'var(--color-grey-200)' : 'inherit',
              }}
            >
              {option.label}
            </OptionItem>
          ))}
        </OptionsList>
      )}
      <HiddenInput id={id} {...hiddenInputProps} />
    </Wrapper>
  );
};

export default Select;
