package com.chordify.contract;

/**
 * Objek yang bisa dilaporkan (lagu). Report system hanya mencatat; keputusan di tangan admin.
 *
 * <p><b>Konsep PBO (Tabel VI):</b>
 * <ul>
 *   <li>[PBO-6] Interface — kontrak {@code Reportable}; {@code Song} yang
 *       mengimplementasikannya, dan service cukup bekerja dengan tipe kontrak.</li>
 * </ul>
 */
public interface Reportable {
    Long getReportableId();
}
