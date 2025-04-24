import { motion } from "framer-motion";

interface Option {
  id: number;
  text: string;
}

interface QuickOptionsProps {
  options: Option[];
  onOptionSelect: (text: string) => void;
}

export default function QuickOptions({ options, onOptionSelect }: QuickOptionsProps) {
  return (
    <motion.div 
      className="flex flex-wrap justify-start ml-10 mb-6 gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {options.map((option) => (
        <motion.button
          key={option.id}
          className="button-option bg-white text-primary border border-primary rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 shadow-sm hover:bg-primary hover:text-white"
          onClick={() => onOptionSelect(option.text)}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          whileTap={{ y: 0, transition: { duration: 0.2 } }}
        >
          {option.text}
        </motion.button>
      ))}
    </motion.div>
  );
}
