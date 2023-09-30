import React from "react"

import {
  faArrowLeft,
  faArrowRight,
  faFilter,
  faGear,
  faList,
  faRotate,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

import useViewport from "~/shared/hooks/useViewport"
import {Profile, Workout} from "~/shared/resources/models"
import {getDateText} from "~/shared/utils/parsers"
import {getPrintout, groupExercisesByLift} from "~/shared/utils/workout"
import {Button, IconButton, UserMenu} from "./CTA"

/**
 * Displays workout exercises and dates in a table view
 * which can be filtered and/or have its axes toggled
 */
export default function WorkoutsTable({
  filteredWorkouts,
  clearFilters,
  handleFiltersClick,
  hideWorkoutsTable,
  profile,
}: {
  filteredWorkouts: Workout[]
  profile: Profile
} & {
  [key in
    | "clearFilters"
    | "handleFiltersClick"
    | "hideWorkoutsTable"]: () => void
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
    <div className="flex h-screen justify-center overflow-hidden border-slate-700">
      <div className="fixed top-0 left-0 z-10 w-screen">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-6 border-b border-slate-700 bg-slate-50 px-6 dark:bg-black xl:border-x">
          <IconButton
            icon={<FontAwesomeIcon icon={faList} size="xl" />}
            aria-label="View workouts list"
            onClick={hideWorkoutsTable}
            side="right"
            text="List"
            textClass="max-sm:sr-only"
          />
          <IconButton
            aria-label="Show workout filters"
            icon={<FontAwesomeIcon icon={faFilter} size="xl" />}
            onClick={handleFiltersClick}
            side="right"
            text="Filters"
            textClass="max-sm:sr-only"
          />
          <IconButton
            aria-label="Reverse x and y axes of table"
            icon={<FontAwesomeIcon icon={faRotate} size="xl" />}
            onClick={() => setSortByDate(!sortByDate)}
            side="right"
            text="Reverse"
            textClass="max-sm:sr-only"
          />
          <IconButton
            aria-label="Go to settings page"
            href="/settings"
            icon={<FontAwesomeIcon icon={faGear} size="xl" />}
            side="right"
            text="Settings"
            textClass="max-sm:sr-only"
          />
          <UserMenu />
        </div>
      </div>
      <div className="max-h-screen w-screen max-w-screen-xl divide-x divide-slate-700 overflow-hidden border-slate-700 pt-20 xl:border-x">
        <div className="flex w-full flex-1 flex-col items-center border-b border-slate-700">
          <div className="w-full">
            <div className="flex w-full items-center justify-center gap-5 border-b border-slate-700 pb-4">
              <FontAwesomeIcon
                className={
                  horizontalIndex
                    ? "cursor-pointer"
                    : "cursor-default opacity-0"
                }
                onClick={() =>
                  horizontalIndex && setHorizontalIndex(horizontalIndex - 1)
                }
                icon={faArrowLeft}
                size="lg"
              />
              <div>
                <h1 className="text-center text-xl">
                  {sortByDate ? "Dates" : "Exercises"}
                </h1>
              </div>
              <FontAwesomeIcon
                className={
                  canIncrement ? "cursor-pointer" : "cursor-default opacity-0"
                }
                onClick={() =>
                  canIncrement && setHorizontalIndex(horizontalIndex + 1)
                }
                icon={faArrowRight}
                size="lg"
              />
            </div>
          </div>
          <div className="w-full">
            <div className="h-[calc(100vh-124px)] w-full overflow-y-auto pb-20">
              {filteredWorkouts.length > 0 ? (
                <table className="w-full table-fixed border-b border-slate-700 text-center">
                  <thead className="sticky top-0 divide-x divide-slate-700 bg-slate-50 shadow-sm shadow-slate-700 dark:bg-black">
                    <tr className="divide-x divide-slate-700 shadow-sm shadow-slate-700">
                      <th className="py-2 px-4 text-lg shadow-sm shadow-slate-700">
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
                                className="whitespace-nowrap py-2 px-4 text-lg shadow-sm shadow-slate-700"
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
                                className="py-2 px-4 text-lg shadow-sm shadow-slate-700"
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
                            <td className="py-2 px-4 text-lg">
                              {getLiftName(liftId)}
                            </td>
                            {filteredWorkouts
                              .slice(
                                horizontalIndex,
                                horizontalIndex + maxColumns,
                              )
                              .map(workout => (
                                <td
                                  className="py-2 px-4 text-lg"
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
                            <td className="whitespace-nowrap py-2 px-4 text-lg">
                              {getDateText(workout.date)}
                            </td>
                            {sortedLifts
                              .slice(
                                horizontalIndex,
                                horizontalIndex + maxColumns,
                              )
                              .map(({liftId}) => (
                                <td
                                  className="py-2 px-4 text-lg"
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
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold text-red-500">No results</p>
                    <Button onClick={clearFilters} variant="secondary">
                      Clear Filters
                    </Button>
                  </div>
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
