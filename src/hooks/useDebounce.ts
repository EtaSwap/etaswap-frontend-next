import { useEffect, useState } from 'react';

function useDebounce(value: string, delay: number): string {
    const [debValue, setDebValue] = useState(value);
    useEffect(
        () => {
            const timerId = setTimeout(() => {
                setDebValue(value);
            }, delay);
            return () => {
                clearTimeout(timerId);
            };
        },
        [value, delay],
    );
    return debValue;
}

export default useDebounce;
