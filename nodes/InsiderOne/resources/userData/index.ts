import type { INodeProperties } from 'n8n-workflow';
import { upsertProperties } from './upsert.properties';
import { getProfileProperties } from './getProfile.properties';
import { exportProperties } from './export.properties';
import { deleteAttributeProperties } from './deleteAttribute.properties';

export { executeUpsert, executeUpsertBatch } from './upsert.execute';
export { executeGetProfile } from './getProfile.execute';
export { executeExport } from './export.execute';
export { executeDeleteAttribute } from './deleteAttribute.execute';

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
	],
	default: 'upsert',
};

export const userDataProperties: INodeProperties[] = [
	userDataOperations,
	...upsertProperties,
	...deleteAttributeProperties,
	...getProfileProperties,
	...exportProperties,
];
