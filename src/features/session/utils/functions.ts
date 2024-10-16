import { Profile } from "@/features/profile/utils/models"
import {
	getLiftNameText,
	getWorkoutNameText,
} from "@/features/settings/utils/parsers"
import { Exercise, Workout } from "@/features/workouts/utils/models"
import sortBy from "lodash/sortBy"

export function generateSession(profile: Profile, workoutList: Array<Workout>) {
	const liftIds = new Set<string>()
	const nameIds = new Set<string>()
	const workoutDates = new Set<string>()

	const workouts = recursiveChecker(sortBy(workoutList, "date"))

	const filters = generateWorkoutsFilters({
		liftIds: Array.from(liftIds).filter(
			id => !profile.liftNames.find(n => n.id === id)?.isHidden,
		),
		nameIds: Array.from(nameIds).filter(
			id => !profile.workoutNames.find(n => n.id === id)?.isHidden,
		),
		workoutDates: Array.from(workoutDates),
	})

	return {
		filters,
		profile: {
			...profile,
			liftNames: sortBy(
				profile.liftNames.map(liftName => ({
					...liftName,
					canDelete: !liftIds.has(liftName.id),
				})),
				({ id }) => getLiftNameText(id, profile.liftNames),
			),
			workoutNames: sortBy(
				profile.workoutNames.map(workoutName => ({
					...workoutName,
					canDelete: !nameIds.has(workoutName.id),
				})),
				({ id }) => getWorkoutNameText(id, profile.workoutNames),
			),
		},
		workouts,
	}

	function recursiveChecker(
		pendingWorkouts: Array<Workout>,
		workouts: Array<Workout> = [],
		records: Array<Exercise> = [],
	): Array<Workout> {
		if (pendingWorkouts[0]) {
			const updated = updateRecords(pendingWorkouts[0], records)
			return recursiveChecker(
				pendingWorkouts.slice(1),
				[...workouts, updated.workout],
				updated.records,
			)
		}
		return workouts.reverse()
	}

	function updateRecords(workout: Workout, records: Array<Exercise>) {
		nameIds.add(workout.nameId)
		workoutDates.add(workout.date)
		for (const exercise of workout.routine) {
			delete exercise.recordEndDate
			delete exercise.recordStartDate
			const { liftId, sets, reps, weight } = exercise
			liftIds.add(liftId)
			let newRecord = true
			for (const record of records) {
				if (!record.recordEndDate && record.liftId === liftId) {
					if (
						record.sets >= sets &&
						record.reps >= reps &&
						record.weight >= weight
					) {
						newRecord = false
						break
					} else if (
						sets >= record.sets &&
						reps >= record.reps &&
						weight >= record.weight
					) {
						record.recordEndDate = workout.date
					}
				}
			}
			if (newRecord) {
				exercise.recordStartDate = workout.date
				records.push(exercise)
			}
		}
		return { records, workout }
	}
}

function generateWorkoutsFilters({
	liftIds,
	nameIds,
	workoutDates,
}: {
	liftIds: Array<string>
	nameIds: Array<string>
	workoutDates: Array<string>
}) {
	return {
		liftIds: sortBy(liftIds).map(id => ({ checked: false, id })),
		nameIds: sortBy(nameIds).map(id => ({ checked: false, id })),
		newestFirst: true,
		workoutDates: {
			allDates: workoutDates,
			endDate: workoutDates[workoutDates.length - 1],
			startDate: workoutDates[0],
		},
	}
}
