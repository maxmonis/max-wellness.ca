import {useQueryClient} from "react-query"

import {useAuth} from "~/context/AuthContext"

export default function useInvalidateSession() {
  const [user] = useAuth()
  const queryClient = useQueryClient()

  return () =>
    queryClient.invalidateQueries({
      predicate: ({queryKey}) => {
        if (queryKey[0] !== "session") {
          return false
        }
        const params = queryKey[1]
        if (typeof params === "object" && params !== null) {
          if ("userId" in params && params.userId !== user?.uid) {
            return false
          }
        }
        return true
      },
    })
}
