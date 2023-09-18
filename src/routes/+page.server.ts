import { FIDOScenario } from '$lib/enums'
import type { Actions } from './$types'
import { SKFS_API_HOST } from '$env/static/private'

export const actions = {
	login: async ({ request }) => {
		const data = await request.formData()
		const username = data.get('username')

		var myHeaders = new Headers()
		myHeaders.append('Content-Type', 'application/json')

		var raw = JSON.stringify({
			svcinfo: {
				did: 1,
				protocol: 'FIDO2_0',
				authtype: 'PASSWORD',
				svcusername: 'svcfidouser',
				svcpassword: 'Abcd1234!'
			},
			payload: {
				username: username,
				options: {}
			}
		})

		var requestOptions: RequestInit = {
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow'
		}

		const fidoresponse = await fetch(SKFS_API_HOST + '/skfs/rest/preauthenticate', requestOptions)

		if (fidoresponse.status === 200) {
			let options = await fidoresponse.json()
			return {
				fidoScenario: FIDOScenario.auth,
				publicKeyOptions: { publicKey: options.Response }
			}
		}

		console.log(data.get('username'))
		return { fidoScenario: FIDOScenario.auth, publicKeyOptions: '' }
	},
	register: async ({ request }) => {
		const data = await request.formData()
		const username = data.get('username')

		console.log('Register: ', data.get('username'))

		var myHeaders = new Headers()
		myHeaders.append('Content-Type', 'application/json')

		var raw = JSON.stringify({
			svcinfo: {
				did: 1,
				protocol: 'FIDO2_0',
				authtype: 'PASSWORD',
				svcusername: 'svcfidouser',
				svcpassword: 'Abcd1234!'
			},
			payload: {
				username: username,
				displayname: 'Initial Key',
				options: {}
			}
		})

		var requestOptions: RequestInit = {
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow'
		}
		let fidoresponse = await fetch(SKFS_API_HOST + '/skfs/rest/preregister', requestOptions)

		if (fidoresponse.status === 200) {
			let options = await fidoresponse.json()
			return {
				fidoScenario: FIDOScenario.reg,
				publicKeyOptions: { publicKey: options.Response }
			}
		}
	}
} satisfies Actions
