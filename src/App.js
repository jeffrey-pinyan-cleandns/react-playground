import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

export const App = () => {
    const [ clicks, setClicks ] = useState(0);
    const addClick = (n=1) => setClicks((c) => c+n);
    const addClickCallback = useCallback((n=1) => setClicks((c) => c+n), []);

    const id1 = useNextId();
    const id2 = useNextId('prefix');
    const id3 = useId();
    const id4 = useId();

    const ref = useRef(getPi1());
    const refMemo = useRef(useMemo(getPi2, []));

    const [ factor, setFactor ] = useState(1);
    const memo = useMemo(() => getPi3() * factor, [factor]);

    // useEffect with an empty dependency array fires only when the component is mounted.
    // useEffect can return a function which will fire when the component is unmounted.
    useEffect(() => {
        console.log('mounted');
        return () => console.log('unmounted');
    }, []);

    // useEffect with a dependency array fires after the dependencies change.
    // useEffect can return a function which will fire right before the dependencies change.
    useEffect(() => {
        console.log(`mounted, memo=${memo}`);
        return () => console.log(`unmounted, memo=${memo}`);
    }, [memo]);


    // This message will be logged every time this component renders.
    console.log('re-rendered');

    // This message will be logged every time this component renders,
    // because addClick is re-defined every time the component renders.
    useEffect(() => {
        console.log('addClick changed');
    }, [addClick]);

    // This message will only be logged when the component is mounted,
    // because addClickCallback uses the useCallback hook to avoid
    // re-defining the function each time.
    useEffect(() => {
        console.log('addClickCallback changed');
    }, [addClickCallback]);

    // The object returned by useRef() never changes while the component remains mounted,
    // so this useEffect will only fire when the compponent mounts.
    useEffect(() => {
        console.log('ref changed');
    }, [ref]);

    // The value returned by useRef().current is not a state variable,
    // so this useEffect will only fire when the compponent re-renders for some other reason.
    useEffect(() => {
        console.log('ref.current changed');
    }, [ref.current]);

    // The object returned by useRef() never changes while the component remains mounted,
    // so this useEffect will only fire when the compponent mounts.
    useEffect(() => {
        console.log('refMemo changed');
    }, [refMemo]);
    
    // The value returned by useRef().current is not a state variable,
    // so this useEffect will only fire when the compponent re-renders for some other reason.
    useEffect(() => {
        console.log('refMemo.current changed');
    }, [refMemo.current]);

    // The 'memo' variable changes when 'factor' changes,
    // so this message will only be logged when 'factor' is changed.
    useEffect(() => {
        console.log('memo changed');
    }, [memo]);


    const foo = useFoo(factor);

    // This is logged every time the component re-renders,
    // because useFoo() returns an object that changes every time.
    useEffect(() => {
        console.log(`foo changed`);
    }, [foo]);


    const bar = useBar(factor);

    // This is logged only when the component is mounted, or when bar.N changes,
    // because useBar() returns an memo-ized object.
    useEffect(() => {
        console.log(`bar changed`);
    }, [bar]);


    const blat = useBlat(factor);

    // This is logged only when the component is mounted, or when blat.N changes,
    // because useBlat() returns an memo-ized object.
    // In addition, the useBlat() hook pays attention to when its argument changes.
    useEffect(() => {
        console.log(`blat changed`);
    }, [blat]);

    return (<>
        <h1>{id1} {id2} {id3} {id4}</h1>
        <table cellPadding={20}>
            <tbody>
            <tr>
                <td colSpan={3}>
                    You have clicked {clicks} time{clicks !== 1 && 's'}!
                </td>
            </tr>
            <tr>
                <td>
                    <button onClick={() => setClicks((c) => c+1)}>Add 1</button>        
                </td>
                <td>                    
                    <button onClick={() => addClick(3)}>Add 3</button>
                </td>
                <td>
                    <button onClick={() => addClickCallback(5)}>Add 5</button>
                </td>
            </tr>
            </tbody>
        </table>
        <hr/>
        <table cellPadding={20}>
            <tbody>
            <tr>
                <td>
                    <div>ref.current = {ref.current}</div>
                    <button onClick={() => ref.current *= 2}>Double ref.current</button>
                </td>
                <td>
                    <div>refMemo.current = {refMemo.current}</div>
                    <button onClick={() => refMemo.current *= 2}>Double refMemo.current</button>
                </td>
                <td>
                    <div>memo = {memo}</div>
                    <button onClick={() => setFactor((f) => f *= 2)}>Double memo (factor = {factor})</button>
                </td>
            </tr>
            </tbody>
        </table>
        <hr/>
        <table cellPadding={20}>
            <tbody>
            <tr>
                <td>
                    <div>foo.N = {foo.N} (initially based on 'factor')</div>
                    <button onClick={() => foo.setN((n) => n + 1)}>Add 1 to foo.N</button>
                </td>
                <td>
                    <div>bar.N = {bar.N} (initially based on 'factor')</div>
                    <button onClick={() => bar.setN((n) => n + 1)}>Add 1 to bar.N</button>
                </td>
                <td>
                    <div>blat.N = {blat.N} (based on 'factor')</div>
                    <button onClick={() => blat.setN((n) => n + 1)}>Add 1 to blat.N</button>
                </td>
            </tr>
            </tbody>
        </table>
        <hr/>
        <table cellPadding={20}>
            <tbody>
            <tr>
                <td><Plain value={blat.N}/></td>
                <td><Memoized value={blat.N}/></td>
            </tr>
            </tbody>
        </table>
        <hr/>
        <SetState/>
    </>);
};

