import React from "react"

import {
  faEllipsis,
  faHome,
  faMinusCircle,
  faPen,
  faTrash,
  faXmarkSquare,
} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import isEqual from "lodash/isEqual"
import omit from "lodash/omit"
import sortBy from "lodash/sortBy"
import {nanoid} from "nanoid"

import Page from "~/shared/components/Page"
import {Button, IconButton, UserMenu} from "~/shared/components/CTA"
import {useAlerts} from "~/shared/context/AlertContext"
import useKeypress from "~/shared/hooks/useKeypress"
import useOutsideClick from "~/shared/hooks/useOutsideClick"
import useSession from "~/shared/hooks/useSession"
import useUpdateProfile from "~/shared/hooks/useUpdateProfile"
import {EditableName, Profile} from "~/shared/resources/models"
import useInvalidateSession from "~/shared/hooks/useInvalidateSession"

/**
 * Allows the user to manage the names of workouts and exercises
 */
export default function SettingsPage() {
  const [session, loading, error] = useSession()

  return (
    <Page
      component={SettingsApp}
      Loader={SettingsLoader}
      mustBeLoggedIn
      props={session && {profile: session.profile}}
      title="Settings"
      {...{error, loading}}
    />
  )
}

function SettingsLoader() {
  return (
    <div className="flex flex-col items-center h-screen overflow-hidden border-slate-700">
      <div className="w-screen">
        <div className="bg-slate-50 dark:bg-black flex gap-6 items-center justify-between h-16 px-6 border-slate-700 border-b max-w-screen-md md:border-x mx-auto">
          {Array.from({length: 2}).map((_, i) => (
            <span
              className="h-7 w-7 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse"
              key={i}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center divide-x divide-slate-700 border-slate-700 w-screen min-h-full max-w-screen-md md:border-x">
        {Array.from({length: 2}).map((_, i) => (
          <div
            className="flex flex-col flex-grow items-center w-full overflow-hidden"
            key={i}
          >
            <div className="flex border-b py-4 px-4 sm:px-6 border-slate-700 w-full">
              <span className="h-7 w-24 rounded bg-slate-300 dark:bg-slate-700 animate-pulse" />
            </div>
            <div className="flex flex-col w-full justify-center pt-6 px-4 sm:px-6 overflow-hidden">
              <div className="flex">
                <span className="h-9 w-full rounded bg-slate-300 dark:bg-slate-700 animate-pulse" />
              </div>
              <div className="flex flex-col gap-5 h-full pt-6 pb-20">
                {Array.from({length: i === 0 ? 2 : 1}).map((_, j) => (
                  <div className="flex flex-col gap-5" key={`${i}-${j}`}>
                    {[24, 20, 20, 24].map((width, k) => (
                      <div
                        className="flex justify-between items-center"
                        key={`${i}-${j}-${k}`}
                      >
                        <span
                          className={`h-5 w-${width} rounded bg-slate-300 dark:bg-slate-700 animate-pulse`}
                        />
                        <div className="flex gap-4">
                          <span className="h-5 w-5 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsApp({profile}: {profile: Profile}) {
  const {showAlert} = useAlerts()
  const invalidateSession = useInvalidateSession()

  const updateProfile = useUpdateProfile({
    onMutate: () => setSubmitting(true),
    onSettled() {
      invalidateSession()
      setSubmitting(false)
    },
    onSuccess() {
      showAlert({
        text: "Settings updated",
        type: "success",
      })
    },
  })

  const [liftNames, setLiftNames] = React.useState(profile.liftNames)
  const [workoutNames, setWorkoutNames] = React.useState(profile.workoutNames)

  const [submitting, setSubmitting] = React.useState(false)
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
  }, [])

  return (
    <div className="flex justify-center border-slate-700 h-screen">
      <div className="fixed top-0 left-0 w-screen">
        <div className="bg-slate-50 dark:bg-black flex gap-6 items-center justify-between h-16 px-6 max-w-screen-md md:border-x mx-auto border-slate-700 border-b">
          <IconButton
            aria-label="Go to the home page"
            href="/"
            icon={<FontAwesomeIcon icon={faHome} size="xl" />}
            side="right"
            text="Home"
            textClass="max-sm:sr-only"
          />
          <UserMenu />
        </div>
      </div>
      <div className="flex justify-center divide-x divide-slate-700 border-slate-700 pt-16 w-screen max-w-screen-md md:border-x">
        <div className="flex flex-col flex-grow items-center w-full overflow-hidden">
          <div className="border-b py-4 px-4 sm:px-6 border-slate-700 w-full">
            <h3 className="text-xl">Exercises</h3>
          </div>
          <div className="flex flex-col flex-grow w-full justify-center pt-6 px-4 sm:px-6 overflow-hidden">
            <form onSubmit={handleLiftSubmit}>
              <div className="flex gap-4 items-center justify-center text-lg">
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
                    icon={<FontAwesomeIcon icon={faXmarkSquare} size="xl" />}
                    onClick={() => setValues({...values, lift: ""})}
                  />
                )}
              </div>
              {lift && (
                <>
                  {liftNames.some(
                    ({text}) => text.toLowerCase() === lift.toLowerCase(),
                  ) ? (
                    <p className="text-red-500 text-center mt-1">
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
            <ul className="h-full overflow-y-scroll pt-2 pb-20">
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
        <div className="flex flex-col flex-grow items-center w-full overflow-hidden">
          <div className="border-b py-4 px-4 sm:px-6 border-slate-700 w-full">
            <h3 className="text-xl">Workouts</h3>
          </div>
          <div className="flex flex-col flex-grow w-full justify-center pt-6 px-4 sm:px-6 overflow-hidden">
            <form onSubmit={handleWorkoutSubmit}>
              <div className="flex gap-4 items-center justify-center text-lg">
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
                    icon={<FontAwesomeIcon icon={faXmarkSquare} size="xl" />}
                    onClick={() => setValues({...values, workout: ""})}
                  />
                )}
              </div>
              {workout && (
                <>
                  {workoutNames.some(
                    ({text}) => text.toLowerCase() === workout.toLowerCase(),
                  ) ? (
                    <p className="text-red-500 text-center mt-1">
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
            <ul className="h-full overflow-y-scroll pt-2 pb-20">
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
  async function saveChanges() {
    if (submitting) {
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

/**
 * Allows the user to edit and delete a lift/workout name
 */
function EditableListItem({
  editableName,
  editableNameList,
  updateOptions,
}: {
  editableName: EditableName
  editableNameList: EditableName[]
  updateOptions: (newValue: EditableName, previousValue: EditableName) => void
}) {
  const [newText, setNewText] = React.useState(editableName.text)
  const [editing, setEditing] = React.useState(false)

  const isDuplicate = isTextAlreadyInList(newText, editableNameList)
  const canHide = editableNameList.filter(n => !n.isHidden).length > 1

  return (
    <li className="mt-4 flex items-center justify-between gap-4">
      {editing ? (
        <form className="w-full" {...{onSubmit}}>
          <div className="flex gap-4 items-center justify-center px-1">
            <input autoFocus value={newText} {...{onChange, onKeyUp}} />
            <IconButton
              aria-label="Discard changes"
              className="max-sm:hidden"
              icon={<FontAwesomeIcon icon={faXmarkSquare} size="xl" />}
              onClick={handleReset}
            />
          </div>
          {newText !== editableName.text && (
            <div className="flex justify-center mb-2">
              {isDuplicate ? (
                <p className="text-red-500 text-center mt-1">Duplicate name</p>
              ) : newText ? (
                <Button
                  className="mt-3 w-fit"
                  type="submit"
                  variant="secondary"
                >
                  Update Name
                </Button>
              ) : editableName.canDelete ? (
                <Button className="mt-3 w-fit" type="submit" variant="danger">
                  Delete Name
                </Button>
              ) : (
                <p className="text-red-500 text-center mt-1 text-sm">
                  Can't delete, used in workout(s)
                </p>
              )}
            </div>
          )}
        </form>
      ) : (
        <>
          <span
            aria-label={`Edit ${newText}`}
            className={`leading-tight ${
              editableName.isHidden ? "line-through" : ""
            }`}
            onClick={() => setEditing(true)}
          >
            {newText}
          </span>
          <EditableItemMenu
            onDeleteClick={handleDelete}
            onEditClick={() => setEditing(true)}
            {...{canHide, editableName, newText, onHideClick}}
          />
        </>
      )}
    </li>
  )

  /**
   * Handles form updates, sanitizing the value
   */
  function onChange({target: {value}}: React.ChangeEvent<HTMLInputElement>) {
    if (!value || /^[A-Za-z ]+$/.test(value)) {
      setNewText(value.trimStart().replace(/\s/, " "))
    }
  }

  /**
   * Cancels editing if the user presses the escape key
   */
  function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setEditing(false)
      setNewText(editableName.text)
    }
  }

  /**
   * Attempts to save the user's changes
   */
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isDuplicate) {
      setNewText(editableName.text)
    } else if (!newText.trim()) {
      handleDelete()
    } else {
      updateOptions({...editableName, text: newText.trim()}, editableName)
    }
    setEditing(false)
  }

  /**
   * Deletes the name (if allowed)
   */
  function handleDelete() {
    if (editableName.canDelete && editableNameList.length > 1) {
      updateOptions({...editableName, text: ""}, editableName)
    } else {
      handleReset()
    }
  }

  /**
   * Updates whether a name is hidden (if possible)
   */
  function onHideClick() {
    const newHidden = !editableName.isHidden
    if ((canHide && newHidden) || !newHidden) {
      updateOptions({...editableName, isHidden: newHidden}, editableName)
    }
  }

  /**
   * Resets the component
   */
  function handleReset() {
    setEditing(false)
    setNewText(editableName.text)
  }
}

/**
 * Evaluates whether text exists in a list of names (case insensitive)
 */
function isTextAlreadyInList(newText: string, allNames: EditableName[]) {
  return allNames.some(
    ({text}) =>
      text.toLowerCase().replace(/\s/g, "") ===
      newText.toLowerCase().replace(/\s/g, ""),
  )
}

/**
 * Allows the user to update or hide a name,
 * and also to delete it (if possible)
 */
function EditableItemMenu({
  canHide,
  editableName: {canDelete, isHidden},
  newText,
  onDeleteClick,
  onEditClick,
  onHideClick,
}: {
  canHide: boolean
  editableName: EditableName
  newText: string
  onDeleteClick: () => void
  onEditClick: () => void
  onHideClick: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const ref = useOutsideClick(() => setOpen(false))
  useKeypress("Escape", () => setOpen(false))

  return (
    <div className="relative" {...{ref}}>
      <IconButton
        aria-label="Toggle menu"
        className={`p-1 rounded-lg border ${
          open
            ? "bg-slate-100 border-slate-300 dark:bg-black"
            : "border-transparent"
        }`}
        icon={<FontAwesomeIcon icon={faEllipsis} size="xl" />}
        onClick={() => setOpen(!open)}
      />
      {open && (
        <dialog className="z-10 flex flex-col items-start gap-4 border border-slate-700 absolute w-28 top-8 -left-24 p-4 rounded-lg">
          <IconButton
            aria-label={`Edit ${newText}`}
            icon={<FontAwesomeIcon icon={faPen} />}
            onClick={onEditClick}
            side="right"
            text="Edit"
            textClass="whitespace-nowrap"
          />
          {((canHide && !isHidden) || isHidden) && (
            <IconButton
              aria-label={`${isHidden ? "Unhide" : "Hide"} ${newText}`}
              icon={<FontAwesomeIcon icon={faMinusCircle} />}
              onClick={onHideClick}
              side="right"
              text={isHidden ? "Unhide" : "Hide"}
            />
          )}
          {canDelete && (
            <IconButton
              icon={
                <FontAwesomeIcon
                  aria-label={`Delete ${newText}`}
                  icon={faTrash}
                />
              }
              onClick={onDeleteClick}
              side="right"
              text="Delete"
            />
          )}
        </dialog>
      )}
    </div>
  )
}
