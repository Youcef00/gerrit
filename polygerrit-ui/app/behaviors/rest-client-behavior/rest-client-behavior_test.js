/**
 * @license
 * Copyright (C) 2017 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import '../../test/common-test-setup-karma.js';
import {Polymer} from '@polymer/polymer/lib/legacy/polymer-fn.js';
import {RESTClientBehavior} from './rest-client-behavior.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';

const basicFixture = fixtureFromElement('rest-client-behavior-test-element');

const withinOverlayFixture = fixtureFromTemplate(html`
<gr-overlay>
  <rest-client-behavior-test-element></rest-client-behavior-test-element>
</gr-overlay>
`);

suite('rest-client-behavior tests', () => {
  let element;
  // eslint-disable-next-line no-unused-vars
  let overlay;
  let originalCanonicalPath;

  suiteSetup(() => {
    originalCanonicalPath = window.CANONICAL_PATH;
    window.CANONICAL_PATH = '/r';
    // Define a Polymer element that uses this behavior.
    Polymer({
      is: 'rest-client-behavior-test-element',
      behaviors: [
        RESTClientBehavior,
      ],
    });
  });

  suiteTeardown(() => {
    window.CANONICAL_PATH = originalCanonicalPath;
  });

  setup(() => {
    element = basicFixture.instantiate();
    overlay = withinOverlayFixture.instantiate();
  });

  test('changeBaseURL', () => {
    assert.deepEqual(
        element.changeBaseURL('test/project', '1', '2'),
        '/r/changes/test%2Fproject~1/revisions/2'
    );
  });

  test('changePath', () => {
    assert.deepEqual(element.changePath('1'), '/r/c/1');
  });

  test('Open status', () => {
    const change = {
      change_id: 'Iad9dc96274af6946f3632be53b106ef80f7ba6ca',
      revisions: {
        rev1: {_number: 1},
      },
      current_revision: 'rev1',
      status: 'NEW',
      labels: {},
      mergeable: true,
    };
    let statuses = element.changeStatuses(change);
    const statusString = element.changeStatusString(change);
    assert.deepEqual(statuses, []);
    assert.equal(statusString, '');

    change.submittable = false;
    statuses = element.changeStatuses(change,
        {includeDerived: true});
    assert.deepEqual(statuses, ['Active']);

    // With no missing labels but no submitEnabled option.
    change.submittable = true;
    statuses = element.changeStatuses(change,
        {includeDerived: true});
    assert.deepEqual(statuses, ['Active']);

    // Without missing labels and enabled submit
    statuses = element.changeStatuses(change,
        {includeDerived: true, submitEnabled: true});
    assert.deepEqual(statuses, ['Ready to submit']);

    change.mergeable = false;
    change.submittable = true;
    statuses = element.changeStatuses(change,
        {includeDerived: true});
    assert.deepEqual(statuses, ['Merge Conflict']);

    delete change.mergeable;
    change.submittable = true;
    statuses = element.changeStatuses(change,
        {includeDerived: true, mergeable: true, submitEnabled: true});
    assert.deepEqual(statuses, ['Ready to submit']);

    change.submittable = true;
    statuses = element.changeStatuses(change,
        {includeDerived: true, mergeable: false});
    assert.deepEqual(statuses, ['Merge Conflict']);
  });

  test('Merge conflict', () => {
    const change = {
      change_id: 'Iad9dc96274af6946f3632be53b106ef80f7ba6ca',
      revisions: {
        rev1: {_number: 1},
      },
      current_revision: 'rev1',
      status: 'NEW',
      labels: {},
      mergeable: false,
    };
    const statuses = element.changeStatuses(change);
    const statusString = element.changeStatusString(change);
    assert.deepEqual(statuses, ['Merge Conflict']);
    assert.equal(statusString, 'Merge Conflict');
  });

  test('mergeable prop undefined', () => {
    const change = {
      change_id: 'Iad9dc96274af6946f3632be53b106ef80f7ba6ca',
      revisions: {
        rev1: {_number: 1},
      },
      current_revision: 'rev1',
      status: 'NEW',
      labels: {},
    };
    const statuses = element.changeStatuses(change);
    const statusString = element.changeStatusString(change);
    assert.deepEqual(statuses, []);
    assert.equal(statusString, '');
  });

  test('Merged status', () => {
    const change = {
      change_id: 'Iad9dc96274af6946f3632be53b106ef80f7ba6ca',
      revisions: {
        rev1: {_number: 1},
      },
      current_revision: 'rev1',
      status: 'MERGED',
      labels: {},
    };
    const statuses = element.changeStatuses(change);
    const statusString = element.changeStatusString(change);
    assert.deepEqual(statuses, ['Merged']);
    assert.equal(statusString, 'Merged');
  });

  test('Abandoned status', () => {
    const change = {
      change_id: 'Iad9dc96274af6946f3632be53b106ef80f7ba6ca',
      revisions: {
        rev1: {_number: 1},
      },
      current_revision: 'rev1',
      status: 'ABANDONED',
      labels: {},
    };
    const statuses = element.changeStatuses(change);
    const statusString = element.changeStatusString(change);
    assert.deepEqual(statuses, ['Abandoned']);
    assert.equal(statusString, 'Abandoned');
  });

  test('Open status with private and wip', () => {
    const change = {
      change_id: 'Iad9dc96274af6946f3632be53b106ef80f7ba6ca',
      revisions: {
        rev1: {_number: 1},
      },
      current_revision: 'rev1',
      status: 'NEW',
      is_private: true,
      work_in_progress: true,
      labels: {},
      mergeable: true,
    };
    const statuses = element.changeStatuses(change);
    const statusString = element.changeStatusString(change);
    assert.deepEqual(statuses, ['WIP', 'Private']);
    assert.equal(statusString, 'WIP, Private');
  });

  test('Merge conflict with private and wip', () => {
    const change = {
      change_id: 'Iad9dc96274af6946f3632be53b106ef80f7ba6ca',
      revisions: {
        rev1: {_number: 1},
      },
      current_revision: 'rev1',
      status: 'NEW',
      is_private: true,
      work_in_progress: true,
      labels: {},
      mergeable: false,
    };
    const statuses = element.changeStatuses(change);
    const statusString = element.changeStatusString(change);
    assert.deepEqual(statuses, ['Merge Conflict', 'WIP', 'Private']);
    assert.equal(statusString, 'Merge Conflict, WIP, Private');
  });
});

