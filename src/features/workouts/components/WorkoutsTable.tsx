import {
  faArrowLeft,
  faArrowRight,
  faChevronCircleLeft,
  faRotate,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import React from "react"
import {getDateText} from "~/shared/functions/parsers"
import {useViewport} from "~/shared/hooks/useViewport"
import {Profile, Workout} from "~/shared/utils/models"
import {Button, IconButton} from "../../../shared/components/CTA"
import {getPrintout, groupExercisesByLift} from "../functions"

/**
 * Displays workout exercises and dates in a table view
 * which can be filtered and/or have its axes toggled
 */
export function WorkoutsTable({
  filteredWorkouts,
  clearFilters,
  hideWorkoutsTable,
  profile,
}: {
  filteredWorkouts: Workout[]
  profile: Profile
} & {
  [key in "clearFilters" | "hideWorkoutsTable"]: () => void
}) {
  const width = useViewport()

  const canFit = Math.floor(width / 150) - 1
  const maxColumns = canFit < 2 ? 1 : canFit < 3 ? canFit : 3

  const liftIds: Record<string, number> = {}
  for (const {routine} of filteredWorkouts) {
    for (const {liftId} of routine) {
      liftIds[liftId] = liftIds[liftId] + 1 || 1
    }
  }
  const liftArray = []
  for (const liftId in liftIds) {
    liftArray.push({liftId, total: liftIds[liftId]})
  }
  const sortedLifts = liftArray.sort((a, b) => b.total - a.total)

  const [sortByDate, setSortByDate] = React.useState(false)
  const [horizontalIndex, setHorizontalIndex] = React.useState(0)
  const [canIncrement, setCanIncrement] = React.useState(false)

  React.useEffect(() => {
    setHorizontalIndex(0)
  }, [maxColumns, sortByDate])

  React.useEffect(() => {
    setCanIncrement(
      sortByDate
        ? horizontalIndex < filteredWorkouts.length - maxColumns
        : horizontalIndex < liftArray.length - maxColumns,
    )
    // eslint-disable-next-line
  }, [liftArray, horizontalIndex])

  return (
    <div className="flex min-h-screen w-full justify-center">
      <div className="w-full flex-col divide-x divide-slate-700 overflow-hidden">
        <div className="flex w-full flex-1 flex-col items-center border-slate-700">
          <div className="flex h-14 w-full items-end justify-between border-b border-slate-700 px-4 pb-2 text-lg sm:px-6">
            <div className="flex items-center justify-center gap-5">
              <FontAwesomeIcon
                aria-label="View previous column"
                className={classNames(
                  horizontalIndex
                    ? "cursor-pointer"
                    : "cursor-default opacity-0",
                )}
                onClick={() =>
                  horizontalIndex && setHorizontalIndex(horizontalIndex - 1)
                }
                icon={faArrowLeft}
                size="lg"
              />
              <IconButton
                aria-label="Reverse x and y axes of table"
                icon={<FontAwesomeIcon icon={faRotate} size="lg" />}
                onClick={() => setSortByDate(!sortByDate)}
              />
              <FontAwesomeIcon
                aria-label="View next column"
                className={classNames(
                  canIncrement ? "cursor-pointer" : "cursor-default opacity-0",
                )}
                onClick={() =>
                  canIncrement && setHorizontalIndex(horizontalIndex + 1)
                }
                icon={faArrowRight}
                size="lg"
              />
            </div>
            <IconButton
              className="text-blue-600 dark:text-blue-400"
              icon={<FontAwesomeIcon icon={faChevronCircleLeft} />}
              onClick={hideWorkoutsTable}
              text="Hide"
            />
          </div>
          <div className="h-full w-full">
            <div className="max-h-[calc(100dvh-112px)] w-full overflow-y-auto border-slate-700 md:max-h-[calc(100dvh-56px)]">
              {filteredWorkouts.length > 0 ? (
                <table className="w-full table-fixed border-b border-slate-700 bg-gray-100 text-center dark:bg-gray-900">
                  <thead className="sticky top-0 divide-x divide-slate-700 bg-gray-100 text-gray-900 shadow-sm shadow-slate-700 dark:bg-gray-900 dark:text-white">
                    <tr className="divide-x divide-slate-700 shadow-sm shadow-slate-700">
                      <th className="px-4 py-2 text-lg shadow-sm shadow-slate-700">
                        {sortByDate ? "Exercise" : "Date"}
                      </th>
                      {sortByDate
                        ? filteredWorkouts
                            .slice(
                              horizontalIndex,
                              horizontalIndex + maxColumns,
                            )
                            .map(workout => (
                              <th
                                className="whitespace-nowrap px-4 py-2 text-lg shadow-sm shadow-slate-700"
                                key={workout.id}
                              >
                                {getDateText(workout.date)}
                              </th>
                            ))
                        : sortedLifts
                            .slice(
                              horizontalIndex,
                              horizontalIndex + maxColumns,
                            )
                            .map(({liftId}) => (
                              <th
                                className="px-4 py-2 text-lg shadow-sm shadow-slate-700"
                                key={liftId}
                              >
                                {getLiftName(liftId)}
                              </th>
                            ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortByDate
                      ? sortedLifts.map(({liftId}) => (
                          <tr
                            className="divide-x divide-slate-700 border-t border-slate-700"
                            key={liftId}
                          >
                            <td className="px-4 py-2 text-lg">
                              {getLiftName(liftId)}
                            </td>
                            {filteredWorkouts
                              .slice(
                                horizontalIndex,
                                horizontalIndex + maxColumns,
                              )
                              .map(workout => (
                                <td
                                  className="px-4 py-2 text-lg"
                                  key={liftId + workout.id}
                                >
                                  {groupExercisesByLift(
                                    workout.routine.filter(
                                      exercise => exercise.liftId === liftId,
                                    ),
                                  ).map(exerciseList =>
                                    exerciseList.map((exercise, i) =>
                                      getPrintout(exercise)
                                        .split(" ")
                                        .map(
                                          printout =>
                                            printout +
                                            (i !== exerciseList.length - 1
                                              ? ", "
                                              : ""),
                                        ),
                                    ),
                                  )}
                                </td>
                              ))}
                          </tr>
                        ))
                      : filteredWorkouts.map(workout => (
                          <tr
                            className="divide-x divide-slate-700 border-t border-slate-700"
                            key={workout.id}
                          >
                            <td className="whitespace-nowrap px-4 py-2 text-lg">
                              {getDateText(workout.date)}
                            </td>
                            {sortedLifts
                              .slice(
                                horizontalIndex,
                                horizontalIndex + maxColumns,
                              )
                              .map(({liftId}) => (
                                <td
                                  className="px-4 py-2 text-lg"
                                  key={liftId + workout.id}
                                >
                                  {groupExercisesByLift(
                                    workout.routine.filter(
                                      exercise => exercise.liftId === liftId,
                                    ),
                                  ).map(exerciseList =>
                                    exerciseList.map((exercise, i) =>
                                      getPrintout(exercise)
                                        .split(" ")
                                        .map(
                                          printout =>
                                            printout +
                                            (i !== exerciseList.length - 1
                                              ? ", "
                                              : ""),
                                        ),
                                    ),
                                  )}
                                </td>
                              ))}
                          </tr>
                        ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center gap-4 p-6">
                  <p className="text-lg font-bold text-red-500">No results</p>
                  <Button onClick={clearFilters} variant="secondary">
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * Gets the text which corresponds to a lift ID
   */
  function getLiftName(liftId: string) {
    return profile.liftNames.find(({id}) => id === liftId)?.text ?? ""
  }
}