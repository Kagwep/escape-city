import React, { useEffect, useState } from 'react';

interface SvgDisplayProps {
    dna: number;
}

const SvgDisplay: React.FC<SvgDisplayProps> = ({ dna }) => {
    const [svgUri, setSvgUri] = useState<string>('');
    const svgUrl: string = 'https://res.cloudinary.com/dydj8hnhz/image/upload/v1717321072/gudx6izjars2vmxpfb2b.svg';

    useEffect(() => {
        fetch(svgUrl)
            .then(response => response.text())
            .then(svg => {
                const modifiedSvg: string = applyDnaToSvg(svg, dna);
                const dataUri: string = svgToDataUri(modifiedSvg);
                setSvgUri(dataUri);
            })
            .catch(error => console.error('Error fetching SVG:', error));
    }, [dna]);

    const svgToDataUri = (svg: string): string => {
        return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}`;
    };

    const applyDnaToSvg = (svg: string, dna: number): string => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, "image/svg+xml");

        // Target all path elements
        const paths = doc.querySelectorAll('path');
        const colorValues = generateColorValues(dna, 5);

        paths.forEach((path, index) => {
            // Skip the background element by its fill color
            if (path.getAttribute('fill') === 'rgb(252,253,247)') {
                return;
            }

            const colorIndex = (dna >> (index * 5)) % colorValues.length;
            path.setAttribute('fill', colorValues[colorIndex]);

            // Logging for debugging
            console.log(`Element tag: ${path.tagName}, Color: ${colorValues[colorIndex]}`);

            const strokeColorIndex = (dna >> (index * 7)) % colorValues.length;
            path.setAttribute('stroke', colorValues[strokeColorIndex]);
        });

        return new XMLSerializer().serializeToString(doc.documentElement);
    };

    const generateColorValues = (dna: number, count: number): string[] => {
        let colors: string[] = [];
        let seed = dna;
        for (let i = 0; i < count; i++) {
            seed = (seed * 9301 + 49297) % 233280;
            let hue = (seed / 233280) * 360;
            let saturation = 100;
            let lightness = (seed % 50) + 25; // Lightness between 25% and 75%

            colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
        return colors;
    };

    return (
        <div className="svg-container">
            <img src={svgUri} alt="Dynamic SVG Display" />
        </div>
    );
};

export default SvgDisplay;
