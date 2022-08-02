import { useEffect, useState } from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Router from 'next/router';

export default function Confirmed() {
    const [percentage, setPercentage] = useState(0);
    const [text, setText] = useState('');

    useEffect(() => {
        const t1 = setTimeout(() => setPercentage(100), 100);
        const t2 = setTimeout(() => setText('✅'), 600);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <div style={{ padding: '20px', height: '20rem', width: '20rem' }}>
                <CircularProgressbar
                    value={percentage}
                    text={text}
                    styles={buildStyles({
                        pathColor: '#00AB00',
                    })}
                />
            </div>
            <button
                type="button"
                onClick={() => Router.push('/')}
                style={{ margin: '30px', textDecoration: 'underline', cursor: 'pointer' }}
            >
                Download your comic book from here!
            </button>
        </div>
    );
}
