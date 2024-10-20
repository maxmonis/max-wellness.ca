const withPWA = require("next-pwa")({
	dest: "public",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			/* Google auth user initial image */
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
				pathname: "/**",
			},
			/* images the user has uploaded to Firebase */
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
				port: "",
				pathname: "/v0/b/max-wellness.appspot.com/o/users**",
			},
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
				port: "",
				pathname: "/v0/b/max-wellness.appspot.com/o/images**",
			},
		],
	},
	reactStrictMode: false,
}

module.exports =
	process.env.NODE_ENV === "production" ? withPWA(nextConfig) : nextConfig
