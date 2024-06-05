import React,{useState,useEffect} from "react";
import { Link } from "react-router-dom";
import { EscapeCity } from "pages";
import { RunAwayType } from "utils/EscapeCityTypes";

interface PropTypes {
  runaway: RunAwayType;
  onSelectRunaway: (id: number) => void;
}

export const RunAwayItem: React.FC<PropTypes> = ({ runaway,onSelectRunaway }) => {

  const [svgUri, setSvgUri] = useState<string>('');
  const [showEscapeCity, setShowEscapeCity] = useState<boolean>(false); 
  const svgUrl: string = 'https://res.cloudinary.com/dydj8hnhz/image/upload/v1717581659/y4r7yfifi3ejweqxnca9.svg';

  useEffect(() => {
    fetch(svgUrl)
        .then(response => response.text())
        .then(svg => {
            const modifiedSvg: string = applyTrailPrintToSvg(svg, Number(runaway.trail_print));
            const dataUri: string = svgToDataUri(modifiedSvg);
            setSvgUri(dataUri);
        })
        .catch(error => console.error('Error fetching SVG:', error));
}, [runaway.trail_print]);

const svgToDataUri = (svg: string): string => {
  return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}`;
};

const applyTrailPrintToSvg = (svg: string, trailPrint: number): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");
  const paths = doc.querySelectorAll('path');
  const colorValues = generateColorValues(trailPrint, paths.length);

  paths.forEach((path, index) => {
      if (path.getAttribute('fill') === 'rgb(232,254,252)') {
          return;
      }
      const colorIndex = index % colorValues.length;
      path.setAttribute('fill', colorValues[colorIndex]);

  });

  return new XMLSerializer().serializeToString(doc.documentElement);
};

const generateColorValues = (trailPrint: number, count: number): string[] => {
  let colors: string[] = [];
  let seed = trailPrint;
  let lastHue = -100; // Initialize with an impossible hue for comparison

  for (let i = 0; i < count; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      let hue = (seed / 233280) * 360;

      // Ensure diverse hues
      while (Math.abs(hue - lastHue) < 30) { // Avoid similar hues by ensuring they are at least 30 degrees apart
          seed = (seed * 9301 + 49297) % 233280;
          hue = (seed / 233280) * 360;
      }
      lastHue = hue;

      let saturation = 70 + (seed % 30); // Dynamic saturation between 70% and 100%
      let lightness = 30 + (seed % 40);  // Lightness between 30% and 70%

      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
};

const handlePlayNowClick = () => {
  onSelectRunaway(runaway.runaway_id);
};


  return (
    <>
    <div className="card shadow-xl">
      <figure>
        <Link to={''}>
          <div className="svg-container">
              <img src={svgUri} alt="Dynamic SVG Display" className="rounded"/>
          </div>
        </Link>
      </figure>
      <div className="card-body p-4">
        <Link to={''}>
          <h2 className="card-title text-sm truncate"></h2>
        </Link>
        <div className="flex justify-between w-full">
          <small className=" text-cyan-600">Weight: {runaway.weight.toString()}</small>
        </div>
        <div>
        <small className="text-blue-500">Experience: {runaway.experience.toString()}</small>
        </div>
        <div className="card-actions">
          <button className="btn btn-primary btn-sm w-full text-green-500 hover:text-green-800" onClick={handlePlayNowClick}>
            Play Now
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

