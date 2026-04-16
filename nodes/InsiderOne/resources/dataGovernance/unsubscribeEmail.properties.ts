import type { INodeProperties } from 'n8n-workflow';

export const unsubscribeEmailProperties: INodeProperties[] = [
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'user@example.com',
		description: 'The email address to unsubscribe from the database',
		displayOptions: {
			show: { resource: ['dataGovernance'], operation: ['unsubscribeEmail'] },
		},
	},
];
