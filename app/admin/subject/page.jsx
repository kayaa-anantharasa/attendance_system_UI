import SubjectList from "../../components/Subject/SubjectList";
import SubjectAssignment from "../../components/SubjectAssignment/SubjectAssign";

export default function SubjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Subject Management</h1>
      <SubjectList />
      <SubjectAssignment />
    </div>
  );
}
