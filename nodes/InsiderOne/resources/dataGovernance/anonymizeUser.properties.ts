import type { INodeProperties } from 'n8n-workflow';

export const anonymizeUserProperties: INodeProperties[] = [

	{
		displayName: 'Identifier Type',
		name: 'anonymizeUserIdentifierType',
		type: 'options',
		default: 'insiderId',
		options: [
			{ name: 'Insider ID', value: 'insiderId', description: 'Look up user by Insider ID' },
			{ name: 'Identifiers', value: 'identifiers', description: 'Look up user by email, UUID, or phone number' },
		],
		displayOptions: {
			show: { resource: ['dataGovernance'], operation: ['anonymizeUser'] },
		},
	},
	{
		displayName: 'Insider ID',
		name: 'anonymizeUserInsiderId',
		type: 'string',
		default: '',
		required: true,
		description: 'The unique Insider ID for the user',
		displayOptions: {
			show: { resource: ['dataGovernance'], operation: ['anonymizeUser'], anonymizeUserIdentifierType: ['insiderId'] },
		},
	},
	{
		displayName: 'Identifiers',
		name: 'anonymizeUserIdentifiersUi',
		type: 'collection',
		placeholder: 'Add Identifier',
		default: {},
		displayOptions: {
			show: { resource: ['dataGovernance'], operation: ['anonymizeUser'], anonymizeUserIdentifierType: ['identifiers'] },
		},
		options: [
			{ displayName: 'Email', name: 'email', type: 'string', default: '', placeholder: 'user@example.com', description: 'User email address' },
			{ displayName: 'Phone Number', name: 'phone_number', type: 'string', default: '', placeholder: '+6598765432', description: 'Phone number in E.164 format' },
			{ displayName: 'UUID', name: 'uuid', type: 'string', default: '', description: 'User UUID' },
		],
	},
	{
		displayName: 'This action permanently removes the user\'s PII data and cannot be undone.',
		name: 'anonymizeUserWarning',
		type: 'notice',
		default: '',
		displayOptions: {
			show: { resource: ['dataGovernance'], operation: ['anonymizeUser'] },
		},
	},
];
