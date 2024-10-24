import { BackButton } from "@/components/BackButton"
import { Page } from "@/components/Page"
import { buttonVariants } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { cn } from "@/lib/utils"
import Link from "next/link"

/**
 * Displays text and GIFs showing how to use the app
 */
export default function InfoPage() {
	const { user } = useAuth()

	return (
		<Page title="About">
			<div className="w-full lg:max-w-3xl lg:border-r">
				<div className="p1-2 flex h-14 items-center border-b px-4 pt-1 sm:px-6">
					<div className="flex items-center">
						<BackButton />
						<h1 className="text-lg">About</h1>
					</div>
				</div>
				<div className="mx-auto flex h-full max-h-[calc(100dvh-7rem)] w-full flex-col items-center overflow-y-auto px-4 sm:px-6 md:max-h-[calc(100dvh-3.5rem)]">
					<div className="flex flex-col gap-12 pb-12 pt-6">
						<div>
							<div className="mx-auto flex max-w-prose flex-col gap-4">
								<h3 className="text-center text-lg">Overview</h3>
								<p>
									This website allows you to create a free account using your
									Google credentials or an email/password combination. It&apos;s
									a handy way to keep track of your weightlifting workouts and
									personal bests, and can be used on devices of any size.
								</p>
								<Video className="max-w-xs" src="mobile-view" />
							</div>
						</div>
						<div>
							<div className="mx-auto flex max-w-prose flex-col gap-4">
								<h3 className="text-center text-lg">Creating Workouts</h3>
								<p>
									To create a new workout, add exercises by selecting their
									name, sets, reps, and weight. You can drag and drop exercises
									to reorder them, and clicking the x icon next to an exercise
									will delete it. When you&apos;ve finished adding exercises,
									select a name and date for your workout and click the save
									button.
								</p>
								<Video src="creating-workouts" />
								<p>
									Each exercise must include a weight or at least one rep. This
									is because you could do 10 bodyweight squats or you could
									squat 100 pounds one time, but you can&apos;t do zero reps
									with zero weight.
								</p>
								<p>
									Back-to-back sets of the same exercise with the same weight
									and reps will automatically be combined. For example,
									2(10x100) immediately followed by 3(10x100) will become
									5(10x100).
								</p>
								<p>
									Personal records will be indicated with asterisks (one
									indicates that the record has been broken, two means it&apos;s
									still your record). These records will be automatically
									refreshed any time you add, edit, or remove a workout.
								</p>
							</div>
						</div>
						<div>
							<div className="mx-auto flex max-w-prose flex-col gap-4">
								<h3 className="text-center text-lg">Managing Names</h3>
								<p>
									The Settings page allows you to add, update, or delete the
									names you use for workouts and exercises. Names must be
									unique.
								</p>
								<Video src="managing-names" />
							</div>
						</div>
						<div>
							<div className="mx-auto flex max-w-prose flex-col gap-4">
								<h3 className="text-center text-lg">Managing Workouts</h3>
								<p>
									The ellipsis icon to the right of each workout in the list
									allows you to duplicate it, copy it to clipboard, edit it, or
									delete it. Please note that edits and deletions cannot be
									undone once confirmed.
								</p>
								<Video src="managing-workouts" />
							</div>
						</div>
						<div>
							<div className="mx-auto flex max-w-prose flex-col gap-4">
								<h3 className="text-center text-lg">Tips and Tricks</h3>
								<p>
									While you&apos;re entering a new workout you can click on the
									name, date, or exercise of an existing workout to copy that
									value. The Filters page allows you to sort or filter the
									workouts list, and the Calendar page provides an alternate way
									to view your workouts sorted by date or exercise name.
								</p>
								<Video src="tips-and-tricks" />
								<p>
									If you ever need help you can always return to this About page
									by clicking the question mark icon in the navbar. That&apos;s
									all you need to know, time to add some workouts!
								</p>
								<div className="mt-8 flex w-full justify-center">
									<Link
										className={cn(buttonVariants({ variant: "default" }))}
										href={user ? "/?view=create" : "/register"}
									>
										{user ? "New Workout" : "Get Started"}
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Page>
	)
}

function Video({ className, src }: { className?: string; src: string }) {
	return (
		<video
			className={cn("mx-auto my-2 w-full border", className)}
			controls
			height="240"
			width="320"
		>
			<source src={`/info/${src}.mp4`} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	)
}
