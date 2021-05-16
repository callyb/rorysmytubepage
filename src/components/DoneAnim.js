import React from 'react';
import lottie from 'lottie-web';
import * as doneAnim from './../done-anim.json';

const DoneAnim = () => {
    const elem = React.useRef < HTMLDivElement > (null);

    React.useEffect(() => {
        const anim = lottie.loadAnimation({
            animationData: doneAnim,
            loop: true,
            renderer: 'svg',
            container: elem.current,
            autoplay: true,
        });
        anim.dur(6);

        return () => {
            anim.stop();
            anim.destroy();
        }
    }, []);

    return (
        <div ref={elem} className="inset-0 absolute ml-5"></div>
    );
}

export default DoneAnim;