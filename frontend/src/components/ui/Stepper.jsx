import React from "react";
import { STEPS } from "../../constants/steps";
import { CheckIcon, BlockchainIcon } from "../icons";

export default function Stepper({ currentStep, onStepClick }) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-5">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {STEPS.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isUpcoming = step.id > currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => onStepClick(step.id)}
                className="flex flex-col items-center group"
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  transition-all duration-200 border-2
                  ${isCompleted ? "bg-blue-900 border-blue-900 text-white" : ""}
                  ${isActive ? "bg-white border-blue-900 text-blue-900 shadow-md ring-4 ring-blue-100" : ""}
                  ${isUpcoming ? "bg-white border-gray-300 text-gray-400" : ""}
                `}>
                  {isCompleted
                    ? <CheckIcon size={18} className="text-white" />
                    : step.id === 4
                      ? <BlockchainIcon size={16} />
                      : step.id}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-xs font-semibold leading-tight ${isActive ? "text-blue-900" : isCompleted ? "text-blue-700" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                  <p className={`text-xs leading-tight mt-0.5 ${isActive ? "text-blue-600" : "text-gray-400"}`}>
                    {step.sub}
                  </p>
                </div>
              </button>
              {index < STEPS.length - 1 && (
                <div className="flex-1 mx-3 mb-6">
                  <div className={`h-0.5 w-full rounded ${step.id < currentStep ? "bg-blue-900" : "bg-gray-200"}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
