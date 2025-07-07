import { useEffect, useRef } from 'react';

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        const isAntdPopup = e.target.closest(
          '.ant-picker-dropdown, .ant-select-dropdown, .ant-popover-content'
        );
        if (isAntdPopup) return;

        if (ref.current && !ref.current.contains(e.target)) {
          handler();
        }
      }

      document.addEventListener('click', handleClick, listenCapturing);

      return () => document.removeEventListener('click', handleClick, listenCapturing);
    },
    [handler, listenCapturing]
  );

  return ref;
}
