import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { parseJsonParameter, BASE_URL } from '../../shared/utils';

export async function executeGetProfile(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {
	// --- Identifiers ---
	// insider_id goes at the top level of the body
	// identifiers mode wraps fields under an "identifiers" key
	const identifierType = this.getNodeParameter('profileIdentifierType', i) as string;

	let identifierPayload: IDataObject;
	if (identifierType === 'insiderId') {
		const insiderId = this.getNodeParameter('profileInsiderId', i) as string;
		identifierPayload = { insider_id: insiderId };
	} else {
		const identifiersUi = this.getNodeParameter('profileIdentifiersUi', i, {}) as IDataObject;
		const identifiers: IDataObject = {};
		if (identifiersUi.email) identifiers.email = identifiersUi.email;
		if (identifiersUi.uuid) identifiers.uuid = identifiersUi.uuid;
		if (identifiersUi.phone_number) identifiers.phone_number = identifiersUi.phone_number;
		if (identifiersUi.custom) {
			identifiers.custom = parseJsonParameter(identifiersUi.custom as string, 'Custom Identifiers');
		}
		identifierPayload = { identifiers };
	}

	const jsonParameters = this.getNodeParameter('profileJsonParameters', i, false) as boolean;

	let profileAttributes: string[] | IDataObject[];
	let eventsObj: IDataObject | undefined;

	if (jsonParameters) {
		profileAttributes = parseJsonParameter(
			this.getNodeParameter('profileAttributesJson', i, '[]') as string,
			'Attributes (JSON)',
		) as IDataObject[];

		const eventsJson = this.getNodeParameter('profileEventsJson', i, '{}') as string;
		const parsed = parseJsonParameter(eventsJson, 'Events (JSON)') as IDataObject;
		if (Object.keys(parsed).length > 0) {
			eventsObj = parsed;
		}
	} else {
		// Attributes section
		const getAllAttributes = this.getNodeParameter('profileGetAllAttributes', i, false) as boolean;

		if (getAllAttributes) {
			profileAttributes = ['*'];
		} else {
			profileAttributes = this.getNodeParameter('profileAttributes', i, []) as string[];
		}

		// Events section
		const eventsSection = this.getNodeParameter('profileEventsSection', i, {}) as IDataObject;
		const events: IDataObject = {};

		if (eventsSection.startDate) {
			events.start_date = parseInt(eventsSection.startDate as string, 10);
		}
		if (eventsSection.endDate) {
			events.end_date = parseInt(eventsSection.endDate as string, 10);
		}
		if (eventsSection.wantedJson) {
			events.wanted = parseJsonParameter(eventsSection.wantedJson as string, 'Wanted Events (JSON)');
		} else if (eventsSection.wantedEvents) {
			const wantedUi = eventsSection.wantedEvents as IDataObject;
			if (wantedUi.eventValues) {
				events.wanted = (wantedUi.eventValues as IDataObject[]).map((ev) => {
					const wanted: IDataObject = { event_name: ev.event_name };
					if (ev.params) {
						wanted.params = (ev.params as string).split(',').map((s) => s.trim()).filter(Boolean);
					}
					return wanted;
				});
			}
		}

		if (Object.keys(events).length > 0) {
			eventsObj = events;
		}

	}

	const additionalSettings = this.getNodeParameter('profileAdditionalSettings', i, {}) as IDataObject;
	const quota = (additionalSettings.quota ?? false) as boolean;

	const body: IDataObject = {
		...identifierPayload,
	};

	if (profileAttributes.length > 0) {
		body.attributes = profileAttributes;
	}

	if (eventsObj) {
		body.events = eventsObj;
	}

	if (!body.attributes && !body.events) {
		throw new NodeOperationError(
			this.getNode(),
			'At least one of Attributes or Events must be provided',
			{ itemIndex: i },
		);
	}

	if (quota) {
		body.quota = true;
	}

	return (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'insiderOneApi',
		{
			method: 'POST',
			url: `${BASE_URL}/api/user/v1/profile`,
			body,
			json: true,
		},
	)) as IDataObject;
}
