/**
 * @package com.akeirou.appendbacklinks.thearchiveplugin
 * 
 * Plugin for "The Archive"
 * Appends a Backlinks section to the current note with links to all the notes
 * that reference the current note.
 *   - The original content of the note is not modified. There is only an append.
 *   - The backlinks section format is hard-coded.
 *
 * @summary appends backlinks to the current note
 * @version v1.0.0
 * @author Bruno Borghi <bruno.borghi@akeirou.com>
 * @license Unlicense
 * 
 * Created at     : 2024-10-16 15:45:00
 * Last modified  : 2024-10-16 15:45:00
 */


"use strict";

// Get the current note
const selectedNotes = input.notes.selected;
if (selectedNotes.length !== 1) {
  cancel(`${selectedNotes.length} notes are selected. Please select only one note.`);
}
const currentNote = selectedNotes[0];

// Set the match string to find links to the current note
const currentNoteID = app.extractNoteID(currentNote.filename);
const matchString = "\\[\\["+currentNoteID+"\\]\\]" // Many backslashes are needed!

// Initialize the backlinks string to be appended with the current date
const now=new Date()
const currentDateString = [
    now.getFullYear(),"-",
    ('0' + (now.getMonth() + 1)).slice(-2),"-",
    ('0' + now.getDate()).slice(-2)," ",
    ('0' + now.getHours()).slice(-2),":",
    ('0' + now.getMinutes()).slice(-2),
  ].join('');
const backlinksHdr = "\n\n---\n\n#### Backlinks _(updated " + currentDateString + ")_\n" // Customize here to your needs
var backlinks =""

// Visit all the notes to find links
for (let note of input.notes.all) {
    if (note.content.match(matchString)){
		let backlinkNoteID = app.extractNoteID(note.filename)
		backlinks += "[[" + backlinkNoteID +"]] " + note.filename + "\n" // Customize here to your needs
	}
}	

// Append the backlinks section 
if (! backlinks) backlinks = "_(None)_" // be explicit when there are no backlinks
const updatedContent = currentNote.content + backlinksHdr + backlinks
output.changeFile.filename = currentNote.filename
output.changeFile.content = updatedContent
