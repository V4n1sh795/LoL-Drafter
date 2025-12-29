import React from 'react';

const RoleFilter = ({ activeRole, onRoleSelect }) => {
  const roles = [
    { id: 'top', title: 'Топлейн', icon: '/roles/top.png' },
    { id: 'jungle', title: 'Лес', icon: '/roles/jungle.png' },
    { id: 'middle', title: 'Мидлейн', icon: '/roles/middle.png' },
    { id: 'bottom', title: 'ADC', icon: '/roles/bottom.png' },
    { id: 'support', title: 'Саппорт', icon: '/roles/support.png' },
  ];

  return (
    <div className="flex gap-2">
      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => onRoleSelect(role.id)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
            activeRole === role.id
              ? 'bg-blue-600 border-2 border-blue-400 scale-105'
              : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
          }`}
          title={role.title}
        >
          <img 
            src={role.icon} 
            alt={role.title} 
            className="w-8 h-8 object-contain"
            loading="lazy"
          />
        </button>
      ))}
    </div>
  );
};

export default RoleFilter;