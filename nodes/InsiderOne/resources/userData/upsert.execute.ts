import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { parseJsonParameter, BASE_URL } from '../../shared/utils';

export function buildUserObject(
	context: IExecuteFunctions,
	i: number,
): IDataObject {
	const identifierType = context.getNodeParameter('identifierType', i) as string;

	let userObj: IDataObject;
	if (identifierType === 'insiderId') {
		const insiderId = context.getNodeParameter('insiderId', i) as string;
		userObj = { insider_id: insiderId };
	} else {
		const identifiersUi = context.getNodeParameter('identifiersUi', i, {}) as IDataObject;
		const identifiers: IDataObject = {};
		if (identifiersUi.email) identifiers.email = identifiersUi.email;
		if (identifiersUi.uuid) identifiers.uuid = identifiersUi.uuid;
		if (identifiersUi.phone_number) identifiers.phone_number = identifiersUi.phone_number;
		if (identifiersUi.custom) {
			identifiers.custom = parseJsonParameter(identifiersUi.custom as string, 'Custom Identifiers');
		}
		userObj = { identifiers };
	}

	const additionalSettings = context.getNodeParameter('additionalSettings', i, {}) as IDataObject;
	const notAppend = (additionalSettings.notAppend ?? true) as boolean;
	const jsonParameters = context.getNodeParameter('jsonParameters', i, false) as boolean;

	let attributes: IDataObject = {};
	let events: IDataObject[] = [];

	if (jsonParameters) {
		attributes = parseJsonParameter(
			context.getNodeParameter('attributesJson', i, '{}') as string,
			'Attributes (JSON)',
		) as IDataObject;
		events = parseJsonParameter(
			context.getNodeParameter('eventsJson', i, '[]') as string,
			'Events Array (JSON)',
		) as IDataObject[];
	} else {
		const attributesUi = context.getNodeParameter('attributesUi', i, {}) as IDataObject;
		attributes = { ...attributesUi };

		if (attributes.custom) {
			const custom = parseJsonParameter(attributes.custom as string, 'Custom Attributes');
			delete attributes.custom;
			Object.assign(attributes, custom);
		}

		if (attributes.static_segment_id) {
			attributes.static_segment_id = (attributes.static_segment_id as string)
				.split(',')
				.map((id) => parseInt(id.trim(), 10));
		}

		for (const key of Object.keys(attributes)) {
			if (attributes[key] === '' || attributes[key] === 0) {
				delete attributes[key];
			}
		}

		const eventsUi = context.getNodeParameter('eventsUi', i, {}) as IDataObject;
		if (eventsUi.eventValues) {
			events = (eventsUi.eventValues as IDataObject[]).map((ev) => {
				const event: IDataObject = {
					event_name: ev.event_name,
					timestamp: ev.timestamp,
				};
				if (ev.event_params) {
					event.event_params = parseJsonParameter(ev.event_params as string, 'Event Params');
				}
				return event;
			});
		}
	}

	return {
		...userObj,
		attributes,
		events,
		not_append: notAppend,
	};
}

export async function executeUpsert(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {
	const user = buildUserObject(this, i);
	const additionalSettings = this.getNodeParameter('additionalSettings', i, {}) as IDataObject;
	const skipHook = (additionalSettings.skipHook ?? false) as boolean;
	const errorCallbackEndpoint = (additionalSettings.errorCallbackEndpoint ?? '') as string;

	const body: IDataObject = {
		users: [user],
		platform: 'n8n',
		skip_hook: skipHook,
	};

	if (errorCallbackEndpoint) {
		body.error_callback_endpoint = errorCallbackEndpoint;
	}

	return (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'insiderOneApi',
		{
			method: 'POST',
			url: `${BASE_URL}/api/user/v1/upsert`,
			body,
			json: true,
		},
	)) as IDataObject;
}

export async function executeUpsertBatch(
	this: IExecuteFunctions,
	indices: number[],
): Promise<IDataObject> {
	const users = indices.map((i) => buildUserObject(this, i));

	const additionalSettings = this.getNodeParameter('additionalSettings', indices[0], {}) as IDataObject;
	const skipHook = (additionalSettings.skipHook ?? false) as boolean;
	const errorCallbackEndpoint = (additionalSettings.errorCallbackEndpoint ?? '') as string;

	const body: IDataObject = {
		users,
		platform: 'n8n',
		skip_hook: skipHook,
	};

	if (errorCallbackEndpoint) {
		body.error_callback_endpoint = errorCallbackEndpoint;
	}

	return (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'insiderOneApi',
		{
			method: 'POST',
			url: `${BASE_URL}/api/user/v1/upsert`,
			body,
			json: true,
		},
	)) as IDataObject;
}
