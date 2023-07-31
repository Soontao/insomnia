/* eslint-disable @typescript-eslint/no-unused-vars */

import * as session from '../account/session';
import { getApiBaseURL } from '../common/constants';
import { axiosRequest } from './network/axios-request';

export enum SegmentEvent {
  appStarted = 'App Started',
  collectionCreate = 'Collection Created',
  dataExport = 'Data Exported',
  dataImport = 'Data Imported',
  documentCreate = 'Document Created',
  kongConnected = 'Kong Connected',
  kongSync = 'Kong Synced',
  requestBodyTypeSelect = 'Request Body Type Selected',
  requestCreate = 'Request Created',
  requestExecute = 'Request Executed',
  projectLocalCreate = 'Local Project Created',
  projectLocalDelete = 'Local Project Deleted',
  testSuiteCreate = 'Test Suite Created',
  testSuiteDelete = 'Test Suite Deleted',
  unitTestCreate = 'Unit Test Created',
  unitTestDelete = 'Unit Test Deleted',
  unitTestRun = 'Ran Individual Unit Test',
  unitTestRunAll = 'Ran All Unit Tests',
  vcsSyncStart = 'VCS Sync Started',
  vcsSyncComplete = 'VCS Sync Completed',
  vcsAction = 'VCS Action Executed',
  buttonClick = 'Button Clicked',
}

export async function trackSegmentEvent() {
}

export async function trackPageView() {
}

export async function sendTelemetry() {
  if (session.isLoggedIn()) {
    axiosRequest({
      method: 'POST',
      url: `${getApiBaseURL()}/v1/telemetry/`,
      headers: {
        'X-Session-Id': session.getCurrentSessionId(),
      },
    }).catch((error: unknown) => {
      console.warn('[analytics] Unexpected error while sending telemetry', error);
    });
  }
}
