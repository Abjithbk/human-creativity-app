import React from 'react';

interface CategoryItem {
  id: number;
  title: string;
  count: string;
  gradient: string;
}

const categories: CategoryItem[] = [
  {
    id: 1,
    title: 'Digital Art',
    count: '12k creations',
    gradient: 'from-purple-600 to-fuchsia-600'
  },
  {
    id: 2,
    title: 'Photography',
    count: '45k creations',
    gradient: 'from-sky-300 to-cyan-700'
  },
  {
    id: 3,
    title: 'Hand Crafts',
    count: '8k creations',
    gradient: 'from-orange-400 to-yellow-500'
  },
  {
    id: 4,
    title: 'Music',
    count: '5k creations',
    gradient: 'from-emerald-500 to-green-700'
  },
  {
    id: 5,
    title: 'Sculpture',
    count: '2k creations',
    gradient: 'from-blue-300 to-blue-900'
  },
  {
    id: 6,
    title: 'Writing',
    count: '15k creations',
    gradient: 'from-red-600 to-pink-600'
  }
];

export default function Categories() {
  return (
    <div className="w-full h-full text-zinc-900 dark:text-white">
      
      <h2 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-white">
        Browse Categories
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((item) => (
          <div
            key={item.id}
            className={`
              relative overflow-hidden rounded-3xl p-10 h-48 
              flex flex-col justify-center items-center text-center 
              shadow-sm hover:shadow-lg dark:shadow-none
              cursor-pointer hover:scale-[1.02] transition-all duration-300
              bg-gradient-to-br ${item.gradient}
            `}
          >
            <div className="absolute inset-0 bg-black/0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors" />

            <h3 className="text-white text-2xl font-bold mb-1 tracking-wide drop-shadow-sm">
              {item.title}
            </h3>
            <span className="text-white/90 text-sm font-medium">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}