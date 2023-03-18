import React from "react"
import Link from "next/link"
import {useRouter} from "next/router"

import {GoogleButton} from "~/components/CTA"
import Page from "~/components/Page"
import {logIn} from "~/firebase/client"
import {extractErrorMessage} from "~/utils/parsers"
import {validateAuthForm} from "~/utils/validators"

export default function LoginPage() {
  const router = useRouter()

  const [values, setValues] = React.useState({
    email: "",
    password: "",
  })
  const {email, password} = values

  const [inputErrors, setInputErrors] = React.useState<
    ReturnType<typeof validateAuthForm>
  >({})

  const [submitting, setSubmitting] = React.useState(false)
  const [authError, setAuthError] = React.useState("")

  return (
    <Page mustBeLoggedOut title="Login">
      <div className="flex flex-col items-center py-10 px-4 h-full w-full">
        <form
          className="flex flex-col items-start max-w-xs w-full bg-black gap-6 border rounded-md p-6"
          {...{onSubmit}}
        >
          {authError && <p className="text-red-500 text-md">{authError}</p>}
          <div className="w-full">
            <input
              className="px-3 py-2 rounded w-full"
              name="email"
              placeholder="Email"
              value={email}
              {...{onChange}}
            />
            {inputErrors.email && (
              <p className="text-red-500 text-sm">{inputErrors.email}</p>
            )}
          </div>
          <div className="w-full">
            <input
              className="px-3 py-2 rounded w-full"
              name="password"
              placeholder="Password"
              type="password"
              value={password}
              {...{onChange}}
            />
            {inputErrors.password && (
              <p className="text-red-500 text-sm">{inputErrors.password}</p>
            )}
          </div>
          <button
            className="px-4 py-2 border rounded w-full text-blue-300 border-blue-300"
            type="submit"
          >
            Log In
          </button>
          <GoogleButton {...{handleError, submitting, setSubmitting}} />
          <div className="flex flex-col items-start gap-2">
            <div>
              <Link
                className="hover:underline text-blue-300"
                href="/reset-password"
              >
                Forgot Password
              </Link>
            </div>
            <div className="flex gap-4 center-align justify-center">
              <div className="flex flex-wrap gap-x-2">
                <p className="whitespace-nowrap">Need an account?</p>
                <Link
                  className="hover:underline text-blue-300"
                  href="/register"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Page>
  )

  function onChange({
    target: {name, value},
  }: React.ChangeEvent<HTMLInputElement>) {
    setValues({...values, [name]: value})
    setInputErrors({})
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) {
      return
    }

    const inputErrors = validateAuthForm({...values, page: "login"})
    setInputErrors(inputErrors)
    if (Object.keys(inputErrors).length > 0) {
      setTimeout(() => {
        setInputErrors({})
      }, 3000)
      return
    }

    setSubmitting(true)
    try {
      await logIn(email, password)
      router.push("/")
    } catch (error) {
      handleError(error)
    } finally {
      setSubmitting(false)
    }
  }

  function handleError(error: unknown) {
    setAuthError(extractErrorMessage(error))
    setTimeout(() => {
      setAuthError("")
    }, 3000)
  }
}
