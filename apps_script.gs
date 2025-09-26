function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);

  // ---- Input kerja (BP1-4) ----
  if (data.type === "kerja") {
    var sheetName = "";
    switch (data.planter) {
      case "Planter 1": sheetName = "BP1"; break;
      case "Planter 2": sheetName = "BP2"; break;
      case "Planter 3": sheetName = "BP3"; break;
      case "Planter 4": sheetName = "BP4"; break;
      default: return ContentService.createTextOutput("Planter tidak dikenal");
    }
    var sheet = ss.getSheetByName(sheetName);
    var lastRow = sheet.getLastRow();
    var idColumn = 11;  // kolom K untuk ID
    if (lastRow > 1) {
      var ids = sheet.getRange(2, idColumn, lastRow-1).getValues().flat();
      if (ids.indexOf(data.id) !== -1) return ContentService.createTextOutput("Duplicate ignored");
    }
    var ts = Utilities.formatDate(new Date(), "Asia/Jayapura", "yyyy-MM-dd HH:mm:ss");
    sheet.appendRow([ts, data.planter, data.nama, data.tanggal, data.fungisida, data.insektisida, data.pupuk, data.bin, data.keterangan, data.id]);
    return ContentService.createTextOutput("Success");
  }

  // ---- Waktu Tunggu (start-end, auto durasi menit) ----
  if (data.type === "waktu") {
    var wt = ss.getSheetByName("WaktuTunggu");
    if (!wt) {
      wt = ss.insertSheet("WaktuTunggu");
      wt.appendRow(["Timestamp","Planter","Tanggal","Jenis","Start Time","End Time","Total (menit)","Keterangan","ID"]);
    }
    var lastRowWT = wt.getLastRow();
    var idColWT = 9; // kolom I untuk ID
    if (lastRowWT > 1) {
      var idsWT = wt.getRange(2, idColWT, lastRowWT-1).getValues().flat();
      if (idsWT.indexOf(data.id) !== -1) return ContentService.createTextOutput("Duplicate ignored");
    }
    var ts2 = Utilities.formatDate(new Date(), "Asia/Jayapura", "yyyy-MM-dd HH:mm:ss");
    wt.appendRow([ts2, data.planter, data.tanggal, data.jenis, data.start_time, data.end_time, "", data.keterangan, data.id]);
    var newRow = wt.getLastRow();
    var formula = "=ROUND(MOD(F" + newRow + "-E" + newRow + ",1)*24*60,0)";
    wt.getRange(newRow, 7).setFormula(formula);
    return ContentService.createTextOutput("Waktu Tunggu saved");
  }

  // ---- Harvester ----
  if (data.type === "harvester") {
    var hs = ss.getSheetByName("Harvester");
    if (!hs) {
      hs = ss.insertSheet("Harvester");
      hs.appendRow(["Timestamp","Shift","Start Time","End Time","Total Jam Kerja (h)","Tanggal Tanam","Nomor Blok","Varietas","Luas Area (Ha)","Jumlah Row Tertebang","Jumlah BIN Didapatkan","Keterangan","ID"]);
    }
    var lastRowH = hs.getLastRow();
    var idColH = 13; // kolom M untuk ID
    if (lastRowH > 1) {
      var idsH = hs.getRange(2, idColH, lastRowH-1).getValues().flat();
      if (idsH.indexOf(data.id) !== -1) return ContentService.createTextOutput("Duplicate ignored");
    }
    var ts3 = Utilities.formatDate(new Date(), "Asia/Jayapura", "yyyy-MM-dd HH:mm:ss");

    hs.appendRow([
      ts3,
      data.shift,
      data.start_time,
      data.end_time,
      "", // formula will be set
      data.tanggal_tanam,
      data.blok,
      data.varietas,
      data.luas_area,
      data.row_tertebang,
      data.bin_didapat,
      data.keterangan,
      data.id
    ]);

    var newRowH = hs.getLastRow();
    var formulaH = "=MOD(D" + newRowH + "-C" + newRowH + ",1)*24";
    hs.getRange(newRowH, 5).setFormula(formulaH).setNumberFormat("0.00");

    return ContentService.createTextOutput("Harvester saved");
  }

  return ContentService.createTextOutput("Unknown type");
}