import * as React from "react";
import './Scramble.css';
import { useDencrypt } from "use-dencrypt-effect";

const values = ["PROBLEM SOLVER", "DEVELOPER", "SOFTWARE ENGINEER", "INNOVATOR"];

const Scramble = () => {
    const { result, dencrypt } = useDencrypt();

    React.useEffect(() => {
        let i = 0;

        const action = setInterval(() => {
            dencrypt(values[i]);

            i = i === values.length - 1 ? 0 : i + 1;
        }, 5000);

        return () => clearInterval(action);
    }, [dencrypt]);

    return <div className="header-career">{result}</div>;
};

export default Scramble;