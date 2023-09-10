<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { FIDOScenario } from '$lib/enums';
	import { create, parseCreationOptionsFromJSON } from '@github/webauthn-json/browser-ponyfill';
	import { registerWithStrongKey } from '$lib/FIDOClient/register';

	const toastStore = getToastStore();

	let username: string;

	const submitForm: SubmitFunction = () => {
		return async ({ result, update }) => {
			switch (result.type) {
				case 'error':
					console.log('error');
					break;
				case 'success':
					console.log('Form Success');
					console.log(result.data);

					switch (result.data?.fidoScenario) {
						case FIDOScenario.auth:
							const t2: ToastSettings = {
								message: 'Successfully Logged In!',
								hoverable: true,
								background: 'variant-filled-success'
							};
							toastStore.trigger(t2);
							break;
						case FIDOScenario.reg:
							const options = parseCreationOptionsFromJSON(result.data?.publicKeyOptions);
							const authenticatorResponse = await create(options);

							const SKFSRegResponse = await fetch('/api/processReg', {
								method: 'POST',
								body: JSON.stringify({
									username: username,
									publicKeyCredential: authenticatorResponse
								}),
								headers: {
									'Content-Type': 'application/json'
								}
							});

							const parsedRes = await SKFSRegResponse.json();

							if (parsedRes.responseCode === 'FIDO-MSG-0004') {
								const t: ToastSettings = {
									message: 'Successfully Registered!',
									hoverable: true,
									background: 'variant-filled-success'
								};
								toastStore.trigger(t);
							}
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
				<input
					class="input"
					type="text"
					placeholder="johndoe"
					name="username"
					bind:value={username}
					required
				/>
			</label>
		</section>
		<footer class="card-footer flex justify-end gap-2">
			<button class="btn variant-filled-surface" formaction="?/register">Register</button>
			<button class="btn variant-filled" formaction="?/login">Login</button>
		</footer>
	</form>
</div>
