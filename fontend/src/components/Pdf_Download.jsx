import React from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import Pdf_Content from './Pdf_Content';
function Pdf_Download({sub_data}){
    return(
        <div style={{ padding: "10px" }}>
       
             <PDFDownloadLink
               document={<Pdf_Content sub_data={sub_data}/>}
               fileName="bangla-certificate.pdf"
             >
               
             </PDFDownloadLink>
       
             <br />
             <br />
       
            <div className="w-screen h-screen border border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
          <Pdf_Content sub_data={sub_data}/>
        </PDFViewer>
      </div>
       
           </div>
    );
}

export default Pdf_Download;