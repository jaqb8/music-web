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
			always: [{ target: states.noComment }, { target: states.commented, cond: 'hasComment' }]
		},
		[states.noComment]: {
			on: {
				ADD_COMMENT: states.loading
			}
		},
		[states.loading]: {
			on: {
				ADD_COMMENT_SUCCESS: states.commented,
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
