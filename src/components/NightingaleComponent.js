import React, { useEffect, useState, useRef } from 'react';
import "@nightingale-elements/nightingale-sequence";

const NightingaleComponent = ({ proteinData }) => {

    const seqContainer = useRef(null);
    const [sequenceLength, setSequenceLength] = useState(0);

    useEffect(() => {
        customElements.whenDefined("nightingale-sequence").then(() => {
            if (document.querySelector("#sequence")) {
                const seq = document.querySelector("#sequence");
                seq.data = proteinData.proteinSequence; // Assuming proteinData is available at mount
                setSequenceLength(proteinData.proteinSequence.length); // Update sequence length
            }
        });
    }, [proteinData.proteinSequence]);
    // get Barcodesequnce and use nightingale colored sequence 
     
    return (
        <div className="nightingale-container"> {/* Added class for styling */}
        <nightingale-manager>
          <table>
            <tbody>
              <tr>
                <td></td>
                <td>
                  <nightingale-navigation
                    id="navigation"
                    min-width="800"
                    height="40" 
                    length={sequenceLength}
                    display-begin="1"
                    display-end={sequenceLength}
                    margin-color="white"
                  ></nightingale-navigation>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <nightingale-sequence
                    id="sequence"
                    min-width="800"
                    height="40"
                    length={sequenceLength}
                    display-start="1"
                    display-end={sequenceLength}
                    margin-color="white"
                    highlight-event="onmouseover"
                  ></nightingale-sequence>
                </td>
              </tr>
            </tbody>
          </table>
          </nightingale-manager>
        </div>
      );
  };

export default NightingaleComponent;
