import type { INodeProperties } from 'n8n-workflow';

export const deleteUserProfileProperties: INodeProperties[] = [

	{
		displayName: 'Identifiers',
		name: 'deleteUserProfileIdentifiersUi',
		type: 'collection',
		placeholder: 'Add Identifier',
		default: {},
		description: 'At least one identifier is required. insider_id and other identifiers can be combined.',
		displayOptions: {
			show: { resource: ['dataGovernance'], operation: ['deleteUserProfile'] },
		},
		options: [
			{ displayName: 'Custom Identifiers (JSON)', name: 'custom', type: 'json', default: '{}', placeholder: '{"user_loyalty_id": "xyz123"}', description: 'Custom identifier key-value pairs' },
			{ displayName: 'Email Address', name: 'email', type: 'string', default: '', placeholder: 'user@example.com', description: 'User email address' },
			{ displayName: 'Insider One ID', name: 'insider_id', type: 'string', default: '', description: 'The unique Insider One ID for the user' },
			{ displayName: 'Phone Number', name: 'phone_number', type: 'string', default: '', placeholder: '+6598765432', description: 'Phone number in E.164 format' },
			{ displayName: 'UUID', name: 'uuid', type: 'string', default: '', description: 'User UUID' },
		],
	},
	{
		displayName: 'This action permanently deletes the user profile and can\'t be undone.',
		name: 'deleteUserProfileWarning',
		type: 'notice',
		default: '',
		displayOptions: {
			show: { resource: ['dataGovernance'], operation: ['deleteUserProfile'] },
		},
	},
];
