import React from 'react';
import * as Icons from 'lucide-react';

interface DifficultySelectorProps {
  difficulties: Array<{
    id: string;
    name: string;
    description: string;
    icon: keyof typeof import("lucide-react");
  }>;
  selected: string;
  onSelect: (id: string) => void;
}

export function DifficultySelector({
  difficulties,
  selected,
  onSelect
}: DifficultySelectorProps) {
  return (
    <div className="grid gap-4 sm:gap-6">
      {difficulties.map(({ id, name, description, icon }) => {
        const Icon = Icons[icon] as React.ElementType;
        const isSelected = selected === id;

        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`
              w-full group relative overflow-hidden
              rounded-xl sm:rounded-2xl transition-all duration-300
              hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
              ${
                isSelected
                  ? 'bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200'
                  : 'bg-white border-2 border-transparent hover:bg-gray-50'
              }
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/0 to-violet-500/0 group-hover:from-violet-500/5 group-hover:via-violet-500/5 group-hover:to-violet-500/0 transition-all duration-500" />
            
            <div className="relative p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <div 
                  className={`
                    p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 self-start
                    ${
                      isSelected 
                        ? 'bg-violet-100 text-violet-600 shadow-inner' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-violet-50 group-hover:text-violet-500'
                    }
                  `}
                >
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                
                <div className="text-left flex-1">
                  <h3 className={`
                    text-lg sm:text-xl font-semibold mb-1 sm:mb-2 transition-colors duration-300
                    ${isSelected ? 'text-violet-900' : 'text-gray-900'}
                  `}>
                    {name}
                  </h3>
                  <p className={`
                    text-sm sm:text-base transition-colors duration-300
                    ${isSelected ? 'text-violet-600' : 'text-gray-600'}
                  `}>
                    {description}
                  </p>
                </div>

                <div className={`
                  w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-300 
                  flex items-center justify-center absolute top-3 right-3 sm:static
                  ${
                    isSelected
                      ? 'border-violet-500 bg-violet-500 text-white'
                      : 'border-gray-300 group-hover:border-violet-300'
                  }
                `}>
                  <Icons.Check className={`
                    w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300
                    ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                  `} />
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}