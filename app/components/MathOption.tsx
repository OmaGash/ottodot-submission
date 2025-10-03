import React, { Dispatch, SetStateAction } from "react";
import { ArithmeticType, Difficulty } from "../types";

interface MathOptionProps {
  propValue: Difficulty | ArithmeticType;
  propSetter: Dispatch<SetStateAction<Difficulty | ArithmeticType>>;
  title?: string;
  isLoading: boolean;
  options?: { value: Difficulty | ArithmeticType; label: string }[];
}

const MathOption = ({
  propValue,
  propSetter,
  isLoading,
  title,
  options,
}: MathOptionProps) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={propValue}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {`Select ${title ? title : "an option"}:`}
      </label>
      <select
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={isLoading}
        onChange={(e) =>
          propSetter(e.target.value as Difficulty | ArithmeticType)
        }
      >
        {options ? (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        ) : (
          <option>Default</option>
        )}
      </select>
    </div>
  );
};

export default MathOption;
