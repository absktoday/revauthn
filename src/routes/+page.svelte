<script lang="ts">
	import { enhance } from '$app/forms'
	import type { SubmitFunction } from '@sveltejs/kit'
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton'
	import { FIDOScenario } from '$lib/enums'
	import {
		create,
		get,
		parseCreationOptionsFromJSON,
		parseRequestOptionsFromJSON
	} from '@github/webauthn-json/browser-ponyfill'
	import { goto } from '$app/navigation'

	const toastStore = getToastStore()

	let username: string

	const submitForm: SubmitFunction = () => {
		return async ({ result, update }) => {
			switch (result.type) {
				case 'error':
					console.log('error')
					break
				case 'success':
					console.log('Form Success')

					switch (result.data?.fidoScenario) {
						case FIDOScenario.auth:
							const authOptions = parseRequestOptionsFromJSON(result.data?.publicKeyOptions)

							const assertionResponse = await get(authOptions)

							const SKFSAuthResponse = await fetch('/api/fido/auth', {
								method: 'POST',
								body: JSON.stringify({
									username: username,
									publicKeyCredential: assertionResponse
								}),
								headers: {
									'Content-Type': 'application/json'
								}
							})

							const parsedAuthRes = await SKFSAuthResponse.json()

							if (parsedAuthRes.responseCode === 'FIDO-MSG-0008') {
								await goto('/home')
							}

							break
						case FIDOScenario.reg:
							const regOptions = parseCreationOptionsFromJSON(result.data?.publicKeyOptions)
							const authenticatorResponse = await create(regOptions)

							const SKFSRegResponse = await fetch('/api/fido/reg', {
								method: 'POST',
								body: JSON.stringify({
									username: username,
									publicKeyCredential: authenticatorResponse
								}),
								headers: {
									'Content-Type': 'application/json'
								}
							})

							const parsedRes = await SKFSRegResponse.json()

							if (parsedRes.responseCode === 'FIDO-MSG-0004') {
								const t: ToastSettings = {
									message: 'Successfully Registered!',
									hoverable: true,
									background: 'variant-filled-success'
								}
								toastStore.trigger(t)
							}
							break
					}
					break
			}
			await update()
		}
	}
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
