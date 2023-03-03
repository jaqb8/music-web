import { createMachine } from 'xstate';
import type { Session } from '@supabase/supabase-js';
import type { Database } from '$lib/types';

export const states = {
	initial: 'initial',
	authenticated: {
		initial: 'authenticated',
		noRate: 'no_rate',
		rated: 'rated',
		loading: 'loading'
	},
	notAuthenticated: {
		initial: 'notAuthenticated',
		hasModalOpen: 'has_modal_open'
	}
};

interface RatingContext {
	session: Session | null;
	userRating: Database['public']['Tables']['ratings']['Row'][];
}

export const ratingMachine = createMachine({
	id: 'rating-machine',
	predictableActionArguments: true,
	schema: {
		context: {} as RatingContext
	},
	initial: states.initial,
	states: {
		initial: {
			always: [
				{ target: states.authenticated.initial, cond: 'isAuthenticated' },
				{ target: states.notAuthenticated.initial }
			]
		},
		notAuthenticated: {
			initial: states.notAuthenticated.initial,
			states: {
				[states.notAuthenticated.initial]: {
					on: {
						ADD_RATING: {
							target: states.notAuthenticated.hasModalOpen,
							cond: 'isAuthenticated',
							actions: ['addRating']
						}
					}
				},
				[states.notAuthenticated.hasModalOpen]: {
					on: {
						HIDE_MODAL: states.notAuthenticated.initial
					}
				}
			}
		},
		authenticated: {
			initial: states.authenticated.initial,
			on: {
				LOGOUT: states.initial
			},
			states: {
				[states.authenticated.initial]: {
					always: [
						{ target: states.authenticated.rated, cond: 'hasRating' },
						{ target: states.authenticated.noRate }
					]
				},
				[states.authenticated.rated]: {
					on: {
						DELETE_RATING: states.authenticated.loading
					}
				},
				[states.authenticated.noRate]: {
					on: {
						ADD_RATING: {
							target: states.authenticated.loading,
							cond: 'isAuthenticated',
							actions: ['addRating']
						}
					}
				},
				[states.authenticated.loading]: {
					on: {
						ADD_RATING_SUCCESS: states.authenticated.rated,
						DELETE_RATING_SUCCESS: states.authenticated.noRate
					}
				}
			}
		}
	}
});
