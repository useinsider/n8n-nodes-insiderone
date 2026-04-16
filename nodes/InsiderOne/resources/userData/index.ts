import type { INodeProperties } from 'n8n-workflow';
import { upsertProperties } from './upsert.properties';
import { getProfileProperties } from './getProfile.properties';
import { exportProperties } from './export.properties';
import { deleteAttributeProperties } from './deleteAttribute.properties';
import { updateIdentifiersProperties } from './updateIdentifiers.properties';
import { deleteIdentifiersProperties } from './deleteIdentifiers.properties';

export { executeUpsert, executeUpsertBatch } from './upsert.execute';
export { executeGetProfile } from './getProfile.execute';
export { executeExport } from './export.execute';
export { executeDeleteAttribute } from './deleteAttribute.execute';
export { executeUpdateIdentifiers } from './updateIdentifiers.execute';
export { executeDeleteIdentifiers } from './deleteIdentifiers.execute';

export const userDataOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: { resource: ['userData'] },
	},
	options: [
		{
			name: 'Create or Update',
			value: 'upsert',
			description:
				'Create a new record, or update the current one if it already exists (upsert)',
			action: 'Upsert user data',
		},
		{
			name: 'Delete Identifiers',
			value: 'deleteIdentifiers',
			description: 'Delete one or more identifiers from a user profile',
			action: 'Delete identifiers',
		},
		{
			name: 'Delete User Attribute',
			value: 'deleteAttribute',
			description: 'Delete one or more attributes from a user profile',
			action: 'Delete user attribute',
		},
		{
			name: 'Export Raw Data',
			value: 'export',
			description: 'Export raw user data from Insider One',
			action: 'Export raw data',
		},
		{
			name: 'Get User Profiles',
			value: 'getProfile',
			description: 'Query user profile information',
			action: 'Get user profiles',
		},
		{
			name: 'Update Identifiers',
			value: 'updateIdentifiers',
			description: 'Update an existing identifier to a new value',
			action: 'Update identifiers',
		},
	],
	default: 'upsert',
};

export const userDataProperties: INodeProperties[] = [
	userDataOperations,
	...upsertProperties,
	...deleteAttributeProperties,
	...getProfileProperties,
	...exportProperties,
	...updateIdentifiersProperties,
	...deleteIdentifiersProperties,
];
