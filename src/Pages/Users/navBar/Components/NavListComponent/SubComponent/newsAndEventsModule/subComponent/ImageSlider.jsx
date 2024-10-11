
import { useState } from 'react'

import styles from './styles/imageSliderStyles.module.scss';

export default function ImageSlider({ slideImgs }) {

    const [currentIndex, setCurrentIndex] = useState(0);

    function goToNext() {
        const isFirstImg = currentIndex === slideImgs.length - 1;
        const newIndex = isFirstImg ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }

    function goToPrev() {
        const isFirstImg = currentIndex === 0;
        const newIndex = isFirstImg ? slideImgs.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }

    function goToSlide(dotIndex) {
        setCurrentIndex(dotIndex);
    }


    return (
        <div className = { styles.sliderContainer }>
            <div className = { `${ styles.arrowBtn } ${ styles.prev }` } onClick = { goToPrev }>
                ❰ 
            </div>
            <div className = { `${ styles.arrowBtn } ${ styles.next }` } onClick = { goToNext }>
                ❱ 
            </div>

            <div className = { styles.imageContainer }>
                {slideImgs.map((url, index) => (
                    <div 
                        key = { index }
                        className = { styles.sliderImage } 
                        style = {{ 
                            backgroundImage: `url(${url.url})`,
                            translate: `${ -100 * currentIndex }%` 
                        }}
                    >
                    </div>
                ))}
            </div>

            <div className = { styles.dotContainer }>
                {slideImgs.map((_, dotIndex) => (
                    <div
                        className = { dotIndex === currentIndex ? `${ styles.dot } ${ styles.active }` : styles.dot }
                        key = { dotIndex }
                        onClick = {() => goToSlide(dotIndex)}
                    >
                        ●
                    </div>
                ))}
            </div>
        </div>
    )
}