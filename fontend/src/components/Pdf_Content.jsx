import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Bengali font register
Font.register({
  family: "HindSiliguri",
  src: "fonts/HindSiliguri-Regular.ttf",
  
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "HindSiliguri",
    fontSize: 11,
  },

  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 15,
  },

  text: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 1.6,
  },

  table: {
    display: "table",
    width: "100%",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#000",
  },

  row: {
    flexDirection: "row",
  },

  header: {
    backgroundColor: "#eeeeee",
  },

  cell: {
    padding: 6,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    flex: 1,
  },

  lastCell: {
    padding: 6,
    borderBottomWidth: 1,
    borderColor: "#000",
    flex: 1,
  },
});

export default function Pdf_Content({sub_data}) {

  const {name,phone, division, district,upazila,institute}=sub_data || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        <Text style={styles.title}>
          ToT Selection Exam 
        </Text>
        <Text style={styles.text}>Name: {name}</Text>
        <Text style={styles.text}>Phone: {phone}</Text>
        <Text style={styles.text}>Division: {division}</Text>
        <Text style={styles.text}>District: {district}</Text>
        <Text style={styles.text}>Upazila: {upazila}</Text>
        <Text style={styles.text}>Institute: {institute}</Text>
        <Text style={styles.subtitle} > উত্তরপত্র</Text>
        {Object.entries(sub_data.answers).map(([key, val]) => (
  <Text key={key}>প্রশ্ন {key}: {val}</Text>
))}

      </Page>
    </Document>
  );
}