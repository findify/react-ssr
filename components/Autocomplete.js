import styled from '@emotion/styled'
import { connectSuggestions, useSuggestions } from '@findify/react-connect/lib'
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react'
import { createWidgetCreator } from './Findify'


const Creator = createWidgetCreator('autocomplete', {
  key: '680d373d-06b3-442b-bebc-d35a5b0868b3',
  user: { uid: "IQnXnYbY9f5FDRIn", sid: "A3Y0uoRK5H8S0vv0" }
});

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
 

const Container = styled.div`
  position: relative;
  input{
    width: 100%;
  }
`

const Image = styled.img``
const Suggestion = styled.button`
  
`

const Suggestions = () => {
  const { suggestions } = useSuggestions();
  const router = useRouter();
  const onClick = useCallback((q) => {
    router.push({ query: { q } })
  })
  if (!suggestions) return null;
  return (
    <div>
      {
        suggestions
          .map((i) =>
            <Suggestion key={i.hashCode()} onClick={() => onClick(i.get('value'))}>
              {i.get('value')}
            </Suggestion>)
          .toArray()
      }
    </div>
  )
}
export const Grid = styled.section`
  display: flex;
  align-items: top;
  flex-wrap: wrap;
`
export const Autocomplete = () => {
  const [q, setQ] = useState('');
  const onChange = useCallback(debounce((e) => setQ(e.target.value), 1000), []);
  return (
    <Container>
      <input onChange={onChange} />
      <Creator.Provider query={{ q }}>
        <Suggestions />
      </Creator.Provider>
    </Container>
  )
}
