// LoadingSpinner.tsx
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-8 h-8 border-2 border-ink-200 dark:border-ink-700 border-t-accent rounded-full animate-spin" />
    </div>
  )
}
