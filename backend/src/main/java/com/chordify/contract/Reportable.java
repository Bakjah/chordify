package com.chordify.contract;

/** Objek yang bisa dilaporkan (lagu). Report system hanya mencatat; keputusan di tangan admin. */
public interface Reportable {
    Long getReportableId();
}
