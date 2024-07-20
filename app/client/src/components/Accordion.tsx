import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import useStore from "../store/store";

type AccordionItemProps = {
  title: string;
  content: string;
};

const Accordion: React.FC<AccordionItemProps> = ({
  title,
  content,
}: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = (): void => {
    setIsOpen(!isOpen);
  };

  const { darkMode } = useStore();

  return (
    <div className="w-full cursor-pointer" onClick={toggleAccordion}>
      <div className="flex justify-between">
        <span className="text-2xl font-medium">{title}</span>
        <FaArrowUp
          className={`transform transition-transform ${
            isOpen ? "rotate-45" : ""
          }`}
          size={25}
        />
      </div>
      {isOpen && (
        <div
          className={`text-xl font-light ${
            darkMode ? "text-[#999999]" : "text-black"
          }`}
        >
          {content}
        </div>
      )}
      <hr />
    </div>
  );
};

export default Accordion;
