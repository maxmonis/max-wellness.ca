import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": "/src",
		},
	},
	test: {
		coverage: {
			include: ["src/**/*.{ts,tsx}"],
		},
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
	},
})
