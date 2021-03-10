
import * as Agents from '@findify/agent';
import { SearchProvider, AutocompleteProvider, RecommendationProvider, SmartCollectionProvider } from '@findify/react-connect';
import { useEffect } from 'react';

export const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
export const camelize = s => s.split('-').map(capitalize).join('');

const providers = {
  search: SearchProvider,
  autocomplete: AutocompleteProvider,
  recommendation: RecommendationProvider,
  'smart-collection': SmartCollectionProvider
};

export const createWidgetCreator = (type, { key, user }) => {
  const _agent = new Agents[camelize(type)]({ key, user, immutable: true, method: 'post' })
  const ProviderComponent = providers[type];

  const Provider = ({ cache, ...rest }) => {
    useEffect(() => cache && _agent.handleResponse(cache), []);
    return <ProviderComponent apiKey={key} user={user} agent={_agent} {...rest} />
  }

  const request = (params, defaults) => new Promise((resolve, reject) => {
    _agent.once('change', (i) => resolve(i[0]))
    _agent.once('error', (e) => console.error('error', e) || reject(e))
    if (defaults) _agent.defaults(defaults);
    if (params) _agent.set(params)
  })

  return { request, Provider }
};
