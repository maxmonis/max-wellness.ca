import { UserMenu } from "@/components/UserMenu"
import { buttonVariants } from "@/components/ui/button"
import { useSession } from "@/hooks/useSession"
import { cn } from "@/lib/utils"
import {
	CalendarIcon,
	GearIcon,
	HomeIcon,
	MagnifyingGlassIcon,
	PersonIcon,
	PlusIcon,
	QuestionMarkCircledIcon,
} from "@radix-ui/react-icons"
import Image from "next/image"
import Link from "next/link"

/**
 * The site's main navbar, which is displayed at the bottom of
 * the screen on narrow viewports and to the left on wider ones
 */
export default function Navbar() {
	const { loading, session } = useSession()
	const hasWorkouts = Boolean(session?.workouts.length)
	const homeHref = hasWorkouts ? "/" : session ? "/?view=create" : "/login"

	return (
		<div className="flex max-h-screen items-center border-slate-700 max-md:h-14 max-md:w-screen max-md:border-t md:max-w-min md:border-r">
			<div className="flex h-full w-full flex-col items-center justify-center px-2 md:h-full md:justify-between md:overflow-y-scroll md:px-4 xl:px-6">
				<div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-y-4 md:h-full md:flex-col md:items-start md:justify-start md:py-5">
					<div className="md:mb-4">
						<Link
							className={cn(
								"flex w-full gap-1.5",
								buttonVariants({ variant: "ghost" }),
							)}
							href={homeHref}
						>
							<Image
								alt="Logo"
								className="h-6 w-6 min-w-max rounded-md border max-sm:h-7 max-sm:w-7"
								src="/android-chrome-192x192.png"
								height={24}
								width={24}
							/>
							<span className="text-lg max-sm:sr-only" translate="no">
								maxWellness
							</span>
						</Link>
					</div>
					{loading ? (
						<></>
					) : session ? (
						<>
							<div className="flex w-full flex-col gap-x-6 gap-y-4 max-md:hidden">
								{hasWorkouts && (
									<Link
										className={cn(
											"flex w-full gap-1.5",
											buttonVariants({ variant: "outline" }),
										)}
										href={homeHref}
									>
										<HomeIcon className="h-5 w-5" />
										<span className="font-bold md:w-16">Home</span>
									</Link>
								)}
								<Link
									className={cn(
										"flex w-full gap-1.5",
										buttonVariants({ variant: "default" }),
									)}
									href="/?view=create"
								>
									<PlusIcon className="h-5 w-5" />
									<span className="font-bold md:w-16">Create</span>
								</Link>
								{hasWorkouts && (
									<>
										<Link
											className={cn(
												"flex w-full gap-1.5",
												buttonVariants({ variant: "outline" }),
											)}
											href="/?view=filters"
										>
											<MagnifyingGlassIcon className="h-5 w-5" />
											<span className="font-bold md:w-16">Filters</span>
										</Link>
										<Link
											className={cn(
												"flex w-full gap-1.5",
												buttonVariants({ variant: "outline" }),
											)}
											href="/?view=calendar"
										>
											<CalendarIcon className="h-5 w-5" />
											<span className="font-bold md:w-16">Calendar</span>
										</Link>
									</>
								)}
							</div>
							<Link
								className={cn(
									"flex w-full gap-1.5 max-md:max-w-min",
									buttonVariants({ variant: "outline" }),
								)}
								href="/settings"
							>
								<GearIcon className="h-5 w-5" />
								<span className="font-bold max-xs:sr-only md:w-16">
									Settings
								</span>
							</Link>
							<Link
								className={cn(
									"flex w-full gap-1.5 max-md:max-w-min",
									buttonVariants({ variant: "outline" }),
								)}
								href="/about"
							>
								<QuestionMarkCircledIcon className="h-5 w-5" />
								<span className="font-bold max-xs:sr-only md:w-16">About</span>
							</Link>
						</>
					) : (
						<Link
							className={cn(
								"flex w-full gap-1.5 max-md:max-w-min",
								buttonVariants({ variant: "outline" }),
							)}
							href="/register"
						>
							<PersonIcon className="h-5 w-5" />
							<span className="font-bold md:w-16">Sign Up</span>
						</Link>
					)}
					<div className="mb-6 max-md:hidden" />
					<div className="mb-0 mt-auto md:w-full">
						<UserMenu />
					</div>
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
