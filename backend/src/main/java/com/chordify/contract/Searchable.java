package com.chordify.contract;

import java.util.List;

/**
 * Kontrak pencarian. Overloading pencarian lagu (judul / artis / genre) diimplementasikan di service.
 *
 * <p><b>Konsep PBO (Tabel VI):</b>
 * <ul>
 *   <li>[PBO-6] Interface — kontrak generik {@code Searchable<T>}; service cukup
 *       mengimplementasikan {@link #search(String)} tanpa harus tahu tipe
 *       datanya di muka.</li>
 * </ul>
 */
public interface Searchable<T> {
    List<T> search(String keyword);
}
