
import React from 'react';

interface MarqueeProps {
    text: string;
}

const Marquee: React.FC<MarqueeProps> = ({ text }) => {
    if (!text) {
        return null;
    }

    return (
        <div className="bg-primary/20 dark:bg-primary/80 text-text-primary overflow-hidden flex items-center h-10 shadow-inner">
            <div className="text-base font-bold whitespace-nowrap animate-marquee font-body">
                <span className="mx-8">{text}</span>
                <span className="mx-8">{text}</span>
            </div>
        </div>
    );
};

export default Marquee;
