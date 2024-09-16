'use strict';
import { IWebviewViewMessageListener } from '../types';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Message listening class for the native variable viewer and scratch pad
export class SimpleMessageListener implements IWebviewViewMessageListener {
    private disposedCallback: () => void;
    private callback: (message: string, payload: any) => void;

    constructor(callback: (message: string, payload: any) => void, disposed: () => void) {
        // Save our dispose callback so we remove our history window
        this.disposedCallback = disposed;

        // Save our local callback so we can handle the non broadcast case(s)
        this.callback = callback;
    }

    public async dispose() {
        this.disposedCallback();
    }

    public onMessage(message: string, payload: any) {
        // Send to just our local callback.
        this.callback(message, payload);
    }
}
