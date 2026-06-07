import React from "react";

export const DropZone = ({ onDrop, className,showDropZones }) => {
    if(!showDropZones) return
  return (
    <tr
      className={className}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.(e);
      }}
    >
      <td colSpan={999} />
    </tr>
  );
};