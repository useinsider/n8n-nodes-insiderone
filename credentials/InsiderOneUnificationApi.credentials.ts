import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

export class InsiderOneUnificationApi implements ICredentialType {
	name = 'insiderOneUnificationApi';

	displayName = 'Insider One Unification API';

	icon = { light: 'file:insiderone.svg', dark: 'file:insiderone.svg' } as const;

	documentationUrl = 'https://academy.insiderone.com/docs/api-reference-welcome';

	properties: INodeProperties[] = [
		{
			displayName: 'Insider One Inone Name',
			name: 'partnerName',
			type: 'string',
			default: '',
			placeholder: 'mybrand',
			description: 'Your Insider One Inone name (lowercase)',
			required: true,
		},
		{
			displayName: 'Unified Customer Database API Token',
			name: 'requestToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API authentication token',
			required: true,
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://unification.useinsider.com',
			url: '/api/user/v3/metadata/columns',
			method: 'POST',
			body: { table: 'contacts' },
		},
	};

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-PARTNER-NAME': '={{$credentials.partnerName}}',
				'X-REQUEST-TOKEN': '={{$credentials.requestToken}}',
				'Content-Type': 'application/json',
			},
		},
	};
}
