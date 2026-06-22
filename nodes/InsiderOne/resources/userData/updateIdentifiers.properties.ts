import type { INodeProperties } from 'n8n-workflow';

export const updateIdentifiersProperties: INodeProperties[] = [

	// --- JSON Parameters toggle ---
	{
		displayName: 'JSON Parameters',
		name: 'updateIdentifiersJsonParameters',
		type: 'boolean',
		default: false,
		description: 'Whether to pass identifier fields as raw JSON',
		displayOptions: {
			show: { resource: ['userData'], operation: ['updateIdentifiers'] },
		},
	},

	// ── UI MODE ──────────────────────────────────────────────────────────────

	{
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-update-fields
		displayName: 'Old Identifier',
		name: 'updateIdentifiersOldUi',
		type: 'collection',
		placeholder: 'Add Identifier',
		default: {},
		description: 'Current identifier value to be replaced',
		displayOptions: {
			show: { resource: ['userData'], operation: ['updateIdentifiers'], updateIdentifiersJsonParameters: [false] },
		},
		options: [
			{ displayName: 'Custom Identifiers (JSON)', name: 'custom', type: 'json', default: '{}', placeholder: '{"user_loyalty_id": "xyz123"}', description: 'Custom identifier key-value pairs' },
			{ displayName: 'Email Address', name: 'email', type: 'string', default: '', placeholder: 'user@example.com', description: 'User email address' },
			{ displayName: 'Phone Number', name: 'phone_number', type: 'string', default: '', placeholder: '+6598765432', description: 'Phone number in E.164 format' },
			{ displayName: 'UUID', name: 'uuid', type: 'string', default: '', description: 'User UUID' },
		],
	},
	{
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-update-fields
		displayName: 'New Identifier',
		name: 'updateIdentifiersNewUi',
		type: 'collection',
		placeholder: 'Add Identifier',
		default: {},
		description: 'Updated identifier value',
		displayOptions: {
			show: { resource: ['userData'], operation: ['updateIdentifiers'], updateIdentifiersJsonParameters: [false] },
		},
		options: [
			{ displayName: 'Custom Identifiers (JSON)', name: 'custom', type: 'json', default: '{}', placeholder: '{"user_loyalty_id": "xyz456"}', description: 'Custom identifier key-value pairs' },
			{ displayName: 'Email Address', name: 'email', type: 'string', default: '', placeholder: 'newuser@example.com', description: 'New email address' },
			{ displayName: 'Phone Number', name: 'phone_number', type: 'string', default: '', placeholder: '+6598765433', description: 'New phone number in E.164 format' },
			{ displayName: 'UUID', name: 'uuid', type: 'string', default: '', description: 'New UUID' },
		],
	},

	// ── JSON MODE ─────────────────────────────────────────────────────────────

	{
		displayName: 'Old Identifier (JSON)',
		name: 'updateIdentifiersOldJson',
		type: 'json',
		default: '{}',
		placeholder: '{"email": "sample@mail.com"}',
		description: 'Current identifier object to be replaced',
		displayOptions: {
			show: { resource: ['userData'], operation: ['updateIdentifiers'], updateIdentifiersJsonParameters: [true] },
		},
	},
	{
		displayName: 'New Identifier (JSON)',
		name: 'updateIdentifiersNewJson',
		type: 'json',
		default: '{}',
		placeholder: '{"email": "sample2@mail.com"}',
		description: 'Updated identifier object',
		displayOptions: {
			show: { resource: ['userData'], operation: ['updateIdentifiers'], updateIdentifiersJsonParameters: [true] },
		},
	},
];
