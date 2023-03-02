import { createMachine } from 'xstate';

export const states = {
	initial: 'inital',
	noRate: 'no_rate',
	isLoading: 'loading',
	hasRate: 'has_rate',
	hasModalOpen: 'has_modal_open'
};

export const ratingMachine = createMachine({
	id: 'rating-machine',
	predictableActionArguments: true,
	initial: states.initial,
	states: {
		[states.initial]: {
			always: [
				{ target: states.noRate, cond: 'notRated' },
				{ target: states.hasRate, cond: 'rated' }
			]
		},
		[states.noRate]: {
			on: {
				ADD_RATING: [
					{
						target: states.isLoading,
						cond: 'isAuthenticated'
					},
					{
						target: states.hasModalOpen
					}
				]
			}
		},
		[states.isLoading]: {
			on: {
				ADD_RATING_SUCCESS: states.hasRate,
				DELETE_RATING_SUCCESS: states.noRate
			}
		},
		[states.hasRate]: {
			on: {
				DELETE_RATING: states.isLoading
			},
			always: [
				{
					target: states.noRate,
					cond: 'isNotAuthenticated'
				}
			]
		},
		[states.hasModalOpen]: {
			on: {
				HIDE_MODAL: states.noRate
			}
		}
	}
});
