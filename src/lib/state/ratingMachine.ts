import { assign, createMachine, type EventObject } from 'xstate';
import type { Session } from '@supabase/supabase-js';
import type { RatingValue } from '$lib/types';

export const states = {
	initial: 'initial',
	noRate: 'no_rate',
	rated: 'rated',
	loading: 'loading',
	hasModalOpen: 'has_modal_open'
};

interface RatingContext {
	session: Session | null;
	userRating: RatingValue;
}

interface RatingEvent extends EventObject {
	userRating: RatingValue;
}

export const ratingMachine = createMachine(
	{
		id: 'rating-machine',
		predictableActionArguments: true,
		schema: {
			context: {} as RatingContext
		},
		initial: states.initial,
		states: {
			[states.initial]: {
				always: [{ target: states.rated, cond: 'hasRate' }, { target: states.noRate }]
			},
			[states.noRate]: {
				on: {
					ADD_RATING: [
						{
							target: states.loading,
							cond: 'isAuthenticated',
							actions: ['addRating']
						},
						{ target: states.hasModalOpen }
					]
				}
			},
			[states.rated]: {
				on: {
					DELETE_RATING: {
						target: states.loading,
						cond: 'isAuthenticated'
					},
					LOGOUT: {
						target: states.initial,
						actions: assign(() => ({
							session: null,
							userRating: undefined
						}))
					}
				}
			},
			[states.loading]: {
				on: {
					ADD_RATING_SUCCESS: {
						target: states.rated,
						actions: assign<RatingContext, RatingEvent>({
							userRating: (_, { userRating }) => userRating
						})
					},
					DELETE_RATING_SUCCESS: states.noRate
				}
			},
			[states.hasModalOpen]: {
				on: {
					HIDE_MODAL: states.noRate
				}
			}
		}
	},
	{
		guards: {
			isAuthenticated: ({ session }) => Boolean(session),
			hasRate: ({ session, userRating }) =>
				Boolean(session) && userRating !== null && userRating !== undefined
		}
	}
);
