import classNames from "classnames"

/**
 * Displays a loading skeleton for the root route
 */
export function WorkoutsLoader() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex h-14 w-full items-end justify-between px-4 pb-2 md:px-6">
        <span className="h-5 w-16 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
        <div className="flex gap-6">
          <span className="h-5 w-16 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
          <span className="h-5 w-16 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
        </div>
      </div>
      <div className="mx-auto flex h-full max-h-[calc(100dvh-112px)] w-full justify-center border-t border-slate-700 md:max-h-[calc(100dvh-56px)] md:px-6">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="h-full p-6">
            {Array.from({length: 5}).map((_, i) => (
              <div
                key={i}
                className={classNames(
                  "flex justify-between gap-6 border-slate-700 pb-6",
                  i ? "border-t pt-6" : "pt-2",
                )}
              >
                <div className="flex flex-col">
                  <span className="mb-4 h-6 w-40 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                  <span className="mb-6 h-4 w-20 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                  <span className="h-5 w-28 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                  <span className="my-4 h-5 w-48 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                  <span className="h-5 w-36 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                </div>
                <div className="flex flex-col items-center gap-y-4">
                  {Array.from({length: 1}).map((_, j) => (
                    <span
                      className="h-6 w-6 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700"
                      key={`${i}-${j}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
