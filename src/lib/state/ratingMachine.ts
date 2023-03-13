import { assign, createMachine, type EventObject } from 'xstate';
import type { Session } from '@supabase/supabase-js';
import type { RatingObject } from '$lib/types';
import { ratingCommentMachine } from './ratingCommentMachine';

export const states = {
	initial: 'initial',
	noRate: 'no_rate',
	rated: 'rated',
	loading: 'loading',
	hasModalOpen: 'has_modal_open'
};

interface RatingContext {
	session: Session | null;
	userRating: RatingObject[];
}

interface RatingEvent extends EventObject {
	userRating: RatingObject[];
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
					],
					LOGOUT: {
						target: states.initial,
						actions: assign(() => ({
							session: null,
							userRating: []
						}))
					}
				}
			},
			[states.rated]: {
				on: {
					DELETE_RATING: {
						target: states.loading,
						cond: 'hasRate',
						actions: ['deleteRating']
					},
					LOGOUT: {
						target: states.initial,
						actions: assign(() => ({
							session: null,
							userRating: []
						}))
					}
				},
				...ratingCommentMachine
			},
			[states.loading]: {
				on: {
					ADD_RATING_SUCCESS: {
						target: states.rated,
						actions: ['invalidateUserRating']
					},
					DELETE_RATING_SUCCESS: {
						target: states.noRate,
						actions: assign<RatingContext, RatingEvent>({
							userRating: []
						})
					}
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
				Boolean(session) && userRating.length > 0 && userRating.at(0)?.rating !== null,
			hasComment: ({ session, userRating }) =>
				Boolean(session) &&
				userRating.length > 0 &&
				userRating.at(0)?.rating !== null &&
				userRating.at(0)?.comment !== null
		},
		actions: {
			invalidateUserRating: assign<RatingContext, RatingEvent>({
				userRating: (_, { userRating }) => userRating
			})
		}
	}
);
