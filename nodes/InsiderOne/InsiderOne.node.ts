import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

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
	executeUnsubscribeEmail,
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
	export: executeExport,
	unsubscribeEmail: executeUnsubscribeEmail,
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
				name: 'insiderOneApi',
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
					throw new NodeOperationError(this.getNode(), error as Error, {
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
				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
