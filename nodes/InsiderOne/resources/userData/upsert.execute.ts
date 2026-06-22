import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { parseJsonParameter, BASE_URL } from '../../shared/utils';

export function buildUserObject(
	context: IExecuteFunctions,
	i: number,
): IDataObject {
	const identifiersUi = context.getNodeParameter('identifiersUi', i, {}) as IDataObject;
	const userObj: IDataObject = {};

	if (identifiersUi.insider_id) userObj.insider_id = identifiersUi.insider_id;

	const identifiers: IDataObject = {};
	if (identifiersUi.email) identifiers.email = identifiersUi.email;
	if (identifiersUi.uuid) identifiers.uuid = identifiersUi.uuid;
	if (identifiersUi.phone_number) identifiers.phone_number = identifiersUi.phone_number;
	const customIdentifiersRaw = context.getNodeParameter('customIdentifiers', i, { assignments: [] }) as { assignments: Array<{ name: string; value: unknown }> };
	if (customIdentifiersRaw.assignments.length > 0) {
		const customIds: IDataObject = {};
		for (const assignment of customIdentifiersRaw.assignments) {
			if (assignment.name) customIds[assignment.name] = assignment.value as string;
		}
		identifiers.custom = customIds;
	}
	if (Object.keys(identifiers).length > 0) userObj.identifiers = identifiers;

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

		// Merge extra default attributes directly into attributes object
		const extraDefaultRaw = context.getNodeParameter('extraDefaultAttributes', i, { assignments: [] }) as { assignments: Array<{ name: string; value: unknown }> };
		for (const assignment of extraDefaultRaw.assignments) {
			if (assignment.name) attributes[assignment.name] = assignment.value as string;
		}

		// Build custom attributes — wrapped under "custom" key, no c_ prefix needed
		const customAttributesRaw = context.getNodeParameter('customAttributes', i, { assignments: [] }) as { assignments: Array<{ name: string; value: unknown }> };
		if (customAttributesRaw.assignments.length > 0) {
			const custom: IDataObject = {};
			for (const assignment of customAttributesRaw.assignments) {
				if (assignment.name) custom[assignment.name] = assignment.value as string;
			}
			attributes.custom = custom;
		}

		if (attributes.birthday) {
			const bd = attributes.birthday as string;
			attributes.birthday = bd && !bd.endsWith('Z') ? `${bd}Z` : bd;
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
				const ts = ev.timestamp as string;
				const event: IDataObject = {
					event_name: ev.event_name,
					timestamp: ts && !ts.endsWith('Z') ? `${ts}Z` : ts,
				};
				if (ev.event_params) {
					const paramsRaw = ev.event_params as { assignments?: Array<{ name: string; value: unknown }> };
					if (paramsRaw.assignments?.length) {
						const eventParams: IDataObject = {};
						for (const assignment of paramsRaw.assignments) {
							if (assignment.name) eventParams[assignment.name] = assignment.value as string;
						}
						event.event_params = eventParams;
					}
				}
				if (ev.custom) {
					const customRaw = ev.custom as { assignments?: Array<{ name: string; value: unknown }> };
					if (customRaw.assignments?.length) {
						const customParams: IDataObject = {};
						for (const assignment of customRaw.assignments) {
							if (assignment.name) customParams[assignment.name] = assignment.value as string;
						}
						event.custom = customParams;
					}
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
		skip_hook: skipHook,
	};

	if (errorCallbackEndpoint) {
		body.error_callback_endpoint = errorCallbackEndpoint;
	}

	return (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'insiderOneUnificationApi',
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
		skip_hook: skipHook,
	};

	if (errorCallbackEndpoint) {
		body.error_callback_endpoint = errorCallbackEndpoint;
	}

	return (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'insiderOneUnificationApi',
		{
			method: 'POST',
			url: `${BASE_URL}/api/user/v1/upsert`,
			body,
			json: true,
		},
	)) as IDataObject;
}
