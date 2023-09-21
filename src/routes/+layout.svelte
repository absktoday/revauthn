<script lang="ts">
	import '../app.postcss'
	import { Toast, initializeStores } from '@skeletonlabs/skeleton'

	initializeStores()
</script>

<Toast position="tr" />

<slot />
