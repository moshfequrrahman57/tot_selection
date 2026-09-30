import React from "react";

import {
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";

import BengaliPDF from "./components/Pdf_Download";
import Pdf_Download from "./components/Pdf_Download";

function App2() {
  return (
    <div style={{ padding: "20px" }}>

      <h1>বাংলা PDF তৈরি</h1>

      <PDFDownloadLink
        document={<Pdf_Download />}
        fileName="bangla-certificate.pdf"
      >
        
      </PDFDownloadLink>

      <br />
      <br />

      <PDFViewer
        width="100%"
        height="700"
      >
        <Pdf_Download />
      </PDFViewer>

    </div>
  );
}

export default App2;