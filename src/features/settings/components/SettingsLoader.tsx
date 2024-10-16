import { BackButton } from "@/components/BackButton"
import { cn } from "@/lib/utils"

/**
 * Displays a loading skeleton for the /settings route
 */
export function SettingsLoader() {
	return (
		<div className="flex min-h-screen flex-col justify-between lg:max-w-3xl lg:border-r">
			<div className="flex h-14 items-end border-b px-4 pb-2 lg:px-6">
				<BackButton />
				<h1 className="text-lg">Settings</h1>
			</div>
			<div className="flex w-full flex-grow justify-center">
				<div className="flex max-h-[calc(100dvh-7rem)] flex-grow divide-x md:max-h-[calc(100dvh-3.5rem)]">
					{Array.from({ length: 2 }).map((_, i) => (
						<div
							className="flex w-full flex-grow flex-col items-center overflow-hidden"
							key={i}
						>
							<div className="flex w-full flex-grow flex-col justify-center overflow-hidden px-4 pt-4 lg:px-6">
								<h2 className="mx-auto mb-4 text-center font-bold">
									{i ? "Workouts" : "Exercises"}
								</h2>
								<div className="flex">
									<span className="h-7 w-full animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
								</div>
								<div className="flex h-full flex-col gap-5 pt-6">
									{Array.from({ length: 3 - i }).map((_, j) => (
										<div className="flex flex-col gap-4" key={`${i}-${j}`}>
											{Array.from({ length: 2 }).map((_, k) => (
												<div
													className="flex items-center justify-between"
													key={`${i}-${j}-${k}`}
												>
													<span
														className={cn(
															"ml-1 h-3 animate-pulse rounded bg-slate-300 dark:bg-slate-700",
															k ? "w-16" : "w-20",
															((i + j) * k) % 5 && "max-xs:h-5 xs:w-28",
														)}
													/>
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
		</div>
	)
}
