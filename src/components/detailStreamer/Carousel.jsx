import React, { useState } from 'react';
import SmallStreamCard from './SmallStreamCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ streams }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const cardsPerSlide = 4;

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? 0 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex >= streams.length - cardsPerSlide;
        const newIndex = isLastSlide ? currentIndex : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className="relative w-full overflow-hidden">
            <div className="flex transition-transform ease-out duration-500" style={{ transform: `translateX(-${currentIndex * (100 / cardsPerSlide)}%)` }}>
                {streams.map((stream, index) => (
                    <div
                        key={index}
                        className="w-1/4 px-2 flex-shrink-0"
                    >
                        <SmallStreamCard
                            index={index}
                            stream={stream}
                        />
                    </div>
                ))}
            </div>

            {/* Previous Button */}
            <button
                onClick={prevSlide}
                className={`absolute top-1/2 left-0 transform -translate-y-1/2 p-2
                    bg-neutral-200 dark:bg-neutral-700 rounded-full shadow-md 
                    hover:bg-neutral-300 dark:hover:bg-neutral-600 
                    ${currentIndex === 0 ? "hidden" : ""}`}
            >
                <ChevronLeft />
            </button>

            {/* Next Button */}
            <button
                onClick={nextSlide}
                className={`absolute top-1/2 right-0 transform -translate-y-1/2 p-2
                    bg-neutral-200 dark:bg-neutral-700 rounded-full shadow-md 
                    hover:bg-neutral-300 dark:hover:bg-neutral-600
                    ${currentIndex >= streams.length - cardsPerSlide ? "hidden" : ""}`}
            >
                <ChevronRight />
            </button>
        </div>
    );
};

export default Carousel;
