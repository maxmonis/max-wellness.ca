import {faXmarkSquare} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {isEqual, omit, sortBy} from "lodash"
import {nanoid} from "nanoid"
import React from "react"
import {Button, IconButton} from "~/shared/components/CTA"
import {useAlerts} from "~/shared/context/AlertContext"
import {useMutating} from "~/shared/hooks/useMutating"
import {useUpdateProfile} from "~/shared/hooks/useUpdateProfile"
import {EditableName, Profile} from "~/shared/utils/models"
import {isTextAlreadyInList} from "../functions"
import {EditableListItem} from "./EditableListItem"

/**
 * Displays the user's workout and exercise names, allowing
 * them to add new ones and edit/delete existing ones
 */
export function SettingsApp({profile}: {profile: Profile}) {
  const {showAlert} = useAlerts()

  const {mutate: updateProfile} = useUpdateProfile({
    onSuccess() {
      showAlert({
        text: "Settings updated",
        type: "success",
      })
    },
  })
  const {mutating} = useMutating({key: "session"})

  const [liftNames, setLiftNames] = React.useState(profile.liftNames)
  const [workoutNames, setWorkoutNames] = React.useState(profile.workoutNames)

  const [values, setValues] = React.useState({lift: "", workout: ""})
  const {lift, workout} = values

  const liftNamesRef = React.useRef(liftNames)
  const workoutNamesRef = React.useRef(workoutNames)

  React.useEffect(() => {
    liftNamesRef.current = liftNames
  }, [liftNames])

  React.useEffect(() => {
    workoutNamesRef.current = workoutNames
  }, [workoutNames])

  React.useEffect(() => {
    return () => {
      saveChanges()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-grow justify-center">
      <div className="flex max-h-[calc(100dvh-57px)] w-screen flex-grow justify-center divide-x divide-slate-700 border-slate-700 bg-gray-100 dark:bg-gray-900 md:mt-10 md:max-h-[calc(100dvh-128px)] md:max-w-2xl md:rounded-lg md:border">
        <div className="flex w-full flex-grow flex-col items-center overflow-hidden">
          <div className="flex w-full flex-grow flex-col justify-center overflow-hidden px-4 pt-6 sm:px-6">
            <form onSubmit={handleLiftSubmit}>
              <div className="flex items-center justify-center gap-4 text-lg">
                <input
                  name="lift"
                  value={lift}
                  placeholder="New exercise"
                  {...{onChange}}
                />
                {lift && (
                  <IconButton
                    aria-label="Clear lift"
                    className="max-sm:hidden"
                    icon={<FontAwesomeIcon icon={faXmarkSquare} size="lg" />}
                    onClick={() => setValues({...values, lift: ""})}
                  />
                )}
              </div>
              {lift && (
                <>
                  {liftNames.some(
                    ({text}) => text.toLowerCase() === lift.toLowerCase(),
                  ) ? (
                    <p className="mt-1 text-center text-red-500">
                      Duplicate name
                    </p>
                  ) : (
                    <div className="flex justify-center">
                      <Button
                        className="mt-3 w-fit"
                        type="submit"
                        variant="secondary"
                      >
                        Add Name
                      </Button>
                    </div>
                  )}
                </>
              )}
            </form>
            <ul className="h-full overflow-y-scroll pb-6 pt-2">
              {sortBy(
                liftNames.filter(n => !n.isHidden),
                "text",
              ).map(liftName => (
                <EditableListItem
                  editableName={liftName}
                  editableNameList={liftNames}
                  key={liftName.id}
                  updateOptions={updateLiftNames}
                />
              ))}
              {sortBy(
                liftNames.filter(({isHidden}) => isHidden),
                "text",
              ).map(liftName => (
                <EditableListItem
                  editableName={liftName}
                  editableNameList={liftNames}
                  key={liftName.id}
                  updateOptions={updateLiftNames}
                />
              ))}
            </ul>
          </div>
        </div>
        <div className="flex w-full flex-grow flex-col items-center overflow-hidden">
          <div className="flex w-full flex-grow flex-col justify-center overflow-hidden px-4 pt-6 sm:px-6">
            <form onSubmit={handleWorkoutSubmit}>
              <div className="flex items-center justify-center gap-4 text-lg">
                <input
                  name="workout"
                  value={workout}
                  placeholder="New workout"
                  {...{onChange}}
                />
                {workout && (
                  <IconButton
                    aria-label="Clear workout"
                    className="hidden sm:block"
                    icon={<FontAwesomeIcon icon={faXmarkSquare} size="lg" />}
                    onClick={() => setValues({...values, workout: ""})}
                  />
                )}
              </div>
              {workout && (
                <>
                  {workoutNames.some(
                    ({text}) => text.toLowerCase() === workout.toLowerCase(),
                  ) ? (
                    <p className="mt-1 text-center text-red-500">
                      Duplicate name
                    </p>
                  ) : (
                    <div className="flex justify-center">
                      <Button
                        className="mt-3 w-fit"
                        type="submit"
                        variant="secondary"
                      >
                        Add Name
                      </Button>
                    </div>
                  )}
                </>
              )}
            </form>
            <ul className="h-full overflow-y-scroll pb-6 pt-2">
              {sortBy(
                workoutNames.filter(n => !n.isHidden),
                "text",
              ).map(workoutName => (
                <EditableListItem
                  key={workoutName.id}
                  editableName={workoutName}
                  editableNameList={workoutNames}
                  updateOptions={updateWorkoutNames}
                />
              ))}
              {sortBy(
                workoutNames.filter(({isHidden}) => isHidden),
                "text",
              ).map(workoutName => (
                <EditableListItem
                  key={workoutName.id}
                  editableName={workoutName}
                  editableNameList={workoutNames}
                  updateOptions={updateWorkoutNames}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * Saves the profile unless it is unchanged
   */
  function saveChanges() {
    if (mutating) {
      return
    }

    if (
      isEqual(
        workoutNamesRef.current.map(name => omit(name, "canDelete")),
        profile.workoutNames.map(name => omit(name, "canDelete")),
      ) &&
      isEqual(
        liftNamesRef.current.map(name => omit(name, "canDelete")),
        profile.liftNames.map(name => omit(name, "canDelete")),
      )
    ) {
      return
    }

    updateProfile({
      ...profile,
      liftNames: liftNamesRef.current.map(({id, text, isHidden}) => ({
        id,
        text,
        isHidden,
      })),
      workoutNames: workoutNamesRef.current.map(({id, text, isHidden}) => ({
        id,
        text,
        isHidden,
      })),
    })
  }

  /**
   * Handles updates to the form inputs, sanitizing the values
   */
  function onChange({
    target: {name, value},
  }: React.ChangeEvent<HTMLInputElement>) {
    if (!value || /^[A-Za-z ]+$/.test(value)) {
      setValues({
        ...values,
        [name]: value.trimStart().replace(/\s/, " ").substring(0, 36),
      })
    }
  }

  /**
   * Saves a lift name unless it is a duplicate
   */
  function handleLiftSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (
      lift &&
      !liftNames.some(
        ({text}) =>
          text.toLowerCase().replace(/\s/g, "") ===
          lift.toLowerCase().replace(/\s/g, ""),
      )
    ) {
      setLiftNames([
        ...liftNames,
        {
          id: nanoid(),
          text: lift.trim(),
          canDelete: true,
        },
      ])
      setValues({...values, lift: ""})
    }
  }

  /**
   * Saves a workout name unless it is a duplicate
   */
  function handleWorkoutSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (
      workout &&
      !workoutNames.some(
        ({text}) =>
          text.toLowerCase().replace(/\s/g, "") ===
          workout.toLowerCase().replace(/\s/g, ""),
      )
    ) {
      setWorkoutNames([
        ...workoutNames,
        {
          id: nanoid(),
          text: workout.trim(),
          canDelete: true,
        },
      ])
      setValues({...values, workout: ""})
    }
  }

  /**
   * Handles deleted or updated workout names
   */
  function updateWorkoutNames(
    {text, isHidden}: EditableName,
    workoutName: EditableName,
  ) {
    if (!text && workoutName.canDelete && workoutNames.length > 1) {
      setWorkoutNames(workoutNames.filter(({id}) => id !== workoutName.id))
    } else if (text && !isTextAlreadyInList(text, workoutNames)) {
      setWorkoutNames(
        workoutNames.map(name =>
          name.id === workoutName.id ? {...name, text} : name,
        ),
      )
    } else {
      setWorkoutNames(
        workoutNames.map(name =>
          name.id === workoutName.id ? {...name, isHidden} : name,
        ),
      )
    }
  }

  /**
   * Handles deleted or updated lift names
   */
  function updateLiftNames(
    {text, isHidden}: EditableName,
    liftName: EditableName,
  ) {
    if (!text && liftName.canDelete && liftNames.length > 1) {
      setLiftNames(liftNames.filter(({id}) => id !== liftName.id))
    } else if (text && !isTextAlreadyInList(text, liftNames)) {
      setLiftNames(
        liftNames.map(name =>
          name.id === liftName.id ? {...name, text} : name,
        ),
      )
    } else {
      setLiftNames(
        liftNames.map(name =>
          name.id === liftName.id ? {...name, isHidden} : name,
        ),
      )
    }
  }
}
