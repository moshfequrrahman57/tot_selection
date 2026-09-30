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
    fontSize: 20,
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

export default function BengaliPDF() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        <Text style={styles.title}>
          প্রশিক্ষণ সনদপত্র
        </Text>

        <Text style={styles.subtitle}>
          তথ্য ও যোগাযোগ প্রযুক্তি বিষয়ক প্রশিক্ষণ
        </Text>

        <Text style={styles.text}>
          এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,
          মোঃ রহিম উদ্দিন তথ্য ও যোগাযোগ প্রযুক্তি
          বিষয়ক প্রশিক্ষণে সফলভাবে অংশগ্রহণ করেছেন।
        </Text>

        <Text style={styles.text}>
          প্রশিক্ষণের সময়কাল: ০১ সেপ্টেম্বর ২০২৬
          থেকে ০৫ সেপ্টেম্বর ২০২৬ পর্যন্ত।
        </Text>

   

      </Page>
    </Document>
  );
}