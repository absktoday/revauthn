<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { FIDOScenario } from '$lib/enums';

	const toastStore = getToastStore();

	const submitForm: SubmitFunction = () => {
		return async ({ result, update }) => {
			switch (result.type) {
				case 'error':
					console.log('error');
					break;
				case 'success':
					console.log('success');
					console.log(result.data);

					switch (result.data?.fidoScenario) {
						case FIDOScenario.reg:
							const t: ToastSettings = {
								message: 'Successfully Registered!',
								hoverable: true,
								background: 'variant-filled-success'
							};
							toastStore.trigger(t);
							break;
						case FIDOScenario.auth:
							const t2: ToastSettings = {
								message: 'Successfully Logged In!',
								hoverable: true,
								background: 'variant-filled-success'
							};
							toastStore.trigger(t2);
							break;
					}
					break;
			}

			console.log('submit');
			await update();
		};
	};
</script>

<div class="container h-screen mx-auto flex justify-center items-center">
	<form method="POST" class="card" action="?/login" use:enhance={submitForm}>
		<header class="card-header h2">Welcome</header>
		<section class="p-4">
			<label class="label">
				<span>Username</span>
				<input class="input" type="text" placeholder="johndoe" name="username" required />
			</label>
		</section>
		<footer class="card-footer flex justify-end gap-2">
			<button class="btn variant-filled-surface" formaction="?/register">Register</button>
			<button class="btn variant-filled" formaction="?/login">Login</button>
		</footer>
	</form>
</div>
