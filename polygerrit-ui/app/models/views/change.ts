/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  NumericChangeId,
  RepoName,
  RevisionPatchSetNum,
  BasePatchSetNum,
  ChangeInfo,
  PatchSetNumber,
} from '../../api/rest-api';
import {GerritView} from '../../services/router/router-model';
import {UrlEncodedCommentId} from '../../types/common';
import {select} from '../../utils/observable-util';
import {
  encodeURL,
  getBaseUrl,
  getPatchRangeExpression,
} from '../../utils/url-util';
import {AttemptChoice} from '../checks/checks-util';
import {define} from '../dependency';
import {Model} from '../model';
import {ViewState} from './base';

export interface ChangeViewState extends ViewState {
  view: GerritView.CHANGE;

  changeNum: NumericChangeId;
  project: RepoName;
  edit?: boolean;
  patchNum?: RevisionPatchSetNum;
  basePatchNum?: BasePatchSetNum;
  commentId?: UrlEncodedCommentId;
  tab?: string;

  /** Checks related view state */

  /** selected patchset for check runs (undefined=latest) */
  checksPatchset?: PatchSetNumber;
  /** regular expression for filtering check runs */
  filter?: string;
  /** selected attempt for check runs (undefined=latest) */
  attempt?: AttemptChoice;

  /** State properties that trigger one-time actions */

  /** for scrolling a Change Log message into view in gr-change-view */
  messageHash?: string;
  /** for logging where the user came from */
  usp?: string;
  /** triggers all change related data to be reloaded */
  forceReload?: boolean;
  /** triggers opening the reply dialog */
  openReplyDialog?: boolean;
}

/**
 * This is a convenience type such that you can pass a `ChangeInfo` object
 * as the `change` property instead of having to set both the `changeNum` and
 * `project` properties explicitly.
 */
export type CreateChangeUrlObject = Omit<
  ChangeViewState,
  'view' | 'changeNum' | 'project'
> & {
  change: Pick<ChangeInfo, '_number' | 'project'>;
};

export function isCreateChangeUrlObject(
  state: CreateChangeUrlObject | Omit<ChangeViewState, 'view'>
): state is CreateChangeUrlObject {
  return !!(state as CreateChangeUrlObject).change;
}

export function objToState(
  obj: CreateChangeUrlObject | Omit<ChangeViewState, 'view'>
): ChangeViewState {
  if (isCreateChangeUrlObject(obj)) {
    return {
      ...obj,
      view: GerritView.CHANGE,
      changeNum: obj.change._number,
      project: obj.change.project,
    };
  }
  return {...obj, view: GerritView.CHANGE};
}

export function createChangeUrl(
  obj: CreateChangeUrlObject | Omit<ChangeViewState, 'view'>
) {
  const state: ChangeViewState = objToState(obj);
  let range = getPatchRangeExpression(state);
  if (range.length) {
    range = '/' + range;
  }
  let suffix = `${range}`;
  const queries = [];
  if (state.checksPatchset && state.checksPatchset > 0) {
    queries.push(`checksPatchset=${state.checksPatchset}`);
  }
  if (state.attempt) {
    if (state.attempt !== 'latest') queries.push(`attempt=${state.attempt}`);
  }
  if (state.filter) {
    queries.push(`filter=${state.filter}`);
  }
  if (state.forceReload) {
    queries.push('forceReload=true');
  }
  if (state.openReplyDialog) {
    queries.push('openReplyDialog=true');
  }
  if (state.usp) {
    queries.push(`usp=${state.usp}`);
  }
  if (state.edit) {
    suffix += ',edit';
  }
  if (state.commentId) {
    suffix = suffix + `/comments/${state.commentId}`;
  }
  if (queries.length > 0) {
    suffix += '?' + queries.join('&');
  }
  if (state.messageHash) {
    suffix += state.messageHash;
  }
  if (state.project) {
    const encodedProject = encodeURL(state.project, true);
    return getBaseUrl() + `/c/${encodedProject}/+/${state.changeNum}${suffix}`;
  } else {
    return getBaseUrl() + `/c/${state.changeNum}${suffix}`;
  }
}

export const changeViewModelToken =
  define<ChangeViewModel>('change-view-model');

export class ChangeViewModel extends Model<ChangeViewState | undefined> {
  public readonly tab$ = select(this.state$, state => state?.tab);

  public readonly checksPatchset$ = select(
    this.state$,
    state => state?.checksPatchset
  );

  public readonly attempt$ = select(this.state$, state => state?.attempt);

  public readonly filter$ = select(this.state$, state => state?.filter);

  constructor() {
    super(undefined);
    this.state$.subscribe(s => {
      if (s?.usp || s?.forceReload || s?.openReplyDialog) {
        // We had been running into issues with directly calling
        // `this.updateState()` without `setTimeout()`, because we want to
        // first allow all subscribers to process the first state update before
        // creating another one. For some unknown reason some subscribers even
        // got the state updates out of order.
        setTimeout(() => {
          this.updateState({
            usp: undefined,
            forceReload: undefined,
            openReplyDialog: undefined,
          });
        }, 0);
      }
    });
  }
}
