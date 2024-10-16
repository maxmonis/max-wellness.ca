import { EditableName } from "@/features/settings/utils/models"
import { hasChars } from "@/utils/validators"
import { Profile } from "./models"

function isEditableName(value: unknown): value is EditableName {
	if (typeof value !== "object" || value === null) {
		return false
	}
	const name = value as EditableName
	return (
		hasChars(name.id) &&
		hasChars(name.text) &&
		["undefined", "boolean"].includes(typeof name.canDelete)
	)
}

export function isProfile(value: unknown): value is Profile {
	if (typeof value !== "object" || value === null) {
		return false
	}
	const profile = value as Profile
	return (
		hasChars(profile.id) &&
		hasChars(profile.userId) &&
		hasChars(profile.userName) &&
		Array.isArray(profile.liftNames) &&
		profile.liftNames.length > 0 &&
		profile.liftNames.every(isEditableName) &&
		Array.isArray(profile.workoutNames) &&
		profile.workoutNames.length > 0 &&
		profile.workoutNames.every(isEditableName)
	)
}
