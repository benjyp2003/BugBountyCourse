import { LessonEngine } from "@/components/lesson-engine";
import { lesson } from "@/prototype/content";
export default function HttpLessonPage() {
  return <LessonEngine lesson={lesson} />;
}
