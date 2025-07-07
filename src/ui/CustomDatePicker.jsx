import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import styled from 'styled-components';
import hrHR from 'antd/es/date-picker/locale/hr_HR';

const disabledHours = () => {
  const hours = [];
  for (let i = 0; i <= 8; i++) {
    hours.push(i);
  }
  return hours;
};

const disabledMinutes = () => {
  // This will allow only 0, 15, 30, 45
  const minutes = [];
  for (let i = 0; i < 60; i++) {
    if (![0, 15, 30, 45].includes(i)) {
      minutes.push(i);
    }
  }
  return minutes;
};
console.log(hrHR);
const customLocale = {
  ...hrHR,
  lang: {
    ...hrHR.lang,
    now: 'Danas',
    today: 'Danas',
    ok: 'U redu',
    placeholder: 'Odaberite datum i vrijeme',
    weekPlaceholder: 'Odaberite sedmicu',
    weekSelect: 'Odaberite sedmicu',
  },
};

// Customize your styled DatePicker
const StyledPicker = styled(DatePicker)`
  width: 100%;
  padding: 0.8rem 1.2rem !important;
  border-radius: 5px;
  border: 1px solid var(--color-grey-300);
  transition: border-color 0.3s;

  &.ant-picker-focused {
    border-color: var(--color-brand-500);
  }

  &:hover {
    border-color: var(--color-brand-500);
  }

  .ant-picker-panel {
    color: var(--color-brand-500);
  }

  .ant-picker-input > input::placeholder {
    color: var(--color-grey-600);
    opacity: 1;
  }

  /* Time picker selected item */
  .ant-picker-time-panel .ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner {
    background-color: var(--color-brand-500) !important;
    color: white !important;
  }

  /* Scrollbar indicator colors */
  .ant-picker-time-panel-column {
    scrollbar-color: var(--color-brand-500) transparent;
  }

  .ant-picker-time-panel-column::-webkit-scrollbar-thumb {
    background-color: var(--color-brand-500) !important;
  }

  /* Hovered date */

  .ant-picker-cell-inner {
    background-color: var(--color-grey-500) !important;
  }

  .ant-picker-cell-inner:hover {
    background-color: var(--color-grey-500) !important;
  }
  .ant-picker-input.ant-picker-input-placeholder > input {
    color: var(--color-grey-600) !important;
    opacity: 1 !important;
  }

  &:hover .ant-picker-input.ant-picker-input-placeholder > input {
    color: var(--color-grey-600) !important;
    opacity: 1 !important;
  }

  /* OK Button */
  .ant-picker-ok button {
    background-color: var(--color-brand-500);
    border-color: var(--color-brand-500);
    color: white;

    &:hover {
      background-color: var(--color-brand-500);
      border-color: var(--color-brand-500);
    }
  }
`;

export default function CustomDatePicker(props) {
  return (
    <StyledPicker
      showTime={{
        format: 'HH:mm',
        hideDisabledOptions: true,
        disabledHours,
        disabledMinutes,
        defaultValue: dayjs('09:00', 'HH:mm'), // avoids scrolling to 00:00
      }}
      format="DD.MM.YYYY. HH:mm"
      allowClear={false}
      locale={customLocale}
      {...props}
    />
  );
}
