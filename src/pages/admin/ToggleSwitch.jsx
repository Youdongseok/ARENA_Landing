import React from 'react';

const ToggleSwitch = ({ enabled, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        relative inline-flex h-12 w-20 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
        transition-colors duration-300
        ${enabled ? 'bg-[#FF4854]' : 'bg-gray-300'}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-10 w-10 transform rounded-full bg-white shadow-lg ring-0
          transition duration-300
          ${enabled ? 'translate-x-9' : 'translate-x-0'}
        `}
      />
    </button>
  );
};

export default ToggleSwitch;
