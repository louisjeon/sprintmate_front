import { useDrag } from "react-dnd";

const IssueCard = ({
  issue,
  setViewIssue,
  setIsEditingIssue,
  setCurrentIssueId,
  setNewIssue,
  handleDeleteIssue,
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "BOX",
      item: { issue },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    []
  );

  return (
    <li
      key={issue?.issueId}
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="p-4 hover:bg-gray-100 transition max-h-fit h-min border box-border "
    >
      <h3 className="text-lg font-semibold">{issue?.issueTitle}</h3>
      <p className="text-sm text-gray-500">
        스토리 포인트: {issue?.issueStoryPoint}
      </p>
      <p className="text-sm text-gray-500">
        할당자:{" "}
        {issue?.issueAssignees
          ?.map((assignee) => assignee.teamMemberName)
          .join(", ") || "없음"}
      </p>
      <button
        onClick={() => {
          setViewIssue(issue);
        }}
        className="bg-green-500 mt-2 mr-2 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        상세
      </button>
      <button
        onClick={() => {
          setIsEditingIssue(true);
          setCurrentIssueId(issue.issueId);
          setNewIssue({
            title: issue.issueTitle,
            description: issue.issueDescription,
            sp: issue.issueStoryPoint, // Reset to default integer SP
            status: issue.issueStatus,
            assignees: issue.issueAssignees.map(
              (assignee) => assignee.teamMemberId
            ),
          });
        }}
        className="bg-gray-500 mt-2 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
      >
        수정
      </button>
      <button
        onClick={() => {
          handleDeleteIssue(issue.issueId);
        }}
        className="bg-red-500 mt-2 ml-2 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        삭제
      </button>
    </li>
  );
};

export default IssueCard;
