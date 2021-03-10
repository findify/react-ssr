
import * as Agents from '@findify/agent';
import { SearchProvider, AutocompleteProvider, RecommendationProvider, SmartCollectionProvider } from '@findify/react-connect';
import { useEffect, useMemo } from 'react';
import Cookies from 'universal-cookie';

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
const camelize = s => s.split('-').map(capitalize).join('');
const symbols = '0123456789acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ';

const generateId = () => {
  let str = '';
  for (let i = 0; i < 16; i++) {
    str += symbols[(Math.random() * symbols.length) | 0];
  }
  return str;
}

const providers = {
  search: SearchProvider,
  autocomplete: AutocompleteProvider,
  recommendation: RecommendationProvider,
  'smart-collection': SmartCollectionProvider
};

const _uidKey = '_findifyUID'
const _sidKey = '_findifySID'

const getExistUser = (ctx) => {
  if (process.browser) {
    const cookies = new Cookies();
    const _uid = cookies.get(_uidKey);
    const _sid = cookies.get(_sidKey);
    const uid = _uid || generateId();
    const sid = _sid || generateId();
    if (!_uid) cookies.set(_uidKey, uid, { path: '/' });
    if (!_sid) cookies.set(_sidKey, sid, { path: '/' });
    return { uid, sid };
  } else {
    if (!ctx) return;
    const cookies = new Cookies(ctx.headers.cookie);
    return {
      uid: cookies.get(_uidKey) || '0',
      sid: cookies.get(_sidKey) || '0'
    };
  }
};

export const createWidgetCreator = (type, key) => {
  const ProviderComponent = providers[type];
  const Agent = Agents[camelize(type)];
  let _agent = undefined;
  let _user = undefined;

  const setUser = (ctx) => _user = getExistUser(ctx);
  const getUser = () => {
    if (_user) return _user;
    return _user = getExistUser()
  }

  const getAgent = () => {
    if (_agent) return _agent;
    return _agent = new Agent({ key, user: getUser(), immutable: true, method: 'post' })
  }

  const Provider = ({ cache, ...rest }) => {
    const [localAgent, user] = useMemo(() => [getAgent(), getUser()], []);
    useEffect(() => cache && localAgent.handleResponse(cache), []);
    return <ProviderComponent apiKey={key} user={user} agent={localAgent} {...rest} />
  }

  const request = ({ req, params, defaults }) => new Promise((resolve, reject) => {
    if (req) setUser(req);
    const localAgent = getAgent();
    localAgent.once('change', (i) => resolve(i[0].toJS()))
    localAgent.once('error', (e) => console.error('error', e) || reject(e))
    if (defaults) localAgent.defaults(defaults);
    if (params) localAgent.applyState(params)
    if (!defaults && !params) reject();
  });

  return {
    Provider,
    request,
    setUser,
    getAgent
  }
};
