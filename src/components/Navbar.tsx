import { UserMenu } from "@/components/UserMenu"
import { useSession } from "@/hooks/useSession"
import {
	faCirclePlus,
	faFilter,
	faGear,
	faHome,
	faQuestionCircle,
	faTable,
	faUserPlus,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import { IconButton } from "./CTA"

/**
 * The site's main navbar, which is displayed at the bottom of
 * the screen on narrow viewports and to the left on wider ones
 */
export default function Navbar() {
	const { loading, session } = useSession()
	const hasWorkouts = Boolean(session?.workouts.length)
	const homeHref = hasWorkouts ? "/" : session ? "/?view=create" : "/login"

	return (
		<div className="flex max-h-screen items-center border-slate-700 max-md:h-14 max-md:w-screen max-md:border-t md:border-r md:pl-2">
			<div className="flex h-full w-full flex-col items-center justify-center gap-10 px-4 sm:px-6 md:h-full md:justify-between md:overflow-y-scroll">
				<div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-y-4 sm:py-6 md:h-full md:flex-col md:items-start md:justify-start">
					<div className="md:mb-6">
						<IconButton
							className="max-sm:p-4"
							href={homeHref}
							icon={
								<Image
									alt="Logo"
									className="h-6 w-6 min-w-max rounded-md border"
									src="/android-chrome-192x192.png"
									height={24}
									width={24}
								/>
							}
							text="maxWellness"
							textClass="max-sm:sr-only"
						/>
					</div>
					{loading ? (
						<></>
					) : session ? (
						<>
							<div className="flex flex-col gap-x-6 gap-y-4 max-md:hidden">
								{hasWorkouts && (
									<IconButton
										className="-ml-3 rounded-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
										href={homeHref}
										icon={<FontAwesomeIcon icon={faHome} size="lg" />}
										text="Home"
									/>
								)}
								<IconButton
									className="-ml-3 rounded-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
									color="blue"
									href="/?view=create"
									icon={<FontAwesomeIcon icon={faCirclePlus} size="lg" />}
									text="Create"
								/>
								{hasWorkouts && (
									<>
										<IconButton
											className="-ml-3 rounded-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
											href="/?view=filters"
											icon={<FontAwesomeIcon icon={faFilter} size="lg" />}
											text="Filters"
										/>
										<IconButton
											className="-ml-3 rounded-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
											href="/?view=table"
											icon={<FontAwesomeIcon icon={faTable} size="lg" />}
											text="Table"
										/>
									</>
								)}
							</div>
							<IconButton
								className="rounded-full max-xs:p-4 md:-ml-3 md:px-3 md:py-2 md:hover:bg-gray-100 md:dark:hover:bg-gray-800"
								href="/settings"
								icon={<FontAwesomeIcon icon={faGear} size="lg" />}
								text="Settings"
								textClass="max-xs:sr-only"
							/>
							<IconButton
								className="rounded-full max-xs:p-4 md:-ml-3 md:px-3 md:py-2 md:hover:bg-gray-100 md:dark:hover:bg-gray-800"
								href="/about"
								icon={<FontAwesomeIcon icon={faQuestionCircle} size="lg" />}
								text="About"
								textClass="max-xs:sr-only"
							/>
						</>
					) : (
						<IconButton
							className="rounded-full max-xs:p-4 md:-ml-3 md:px-3 md:py-2 md:hover:bg-gray-100 md:dark:hover:bg-gray-800"
							href="/register"
							icon={<FontAwesomeIcon icon={faUserPlus} size="lg" />}
							text="Sign Up"
							textClass="max-xs:sr-only"
						/>
					)}
					<div className="mb-6 max-md:hidden" />
					<UserMenu className="md:mb-0 md:mt-auto" />
				</div>
				<footer className="flex w-full flex-col items-center justify-end gap-4 whitespace-nowrap pb-2 text-center text-sm max-md:hidden">
					<a
						href="https://maxmonis.com/"
						rel="noopener noreferrer"
						target="_blank"
					>
						© Max Monis 2019-{new Date().getFullYear()}
					</a>
				</footer>
			</div>
		</div>
	)
}
