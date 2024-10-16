import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ToastAction } from "@/components/ui/toast"
import { Session } from "@/features/session/utils/models"
import { useToast } from "@/hooks/use-toast"
import { useUpdateEvent } from "@/hooks/useUpdateEvent"
import { cn } from "@/lib/utils"
import { StorageService } from "@/services/StorageService"
import sortBy from "lodash/sortBy"
import * as React from "react"
import { useWorkoutView } from "../hooks/useWorkoutView"
import { today } from "../utils/constants"
import { eliminateRedundancy } from "../utils/functions"
import { Exercise, Workout } from "../utils/models"
import { WorkoutsCalendar } from "./WorkoutsCalendar"
import { WorkoutsFilters } from "./WorkoutsFilters"
import { WorkoutsFiltersResults } from "./WorkoutsFiltersResults"
import { WorkoutsForm } from "./WorkoutsForm"
import { WorkoutsHeader } from "./WorkoutsHeader"
import { WorkoutsList } from "./WorkoutsList"

/**
 * Allows the user to view, filter, and update their workouts
 */
export function WorkoutsApp({ filters, profile, workouts }: Session) {
	const { liftNames, userId, workoutNames } = profile
	const activeWorkoutNames = sortBy(
		workoutNames.filter(n => !n.isHidden),
		"text",
	)
	const activeLiftNames = sortBy(
		liftNames.filter(n => !n.isHidden),
		"text",
	)

	const { changeView, defaultView, view } = useWorkoutView()
	const { toast } = useToast()

	const [editingWorkout, setEditingWorkout] = React.useState<Workout | null>(
		null,
	)

	const localRoutine = new StorageService(`wip-routine_${userId}`)
	const [routine, setRoutine] = React.useState<Workout["routine"]>(
		getLocalRoutine(),
	)

	const defaultValues = {
		date: today,
		liftId: activeLiftNames[0]!.id,
		nameId: activeWorkoutNames[0]!.id,
		reps: "",
		sets: "",
		weight: "",
	}
	const [values, setValues] = React.useState(defaultValues)

	const [filteredWorkouts, setFilteredWorkouts] = React.useState(workouts)
	const [appliedFilters, setAppliedFilters] = React.useState(filters)
	const filtersToastRef = React.useRef<ReturnType<typeof toast> | null>(null)
	useUpdateEvent(() => {
		const count = countAppliedFilters(appliedFilters)
		if (count > 0) {
			filtersToastRef.current = toast({
				action: (
					<ToastAction altText="Clear Filters" onClick={clearFilters}>
						Clear Filters
					</ToastAction>
				),
				duration: Infinity,
				title: `${count} filter${count === 1 ? "" : "s"} applied`,
				...(filteredWorkouts.length === 0 && {
					description: "No results found",
					variant: "destructive",
				}),
			})
		} else {
			removeFiltersToast()
		}
	}, [appliedFilters])

	useUpdateEvent(() => {
		if (editingWorkout) {
			updateRoutine(editingWorkout.routine)
			setValues({
				...defaultValues,
				nameId: editingWorkout.nameId,
				date: editingWorkout.date.split("T")[0]!,
			})
		}
	}, [editingWorkout])

	useUpdateEvent(resetState, [workouts])

	useUpdateEvent(() => {
		setRoutine(getLocalRoutine())
	}, [liftNames])

	React.useEffect(() => {
		if (editingWorkout && view !== "create") {
			setEditingWorkout(null)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [view])

	React.useEffect(() => {
		return () => {
			clearFilters()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (view === "calendar") {
		return (
			<WorkoutsCalendar
				{...{
					clearFilters,
					filteredWorkouts,
				}}
			/>
		)
	}

	return (
		<div className="min-h-screen lg:max-w-3xl lg:border-r">
			<WorkoutsHeader {...{ editingWorkout, workouts }} />
			<ResizablePanelGroup
				className="mx-auto flex h-full max-h-[calc(100dvh-7rem)] w-full flex-grow justify-center border-t md:max-h-[calc(100dvh-3.5rem)]"
				direction="horizontal"
			>
				<ResizablePanel
					className={cn(
						"relative flex w-min min-w-[10rem] flex-grow overflow-x-hidden sm:min-w-[15rem]",
						view === "list" && "hidden",
					)}
				>
					<div className="flex w-full flex-grow flex-col">
						<div className="w-full overflow-hidden max-md:h-full">
							<div className="h-full overflow-y-auto overflow-x-hidden px-4 pb-6 pt-4 lg:px-6">
								{view === "filters" ? (
									<WorkoutsFilters
										{...{
											appliedFilters,
											clearFilters,
											filters,
											liftNames,
											setAppliedFilters,
											setFilteredWorkouts,
											workoutNames,
											workouts,
										}}
									/>
								) : (
									<WorkoutsForm
										{...{
											activeLiftNames,
											activeWorkoutNames,
											defaultValues,
											editingWorkout,
											liftNames,
											resetState,
											routine,
											setValues,
											updateRoutine,
											userId,
											values,
										}}
									/>
								)}
							</div>
						</div>
					</div>
				</ResizablePanel>
				<ResizableHandle
					className={cn(view === "list" && "hidden")}
					withHandle
				/>
				<ResizablePanel
					className={cn(
						view === "list" ? "min-w-full" : "min-w-[1rem] sm:min-w-[15rem]",
					)}
				>
					{view === "filters" ? (
						<WorkoutsFiltersResults
							{...{ appliedFilters, filteredWorkouts, liftNames }}
						/>
					) : (
						<WorkoutsList
							{...{
								addExercise,
								clearFilters,
								editingWorkout,
								filteredWorkouts,
								liftNames,
								resetState,
								setEditingWorkout,
								setValues,
								updateRoutine,
								values,
								view,
								workoutNames,
								workouts,
							}}
						/>
					)}
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	)

	/**
	 * Handles changes to the routine to ensure it is valid and keep data in sync
	 */
	function updateRoutine(newRoutine: Workout["routine"]) {
		const routine = eliminateRedundancy(newRoutine)
		if (!editingWorkout) {
			localRoutine.set(routine)
		}
		setRoutine(routine)
		changeView("create")
	}

	/**
	 * Adds a new exercise to the routine
	 */
	function addExercise(newExercise: Exercise) {
		updateRoutine([...routine, newExercise])
	}

	/**
	 * Clears everything to return to default state
	 */
	function resetState() {
		clearFilters()
		setRoutine(getLocalRoutine())
		setValues(defaultValues)
		setEditingWorkout(null)
		changeView(defaultView)
	}

	/**
	 * Gets the user's WIP routine (if any) from local storage,
	 * filtering out any exercises whose names are hidden/deleted
	 */
	function getLocalRoutine() {
		const newRoutine = eliminateRedundancy(
			localRoutine.get()?.filter(({ liftId }) => {
				const liftName = liftNames.find(({ id }) => id === liftId)
				return liftName && !liftName.isHidden
			}) ?? [],
		)
		localRoutine.set(newRoutine)
		return newRoutine
	}

	/**
	 * Clears all the workout filters, displaying all workouts
	 */
	function clearFilters() {
		setAppliedFilters(filters)
		setFilteredWorkouts(workouts)
		removeFiltersToast()
	}

	function removeFiltersToast() {
		filtersToastRef.current?.dismiss()
		filtersToastRef.current = null
	}
}

/**
 * @returns the number of filters which the user has applied
 */
function countAppliedFilters(appliedFilters: Session["filters"]) {
	let count = 0
	if (appliedFilters.workoutDates.allDates.length === 0) {
		return count
	}
	const {
		liftIds,
		nameIds,
		workoutDates: { allDates, endDate, startDate },
	} = appliedFilters
	if (startDate !== allDates[0]) {
		count++
	}
	if (endDate !== allDates.at(-1)) {
		count++
	}
	count += [...liftIds, ...nameIds].filter(id => id.checked).length
	return count
}
