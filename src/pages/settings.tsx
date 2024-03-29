import {SettingsApp} from "~/features/settings/components/SettingsApp"
import {SettingsLoader} from "~/features/settings/components/SettingsLoader"
import {Page} from "~/shared/components/Page"
import {useSession} from "~/shared/hooks/useSession"

/**
 * Allows the user to manage the names of workouts and exercises
 */
export default function SettingsPage() {
  const {data, isLoading, error} = useSession()

  return (
    <Page
      component={SettingsApp}
      Loader={SettingsLoader}
      loading={isLoading}
      mustBeLoggedIn
      props={data && {profile: data.profile}}
      title="Settings"
      {...{error}}
    />
  )
}
