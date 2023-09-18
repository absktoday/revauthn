import { purgeCss } from 'vite-plugin-tailwind-purgecss'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
	server: {
		https: true,
		host: 'rev.absk.io'
	},
	plugins: [sveltekit(), purgeCss(), mkcert()]
})
