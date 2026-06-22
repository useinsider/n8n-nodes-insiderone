import type { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';

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

	test = {
		request: {
			baseURL: 'https://unification.useinsider.com',
			url: '/api/user/v1/upsert',
			method: 'POST' as const,
			body: {
				users: [
					{
						identifiers: { email: 'insiderone@mail.com' },
						attributes: {
							name: 'Insider One Academy',
							gdpr_optin: true,
							phone_number: '+6512345678',
						},
					},
				],
				platform: 'n8n',
			},
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
