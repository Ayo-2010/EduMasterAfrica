interface PlaceholderProps {
  title?: string;
}

export default function Placeholder({ title }: PlaceholderProps) {
  const displayTitle = title || 'Coming Soon';

  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
      <div className="mb-4 rounded-full bg-brand-50 p-4">
        <svg className="h-8 w-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-slate-900">{displayTitle}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        This module is part of the EduMaster Africa Phase 1 roadmap. The backend API is ready and awaiting the frontend implementation.
      </p>
    </div>
  );
}
