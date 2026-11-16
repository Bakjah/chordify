package com.chordify.chord;

/** Abstract class pemrosesan chord. Subclass: ChordTransposer, CapoCalculator, dst. */
public abstract class ChordProcessor {
    public abstract String process(String chordText, int amount);
}
