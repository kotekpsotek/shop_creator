import { join } from 'path';
import type { Config } from 'tailwindcss';

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';
import flowbite from "flowbite/plugin";

// Import Forms plugin for tailwindcss
import forms from "@tailwindcss/forms"

const contentSkeleton = [
	'./src/**/*.{html,js,svelte,ts}',
	// 3. Append the path to the Skeleton package
	join(require.resolve(
		'@skeletonlabs/skeleton'),
		'../**/*.{html,js,svelte,ts}'
	)
];
const contentFlowbite = ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'];

const config = {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: [...contentSkeleton, ...contentFlowbite],
	theme: {
		extend: {
			colors: {
				// flowbite-svelte
				flowbite: {
					50: '#FFF5F2',
					100: '#FFF1EE',
					200: '#FFE4DE',
					300: '#FFD5CC',
					400: '#FFBCAD',
					500: '#FE795D',
					600: '#EF562F',
					700: '#EB4F27',
					800: '#CC4522',
					900: '#A5371B'
				  }
			}
		},
	},
	plugins: [
		skeleton({
			themes: { preset: [ "wintry" ] }
		}),
		forms,
		flowbite
	]
} satisfies Config;

export default config;
						