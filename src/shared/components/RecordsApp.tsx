import classNames from "classnames"
import {getPrintout} from "~/features/workouts/workoutsFunctions"
import {getDateText, getLiftNameText} from "../functions/parsers"
import {useSession} from "../hooks/useSession"

/**
 * Displays the user's personal records (if any exist)
 */
export function RecordsApp() {
  const {data: session, isLoading} = useSession()
  const records =
    session?.workouts.flatMap(w => w.routine.filter(e => e.recordStartDate)) ??
    []
  return (
    <div className="h-full max-h-screen w-96 max-w-xs overflow-hidden border-l border-slate-700 px-6 pb-6 max-lg:hidden xl:w-full">
      <div className="h-full overflow-hidden pb-14">
        <h2 className="mb-1 ml-1 mt-6 text-lg font-bold">Personal Bests</h2>
        <div className="flex h-full flex-col gap-4 overflow-y-auto rounded-lg bg-gray-100 px-6 py-4 dark:bg-gray-900">
          {isLoading ? (
            <p>Loading records...</p>
          ) : records.length === 0 ? (
            <p>You haven&apos;t set any records yet</p>
          ) : (
            records.map(exercise => {
              const liftNameText = getLiftNameText(
                exercise.liftId,
                session?.profile.liftNames ?? [],
              )
              return (
                <div key={exercise.id}>
                  <p
                    className={classNames(
                      liftNameText.split(" ").some(word => word.length > 9) &&
                        "break-all",
                    )}
                  >
                    {liftNameText}: {getPrintout(exercise)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getDateText(exercise.recordStartDate ?? "")}
                  </p>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
