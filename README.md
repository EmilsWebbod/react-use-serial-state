# React Serial State

React serial state that fixes the problem with async set state.  
Uses the useReducer hooks to be sure the state that updates is correct with earlier setStates.

## Install

```
yarn add @ewb/react-serial-state
npm install @ewb/react-serial-state
```

## How to use

```
function ReactComponent() {
    const [state, setState, setKey] = useSerialState({
        text: 'string',
        number: 1,
        obj: {
            text2: 'string2',
            number2: 2
        }
    });

    useEffetct(() => {
        setState( { text: 'string2' }) // { text: 'string2', number: 1, obj... }
        setKey('obj', { text2: 'string3' }) { text: 'string2', number: 1, obj: { text2: 'string3', number2: 2 }}
    }, []);

    return state;
}
```

## Problem that was fixed.

```
function AsyncComponent() {
    const [state, setState] = useState({
        text: 'string',
        number: 1,
        data: { ... } | null
    });

    async fetchData(num: number) {
        setState( { ...state, num, text: 'string2' }) // { text: 'string2', number: 1, obj... }

        const data = async fetch(...);

        // The next line is wrong when the old state has not been updated with the "num" or string.
        // So spreading this state will overwrite the setState before the async call.
        setState( { ...state, data }) // { text: 'string', number: 1, data: {...} }
    }

    useEffetct(() => {
        fetchData(2)
    }, []);

    return state;
}
```
