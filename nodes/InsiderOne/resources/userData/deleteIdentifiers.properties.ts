import type { INodeProperties } from 'n8n-workflow';

export const deleteIdentifiersProperties: INodeProperties[] = [

	// --- JSON Parameters toggle ---
	{
		displayName: 'Enable JSON Parameters',
		name: 'deleteIdentifiersJsonParameters',
		type: 'boolean',
		default: false,
		description: 'Whether to pass identifier fields as raw JSON',
		displayOptions: {
			show: { resource: ['userData'], operation: ['deleteIdentifiers'] },
		},
	},

	// ── UI MODE ──────────────────────────────────────────────────────────────

	{
		displayName: 'Identifiers',
		name: 'deleteIdentifiersUi',
		type: 'collection',
		placeholder: 'Add Identifier',
		default: {},
		description: 'Identifiers to delete from the user profile. Cannot be the only identifier associated with the user.',
		displayOptions: {
			show: { resource: ['userData'], operation: ['deleteIdentifiers'], deleteIdentifiersJsonParameters: [false] },
		},
		options: [
			{ displayName: 'Custom Identifiers (JSON)', name: 'custom', type: 'json', default: '{}', placeholder: '{"user_loyalty_id": "xyz123"}', description: 'Custom identifier key-value pairs' },
			{ displayName: 'Email Address', name: 'email', type: 'string', default: '', placeholder: 'user@example.com', description: 'User email address' },
			{ displayName: 'Phone Number', name: 'phone_number', type: 'string', default: '', placeholder: '+6598765432', description: 'Phone number in E.164 format' },
			{ displayName: 'UUID', name: 'uuid', type: 'string', default: '', description: 'User UUID' },
		],
	},

	// ── JSON MODE ─────────────────────────────────────────────────────────────

	{
		displayName: 'Identifiers',
		name: 'deleteIdentifiersJson',
		type: 'json',
		default: '{}',
		placeholder: '{"email": "sample@mail.com"}',
		description: 'Identifiers object to delete from the user profile',
		displayOptions: {
			show: { resource: ['userData'], operation: ['deleteIdentifiers'], deleteIdentifiersJsonParameters: [true] },
		},
	},
];
