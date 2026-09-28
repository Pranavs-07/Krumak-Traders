'use client';
import Link from 'next/link';

export default function EmptyState({ icon = '📭', title = 'Nothing here yet', description = '', actionLabel, actionHref }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
      {description && <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary">{actionLabel}</Link>
      )}
    </div>
  );
}