export default App;


const getPi1 = () => {
    // This message will be logged every time getPi1() is called.
    console.log('getPi1 called');
    return Math.PI;
};

const getPi2 = () => {
    // This message will be logged every time getPi2() is called.
    console.log('getPi2 called');
    return Math.PI;
};

const getPi3 = () => {
    // This message will be logged every time getPi3() is called.
    console.log('getPi3 called');
    return Math.PI;
};


// This is my attempt at a useId() clone.
let i = 0;

const useNextId = (prefix='id') => {
    return useMemo(() => `${prefix}-${i++}`, [prefix]);
};


// This hook unwisely returns a new object every time it renders.
// This can cause unnecessary re-rendering of other components.
const useFoo = (n) => {
    const [ N, setN ] = useState(n);

    return { N, setN };
};


// This hook wisely returns a memo-ized object, so it will
// only return a new object when N is changed (via the setN function).
// However, this hook does not monitor for changes in its argument, n.
const useBar = (n) => {
    const [ N, setN ] = useState(n);
    const state = useMemo(() => ({ N, setN }), [N]);
    return state;
};


// This hook improves upon useBar() by also monitoring for
// changes to its argument, n. This means that it will re-render
// when its argument changes, rather than needing to be unmounted
// and remounted.
const useBlat = (n) => {
    const [ N, setN ] = useState(n);
    const state = useMemo(() => ({ N, setN }), [N]);
    useEffect(() => {
        setN(n);
    }, [n]);
    return state;
};


// This component demonstrates importance of state-setting functions being able to receive a function OR a value.
const SetState = () => {
    // This one will succeed.
    const [ age, setAge ] = useState(20);

    // This one will fail because updateAge() doesn't expect to receive a function.
    const [ state, setState ] = useState({ name: 'Alan', age: 20, hair: 'brown' });
    const updateAge = useCallback((age) => setState((state) => ({ ...state, age })), []);

    // This one will succeed.
    const [ state2, setState2 ] = useState({ name: 'Alan', age: 20, hair: 'brown' });
    const updateAge2 = useCallback((funcOrValue) => {
        setState2((state) => ({ ...state, age: (typeof funcOrValue === 'function') ? funcOrValue(state.age) : funcOrValue }));
    }, []);

    // This one will succeed.
    const [ state3, setState3 ] = useState({ name: 'Alan', age: 20, hair: 'brown' });
    const updateAge3 = useCallback((age) => setState3((state) => ({ ...state, age })), []);
    const [ age3, setAge3 ] = useProxyState(state3.age, updateAge3);
    
    return (
        <table cellPadding={20}>
            <tbody>
            <tr>
                <td valign="top">
                    <xmp>{JSON.stringify(age, null, 4)}</xmp>
                    <Age value={age} setValue={setAge}/>
                </td>
                <td valign="top">
                    <xmp>{JSON.stringify(state, null, 4)}</xmp>
                    <Age value={state.age} setValue={updateAge}/>
                </td>
                <td valign="top">
                    <xmp>{JSON.stringify(state2, null, 4)}</xmp>
                    <Age value={state2.age} setValue={updateAge2}/>
                </td>
                <td valign="top">
                    <xmp>{JSON.stringify(state3, null, 4)}</xmp>
                    <Age value={age3} setValue={setAge3}/>
                </td>
            </tr>
            </tbody>
        </table>
    );
};

const Age = ({ value, setValue }) => {
    return <div>
        <div>Age = {value}</div>
        <div><button onClick={() => setValue(30)}>Set Age to 30</button></div>
        <div><button onClick={() => setValue((v) => v+2)}>Add 2 to Age</button></div>
    </div>;
};


const useProxyState = (remote, setRemote) => {
    const valueState = useState(remote);
    const [ value, setValue ] = valueState;

    useEffect(() => setValue(remote), [setValue, remote]);
    useEffect(() => setRemote(value), [setRemote, value]);

    return valueState;
};


const Plain = ({ value }) => {
    console.log(`Plain rendered ${value}`);

    return <div>Plain: {value}</div>;
};

const Memoized = memo(({ value }) => {
    console.log(`Memoized rendered ${value}`);

    return <div>Memoized: {value}</div>;
});

