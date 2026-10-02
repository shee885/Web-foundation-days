let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" }
];

function searchNotes(word) {
  const searchWord = word.toLowerCase();

  return notes.filter(note =>
    note.text.toLowerCase().includes(searchWord)
  );
}

console.log(searchNotes("Day")); // expected: note 2
console.log(searchNotes("pizza")); // expected: []

function longestNote() {

  function longestNote() {
  if (notes.length === 0) {

    console.log(longestNote()); // expected: note 3
    const originalNotes = notes;
notes = [];

console.log(longestNote()); // expected: null

notes = originalNotes;

    function countByCategory() {
  const counts = {
    personal: 0,
    work: 0,
    study: 0
  };

  for (const note of notes) {
    counts[note.category]++;
  }

  return counts;
}

    console.log(countByCategory());// expected: { personal: 2, work: 1, study: 2 }
    const savedNotes = notes;
notes = [];

console.log(countByCategory()); // expected: { personal: 0, work: 0, study: 0 }

notes = savedNotes;

    function getSummary() {
  const counts = countByCategory();
  const word = notes.length === 1 ? "note" : "notes";

  return `${notes.length} ${word}: ${counts.personal} personal, ${counts.work} work, ${counts.study} study.`;
}

    console.log(getSummary()); // expected: "5 notes: 2 personal, 1 work, 2 study."
    const savedNotes2 = notes;
notes = [];

console.log(getSummary()); // expected: "0 notes: 0 personal, 0 work, 0 study."

notes = savedNotes2;

    const savedNotes2 = notes;
notes = [];

console.log(getSummary()); // expected: "0 notes: 0 personal, 0 work, 0 study."

notes = savedNotes2;

    console.log(isDuplicate("buy MILK and bread")); // expected: true
console.log(isDuplicate("Pizza")); // expected: false

    function addNote(text, category) {
  const cleanedText = text.trim();

  if (cleanedText.length < 1 || cleanedText.length > 200) {
    console.log("Note not added: text must be 1-200 characters.");
    return false;
  }

  if (isDuplicate(cleanedText)) {
    console.log("Note not added: duplicate.");
    return false;
  }

  if (!["personal", "work", "study"].includes(category)) {
    console.log("Note not added: invalid category.");
    return false;
  }

  const newId = notes.length
    ? Math.max(...notes.map(note => note.id)) + 1
    : 1;

  notes.push({
    id: newId,
    text: cleanedText,
    category: category
  });

  console.log("Note added.");
  return true;
}
    console.log(addNote("Plan weekend trip", "personal")); // expected: true
console.log(addNote("Buy milk and bread", "personal")); // expected: false
console.log(addNote("", "work")); // expected: false
console.log(addNote("New task", "school")); // expected: false

    


