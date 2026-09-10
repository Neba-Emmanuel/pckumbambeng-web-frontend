
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 px-2 text-left font-semibold text-gray-800 hover:bg-gray-100"
      >
        <span>{title}</span>
        <ChevronDown
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="p-4 bg-white text-gray-700">{children}</div>
      </div>
    </div>
  );
};

interface AccordionProps {
    items: {
        id: string;
        title: string;
        content: React.ReactNode;
    }[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            {items.map((item) => (
                <AccordionItem key={item.id} title={item.title}>
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    );
};


export default Accordion;
