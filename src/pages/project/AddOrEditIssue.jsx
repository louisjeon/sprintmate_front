const AddOrEditIssue = (
  issueId,
  isAddingIssue,
  newIssue,
  teamMembers,
  handleAddIssue,
  handleUpdateIssue,
  setIsAddingIssue,
  setIsEditingIssue,
  setNewIssue
) => {
  return (
    <div key={issueId} className="mt-4 p-4 border rounded-md bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">
        {isAddingIssue ? "새 이슈 추가" : "이슈 수정"}
      </h3>
      <input
        type="text"
        placeholder="이슈 제목"
        value={newIssue.title}
        onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
        className="w-full mb-2 p-2 border rounded"
      />
      <textarea
        placeholder="이슈 설명"
        value={newIssue.description}
        onChange={(e) =>
          setNewIssue({ ...newIssue, description: e.target.value })
        }
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="스토리 포인트"
        value={newIssue.sp}
        onChange={(e) =>
          setNewIssue({
            ...newIssue,
            sp: parseInt(e.target.value, 10) || 0,
          })
        }
        className="w-full mb-2 p-2 border rounded"
      />
      <select
        value={newIssue.status}
        onChange={(e) => setNewIssue({ ...newIssue, status: e.target.value })}
        className="w-full mb-2 p-2 border rounded"
      >
        <option value="NOT_STARTED">Not Started</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>
      <div className="mb-2">
        <h4 className="text-sm font-semibold mb-1">할당자 선택</h4>
        <div className="flex flex-wrap gap-2">
          {teamMembers.map((member) => (
            <label
              key={member.teamMemberId}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                value={member.teamMemberId}
                checked={newIssue.assignees.includes(member.teamMemberId)}
                onChange={(e) => {
                  console.log(newIssue.assignees);
                  const memberIdAsNumber = parseInt(e.target.value, 10); // Ensure IDs are numbers
                  const isChecked = e.target.checked;
                  setNewIssue((prev) => ({
                    ...prev,
                    assignees: isChecked
                      ? [...prev.assignees, memberIdAsNumber]
                      : prev.assignees.filter((id) => id !== memberIdAsNumber),
                  }));
                }}
              />
              {member.memberUsername}
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={isAddingIssue ? handleAddIssue : handleUpdateIssue}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isAddingIssue ? "추가" : "수정 완료"}
        </button>
        <button
          onClick={() => {
            setIsAddingIssue(false);
            setIsEditingIssue(false);
            setNewIssue({
              title: "",
              description: "",
              sp: 3, // Default SP to an integer, e.g., 3 for M
              status: "NOT_STARTED",
              assignees: [],
            });
          }}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default AddOrEditIssue;
