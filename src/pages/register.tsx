import { GoogleButton } from "@/components/CTA"
import { Page } from "@/components/Page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signUp } from "@/firebase/app"
import { extractErrorMessage } from "@/utils/parsers"
import { validateAuthForm } from "@/utils/validators"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

/**
 * Allows new users to create an account with Google or email/password
 */
export default function RegisterPage() {
	const router = useRouter()

	const [values, setValues] = React.useState({
		email: "",
		password: "",
		password2: "",
		userName: "",
	})
	const { userName, email, password, password2 } = values

	const [inputErrors, setInputErrors] = React.useState<
		ReturnType<typeof validateAuthForm>
	>({})

	const [submitting, setSubmitting] = React.useState(false)
	const [authError, setAuthError] = React.useState("")

	return (
		<Page mustBeLoggedOut title="Register">
			<div className="flex h-full w-full flex-col items-center px-4 py-10">
				<form
					className="flex w-full max-w-xs flex-col items-start gap-6 rounded-md border bg-background p-6"
					{...{ onSubmit }}
				>
					<h1
						className="mx-auto flex items-center gap-2 text-lg"
						translate="no"
					>
						<Image
							alt="Logo"
							className="h-6 w-6 min-w-max rounded-md border"
							src="/android-chrome-192x192.png"
							height={24}
							width={24}
						/>
						maxWellness
					</h1>
					{authError && (
						<p className="text-md text-red-600 dark:text-red-500">
							{authError}
						</p>
					)}
					<div className="w-full">
						<Input
							className="w-full rounded px-3 py-2"
							maxLength={40}
							name="userName"
							placeholder="Name"
							value={userName}
							{...{ onChange }}
						/>
						{inputErrors.userName && (
							<p className="text-sm text-red-600 dark:text-red-500">
								{inputErrors.userName}
							</p>
						)}
					</div>
					<div className="w-full">
						<Input
							className="w-full rounded px-3 py-2"
							name="email"
							placeholder="Email"
							value={email}
							{...{ onChange }}
						/>
						{inputErrors.email && (
							<p className="text-sm text-red-600 dark:text-red-500">
								{inputErrors.email}
							</p>
						)}
					</div>
					<div className="w-full">
						<Input
							className="w-full rounded px-3 py-2"
							name="password"
							placeholder="Password"
							type="password"
							value={password}
							{...{ onChange }}
						/>
						{inputErrors.password && (
							<p className="text-sm text-red-600 dark:text-red-500">
								{inputErrors.password}
							</p>
						)}
					</div>
					<div className="w-full">
						<Input
							className="w-full rounded px-3 py-2"
							name="password2"
							placeholder="Confirm Password"
							type="password"
							value={password2}
							{...{ onChange }}
						/>
						{inputErrors.password2 && (
							<p className="text-sm text-red-600 dark:text-red-500">
								{inputErrors.password2}
							</p>
						)}
					</div>
					<Button className="w-full" loading={submitting} type="submit">
						Create Account
					</Button>
					<GoogleButton {...{ handleError, submitting, setSubmitting }} />
					<div className="flex flex-col gap-2">
						<div className="flex flex-wrap gap-x-2">
							<p className="whitespace-nowrap">Already a member?</p>
							<Link
								className="text-blue-700 hover:underline dark:text-blue-400"
								href="/login"
							>
								Log In
							</Link>
						</div>
						<div>
							<Link
								className="text-blue-700 hover:underline dark:text-blue-400"
								href="/about"
							>
								Learn More
							</Link>
						</div>
					</div>
				</form>
			</div>
		</Page>
	)

	/**
	 * Handles changes to inputs and updates validation error accordingly
	 */
	function onChange({
		target: { name, value },
	}: React.ChangeEvent<HTMLInputElement>) {
		setValues({ ...values, [name]: value })
		setInputErrors({})
	}

	/**
	 * Attempts to register a new user using their email and password
	 */
	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		if (submitting) {
			return
		}

		const inputErrors = validateAuthForm({ ...values, page: "register" })
		setInputErrors(inputErrors)
		if (Object.keys(inputErrors).length > 0) {
			setTimeout(() => {
				setInputErrors({})
			}, 3000)
			return
		}

		setSubmitting(true)
		try {
			await signUp(userName, email, password)
			router.push("/about")
		} catch (error) {
			handleError(error)
		} finally {
			setSubmitting(false)
		}
	}

	/**
	 * Displays a registration error for a set interval
	 */
	function handleError(error: unknown) {
		setAuthError(extractErrorMessage(error))
		setTimeout(() => {
			setAuthError("")
		}, 3000)
	}
}
