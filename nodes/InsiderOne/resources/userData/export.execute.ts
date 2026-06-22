import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { parseJsonParameter, BASE_URL } from '../../shared/utils';

export async function executeExport(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject> {
	const segmentId = this.getNodeParameter('segmentId', i) as number;
	const jsonParameters = this.getNodeParameter('exportJsonParameters', i, false) as boolean;

	let exportAttributes: string[] | IDataObject[];
	let eventsObj: IDataObject | undefined;

	if (jsonParameters) {
		exportAttributes = parseJsonParameter(
			this.getNodeParameter('exportAttributesJson', i, '[]') as string,
			'Attributes (JSON)',
		) as IDataObject[];

		const eventsJson = this.getNodeParameter('exportEventsJson', i, '{}') as string;
		const parsed = parseJsonParameter(eventsJson, 'Events (JSON)') as IDataObject;
		if (Object.keys(parsed).length > 0) {
			eventsObj = parsed;
		}
	} else {
		// Attributes
		const getAllAttributes = this.getNodeParameter('exportGetAllAttributes', i, false) as boolean;

		if (getAllAttributes) {
			exportAttributes = ['*'];
		} else {
			exportAttributes = this.getNodeParameter('exportAttributes', i, []) as string[];
		}

		// Events
		const eventsSection = this.getNodeParameter('exportEventsSection', i, {}) as IDataObject;
		const events: IDataObject = {};

		if (eventsSection.startDate) {
			events.start_date = parseInt(eventsSection.startDate as string, 10);
		}
		if (eventsSection.endDate) {
			events.end_date = parseInt(eventsSection.endDate as string, 10);
		}
		if (eventsSection.wantedEvents) {
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

	const format = this.getNodeParameter('format', i, 'json') as string;
	const hookUrl = this.getNodeParameter('hookUrl', i, '') as string;

	const body: IDataObject = {
		segment: { segment_id: segmentId },
		attributes: exportAttributes,
		format,
	};

	if (eventsObj) {
		body.events = eventsObj;
	}

	if (hookUrl) {
		body.hook = hookUrl;
	}

	return (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'insiderOneUnificationApi',
		{
			method: 'POST',
			url: `${BASE_URL}/api/raw/v1/export`,
			body,
			json: true,
		},
	)) as IDataObject;
}
