package com.chordify.contract;

import java.util.List;

/** Kontrak pencarian. Overloading pencarian lagu (judul / artis / genre) diimplementasikan di service. */
public interface Searchable<T> {
    List<T> search(String keyword);
}
