import type { INodeProperties } from 'n8n-workflow';

export const deleteUserProfileProperties: INodeProperties[] = [

	{
		displayName: 'Identifier Type',
		name: 'deleteUserProfileIdentifierType',
		type: 'options',
		default: 'insiderId',
		options: [
			{ name: 'Insider ID', value: 'insiderId', description: 'Look up user by Insider ID' },
			{ name: 'Identifiers', value: 'identifiers', description: 'Look up user by email, UUID, phone number, or custom identifiers' },
		],
		displayOptions: {
			show: { resource: ['dataGovernance'], operation: ['deleteUserProfile'] },
		},
	},
	{
		displayName: 'Insider ID',
		name: 'deleteUserProfileInsiderId',
		type: 'string',
		default: '',
		required: true,
		description: 'The unique Insider ID for the user',
		displayOptions: {
			show: { resource: ['dataGovernance'], operation: ['deleteUserProfile'], deleteUserProfileIdentifierType: ['insiderId'] },
		},
	},
	{
		displayName: 'Identifiers',
		name: 'deleteUserProfileIdentifiersUi',
		type: 'collection',
		placeholder: 'Add Identifier',
		default: {},
		displayOptions: {
			show: { resource: ['dataGovernance'], operation: ['deleteUserProfile'], deleteUserProfileIdentifierType: ['identifiers'] },
		},
		options: [
			{ displayName: 'Custom Identifiers (JSON)', name: 'custom', type: 'json', default: '{}', placeholder: '{"user_loyalty_id": "xyz123"}', description: 'Custom identifier key-value pairs' },
			{ displayName: 'Email', name: 'email', type: 'string', default: '', placeholder: 'user@example.com', description: 'User email address' },
			{ displayName: 'Phone Number', name: 'phone_number', type: 'string', default: '', placeholder: '+6598765432', description: 'Phone number in E.164 format' },
			{ displayName: 'UUID', name: 'uuid', type: 'string', default: '', description: 'User UUID' },
		],
	},
	{
		displayName: 'This action permanently deletes the user profile and cannot be undone.',
		name: 'deleteUserProfileWarning',
		type: 'notice',
		default: '',
		displayOptions: {
			show: { resource: ['dataGovernance'], operation: ['deleteUserProfile'] },
		},
	},
];
