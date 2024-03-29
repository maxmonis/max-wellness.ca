import {NextApiRequest, NextApiResponse} from "next"
import {getUserProfile, getUserWorkouts} from "~/firebase/server"
import {extractErrorMessage} from "~/shared/functions/parsers"
import {generateSession} from "~/shared/functions/session"
import {hasChars} from "~/shared/functions/validators"

/**
 * Handles requests to load the current session
 */
export default async function sessionApi(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {userId} = req.query

  switch (req.method) {
    case "GET": {
      if (!hasChars(userId)) {
        return res.status(400).json("Missing required field: userId")
      }

      try {
        const [profile, workouts]: [
          Awaited<ReturnType<typeof getUserProfile>>,
          Awaited<ReturnType<typeof getUserWorkouts>>,
        ] = await Promise.all([getUserProfile(userId), getUserWorkouts(userId)])

        if (!profile || !workouts) {
          return res.status(404).json(`No session found for user ID: ${userId}`)
        }

        const session = generateSession(profile, workouts)
        return res.json(session)
      } catch (error) {
        return res.status(500).json(extractErrorMessage(error))
      }
    }
    default: {
      return res.status(405).json(`${req.method} not allowed in sessionApi`)
    }
  }
}
