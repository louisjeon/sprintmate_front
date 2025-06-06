import { useDrop } from "react-dnd";
import IssueCard from "./IssueCard";
import AddOrEditIssue from "./AddOrEditIssue";

const IssueBoardColumn = ({
  issues,
  status,
  currentIssueId,
  newIssue,
  teamMembers,
  setNewIssue,
  isAddingIssue,
  isEditingIssue,
  setViewIssue,
  setIsAddingIssue,
  setIsEditingIssue,
  setCurrentIssueId,
  handleAddIssue,
  handleUpdateIssue,
  handleDeleteIssue,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: "BOX",
    drop: (item) => handleDrop(item),
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const handleDrop = (item) => {
    const issue = item.issue;
    if (issue.issueStatus !== status) {
      setCurrentIssueId(issue.issueId);
      handleUpdateIssue(
        {
          title: issue.issueTitle,
          description: issue.issueDescription,
          sp: issue.issueStoryPoint,
          status: status,
          assignees: issue.issueAssignees,
        },
        issue.issueId,
        true
      );
    }
  };

  return (
    <ul
      ref={drop}
      role={"Dustbin"}
      style={{ backgroundColor: isOver ? "lightgray" : "white" }}
      className="divide-y divide-gray-200  rounded-md h-full"
    >
      {issues.map((issue) =>
        !(issue.issueId == currentIssueId && isEditingIssue) ? (
          <IssueCard
            key={issue.issueId}
            issue={issue}
            setViewIssue={setViewIssue}
            setIsEditingIssue={setIsEditingIssue}
            setCurrentIssueId={setCurrentIssueId}
            setNewIssue={setNewIssue}
            handleDeleteIssue={handleDeleteIssue}
          />
        ) : (
          AddOrEditIssue(
            issue.issueId,
            isAddingIssue,
            newIssue,
            teamMembers,
            handleAddIssue,
            handleUpdateIssue,
            setIsAddingIssue,
            setIsEditingIssue,
            setNewIssue,
            true
          )
        )
      )}
    </ul>
  );
};

export default IssueBoardColumn;
