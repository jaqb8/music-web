import { assign } from 'xstate';

export const states = {
	initial: 'initial',
	noComment: 'no_comment',
	loading: 'loading',
	commented: 'commented'
};

export const ratingCommentMachine = {
	initial: states.initial,
	states: {
		initial: {
			always: [{ target: states.commented, cond: 'hasComment' }, { target: states.noComment }]
		},
		[states.noComment]: {
			on: {
				ADD_COMMENT: {
					target: states.loading,
					actions: ['addComment']
				}
			}
		},
		[states.loading]: {
			on: {
				ADD_COMMENT_SUCCESS: {
					target: states.commented,
					actions: ['invalidateUserRating']
				},
				DELETE_COMMENT_SUCCESS: states.noComment
			}
		},
		[states.commented]: {
			on: {
				DELETE_COMMENT: states.loading
			}
		}
	}
};
