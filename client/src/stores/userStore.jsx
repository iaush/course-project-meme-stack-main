import { create } from 'zustand';
import Client from '../services/client';
import jwt_decode from 'jwt-decode';
import { devtools } from 'zustand/middleware'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * @typedef {Object} Response
 * @property {boolean} success
 * @property {String} message
 * @property {T} data
 * 
 * @typedef {{
 *  user: User,
 *  token: String
 *  setCurrentUser: () => void,
 *  login: (String, String) => boolean,
 *  checkValidToken: ([String]) => boolean,
 *  getAndSetUser: () => void
 *  setToken: (String) => void
 *  logout: () => void,
 *  fetchUserModules: () => Response
 * }} UserSlice
 * 
 * @typedef {import('zustand').StateCreator<UserSlice, ['devtools', options.partialize], ['persist', options.partialize], UserSlice>} UserSliceCreator
 */

/** @type {UserSliceCreator} */
const useUserStore = create(
  devtools(
  // Handles this stores persistance in localStorage 
  // (-modules to always load in event of changes)
  persist(
    (set, get) => ({
      /**
       * @typedef {Object} User
       * @property {String} username
       * @property {boolean} anonymous
       * @property {Array} modules
       */
      /** @type {User} */
      user: null,

      /** @type {string} */
      username: null,

      /** @type {string} */ 
      token: null,
      
      /**
       * @typedef {Object} Module
       * @property {String} name
       * 
       * @type {Module[]} modules
       */
      modules: [],

      client: null,

      setCurrentUser: (user) => set({ user }),

      submittedScores: [],

      anonymous: false,

      /**
       * 
       * @param {String} username 
       * @param {String} password 
       * @returns {Response}
       */
      login: async (username, password) => {
        let client = get().getClient();
        let userResponse = await client.post('/api/v1/auth', { username, password });
        if (userResponse.status !== 200) 
          return ({ 
            'success': false,
            'message': userResponse.response.data.message
          })

        client.setToken(userResponse.data.token);
        set({ 
          token: userResponse.data.token,
          client,
          username
        });

        get().getAndSetUser()

        return {
          success: true,
          message: 'Logged in'
        };
      },
      
      getAndSetUser: async () => {
        const client = get().getClient();
        let userResponse = await client.get('/api/v1/user')
        client.setToken(get().token)
        let modules = await get().fetchUserModules();
        set({user: {...userResponse.data},
            client,
            modules,
            username: userResponse.data.data.username,
            anonymous: false})
      },

      getClient: () => {
        if (get().client instanceof Client) {
          return get().client
        } else if (get().token !== null) {
          let client = new Client();
          client.setToken(get().token);
          set({client});
          return client;
        }
        const client = new Client();
        client.setToken('');
        set({client});
        return client;
      },

      /**
       * Checks if token is valid or not. tokenToCheck is
       * optional; if not passed, checks token store.
       * 
       * @param {String} [tokenToCheck]
       * @returns {Boolean}
       */
      checkValidToken: (tokenToCheck) => {
        let token = tokenToCheck ?? get().token;
        if (token === null) return false;

        const decodedToken = jwt_decode(token);
        const dateNow = new Date();
        if (decodedToken.exp < dateNow.getTime() / 1000) {
          return false;
        }
        return true;
      },

      /**
       * Reassigns the new token in state
       * @param {String} token 
       */
      setToken: (token) => {
        set({token});
        const client = get().getClient();
        client.setToken(token);
      },


      fetchUserModules: async () => {
        if (!get().checkValidToken()) {
          return {'success': false, 'message': 'Login required'}
        }
        let userModules = await get().getClient().get('/api/v1/module/user');
        set({modules: userModules.data.data});
        return userModules.data.data;
      },

      /**
       * Deletes store token
       * @returns {void}
       */
      deleteToken: () => set({token: null}),

      checkLoggedIn: () => {
        return get().checkValidToken()
      },

      setAnonymousUsername: (username) => {
        set({username, anonymous: true});
      },

      setSubmittedScores: (submittedScores) => {
        set({submittedScores});
      },

      logout: () => set({token: null, user: null})
  }),
  {
      name:'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
      Object.fromEntries(
        Object.entries(state).filter(([key]) => !['modules'].includes(key))
      )
  }  
  )
  )
)

export default useUserStore;