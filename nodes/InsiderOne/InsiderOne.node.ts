import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { BASE_URL } from './shared/utils';

import {
	userDataProperties,
	executeUpsert,
	executeUpsertBatch,
	executeGetProfile,
	executeExport,
	executeDeleteAttribute,
	executeUpdateIdentifiers,
	executeDeleteIdentifiers,
} from './resources/userData';
import {
	dataGovernanceProperties,
	executeAnonymizeUser,
	executeDeleteUserProfile,
} from './resources/dataGovernance';

type OperationHandler = (
	this: IExecuteFunctions,
	i: number,
) => Promise<IDataObject>;

const operationRouter: Record<string, OperationHandler> = {
	upsert: executeUpsert,
	deleteAttribute: executeDeleteAttribute,
	getProfile: executeGetProfile,
	updateIdentifiers: executeUpdateIdentifiers,
	deleteIdentifiers: executeDeleteIdentifiers,
	anonymizeUser: executeAnonymizeUser,
	deleteUserProfile: executeDeleteUserProfile,
	export: executeExport,
};

export class InsiderOne implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Insider One',
		name: 'insiderOne',
		icon: 'file:insiderone.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + " " + $parameter["resource"]}}',
		description: 'Interact with Insider One APIs',
		defaults: {
			name: 'Insider One',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'insiderOneUnificationApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'User Data', value: 'userData' },
					{ name: 'Data Governance', value: 'dataGovernance' },
				],
				default: 'userData',
			},
			...userDataProperties,
			...dataGovernanceProperties,
		],
	};

	methods = {
		loadOptions: {
			async getAttributeColumns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'insiderOneUnificationApi',
					{
						method: 'POST',
						url: `${BASE_URL}/api/user/v3/metadata/columns`,
						body: { table: 'contacts' },
						json: true,
					},
				) as Array<{ key: string; display_name: string }>;

				return response.map((item) => ({
					name: item.display_name || item.key,
					value: item.key,
				}));
			},

			async getCustomAttributes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'insiderOneUnificationApi',
					{
						method: 'POST',
						url: `${BASE_URL}/api/user/v3/metadata/columns`,
						body: { table: 'contacts' },
						json: true,
					},
				) as Array<{ key: string; display_name: string; type?: string }>;

				return response
					.filter((item) => item.key.startsWith('c_'))
					.map((item) => ({
						name: item.display_name || item.key,
						value: item.key.replace(/^c_/, ''),
					}));
			},

			async getCustomArrayAttributes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'insiderOneUnificationApi',
					{
						method: 'POST',
						url: `${BASE_URL}/api/user/v3/metadata/columns`,
						body: { table: 'contacts' },
						json: true,
					},
				) as Array<{ key: string; display_name: string; type?: string }>;

				return response
					.filter((item) => item.key.startsWith('c_') && item.type === 'array')
					.map((item) => ({
						name: item.display_name || item.key,
						value: item.key.replace(/^c_/, ''),
					}));
			},

			async getEventNames(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'insiderOneUnificationApi',
					{
						method: 'POST',
						url: `${BASE_URL}/api/user/v3/metadata/columns`,
						body: { table: 'events' },
						json: true,
					},
				) as Array<{ key: string; display_name: string }>;

				return response.map((item) => ({
					name: item.display_name || item.key,
					value: item.key,
				}));
			},

			async getEventParams(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const eventName = this.getCurrentNodeParameter('profileEventsSection.eventName') as string;

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'insiderOneUnificationApi',
					{
						method: 'POST',
						url: `${BASE_URL}/api/user/v3/metadata/columns`,
						body: { table: 'events' },
						json: true,
					},
				) as Array<{ key: string; display_name: string; params?: Array<{ key: string; display_name: string }> }>;

				// If event_name is selected, return only that event's params
				if (eventName) {
					const event = response.find((item) => item.key === eventName);
					if (event?.params) {
						return event.params.map((param) => ({
							name: param.display_name || param.key,
							value: param.key,
						}));
					}
				}

				// Fallback: return all params from all events (deduplicated)
				const seen = new Set<string>();
				const allParams: INodePropertyOptions[] = [];
				for (const event of response) {
					for (const param of event.params ?? []) {
						if (!seen.has(param.key)) {
							seen.add(param.key);
							allParams.push({ name: param.display_name || param.key, value: param.key });
						}
					}
				}
				return allParams;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const operation = this.getNodeParameter('operation', 0) as string;

		// Batch mode for upsert
		if (operation === 'upsert') {
			const additionalSettings = this.getNodeParameter('additionalSettings', 0, {}) as IDataObject;
			const batchSize = (additionalSettings.batchSize ?? 1) as number;

			for (let start = 0; start < items.length; start += batchSize) {
				const end = Math.min(start + batchSize, items.length);
				const batchIndices = Array.from({ length: end - start }, (_, k) => start + k);

				try {
					let response: IDataObject;
					if (batchSize === 1) {
						response = await executeUpsert.call(this, start);
					} else {
						response = await executeUpsertBatch.call(this, batchIndices);
					}

					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(response),
						{ itemData: { item: start } },
					);
					returnData.push(...executionData);
				} catch (error) {
					if (this.continueOnFail()) {
						for (const idx of batchIndices) {
							returnData.push({
								json: { error: (error as Error).message },
								pairedItem: { item: idx },
							});
						}
						continue;
					}
					// Validation errors are already NodeOperationError; rethrow as-is.
					// Everything else is an HTTP/API failure — wrap in NodeApiError to
					// preserve the HTTP status code and API response body in the n8n UI.
					if (error instanceof NodeOperationError) {
						throw error;
					}
					throw new NodeApiError(this.getNode(), error as JsonObject, {
						itemIndex: start,
					});
				}
			}

			return [returnData];
		}

		// Standard per-item execution for other operations
		for (let i = 0; i < items.length; i++) {
			try {
				const handler = operationRouter[operation];
				if (!handler) {
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
				}

				const response = await handler.call(this, i);

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(response),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				// Validation errors are already NodeOperationError; rethrow as-is.
				// Everything else is an HTTP/API failure — wrap in NodeApiError to
				// preserve the HTTP status code and API response body in the n8n UI.
				if (error instanceof NodeOperationError) {
					throw error;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
