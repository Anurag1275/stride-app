import { useProgress } from "@/context/ProgressContext";
import { getSemester } from "@/data/syllabus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, StickyNote, BookOpen } from "lucide-react";
import { useState } from "react";

export default function NotesPage() {
  const { semester, userNotes, addNote, removeNote } = useProgress();
  const semData = getSemester(semester);
  const subjects = semData?.subjects.filter(s => !s.isLab) || [];
  const [newNote, setNewNote] = useState<Record<string, string>>({});

  const handleAddNote = (unitId: string) => {
    const note = newNote[unitId]?.trim();
    if (note) {
      addNote(unitId, note);
      setNewNote(prev => ({ ...prev, [unitId]: "" }));
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 animate-fade-in-up">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <StickyNote className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold">My Notes</h1>
          <p className="text-sm text-muted-foreground">Semester {semester} · Quick revision notes by subject</p>
        </div>
      </div>

      {subjects.length === 0 && (
        <p className="text-muted-foreground text-center py-12">No subjects available for this semester.</p>
      )}

      {subjects.map((subject, si) => (
        <Card key={subject.id} className="shadow-sm animate-fade-in-up" style={{ animationDelay: `${si * 80}ms` }}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">{subject.name}</CardTitle>
              <Badge variant="secondary" className="text-[10px] ml-auto">{subject.code}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {subject.units.map(unit => {
              const defaultNotes = unit.notes || [];
              const custom = userNotes[unit.id] || [];
              const allNotes = [...defaultNotes, ...custom];

              return (
                <div key={unit.id} className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{unit.name}</p>
                  {allNotes.length > 0 ? (
                    <ul className="space-y-1.5 pl-1">
                      {allNotes.map((note, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-0.5">•</span>
                          <span className="flex-1">{note}</span>
                          {i >= defaultNotes.length && (
                            <Button
                              variant="ghost" size="icon" className="h-6 w-6 shrink-0"
                              onClick={() => removeNote(unit.id, i - defaultNotes.length)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No notes yet</p>
                  )}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a note..."
                      value={newNote[unit.id] || ""}
                      onChange={e => setNewNote(prev => ({ ...prev, [unit.id]: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && handleAddNote(unit.id)}
                      className="h-8 text-sm"
                    />
                    <Button size="sm" className="h-8 px-3" onClick={() => handleAddNote(unit.id)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
