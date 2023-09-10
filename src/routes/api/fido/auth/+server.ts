import { SourceTextModule } from 'vm';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const data = await request.json();

	const username = data.username;
	const publicKeyCredential = data.publicKeyCredential;

	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');

	const requestBody = {
		svcinfo: {
			did: 1,
			protocol: 'FIDO2_0',
			authtype: 'PASSWORD',
			svcusername: 'svcfidouser',
			svcpassword: 'Abcd1234!'
		},
		payload: {
			strongkeyMetadata: {
				version: '1.0',
				last_used_location: 'Sunnyvale, CA',
				username: username,
				origin: 'https://rev.absk.io:5173'
			},
			publicKeyCredential: publicKeyCredential
		}
	};

	const requestOptions: RequestInit = {
		method: 'POST',
		headers: myHeaders,
		body: JSON.stringify(requestBody),
		redirect: 'follow'
	};

	let response = await fetch('https://fido-test-1.absk.io/skfs/rest/authenticate', requestOptions);

	if (!response.ok) {
		throw new Error(`HTTP Error! Status: ${response.status}`);
	}
	const jsonResponse = await response.json();
	console.log('Json response: ', jsonResponse);

	cookies.set('AuthorizationToken', `Bearer ${jsonResponse.jwt}`, {
		httpOnly: true,
		sameSite: 'strict',
		secure: true,
		path: '/',
		maxAge: 60 * 60 * 24 * 7
	});

	return json(jsonResponse.Response);
};
