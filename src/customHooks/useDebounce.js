import {useEffect,useState} from 'react';

export default function useDebounce(value,callBack,delay)
{
    const [debouncedValue,setDebouncedValue]=useState(value);
    let timer;
    useEffect(()=>
    {
        
        if(value!="" || (debouncedValue!=value))
        {
            
            timer=setTimeout(() => {
                console.log(`value`,value)
                setDebouncedValue(value);
                callBack?.(value);
            }, delay);
        }
      

        return ()=>
        {
            if(timer) clearTimeout(timer);
        }

    },[value])

    return debouncedValue;
}