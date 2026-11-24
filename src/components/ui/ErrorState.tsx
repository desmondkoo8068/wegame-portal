/**
 * ErrorState: friendly message + "Try again" button for failed requests.
 * role="alert" makes screen readers announce it as soon as it appears.
 *
 * `compact` is a one-line version for secondary sections, so a single
 * failed request doesn't fill the page with big identical boxes.
 */
interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  compact?: boolean;
  className?: string;
}

export default function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  compact = false,
  className = "",
}: ErrorStateProps) {
  if (compact) {
    return (
      <div
        role="alert"
        className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm ${className}`}
      >
        <p className="text-muted">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="font-semibold text-brand hover:underline"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-8 text-center ${className}`}
    >
      <p className="font-semibold text-white">{title}</p>
      <p className="max-w-md text-sm text-muted">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-outline mt-2">
          Try again
        </button>
      )}
    </div>
  );
}
