// components/Collapsible.js
"use client";

// import { useState } from 'react';
import {Accordion, AccordionItem} from "@nextui-org/react";

export function Collapsible ({ title, children }) {
  // const [isOpen, setIsOpen] = useState(false);

  // const toggleOpen = () => {
  //   setIsOpen(!isOpen);
  // };

  // return (
  //   <div>
  //     <button onClick={toggleOpen} style={{ backgroundColor: 'lightgray', padding: '10px', border: 'none', cursor: 'pointer' }}>
  //       {title}
  //     </button>
  //     {isOpen && (
  //       <div style={{ marginTop: '10px', padding: '10px', border: '1px solid lightgray' }}>
  //         {children}
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <Accordion selectionMode="multiple">
      <AccordionItem style={{ backgroundColor: 'lightgray'}} key="1" aria-label="Accordion 1" title={title}>
      {children}
      </AccordionItem>
    </Accordion>
  );

}
