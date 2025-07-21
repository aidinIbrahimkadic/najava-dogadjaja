import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
:root {
  &, &.light-mode {
  /* Grey */
  --color-grey-0: #fff;
  --color-grey-50: #f7f7f7;
  --color-grey-100: #f3f4f6;
  --color-grey-200: #e5e7eb;
  --color-grey-300: #d1d5db;
  --color-grey-400: #9ca3af;
  --color-grey-500: #6b7280;
  --color-grey-600: #4b5563;
  --color-grey-700: #374151;
  --color-grey-800: #1f2937;
  --color-grey-900: #111827;

    /* ZA TABELU HOVER */
  --color-hover-50: #f8fafc;  
  --color-hover-100: #f1f5f9; 
  --color-hover-200: #e2e8f0; 
  --color-hover-300: #cbd5e1; 
  --color-hover-400: #94a3b8; 

  --color-blue-100: #e0f2fe;
  --color-blue-700: #0369a1;
  --color-blue-800: #045a8a;

  --color-green-100: #dcfce7;
  --color-green-700: #15803d;
  --color-yellow-100: #fef9c3;
  --color-yellow-700: #a16207;
  --color-silver-100: #e5e7eb;
  --color-silver-700: #374151;
  --color-indigo-100: #e0e7ff;
  --color-indigo-700: #4338ca;

  --color-red-100: #fee2e2;
  --color-red-700: #b91c1c;
  --color-red-800: #991b1b;

  --backdrop-color: rgba(255, 255, 255, 0.1);
  --backdrop-color-modal: rgba(0, 0, 0, 0.4);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);
  --shadow-xlg: 0 1rem 4.2rem rgba(0, 0, 0, 0.20);
  

    --image-grayscale: 0;
  --image-opacity: 100%;
  }
  
  &.dark-mode {
    --color-grey-0: #18212f;
--color-grey-50: #111827;
--color-grey-100: #1f2937;
--color-grey-200: #374151;
--color-grey-300: #4b5563;
--color-grey-400: #6b7280;
--color-grey-500: #9ca3af;
--color-grey-600: #d1d5db;
--color-grey-700: #e5e7eb;
--color-grey-800: #f3f4f6;
--color-grey-900: #f9fafb;

//ZA TABELU HOVER
  --color-dark-hover-100: #1e293b;  
  --color-dark-hover-200: #334155;  
  --color-dark-hover-300: #475569;  

--color-blue-100: #075985;
--color-blue-200: #1880b8;

--color-blue-700: #e0f2fe;
--color-green-100: #166534;
--color-green-700: #dcfce7;
--color-yellow-100: #854d0e;
--color-yellow-700: #fef9c3;
--color-silver-100: #374151;
--color-silver-700: #f3f4f6;
--color-indigo-100: #3730a3;
--color-indigo-700: #e0e7ff;

--color-red-100: #fee2e2;
--color-red-700: #b91c1c;
--color-red-800: #991b1b;

--backdrop-color: rgba(0, 0, 0, 0.1);

--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
--shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3);
--shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.4);

--image-grayscale: 10%;
--image-opacity: 90%;
  }
  
  /* PLAVA */
  /* --color-brand-50: #eff6ff;
  --color-brand-100: #dbeafe;
  --color-brand-200: #bfdbfe;
  --color-brand-500: #3b82f6;
  --color-brand-600: #2563eb; 
  --color-brand-700: #1d4ed8;
  --color-brand-800: #1e40af;
  --color-brand-900: #1e3a8a; */


  //Narandžasta
  --color-brand-50:  #fff7ed;
  --color-brand-100: #ffedd5;
  --color-brand-200: #fed7aa;
  --color-brand-300: #fdba74;
  --color-brand-400: #fb923c;

  --color-brand-500: #f97316;
  --color-brand-600: #ea580c;
  --color-brand-700: #c2410c;
  --color-brand-800: #9a3412;
  --color-brand-900: #7c2d12;
  
  --color-button-primary: #FF8C42;  /* Prijatna narandžasta */
--color-button-primary-hover: #E67A35;  /* Tamnija na hover */
--color-button-primary-active: #CC6A2D;  /* Još tamnija na klik */

--color-button-success: #4CAF7D;  
--color-button-success-hover: #3D996B;  
--color-button-success-active: #2E7D59; 

  --border-radius-tiny: 3px;
  --border-radius-sm: 5px;
  --border-radius-md: 7px;
  --border-radius-lg: 9px;


}

*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;

  /* Creating animations for dark mode */
  transition: background-color 0.3s, border 0.3s;
}

html {
  font-size: 62.5%;
}

body {
  font-family: "Poppins", sans-serif;
  color: var(--color-grey-700);
  transition: color 0.3s, background-color 0.3s;
  min-height: 100vh;
  line-height: 1.5;
  font-size: 1.6rem;
  letter-spacing: .05rem;
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
  letter-spacing: .04rem;

}

button {
  cursor: pointer;
}

*:disabled {
  cursor: not-allowed;
}

select:disabled,
input:disabled {
  background-color: var(--color-grey-200);
  color: var(--color-grey-500);
}

input:focus,
button:focus,
textarea:focus,
select:focus {
  outline-offset: -1px;
}

/* Parent selector, finally 😃 */
button:has(svg) {
  line-height: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
  hyphens: auto;
}

img {
  max-width: 100%;

  /* For dark mode */
  filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
}

  .ant-picker-cell-selected .ant-picker-cell-inner,
  .ant-picker-cell-range-start .ant-picker-cell-inner,
  .ant-picker-cell-range-end .ant-picker-cell-inner {
    background-color: var(--color-brand-500) !important;
    color: var(--color-grey-0) !important;
  }


  /* Today's date border */
  .ant-picker-cell-today .ant-picker-cell-inner::before {
    border: 1px solid var(--color-brand-500)  !important;
  }

  /* OK Button */
  .ant-picker-ok button {
    background-color: var(--color-brand-500) !important;
    border-color: var(--color-brand-500) !important;
    color: var(--color-grey-0) !important;
  }

  .ant-picker-ok button:hover {
    background-color: var(--color-brand-600) !important;
    border-color: var(--color-brand-600) !important;
  }

  /* Hovered cell */

  .ant-picker-cell-inner:hover:not(.ant-picker-cell-selected .ant-picker-cell-inner:hover,){
    background-color: var(--color-grey-100) !important;
    color: var(--color-grey-700) 
  }

/* Time picker selected item */
.ant-picker-time-panel .ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner {
  background-color: var(--color-brand-500) !important;
  color: white !important;
}



/* Hide scrollbar in time picker panel (minutes) */
.ant-picker-time-panel-column::-webkit-scrollbar {
  width: 1px !important; 
}



.ant-picker-time-panel-column {
  overflow: none;
}

.ant-picker-time-panel-column::after{
display:none !important;
}

`;

export default GlobalStyles;
