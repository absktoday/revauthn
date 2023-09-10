export async function POST({ request }) {
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
				create_location: 'Sunnyvale, CA',
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

	const response = await fetch('https://fido-test-1.absk.io/skfs/rest/register', requestOptions);

	if (!response.ok) {
		throw new Error(`HTTP Error! Status: ${response.status}`);
	}

	return response;
}
