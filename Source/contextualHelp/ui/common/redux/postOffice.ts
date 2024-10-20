// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
"use strict";

import * as Redux from "redux";

import { MessageMapping } from "../../../messages";
import { PostOffice } from "../postOffice";
import {
	isAllowedAction,
	reBroadcastMessageIfRequired,
	unwrapPostableAction,
} from "./helpers";
import { CommonActionType } from "./reducers/types";
import { BaseReduxActionPayload } from "./types";

export function generatePostOfficeSendReducer(
	postOffice: PostOffice,
): Redux.Reducer<{}, Redux.AnyAction> {
	// eslint-disable-next-line
	return function (_state: {} | undefined, action: Redux.AnyAction): {} {
		if (isAllowedAction(action)) {
			// Make sure a valid message
			if (action.type === CommonActionType.PostOutgoingMessage) {
				const { type, payload } = unwrapPostableAction(action.payload);
				// Just post this to the post office.
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				postOffice.sendMessage<MessageMapping>(
					type,
					payload?.data as any,
				);
			} else {
				const payload: BaseReduxActionPayload<{}> | undefined =
					action.payload;
				// Do not rebroadcast messages that have been sent through as part of a synchronization packet.
				// If `messageType` is a number, then its some part of a synchronization packet.
				if (payload?.messageDirection === "incoming") {
					reBroadcastMessageIfRequired(
						postOffice.sendMessage.bind(postOffice),
						action.type,
						action?.payload,
					);
				}
			}
		}

		// We don't modify the state.
		return {};
	};
}
