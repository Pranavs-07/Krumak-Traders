'use client';
export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizes = { sm: 'w-6 h-6 border-2', md: 'w-10 h-10 border-3', lg: 'w-14 h-14 border-4' };
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className={`${sizes[size]} border-[#0f4c81] border-t-transparent rounded-full animate-spin`}></div>
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  );
}
